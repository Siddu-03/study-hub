# Study Hub — Structured Learning Resource Discovery Platform & Admin Management

A clean, modern, responsive academic knowledge platform that enables students, researchers, and self-directed learners to discover curated learning resources across a structured hierarchy of knowledge disciplines.

Includes a **multi-JSON data architecture** and an **Admin Management Panel** for managing fields, domains, subjects, topics, and learning resources.

---

## 🌟 Philosophy & Taxonomy

Unlike traditional learning management systems that attempt to host duplicate courses, **Study Hub** organizes existing human knowledge into an intuitive 5-tier taxonomy:

$$\text{Field} \longrightarrow \text{Domain} \longrightarrow \text{Subject} \longrightarrow \text{Topic} \longrightarrow \text{Resource}$$

---

## 🗂️ Multi-JSON Data Architecture

Study Hub organizes subjects into modular JSON files rather than a single monolithic file. This provides instant startup performance, simple Git collaboration, and modular updates.

### 1. Central Catalog (`data/catalog.json`)
The catalog serves as the single source of truth for taxonomy discovery. It maps all fields, domains, subject metadata, and relative data file paths:

```json
{
  "fields": [
    {
      "id": "tech",
      "name": "Tech",
      "description": "Technology, computing, software engineering, and digital systems.",
      "icon": "code",
      "domains": [
        {
          "id": "cybersecurity",
          "name": "Cybersecurity",
          "description": "Protecting systems, networks, data, and applications from digital attacks.",
          "subjects": [
            {
              "id": "web-security",
              "name": "Web Security",
              "description": "Defending web applications against common exploits, injection vulnerabilities, and authentication flaws.",
              "dataFile": "data/tech/cybersecurity/web-security.json",
              "topicCount": 4
            }
          ]
        }
      ]
    }
  ],
  "learning_paths": [ ... ]
}
```

### 2. Subject Data Files (`data/<field>/<domain>/<subject>.json`)
Each subject has its own dedicated JSON file containing its full curriculum and topic details:

```json
{
  "id": "web-security",
  "name": "Web Security",
  "description": "Defending web applications against common exploits, injection vulnerabilities, and authentication flaws.",
  "fieldId": "tech",
  "domainId": "cybersecurity",
  "topics": [
    {
      "id": "sql-injection",
      "subtopic": "Injection Vulnerabilities",
      "title": "SQL Injection (SQLi)",
      "type": "Article",
      "level": "Beginner",
      "link": "https://example.com/demo/web-security/sql-injection",
      "notes": "Covers parameterized queries as the primary defense against query manipulation.",
      "time": 20,
      "why_it_matters": "SQL injection remains one of the most critical vulnerabilities.",
      "related_topics": ["xss-fundamentals", "csrf-defense"]
    }
  ]
}
```

---

## 🎛️ Admin Management Panel (`/admin`)

Study Hub features an integrated Admin Panel located at `admin/index.html` (accessible via the **Admin** button in the header navigation).

### Key Admin Capabilities:
1. **Curriculum Statistics Overview**: Real-time KPI cards displaying total Fields, Domains, Subjects, Topics, and Average Learning Times.
2. **Field & Domain Management**: Add, edit, or remove fields and domains with automated slugification.
3. **Subject Registry**: Register new subjects with auto-calculated file paths (`data/<field>/<domain>/<subject>.json`), descriptions, and instant subject selection.
4. **Topic & Resource Manager**:
   - Add/edit topics with subtopic grouping, difficulty level (*Beginner*, *Intermediate*, *Advanced*), format (*Article*, *Video*), estimated learning time (mins), and verified resource URLs.
   - Comprehensive resource URL validation (`http://` or `https://`).
5. **Bulk Topic Entry**: Add multiple topics at once using simple line-by-line syntax:
   ```text
   Topic Title | Subtopic Group | Level | Format | Minutes | Resource URL
   ```
6. **Static-Friendly Export Center**:
   - **Download Full Data Package (ZIP)**: Generates a complete `study-hub-data.zip` containing `data/catalog.json` and all subject files in their respective folders (`data/<field>/<domain>/<subject>.json`) using JSZip.
   - **Download Updated Catalog**: 1-click download of `data/catalog.json`.
   - **Download Active Subject JSON**: 1-click download of the selected subject file.
   - **Export CSV**: Export all topics in CSV format for spreadsheet editing.
7. **Local Draft Persistence**: All changes are automatically saved to `localStorage`, allowing administrators to curate content across sessions without losing changes, with a 1-click **Reset to Saved Data** option.

---

## ✨ Main Features (Public Dashboard)

- **Light-Themed Academic Design System**: Clean, minimal interface built with an 8px spacing scale, subtle shadows, and high contrast typography (Inter / system fonts).
- **Clickable Resource Links**: Topic titles link directly to external resources (`target="_blank"` with `rel="noopener noreferrer"`) and an external-link icon.
- **Independent Progress Checkboxes**: Click completion checkboxes without triggering resource hyperlinks; saves progress in real-time to `localStorage`.
- **Hierarchical Knowledge Navigation**:
  - **Explore by Field**: Categorized into *Tech*, *Non-Tech*, *Interdisciplinary*, and *Miscellaneous*.
  - **Domain Explorer**: Drill down into specific disciplines (e.g., Cybersecurity, Artificial Intelligence, Cognitive Science, PKM).
  - **Subject Curriculums**: View complete topic lists, progress percentages, and subject descriptions.
  - **Topic Detail View**: In-depth view featuring subtopics, badges, estimated durations, "Why this topic matters", and practical notes.
- **On-Demand & Cached Data Loading**: The catalog loads instantly; subject files are fetched on-demand with caching in `state.subjectCache` and a background preload worker.
- **Global Search & Subject Filtering**: Real-time search across taxonomy levels and loaded topics with live keyword filtering, difficulty filters, and format filters.
- **Study Hub Assistant (Chatbot Integration Point)**: Floating drawer panel searching the local knowledge base and recommending subjects/topics.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic elements with ARIA accessibility labels and visible focus indicators.
- **Vanilla CSS**: CSS Custom Properties (variables), CSS Grid, Flexbox, media queries for responsive layouts, and `@media (prefers-reduced-motion: reduce)` support. No external UI frameworks (no Tailwind, Bootstrap).
- **Vanilla JavaScript**: Pure modern JavaScript (ES6+) for routing, search, filtering, `localStorage` state management, and DOM rendering.
- **JSZip (Admin Panel)**: Bundles the entire multi-JSON folder structure into a 1-click downloadable `.zip` package.

---

## 📁 Project Folder Structure

```text
study-hub/
├── index.html              # Public dashboard HTML markup
├── style.css               # Design tokens, themes, and dashboard stylesheet
├── script.js               # Router, catalog loader, on-demand subject fetcher & search
├── admin/
│   ├── index.html          # Admin Panel interface & modals
│   ├── admin.css           # Academic admin dashboard styling
│   └── admin.js            # Admin state, CRUD, bulk entry & ZIP export
├── data/
│   ├── catalog.json        # Central curriculum catalog mapping all subjects
│   ├── tech/               # Subject JSON files for Tech field
│   │   ├── cybersecurity/
│   │   │   ├── web-security.json
│   │   │   └── cryptography.json
│   │   ├── artificial-intelligence/
│   │   │   └── machine-learning-basics.json
│   │   ├── data-science/
│   │   │   └── data-analysis-python.json
│   │   ├── cloud-computing/
│   │   │   └── cloud-architecture.json
│   │   └── software-engineering/
│   │       └── clean-code.json
│   ├── non-tech/           # Subject JSON files for Non-Tech field
│   │   ├── business-entrepreneurship/
│   │   │   └── startup-fundamentals.json
│   │   ├── finance-investing/
│   │   │   └── personal-finance.json
│   │   └── psychology/
│   │       └── cognitive-biases.json
│   ├── interdisciplinary/  # Subject JSON files for Interdisciplinary field
│   │   ├── design-ux/
│   │   │   └── ux-principles.json
│   │   ├── cognitive-science/
│   │   │   └── memory-mental-models.json
│   │   └── biohacking-health/
│   │       └── sleep-circadian-biology.json
│   └── miscellaneous/      # Subject JSON files for Miscellaneous field
│       ├── personal-knowledge-management/
│       │   └── zettelkasten-pkm.json
│       └── learning-how-to-learn/
│           └── effective-learning-strategies.json
├── assets/                 # Directory for static images and media assets
├── .gitignore              # Ignores credentials, secrets, and system files
└── README.md               # Project documentation and guide
```

---

## 🚀 Running Locally

Study Hub requires no compilers, build pipelines, or runtime dependencies.

### Option 1: Python's Built-in HTTP Server (Recommended)
Open a terminal in the `study-hub/` directory and run:

```bash
python -m http.server 8000
```
Then open:
- Public Dashboard: `http://localhost:8000`
- Admin Panel: `http://localhost:8000/admin/`

### Option 2: Node.js (npx serve or http-server)
```bash
npx serve .
```

### Option 3: Direct File Opening
Double-click `index.html` or open it in any modern browser. A bundled fallback dataset ensures full interactivity even when local `file://` browser policies restrict `fetch()`.

---

## 🔄 Admin Workflow for Static Hosting (e.g. GitHub Pages)

Because GitHub Pages and static web servers cannot accept backend write APIs directly from browser JavaScript:
1. Open the Admin Panel (`/admin`).
2. Make your additions or edits to fields, domains, subjects, or topics.
3. Click **Download Full Data Package (ZIP)** in the Export Center.
4. Extract the contents directly into your project's `data/` directory (or use **Download catalog.json** / **Download Subject JSON** for targeted updates).
5. Commit and push the updated JSON files to your GitHub repository:
   ```bash
   git add data/
   git commit -m "Update curriculum via Study Hub Admin"
   git push
   ```

---

## 📈 Implementation Status

| Feature / Component | Status | Details |
|---|---|---|
| Multi-JSON Data Architecture | ✅ Completed | Catalog (`data/catalog.json`) + partitioned subject JSON files |
| On-Demand & Lazy Subject Loading | ✅ Completed | Instant startup with background preloading and subject caching |
| Clickable Resource Links | ✅ Completed | Direct external hyperlinks with `target="_blank"` and `rel="noopener noreferrer"` |
| Topic Completion Checklists | ✅ Completed | Independent progress toggle stored in `localStorage` |
| Admin Panel Interface | ✅ Completed | Curriculum KPI stats, Field/Domain CRUD, Subject registry |
| Topic Manager & Bulk Entry | ✅ Completed | URL validation, line-by-line quick entry tool, live preview |
| Static Export Center | ✅ Completed | 1-click full data ZIP bundling via JSZip, catalog & subject JSON downloads |
| Global Search & Subject Filters | ✅ Completed | Real-time multi-level search across fields, domains, subjects, topics |
| Study Hub Chatbot Point | ✅ Completed | Decoupled widget ready for AI/LLM backend connection |
| Responsive Academic Styling | ✅ Completed | Mobile, tablet, and desktop tested without CSS frameworks |

---

## 📄 License & Attribution

Created for students, researchers, and self-directed learners. Open and free to adapt for personal and academic knowledge discovery.
