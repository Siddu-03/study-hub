/**
 * ============================================================================
 * STUDY HUB — ADMIN PANEL JAVASCRIPT
 * Comprehensive content and curriculum management system.
 * Handles Fields, Domains, Subjects, Topic CRUD, Bulk Add, and Multi-JSON Export.
 * ============================================================================
 */

const STORAGE_KEY_ADMIN_DRAFT = 'study_hub_admin_draft_v1';

const adminState = {
  catalog: null,
  subjects: {}, // subjectId -> subjectData
  selectedSubjectId: null,
  activeTab: 'overview',
  deleteCallback: null
};

// ----------------------------------------------------------------------------
// 1. Utilities & Helpers
// ----------------------------------------------------------------------------
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start
    .replace(/-+$/, '');         // Trim - from end
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(message) {
  const container = document.getElementById('admin-toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${escapeHTML(message)}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.2s';
    setTimeout(() => toast.remove(), 200);
  }, 2800);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function markDraftDirty() {
  try {
    const payload = {
      catalog: adminState.catalog,
      subjects: adminState.subjects,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY_ADMIN_DRAFT, JSON.stringify(payload));
  } catch (err) {
    console.warn('Unable to persist draft to localStorage:', err);
  }

  const indicator = document.getElementById('sync-status-indicator');
  const text = document.getElementById('sync-status-text');
  if (indicator && text) {
    indicator.className = 'sync-status unsaved';
    text.textContent = 'Unsaved Draft (Local)';
  }
}

function markDraftSynced() {
  const indicator = document.getElementById('sync-status-indicator');
  const text = document.getElementById('sync-status-text');
  if (indicator && text) {
    indicator.className = 'sync-status synced';
    text.textContent = 'Draft In Sync';
  }
}

// ----------------------------------------------------------------------------
// 2. Data Initialization
// ----------------------------------------------------------------------------
async function initAdmin() {
  // Check if draft exists in localStorage
  const saved = localStorage.getItem(STORAGE_KEY_ADMIN_DRAFT);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.catalog && parsed.subjects) {
        adminState.catalog = parsed.catalog;
        adminState.subjects = parsed.subjects;
        setupUI();
        showToast('Resumed working draft from local browser storage.');
        return;
      }
    } catch (e) {
      console.warn('Corrupt local draft; loading from static files:', e);
    }
  }

  // Load from static files: ../data/catalog.json
  try {
    const res = await fetch('../data/catalog.json');
    if (!res.ok) throw new Error(`HTTP ${res.status} loading catalog.json`);
    const catalog = await res.json();
    adminState.catalog = catalog;

    // Fetch all existing subject JSON files into memory
    const subjectPromises = [];
    (catalog.fields || []).forEach(f => {
      (f.domains || []).forEach(d => {
        (d.subjects || []).forEach(s => {
          if (s.dataFile) {
            const relPath = '../' + s.dataFile;
            subjectPromises.push(
              fetch(relPath)
                .then(r => r.ok ? r.json() : null)
                .then(data => {
                  if (data) adminState.subjects[s.id] = data;
                })
                .catch(err => {
                  console.warn(`Could not load ${relPath}:`, err);
                })
            );
          }
        });
      });
    });

    await Promise.all(subjectPromises);
    setupUI();
  } catch (err) {
    console.error('Failed to load catalog:', err);
    showToast('Error loading catalog.json: ' + err.message);
  }
}

function setupUI() {
  initTabs();
  initModals();
  renderOverview();
  renderFieldsAndDomains();
  renderSubjectsTab();
  populateSubjectSelectors();
  renderTopicManager();
  initExportSection();
}

// ----------------------------------------------------------------------------
// 3. Tab Navigation
// ----------------------------------------------------------------------------
function initTabs() {
  document.querySelectorAll('.sidebar-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  document.getElementById('btn-jump-bulk')?.addEventListener('click', () => {
    switchTab('bulk-entry');
  });

  document.getElementById('btn-quick-export')?.addEventListener('click', () => {
    switchTab('export');
  });
}

function switchTab(tabId) {
  adminState.activeTab = tabId;
  document.querySelectorAll('.sidebar-tab').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.admin-tab-content').forEach(sec => {
    sec.classList.toggle('active', sec.id === `tab-${tabId}`);
  });

  if (tabId === 'overview') renderOverview();
  if (tabId === 'fields-domains') renderFieldsAndDomains();
  if (tabId === 'subjects') renderSubjectsTab();
  if (tabId === 'topics') renderTopicManager();
  if (tabId === 'bulk-entry') populateSubjectSelectors();
  if (tabId === 'export') updateExportDropdown();
}

// ----------------------------------------------------------------------------
// 4. Overview Section & Statistics
// ----------------------------------------------------------------------------
function calculateStats() {
  let fieldsCount = (adminState.catalog?.fields || []).length;
  let domainsCount = 0;
  let subjectsCount = 0;
  let topicsCount = 0;
  let missingLinksCount = 0;

  (adminState.catalog?.fields || []).forEach(f => {
    domainsCount += (f.domains || []).length;
    (f.domains || []).forEach(d => {
      subjectsCount += (d.subjects || []).length;
    });
  });

  Object.values(adminState.subjects).forEach(sub => {
    (sub.topics || []).forEach(t => {
      topicsCount++;
      if (!t.link || !t.link.trim() || t.link.trim() === '#') {
        missingLinksCount++;
      }
    });
  });

  return { fieldsCount, domainsCount, subjectsCount, topicsCount, missingLinksCount };
}

function renderOverview() {
  const stats = calculateStats();
  document.getElementById('stat-fields').textContent = stats.fieldsCount;
  document.getElementById('stat-domains').textContent = stats.domainsCount;
  document.getElementById('stat-subjects').textContent = stats.subjectsCount;
  document.getElementById('stat-topics').textContent = stats.topicsCount;
  document.getElementById('stat-missing-links').textContent = stats.missingLinksCount;
  document.getElementById('catalog-subjects-badge').textContent = `${stats.subjectsCount} Subjects`;

  const tbody = document.getElementById('overview-subjects-tbody');
  if (!tbody) return;

  const rows = [];
  (adminState.catalog?.fields || []).forEach(f => {
    (f.domains || []).forEach(d => {
      (d.subjects || []).forEach(s => {
        const subData = adminState.subjects[s.id];
        const count = subData?.topics ? subData.topics.length : (s.topicCount || 0);
        rows.push(`
          <tr>
            <td><strong>${escapeHTML(s.name)}</strong><br><small style="color:var(--muted-text); font-family:monospace;">${escapeHTML(s.id)}</small></td>
            <td><span class="badge">${escapeHTML(f.name)}</span></td>
            <td>${escapeHTML(d.name)}</td>
            <td><code style="font-size:0.8rem;">${escapeHTML(s.dataFile || '')}</code></td>
            <td><strong>${count}</strong> topics</td>
            <td>
              <button type="button" class="btn-sm" data-jump-subject="${s.id}">Manage Topics &rarr;</button>
            </td>
          </tr>
        `);
      });
    });
  });

  tbody.innerHTML = rows.join('');

  tbody.querySelectorAll('[data-jump-subject]').forEach(btn => {
    btn.addEventListener('click', () => {
      const subjectId = btn.getAttribute('data-jump-subject');
      adminState.selectedSubjectId = subjectId;
      switchTab('topics');
    });
  });
}

// ----------------------------------------------------------------------------
// 5. Fields & Domains Management
// ----------------------------------------------------------------------------
function renderFieldsAndDomains() {
  const fields = adminState.catalog?.fields || [];
  document.getElementById('fields-count-badge').textContent = `${fields.length} Fields`;

  // Render Fields Table
  const fieldsTbody = document.getElementById('fields-tbody');
  fieldsTbody.innerHTML = fields.map(f => `
    <tr>
      <td><code style="font-weight:600;">${escapeHTML(f.id)}</code></td>
      <td><strong>${escapeHTML(f.name)}</strong></td>
      <td>${escapeHTML(f.description)}</td>
      <td><span class="badge">${(f.domains || []).length} Domains</span></td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn-sm" data-edit-field="${f.id}">Edit</button>
          <button type="button" class="btn-sm" style="color:var(--danger);" data-delete-field="${f.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  // Populate Field Filter for Domains
  const filterSelect = document.getElementById('filter-domain-by-field');
  filterSelect.innerHTML = `<option value="all">All Fields (${fields.length})</option>` +
    fields.map(f => `<option value="${f.id}">${escapeHTML(f.name)}</option>`).join('');

  renderDomainsTable();

  // Attach Field Actions
  fieldsTbody.querySelectorAll('[data-edit-field]').forEach(btn => {
    btn.addEventListener('click', () => openFieldModal(btn.getAttribute('data-edit-field')));
  });
  fieldsTbody.querySelectorAll('[data-delete-field]').forEach(btn => {
    btn.addEventListener('click', () => confirmDeleteField(btn.getAttribute('data-delete-field')));
  });

  filterSelect.onchange = () => renderDomainsTable();
}

function renderDomainsTable() {
  const fields = adminState.catalog?.fields || [];
  const selectedFieldId = document.getElementById('filter-domain-by-field')?.value || 'all';
  const domainsTbody = document.getElementById('domains-tbody');

  let rows = [];
  fields.forEach(f => {
    if (selectedFieldId !== 'all' && f.id !== selectedFieldId) return;
    (f.domains || []).forEach(d => {
      rows.push(`
        <tr>
          <td><code style="font-weight:600;">${escapeHTML(d.id)}</code></td>
          <td><strong>${escapeHTML(d.name)}</strong></td>
          <td><span class="badge">${escapeHTML(f.name)}</span></td>
          <td>${escapeHTML(d.description || '')}</td>
          <td><span class="badge">${(d.subjects || []).length} Subjects</span></td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn-sm" data-edit-domain="${d.id}" data-parent-field="${f.id}">Edit</button>
              <button type="button" class="btn-sm" style="color:var(--danger);" data-delete-domain="${d.id}" data-parent-field="${f.id}">Delete</button>
            </div>
          </td>
        </tr>
      `);
    });
  });

  domainsTbody.innerHTML = rows.length > 0
    ? rows.join('')
    : `<tr><td colspan="6" style="text-align:center; color:var(--muted-text); padding:2rem;">No domains found.</td></tr>`;

  domainsTbody.querySelectorAll('[data-edit-domain]').forEach(btn => {
    btn.addEventListener('click', () => {
      openDomainModal(btn.getAttribute('data-parent-field'), btn.getAttribute('data-edit-domain'));
    });
  });

  domainsTbody.querySelectorAll('[data-delete-domain]').forEach(btn => {
    btn.addEventListener('click', () => {
      confirmDeleteDomain(btn.getAttribute('data-parent-field'), btn.getAttribute('data-delete-domain'));
    });
  });
}

// ----------------------------------------------------------------------------
// 6. Subjects Registry Management
// ----------------------------------------------------------------------------
function renderSubjectsTab() {
  const fields = adminState.catalog?.fields || [];
  const filterField = document.getElementById('subject-filter-field');
  const filterDomain = document.getElementById('subject-filter-domain');
  const searchInput = document.getElementById('subject-search');

  // Populate Field and Domain Filters
  filterField.innerHTML = `<option value="all">All Fields</option>` +
    fields.map(f => `<option value="${f.id}">${escapeHTML(f.name)}</option>`).join('');

  updateSubjectDomainFilter();

  filterField.onchange = () => {
    updateSubjectDomainFilter();
    renderSubjectsTable();
  };
  filterDomain.onchange = () => renderSubjectsTable();
  searchInput.oninput = () => renderSubjectsTable();

  renderSubjectsTable();
}

function updateSubjectDomainFilter() {
  const fields = adminState.catalog?.fields || [];
  const filterField = document.getElementById('subject-filter-field').value;
  const filterDomain = document.getElementById('subject-filter-domain');

  let domainOptions = `<option value="all">All Domains</option>`;
  fields.forEach(f => {
    if (filterField === 'all' || f.id === filterField) {
      (f.domains || []).forEach(d => {
        domainOptions += `<option value="${d.id}">${escapeHTML(d.name)} (${f.name})</option>`;
      });
    }
  });
  filterDomain.innerHTML = domainOptions;
}

function renderSubjectsTable() {
  const fields = adminState.catalog?.fields || [];
  const filterField = document.getElementById('subject-filter-field')?.value || 'all';
  const filterDomain = document.getElementById('subject-filter-domain')?.value || 'all';
  const query = (document.getElementById('subject-search')?.value || '').toLowerCase().trim();
  const tbody = document.getElementById('subjects-tbody');

  let rows = [];
  fields.forEach(f => {
    if (filterField !== 'all' && f.id !== filterField) return;
    (f.domains || []).forEach(d => {
      if (filterDomain !== 'all' && d.id !== filterDomain) return;
      (d.subjects || []).forEach(s => {
        if (query && !s.name.toLowerCase().includes(query) && !s.id.toLowerCase().includes(query)) {
          return;
        }

        const subData = adminState.subjects[s.id];
        const count = subData?.topics ? subData.topics.length : (s.topicCount || 0);

        rows.push(`
          <tr>
            <td>
              <strong>${escapeHTML(s.name)}</strong><br>
              <code style="font-size:0.8rem; color:var(--muted-text);">${escapeHTML(s.id)}</code>
            </td>
            <td>
              <span class="badge">${escapeHTML(f.name)}</span> &rsaquo; <strong>${escapeHTML(d.name)}</strong>
            </td>
            <td>
              <code style="font-size:0.8rem;">${escapeHTML(s.dataFile || '')}</code>
            </td>
            <td>
              <strong>${count}</strong> topics
            </td>
            <td>
              <div class="table-actions">
                <button type="button" class="btn-sm" data-manage-subject="${s.id}">Manage Topics</button>
                <button type="button" class="btn-sm" data-edit-subject="${s.id}" data-field="${f.id}" data-domain="${d.id}">Edit</button>
                <button type="button" class="btn-sm" style="color:var(--danger);" data-delete-subject="${s.id}" data-field="${f.id}" data-domain="${d.id}">Delete</button>
              </div>
            </td>
          </tr>
        `);
      });
    });
  });

  tbody.innerHTML = rows.length > 0
    ? rows.join('')
    : `<tr><td colspan="5" style="text-align:center; color:var(--muted-text); padding:2rem;">No subjects match your filter criteria.</td></tr>`;

  tbody.querySelectorAll('[data-manage-subject]').forEach(btn => {
    btn.addEventListener('click', () => {
      adminState.selectedSubjectId = btn.getAttribute('data-manage-subject');
      switchTab('topics');
    });
  });

  tbody.querySelectorAll('[data-edit-subject]').forEach(btn => {
    btn.addEventListener('click', () => {
      openSubjectModal(btn.getAttribute('data-field'), btn.getAttribute('data-domain'), btn.getAttribute('data-edit-subject'));
    });
  });

  tbody.querySelectorAll('[data-delete-subject]').forEach(btn => {
    btn.addEventListener('click', () => {
      confirmDeleteSubject(btn.getAttribute('data-field'), btn.getAttribute('data-domain'), btn.getAttribute('data-delete-subject'));
    });
  });
}

// ----------------------------------------------------------------------------
// 7. Topic Manager & Bulk Entry
// ----------------------------------------------------------------------------
function populateSubjectSelectors() {
  const fields = adminState.catalog?.fields || [];
  let options = '';
  let firstSubjectId = null;

  fields.forEach(f => {
    (f.domains || []).forEach(d => {
      if ((d.subjects || []).length > 0) {
        options += `<optgroup label="${escapeHTML(f.name)} > ${escapeHTML(d.name)}">`;
        d.subjects.forEach(s => {
          if (!firstSubjectId) firstSubjectId = s.id;
          options += `<option value="${s.id}">${escapeHTML(s.name)} (${s.id})</option>`;
        });
        options += `</optgroup>`;
      }
    });
  });

  const topicSelector = document.getElementById('topic-subject-selector');
  const bulkSelector = document.getElementById('bulk-subject-select');
  const exportSelector = document.getElementById('export-single-subject-select');

  if (topicSelector) topicSelector.innerHTML = options;
  if (bulkSelector) bulkSelector.innerHTML = options;
  if (exportSelector) exportSelector.innerHTML = options;

  if (!adminState.selectedSubjectId && firstSubjectId) {
    adminState.selectedSubjectId = firstSubjectId;
  }

  if (adminState.selectedSubjectId && topicSelector) {
    topicSelector.value = adminState.selectedSubjectId;
  }
}

function renderTopicManager() {
  populateSubjectSelectors();

  const selector = document.getElementById('topic-subject-selector');
  const activeSubjectId = selector?.value || adminState.selectedSubjectId;
  adminState.selectedSubjectId = activeSubjectId;

  if (!activeSubjectId) {
    document.getElementById('topics-tbody').innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem;">No subjects available. Add a subject first.</td></tr>`;
    return;
  }

  // Find subject meta in catalog
  let meta = null;
  (adminState.catalog?.fields || []).forEach(f => {
    (f.domains || []).forEach(d => {
      const s = (d.subjects || []).find(sub => sub.id === activeSubjectId);
      if (s) meta = s;
    });
  });

  document.getElementById('active-file-indicator').textContent = meta?.dataFile || `data/.../${activeSubjectId}.json`;

  const subjectData = adminState.subjects[activeSubjectId] || { topics: [] };
  const allTopics = subjectData.topics || [];

  const query = (document.getElementById('topic-search-input')?.value || '').toLowerCase().trim();
  const filterLevel = document.getElementById('topic-filter-level')?.value || 'all';
  const filterType = document.getElementById('topic-filter-type')?.value || 'all';
  const missingOnly = document.getElementById('topic-filter-missing-only')?.checked || false;

  const filteredTopics = allTopics.filter(t => {
    const matchesSearch = !query || t.title.toLowerCase().includes(query) || (t.subtopic && t.subtopic.toLowerCase().includes(query));
    const matchesLevel = filterLevel === 'all' || (t.level && t.level.toLowerCase() === filterLevel.toLowerCase());
    const matchesType = filterType === 'all' || (t.type && t.type.toLowerCase() === filterType.toLowerCase());
    const hasMissing = !t.link || !t.link.trim() || t.link.trim() === '#';
    const matchesMissing = !missingOnly || hasMissing;
    return matchesSearch && matchesLevel && matchesType && matchesMissing;
  });

  const tbody = document.getElementById('topics-tbody');
  tbody.innerHTML = filteredTopics.length > 0 ? filteredTopics.map(t => {
    const isMissing = !t.link || !t.link.trim() || t.link.trim() === '#';
    return `
      <tr>
        <td>
          <strong>${escapeHTML(t.title)}</strong>
          ${t.subtopic ? `<br><small style="color:var(--muted-text);">${escapeHTML(t.subtopic)}</small>` : ''}
          <br><code style="font-size:0.75rem; color:var(--muted-text);">${escapeHTML(t.id)}</code>
        </td>
        <td><span class="badge">${escapeHTML(t.level || 'Beginner')}</span></td>
        <td><span class="badge">${escapeHTML(t.type || 'Article')}</span></td>
        <td>${t.time || 15}m</td>
        <td>
          ${isMissing ? `
            <span class="badge badge-url-missing">⚠️ No Resource URL</span>
          ` : `
            <a href="${escapeHTML(t.link)}" target="_blank" rel="noopener noreferrer" class="badge badge-url-valid" style="max-width:200px; overflow:hidden; text-overflow:ellipsis; display:inline-block;" title="${escapeHTML(t.link)}">
              ✓ ${escapeHTML(t.link)}
            </a>
          `}
        </td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn-sm" data-edit-topic="${t.id}">Edit</button>
            <button type="button" class="btn-sm" style="color:var(--danger);" data-delete-topic="${t.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('') : `<tr><td colspan="6" style="text-align:center; color:var(--muted-text); padding:2rem;">No topics found in this subject matching your filter.</td></tr>`;

  tbody.querySelectorAll('[data-edit-topic]').forEach(btn => {
    btn.addEventListener('click', () => openTopicModal(btn.getAttribute('data-edit-topic')));
  });

  tbody.querySelectorAll('[data-delete-topic]').forEach(btn => {
    btn.addEventListener('click', () => confirmDeleteTopic(btn.getAttribute('data-delete-topic')));
  });

  // Filter Event Listeners
  selector.onchange = () => renderTopicManager();
  document.getElementById('topic-search-input').oninput = () => renderTopicManager();
  document.getElementById('topic-filter-level').onchange = () => renderTopicManager();
  document.getElementById('topic-filter-type').onchange = () => renderTopicManager();
  document.getElementById('topic-filter-missing-only').onchange = () => renderTopicManager();
}

// ----------------------------------------------------------------------------
// 8. Modals (Add / Edit / Delete)
// ----------------------------------------------------------------------------
function initModals() {
  // Close buttons
  document.querySelectorAll('.btn-close-modal, .btn-cancel-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-modal').forEach(m => m.style.display = 'none');
    });
  });

  // Field Add Button
  document.getElementById('btn-add-field')?.addEventListener('click', () => openFieldModal());

  // Domain Add Button
  document.getElementById('btn-add-domain')?.addEventListener('click', () => openDomainModal());

  // Subject Add Button
  document.getElementById('btn-add-subject')?.addEventListener('click', () => openSubjectModal());

  // Topic Add Button
  document.getElementById('btn-add-topic')?.addEventListener('click', () => openTopicModal());

  // Delete Confirm Action Button
  document.getElementById('btn-confirm-delete')?.addEventListener('click', () => {
    if (adminState.deleteCallback) {
      adminState.deleteCallback();
      adminState.deleteCallback = null;
    }
    document.getElementById('modal-delete').style.display = 'none';
  });

  // Field Form Submit
  document.getElementById('form-field')?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveFieldForm();
  });

  // Domain Form Submit
  document.getElementById('form-domain')?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveDomainForm();
  });

  // Subject Form Submit
  document.getElementById('form-subject')?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveSubjectForm();
  });

  // Topic Form Submit
  document.getElementById('form-topic')?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveTopicForm();
  });

  // Bulk Topics Form Submit
  document.getElementById('bulk-topics-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleBulkTopicSubmit();
  });

  // CSV Export Button
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    exportSubjectTopicsCSV();
  });

  // Title-to-slug auto generator helpers
  document.getElementById('field-name')?.addEventListener('input', (e) => {
    if (!document.getElementById('field-original-id').value) {
      document.getElementById('field-id').value = slugify(e.target.value);
    }
  });

  document.getElementById('domain-name')?.addEventListener('input', (e) => {
    if (!document.getElementById('domain-original-id').value) {
      document.getElementById('domain-id').value = slugify(e.target.value);
    }
  });

  document.getElementById('subject-name')?.addEventListener('input', (e) => {
    if (!document.getElementById('subject-original-id').value) {
      document.getElementById('subject-id').value = slugify(e.target.value);
      updateSubjectDataFilePreview();
    }
  });

  document.getElementById('subject-id')?.addEventListener('input', updateSubjectDataFilePreview);
  document.getElementById('subject-field-select')?.addEventListener('change', () => {
    populateSubjectModalDomains();
    updateSubjectDataFilePreview();
  });
  document.getElementById('subject-domain-select')?.addEventListener('change', updateSubjectDataFilePreview);

  document.getElementById('topic-title')?.addEventListener('input', (e) => {
    if (!document.getElementById('topic-original-id').value) {
      document.getElementById('topic-id').value = slugify(e.target.value);
    }
  });
}

function updateSubjectDataFilePreview() {
  const fId = document.getElementById('subject-field-select')?.value || 'field';
  const dId = document.getElementById('subject-domain-select')?.value || 'domain';
  const sId = document.getElementById('subject-id')?.value || 'subject';
  document.getElementById('subject-datafile-preview').value = `data/${fId}/${dId}/${sId}.json`;
}

function populateSubjectModalDomains() {
  const fId = document.getElementById('subject-field-select')?.value;
  const dSelect = document.getElementById('subject-domain-select');
  const field = (adminState.catalog?.fields || []).find(f => f.id === fId);
  dSelect.innerHTML = (field?.domains || []).map(d => `<option value="${d.id}">${escapeHTML(d.name)}</option>`).join('');
}

// ----------------------------------------------------------------------------
// 9. Field Operations
// ----------------------------------------------------------------------------
function openFieldModal(fieldId = null) {
  const modal = document.getElementById('modal-field');
  const form = document.getElementById('form-field');
  form.reset();

  if (fieldId) {
    const field = (adminState.catalog?.fields || []).find(f => f.id === fieldId);
    if (!field) return;
    document.getElementById('modal-field-title').textContent = 'Edit Field';
    document.getElementById('field-original-id').value = field.id;
    document.getElementById('field-id').value = field.id;
    document.getElementById('field-id').disabled = true;
    document.getElementById('field-name').value = field.name;
    document.getElementById('field-desc').value = field.description;
    document.getElementById('field-icon').value = field.icon || 'layers';
  } else {
    document.getElementById('modal-field-title').textContent = 'Add Field';
    document.getElementById('field-original-id').value = '';
    document.getElementById('field-id').disabled = false;
  }

  modal.style.display = 'flex';
}

function saveFieldForm() {
  const origId = document.getElementById('field-original-id').value;
  const id = slugify(document.getElementById('field-id').value);
  const name = document.getElementById('field-name').value.trim();
  const desc = document.getElementById('field-desc').value.trim();
  const icon = document.getElementById('field-icon').value;

  if (!origId) {
    // Add new
    if ((adminState.catalog.fields || []).some(f => f.id === id)) {
      alert(`A field with ID "${id}" already exists. Please choose a different ID.`);
      return;
    }
    adminState.catalog.fields.push({
      id,
      name,
      description: desc,
      icon,
      domains: []
    });
    showToast(`Field "${name}" created.`);
  } else {
    // Edit existing
    const field = adminState.catalog.fields.find(f => f.id === origId);
    if (field) {
      field.name = name;
      field.description = desc;
      field.icon = icon;
      showToast(`Field "${name}" updated.`);
    }
  }

  markDraftDirty();
  document.getElementById('modal-field').style.display = 'none';
  renderFieldsAndDomains();
}

function confirmDeleteField(fieldId) {
  const field = (adminState.catalog?.fields || []).find(f => f.id === fieldId);
  if (!field) return;

  const domainCount = (field.domains || []).length;
  let subjectCount = 0;
  (field.domains || []).forEach(d => subjectCount += (d.subjects || []).length);

  document.getElementById('modal-delete-title').textContent = `Delete Field "${field.name}"?`;
  document.getElementById('delete-warning-message').textContent = `Are you sure you want to delete this field?`;

  const cascadeBox = document.getElementById('delete-cascade-warning');
  if (domainCount > 0 || subjectCount > 0) {
    cascadeBox.style.display = 'block';
    cascadeBox.innerHTML = `⚠️ <strong>Warning:</strong> Deleting this field will permanently remove <strong>${domainCount} domains</strong> and <strong>${subjectCount} subjects</strong> belonging to it!`;
  } else {
    cascadeBox.style.display = 'none';
  }

  adminState.deleteCallback = () => {
    // Delete all owned subjects from memory
    (field.domains || []).forEach(d => {
      (d.subjects || []).forEach(s => delete adminState.subjects[s.id]);
    });
    adminState.catalog.fields = adminState.catalog.fields.filter(f => f.id !== fieldId);
    markDraftDirty();
    showToast(`Field "${field.name}" deleted.`);
    renderFieldsAndDomains();
  };

  document.getElementById('modal-delete').style.display = 'flex';
}

// ----------------------------------------------------------------------------
// 10. Domain Operations
// ----------------------------------------------------------------------------
function openDomainModal(parentFieldId = null, domainId = null) {
  const modal = document.getElementById('modal-domain');
  const form = document.getElementById('form-domain');
  form.reset();

  const fieldSelect = document.getElementById('domain-field-select');
  fieldSelect.innerHTML = (adminState.catalog?.fields || []).map(f => `<option value="${f.id}">${escapeHTML(f.name)}</option>`).join('');

  if (domainId && parentFieldId) {
    const field = adminState.catalog.fields.find(f => f.id === parentFieldId);
    const domain = (field?.domains || []).find(d => d.id === domainId);
    if (!domain) return;
    document.getElementById('modal-domain-title').textContent = 'Edit Domain';
    document.getElementById('domain-original-id').value = domain.id;
    fieldSelect.value = parentFieldId;
    fieldSelect.disabled = true;
    document.getElementById('domain-id').value = domain.id;
    document.getElementById('domain-id').disabled = true;
    document.getElementById('domain-name').value = domain.name;
    document.getElementById('domain-desc').value = domain.description || '';
  } else {
    document.getElementById('modal-domain-title').textContent = 'Add Domain';
    document.getElementById('domain-original-id').value = '';
    fieldSelect.disabled = false;
    document.getElementById('domain-id').disabled = false;
    if (parentFieldId) fieldSelect.value = parentFieldId;
  }

  modal.style.display = 'flex';
}

function saveDomainForm() {
  const origId = document.getElementById('domain-original-id').value;
  const fieldId = document.getElementById('domain-field-select').value;
  const id = slugify(document.getElementById('domain-id').value);
  const name = document.getElementById('domain-name').value.trim();
  const desc = document.getElementById('domain-desc').value.trim();

  const field = adminState.catalog.fields.find(f => f.id === fieldId);
  if (!field) return;

  if (!origId) {
    if ((field.domains || []).some(d => d.id === id)) {
      alert(`A domain with ID "${id}" already exists in this field.`);
      return;
    }
    if (!field.domains) field.domains = [];
    field.domains.push({
      id,
      name,
      description: desc,
      subjects: []
    });
    showToast(`Domain "${name}" created.`);
  } else {
    const domain = field.domains.find(d => d.id === origId);
    if (domain) {
      domain.name = name;
      domain.description = desc;
      showToast(`Domain "${name}" updated.`);
    }
  }

  markDraftDirty();
  document.getElementById('modal-domain').style.display = 'none';
  renderFieldsAndDomains();
}

function confirmDeleteDomain(fieldId, domainId) {
  const field = adminState.catalog.fields.find(f => f.id === fieldId);
  const domain = (field?.domains || []).find(d => d.id === domainId);
  if (!domain) return;

  const subjectCount = (domain.subjects || []).length;
  document.getElementById('modal-delete-title').textContent = `Delete Domain "${domain.name}"?`;
  document.getElementById('delete-warning-message').textContent = `Are you sure you want to delete this domain?`;

  const cascadeBox = document.getElementById('delete-cascade-warning');
  if (subjectCount > 0) {
    cascadeBox.style.display = 'block';
    cascadeBox.innerHTML = `⚠️ <strong>Warning:</strong> Deleting this domain will remove <strong>${subjectCount} subjects</strong> inside it!`;
  } else {
    cascadeBox.style.display = 'none';
  }

  adminState.deleteCallback = () => {
    (domain.subjects || []).forEach(s => delete adminState.subjects[s.id]);
    field.domains = field.domains.filter(d => d.id !== domainId);
    markDraftDirty();
    showToast(`Domain "${domain.name}" deleted.`);
    renderFieldsAndDomains();
  };

  document.getElementById('modal-delete').style.display = 'flex';
}

// ----------------------------------------------------------------------------
// 11. Subject Operations
// ----------------------------------------------------------------------------
function openSubjectModal(fieldId = null, domainId = null, subjectId = null) {
  const modal = document.getElementById('modal-subject');
  const form = document.getElementById('form-subject');
  form.reset();

  const fSelect = document.getElementById('subject-field-select');
  fSelect.innerHTML = (adminState.catalog?.fields || []).map(f => `<option value="${f.id}">${escapeHTML(f.name)}</option>`).join('');

  if (fieldId) fSelect.value = fieldId;
  populateSubjectModalDomains();
  if (domainId) document.getElementById('subject-domain-select').value = domainId;

  if (subjectId) {
    document.getElementById('modal-subject-title').textContent = 'Edit Subject';
    document.getElementById('subject-original-id').value = subjectId;
    fSelect.disabled = true;
    document.getElementById('subject-domain-select').disabled = true;
    document.getElementById('subject-id').disabled = true;

    // Find in catalog
    let subj = null;
    (adminState.catalog?.fields || []).forEach(f => {
      (f.domains || []).forEach(d => {
        const s = (d.subjects || []).find(sub => sub.id === subjectId);
        if (s) subj = s;
      });
    });

    if (subj) {
      document.getElementById('subject-name').value = subj.name;
      document.getElementById('subject-id').value = subj.id;
      document.getElementById('subject-desc').value = subj.description || '';
      document.getElementById('subject-datafile-preview').value = subj.dataFile;
    }
  } else {
    document.getElementById('modal-subject-title').textContent = 'Add Subject';
    document.getElementById('subject-original-id').value = '';
    fSelect.disabled = false;
    document.getElementById('subject-domain-select').disabled = false;
    document.getElementById('subject-id').disabled = false;
    updateSubjectDataFilePreview();
  }

  modal.style.display = 'flex';
}

function saveSubjectForm() {
  const origId = document.getElementById('subject-original-id').value;
  const fieldId = document.getElementById('subject-field-select').value;
  const domainId = document.getElementById('subject-domain-select').value;
  const id = slugify(document.getElementById('subject-id').value);
  const name = document.getElementById('subject-name').value.trim();
  const desc = document.getElementById('subject-desc').value.trim();
  const dataFile = `data/${fieldId}/${domainId}/${id}.json`;

  const field = adminState.catalog.fields.find(f => f.id === fieldId);
  const domain = field?.domains?.find(d => d.id === domainId);
  if (!domain) return;

  if (!origId) {
    if ((domain.subjects || []).some(s => s.id === id)) {
      alert(`A subject with ID "${id}" already exists in this domain.`);
      return;
    }
    if (!domain.subjects) domain.subjects = [];

    // Register in catalog
    domain.subjects.push({
      id,
      name,
      description: desc,
      dataFile,
      topicCount: 0
    });

    // Create empty subject data in memory
    adminState.subjects[id] = {
      id,
      name,
      description: desc,
      fieldId,
      domainId,
      topics: []
    };

    showToast(`Subject "${name}" created and registered.`);
  } else {
    const subj = domain.subjects.find(s => s.id === origId);
    if (subj) {
      subj.name = name;
      subj.description = desc;
    }
    if (adminState.subjects[origId]) {
      adminState.subjects[origId].name = name;
      adminState.subjects[origId].description = desc;
    }
    showToast(`Subject "${name}" updated.`);
  }

  markDraftDirty();
  document.getElementById('modal-subject').style.display = 'none';
  renderSubjectsTab();
  populateSubjectSelectors();
}

function confirmDeleteSubject(fieldId, domainId, subjectId) {
  const field = adminState.catalog.fields.find(f => f.id === fieldId);
  const domain = field?.domains?.find(d => d.id === domainId);
  const subject = domain?.subjects?.find(s => s.id === subjectId);
  if (!subject) return;

  const count = adminState.subjects[subjectId]?.topics?.length || subject.topicCount || 0;
  document.getElementById('modal-delete-title').textContent = `Delete Subject "${subject.name}"?`;
  document.getElementById('delete-warning-message').textContent = `Are you sure you want to delete this subject?`;

  const cascadeBox = document.getElementById('delete-cascade-warning');
  cascadeBox.style.display = 'block';
  cascadeBox.innerHTML = `⚠️ This will remove the subject and its <strong>${count} topics</strong>. The file <code>${escapeHTML(subject.dataFile)}</code> will be deleted from the catalog.`;

  adminState.deleteCallback = () => {
    domain.subjects = domain.subjects.filter(s => s.id !== subjectId);
    delete adminState.subjects[subjectId];
    if (adminState.selectedSubjectId === subjectId) {
      adminState.selectedSubjectId = null;
    }
    markDraftDirty();
    showToast(`Subject "${subject.name}" deleted.`);
    renderSubjectsTab();
    populateSubjectSelectors();
  };

  document.getElementById('modal-delete').style.display = 'flex';
}

// ----------------------------------------------------------------------------
// 12. Topic Operations & Form
// ----------------------------------------------------------------------------
function openTopicModal(topicId = null) {
  const subjectId = adminState.selectedSubjectId;
  if (!subjectId) {
    alert('Please select a subject first.');
    return;
  }

  const modal = document.getElementById('modal-topic');
  const form = document.getElementById('form-topic');
  form.reset();

  const subData = adminState.subjects[subjectId] || { topics: [] };

  if (topicId) {
    const topic = (subData.topics || []).find(t => t.id === topicId);
    if (!topic) return;
    document.getElementById('modal-topic-title').textContent = 'Edit Topic';
    document.getElementById('topic-original-id').value = topic.id;
    document.getElementById('topic-id').value = topic.id;
    document.getElementById('topic-id').disabled = true;
    document.getElementById('topic-title').value = topic.title;
    document.getElementById('topic-subtopic').value = topic.subtopic || '';
    document.getElementById('topic-level').value = topic.level || 'Beginner';
    document.getElementById('topic-type').value = topic.type || 'Article';
    document.getElementById('topic-link').value = topic.link || '';
    document.getElementById('topic-time').value = topic.time || 20;
    document.getElementById('topic-why-matters').value = topic.why_it_matters || '';
    document.getElementById('topic-notes').value = topic.notes || '';
    document.getElementById('topic-related').value = (topic.related_topics || []).join(', ');
  } else {
    document.getElementById('modal-topic-title').textContent = 'Add Topic';
    document.getElementById('topic-original-id').value = '';
    document.getElementById('topic-id').disabled = false;
  }

  modal.style.display = 'flex';
}

function saveTopicForm() {
  const subjectId = adminState.selectedSubjectId;
  if (!subjectId) return;

  const origId = document.getElementById('topic-original-id').value;
  const id = slugify(document.getElementById('topic-id').value);
  const title = document.getElementById('topic-title').value.trim();
  const subtopic = document.getElementById('topic-subtopic').value.trim();
  const level = document.getElementById('topic-level').value;
  const type = document.getElementById('topic-type').value;
  let link = document.getElementById('topic-link').value.trim();
  const time = parseInt(document.getElementById('topic-time').value, 10) || 20;
  const why_it_matters = document.getElementById('topic-why-matters').value.trim();
  const notes = document.getElementById('topic-notes').value.trim();
  const relatedRaw = document.getElementById('topic-related').value.trim();
  const related_topics = relatedRaw ? relatedRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  // Validate URL if provided
  if (link) {
    try {
      const parsed = new URL(link);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        alert('Resource URL must begin with http:// or https://');
        return;
      }
    } catch (e) {
      alert('Please enter a valid URL or leave the field blank.');
      return;
    }
  }

  if (!adminState.subjects[subjectId]) {
    adminState.subjects[subjectId] = { id: subjectId, topics: [] };
  }
  const subTopics = adminState.subjects[subjectId].topics;

  if (!origId) {
    if (subTopics.some(t => t.id === id)) {
      alert(`A topic with ID "${id}" already exists in this subject.`);
      return;
    }
    subTopics.push({
      id,
      title,
      subtopic,
      level,
      type,
      link,
      time,
      why_it_matters,
      notes,
      related_topics
    });
    showToast(`Topic "${title}" added.`);
  } else {
    const topic = subTopics.find(t => t.id === origId);
    if (topic) {
      topic.title = title;
      topic.subtopic = subtopic;
      topic.level = level;
      topic.type = type;
      topic.link = link;
      topic.time = time;
      topic.why_it_matters = why_it_matters;
      topic.notes = notes;
      topic.related_topics = related_topics;
      showToast(`Topic "${title}" updated.`);
    }
  }

  // Update catalog topicCount
  updateCatalogTopicCount(subjectId, subTopics.length);
  markDraftDirty();
  document.getElementById('modal-topic').style.display = 'none';
  renderTopicManager();
}

function confirmDeleteTopic(topicId) {
  const subjectId = adminState.selectedSubjectId;
  const subTopics = adminState.subjects[subjectId]?.topics || [];
  const topic = subTopics.find(t => t.id === topicId);
  if (!topic) return;

  document.getElementById('modal-delete-title').textContent = `Delete Topic "${topic.title}"?`;
  document.getElementById('delete-warning-message').textContent = `Are you sure you want to remove this topic from the curriculum?`;
  document.getElementById('delete-cascade-warning').style.display = 'none';

  adminState.deleteCallback = () => {
    adminState.subjects[subjectId].topics = subTopics.filter(t => t.id !== topicId);
    updateCatalogTopicCount(subjectId, adminState.subjects[subjectId].topics.length);
    markDraftDirty();
    showToast(`Topic "${topic.title}" deleted.`);
    renderTopicManager();
  };

  document.getElementById('modal-delete').style.display = 'flex';
}

function updateCatalogTopicCount(subjectId, count) {
  (adminState.catalog?.fields || []).forEach(f => {
    (f.domains || []).forEach(d => {
      const s = (d.subjects || []).find(sub => sub.id === subjectId);
      if (s) s.topicCount = count;
    });
  });
}

// ----------------------------------------------------------------------------
// 13. Bulk Topic Entry
// ----------------------------------------------------------------------------
function handleBulkTopicSubmit() {
  const subjectId = document.getElementById('bulk-subject-select').value;
  const subtopic = document.getElementById('bulk-subtopic').value.trim();
  const level = document.getElementById('bulk-level').value;
  const type = document.getElementById('bulk-type').value;
  const time = parseInt(document.getElementById('bulk-time').value, 10) || 20;
  const text = document.getElementById('bulk-titles-textarea').value;

  if (!subjectId) {
    alert('Please select a target subject.');
    return;
  }

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    alert('Please enter at least one topic title.');
    return;
  }

  if (!adminState.subjects[subjectId]) {
    adminState.subjects[subjectId] = { id: subjectId, topics: [] };
  }

  const existing = adminState.subjects[subjectId].topics;
  let addedCount = 0;

  lines.forEach(title => {
    let baseId = slugify(title);
    let id = baseId;
    let counter = 1;
    while (existing.some(t => t.id === id)) {
      id = `${baseId}-${counter++}`;
    }

    existing.push({
      id,
      title,
      subtopic: subtopic || '',
      level,
      type,
      link: '', // Missing URL clearly marked
      time,
      why_it_matters: '',
      notes: '',
      related_topics: []
    });
    addedCount++;
  });

  updateCatalogTopicCount(subjectId, existing.length);
  markDraftDirty();
  document.getElementById('bulk-titles-textarea').value = '';
  showToast(`Successfully added ${addedCount} topics to ${subjectId}!`);

  adminState.selectedSubjectId = subjectId;
  switchTab('topics');
}

// CSV Export for Subject Topics
function exportSubjectTopicsCSV() {
  const subjectId = adminState.selectedSubjectId;
  const subData = adminState.subjects[subjectId];
  if (!subData || !subData.topics || subData.topics.length === 0) {
    alert('No topics to export for this subject.');
    return;
  }

  const headers = ['id', 'title', 'subtopic', 'level', 'type', 'link', 'time', 'why_it_matters'];
  const csvLines = [headers.join(',')];

  subData.topics.forEach(t => {
    const row = [
      `"${(t.id || '').replace(/"/g, '""')}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.subtopic || '').replace(/"/g, '""')}"`,
      `"${(t.level || '').replace(/"/g, '""')}"`,
      `"${(t.type || '').replace(/"/g, '""')}"`,
      `"${(t.link || '').replace(/"/g, '""')}"`,
      t.time || 20,
      `"${(t.why_it_matters || '').replace(/"/g, '""')}"`
    ];
    csvLines.push(row.join(','));
  });

  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `${subjectId}-topics.csv`);
  showToast(`Exported ${subData.topics.length} topics as CSV.`);
}

// ----------------------------------------------------------------------------
// 14. Export & Publishing Center
// ----------------------------------------------------------------------------
function initExportSection() {
  // Download catalog.json
  document.getElementById('btn-export-catalog')?.addEventListener('click', () => {
    const jsonStr = JSON.stringify(adminState.catalog, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    triggerDownload(blob, 'catalog.json');
    showToast('Downloaded catalog.json.');
  });

  // Download single subject JSON
  document.getElementById('btn-export-single-subject')?.addEventListener('click', () => {
    const subjectId = document.getElementById('export-single-subject-select')?.value;
    if (!subjectId) return;
    const subData = adminState.subjects[subjectId] || { id: subjectId, topics: [] };
    const jsonStr = JSON.stringify(subData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    triggerDownload(blob, `${subjectId}.json`);
    showToast(`Downloaded ${subjectId}.json.`);
  });

  // Download complete ZIP package
  document.getElementById('btn-export-zip')?.addEventListener('click', async () => {
    if (typeof JSZip === 'undefined') {
      alert('JSZip library is loading. Please check internet connection or download individual files.');
      return;
    }

    const zip = new JSZip();
    const dataFolder = zip.folder('data');

    // Add catalog.json
    dataFolder.file('catalog.json', JSON.stringify(adminState.catalog, null, 2));

    // Add all subject JSON files according to their catalog dataFile paths
    (adminState.catalog?.fields || []).forEach(f => {
      (f.domains || []).forEach(d => {
        (d.subjects || []).forEach(s => {
          const subData = adminState.subjects[s.id] || {
            id: s.id,
            name: s.name,
            description: s.description || '',
            fieldId: f.id,
            domainId: d.id,
            topics: []
          };
          // Path: f.id / d.id / s.id.json
          const filePath = `${f.id}/${d.id}/${s.id}.json`;
          dataFolder.file(filePath, JSON.stringify(subData, null, 2));
        });
      });
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      triggerDownload(content, 'study-hub-data.zip');
      showToast('Generated study-hub-data.zip package!');
      markDraftSynced();
    } catch (e) {
      alert('Error building ZIP package: ' + e.message);
    }
  });

  // Reset Draft Button
  document.getElementById('btn-reset-draft')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to discard your local draft and reload from the original static files? Any unsaved edits will be lost.')) {
      localStorage.removeItem(STORAGE_KEY_ADMIN_DRAFT);
      location.reload();
    }
  });
}

function updateExportDropdown() {
  const select = document.getElementById('export-single-subject-select');
  if (!select) return;
  const fields = adminState.catalog?.fields || [];
  let opts = '';
  fields.forEach(f => {
    (f.domains || []).forEach(d => {
      (d.subjects || []).forEach(s => {
        opts += `<option value="${s.id}">${escapeHTML(s.name)} (${s.id}.json)</option>`;
      });
    });
  });
  select.innerHTML = opts;
}

// ----------------------------------------------------------------------------
// 15. DOMContentLoaded Bootstrapper
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initAdmin();
});
