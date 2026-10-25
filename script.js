/**
 * ============================================================================
 * STUDY HUB — APPLICATION SCRIPT
 * Minimal, clean vanilla JavaScript for knowledge discovery and navigation.
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. Fallback Dataset (Used if fetch is blocked by browser file:// restrictions)
// ----------------------------------------------------------------------------
const FALLBACK_DATA = {
  fields: [
    {
      id: "tech",
      name: "Tech",
      description: "Technology, computing, software engineering, and digital systems.",
      icon: "code",
      domains: [
        {
          id: "cybersecurity",
          name: "Cybersecurity",
          description: "Protecting systems, networks, data, and applications from digital attacks.",
          subjects: [
            {
              id: "web-security",
              name: "Web Security",
              description: "Defending web applications against common exploits, injection vulnerabilities, and authentication flaws.",
              topics: [
                {
                  id: "sql-injection",
                  subtopic: "Injection Vulnerabilities",
                  title: "SQL Injection (SQLi)",
                  type: "Article",
                  level: "Beginner",
                  link: "https://example.com/demo/web-security/sql-injection",
                  notes: "Covers how unvalidated user inputs allow attackers to interfere with backend database queries. Explains parameterized queries as the primary defense.",
                  time: 20,
                  why_it_matters: "SQL injection remains one of the most critical web application vulnerabilities, leading to severe data breaches if left unmitigated.",
                  related_topics: ["xss-fundamentals", "csrf-defense"]
                },
                {
                  id: "xss-fundamentals",
                  subtopic: "Client-Side Attacks",
                  title: "Cross-Site Scripting (XSS)",
                  type: "Video",
                  level: "Beginner",
                  link: "https://example.com/demo/web-security/xss-fundamentals",
                  notes: "Details Stored, Reflected, and DOM-based XSS vulnerabilities. Explores Content Security Policy (CSP) and context-aware HTML output encoding.",
                  time: 25,
                  why_it_matters: "XSS allows malicious scripts to run in victims' browsers, compromising cookies, session tokens, and sensitive client data.",
                  related_topics: ["sql-injection", "csrf-defense"]
                },
                {
                  id: "csrf-defense",
                  subtopic: "Session Flaws",
                  title: "Cross-Site Request Forgery (CSRF)",
                  type: "Article",
                  level: "Intermediate",
                  link: "https://example.com/demo/web-security/csrf-defense",
                  notes: "Explains how unauthorized commands are transmitted from a trusted user. Discusses anti-CSRF tokens and SameSite cookie attributes.",
                  time: 18,
                  why_it_matters: "CSRF exploits ambient credentials (like cookies), forcing authenticated users to unintentionally perform sensitive actions.",
                  related_topics: ["xss-fundamentals"]
                },
                {
                  id: "cors-architecture",
                  subtopic: "Browser Security Models",
                  title: "CORS & Browser Origin Security",
                  type: "Article",
                  level: "Intermediate",
                  link: "https://example.com/demo/web-security/cors-architecture",
                  notes: "Comprehensive breakdown of Same-Origin Policy (SOP), preflight OPTIONS requests, and proper Access-Control header configurations.",
                  time: 22,
                  why_it_matters: "Misconfigured CORS headers can inadvertently expose private APIs to malicious third-party origins.",
                  related_topics: ["csrf-defense"]
                }
              ]
            },
            {
              id: "cryptography",
              name: "Applied Cryptography",
              description: "Mathematical principles and engineering practices for securing communication and sensitive data.",
              topics: [
                {
                  id: "symmetric-vs-asymmetric",
                  subtopic: "Encryption Fundamentals",
                  title: "Symmetric vs Asymmetric Encryption",
                  type: "Video",
                  level: "Beginner",
                  link: "https://example.com/demo/cryptography/symmetric-vs-asymmetric",
                  notes: "Compares AES and ChaCha20 symmetric ciphers with RSA and ECC public-key cryptosystems, along with practical performance trade-offs.",
                  time: 30,
                  why_it_matters: "Modern secure communication relies on a hybrid model using asymmetric cryptography for key exchange and symmetric ciphers for bulk data.",
                  related_topics: ["tls-handshake", "hashing-signatures"]
                },
                {
                  id: "hashing-signatures",
                  subtopic: "Integrity & Non-Repudiation",
                  title: "Cryptographic Hash Functions & Digital Signatures",
                  type: "Article",
                  level: "Intermediate",
                  link: "https://example.com/demo/cryptography/hashing-signatures",
                  notes: "Examines collision resistance in SHA-256 and SHA-3, salt/pepper hashing for passwords (bcrypt/Argon2), and digital signature verification.",
                  time: 25,
                  why_it_matters: "Ensures message integrity and authenticates identity without ever revealing private credentials or raw passwords.",
                  related_topics: ["symmetric-vs-asymmetric", "tls-handshake"]
                },
                {
                  id: "tls-handshake",
                  subtopic: "Transport Security",
                  title: "The TLS 1.3 Handshake Protocol",
                  type: "Article",
                  level: "Advanced",
                  link: "https://example.com/demo/cryptography/tls-handshake",
                  notes: "Step-by-step walkthrough of TLS 1.3 key negotiation, Diffie-Hellman ephemeral exchange, and perfect forward secrecy.",
                  time: 35,
                  why_it_matters: "TLS is the backbone of HTTPS and internet confidentiality across all web and mobile applications.",
                  related_topics: ["symmetric-vs-asymmetric", "hashing-signatures"]
                }
              ]
            }
          ]
        },
        {
          id: "artificial-intelligence",
          name: "Artificial Intelligence",
          description: "Creating intelligent systems, machine learning models, and cognitive architectures.",
          subjects: [
            {
              id: "machine-learning-basics",
              name: "Machine Learning Foundations",
              description: "Core concepts, learning paradigms, and mathematical models that power modern AI systems.",
              topics: [
                {
                  id: "supervised-learning",
                  subtopic: "Learning Paradigms",
                  title: "Supervised Learning & Regression",
                  type: "Article",
                  level: "Beginner",
                  link: "https://example.com/demo/ai/supervised-learning",
                  notes: "Introduction to labeled training data, linear regression, cost functions, gradient descent, and evaluation metrics (MSE, R2).",
                  time: 25,
                  why_it_matters: "Forms the foundation of predictive modeling across business forecasting, diagnostics, and classification tasks.",
                  related_topics: ["overfitting-regularization", "neural-networks-intro"]
                },
                {
                  id: "overfitting-regularization",
                  subtopic: "Model Validation",
                  title: "Bias-Variance Tradeoff & Regularization",
                  type: "Article",
                  level: "Intermediate",
                  link: "https://example.com/demo/ai/overfitting-regularization",
                  notes: "Detailed treatment of underfitting, overfitting, cross-validation, and L1 (Lasso) / L2 (Ridge) penalty terms.",
                  time: 20,
                  why_it_matters: "Crucial for building models that generalize accurately to unseen real-world data rather than memorizing training data.",
                  related_topics: ["supervised-learning"]
                },
                {
                  id: "neural-networks-intro",
                  subtopic: "Deep Learning",
                  title: "Artificial Neural Networks & Backpropagation",
                  type: "Video",
                  level: "Intermediate",
                  link: "https://example.com/demo/ai/neural-networks-intro",
                  notes: "Perceptrons, activation functions (ReLU, Sigmoid), computational graphs, chain rule calculus, and weights updating.",
                  time: 40,
                  why_it_matters: "Deep learning architectures power contemporary computer vision, speech synthesis, and large language models.",
                  related_topics: ["supervised-learning", "transformer-architectures"]
                },
                {
                  id: "transformer-architectures",
                  subtopic: "Modern Deep Learning",
                  title: "Attention Mechanisms & Transformers",
                  type: "Article",
                  level: "Advanced",
                  link: "https://example.com/demo/ai/transformer-architectures",
                  notes: "Self-attention mechanism, positional encodings, multi-head attention, and transformer encoder-decoder architectures.",
                  time: 45,
                  why_it_matters: "The core breakthrough behind state-of-the-art generative AI systems, modern NLP, and multimodal AI.",
                  related_topics: ["neural-networks-intro"]
                }
              ]
            }
          ]
        },
        {
          id: "data-science",
          name: "Data Science",
          description: "Extracting actionable insights from structured and unstructured datasets using statistical methods.",
          subjects: [
            {
              id: "data-analysis-python",
              name: "Data Analysis with Python",
              description: "Practical data manipulation, cleaning, and exploratory data analysis using industry-standard libraries.",
              topics: [
                {
                  id: "pandas-dataframes",
                  subtopic: "Tabular Data Manipulation",
                  title: "Exploratory Data Analysis with Pandas",
                  type: "Article",
                  level: "Beginner",
                  link: "https://example.com/demo/data-science/pandas-dataframes",
                  notes: "Techniques for filtering, grouping, aggregating, handling missing values, and reshaping tabular datasets.",
                  time: 30,
                  why_it_matters: "Real-world data is messy; over 70% of a data scientist's time is spent wrangling and understanding data structures.",
                  related_topics: ["data-visualization-principles"]
                },
                {
                  id: "data-visualization-principles",
                  subtopic: "Visual Analytics",
                  title: "Effective Data Storytelling & Visualization",
                  type: "Video",
                  level: "Beginner",
                  link: "https://example.com/demo/data-science/data-visualization-principles",
                  notes: "Color theory, chart selection guidelines, decluttering visuals, and communicating statistical findings clearly to stakeholders.",
                  time: 25,
                  why_it_matters: "Data insights provide no value unless they can be communicated clearly to drive decision-making.",
                  related_topics: ["pandas-dataframes"]
                }
              ]
            }
          ]
        },
        {
          id: "cloud-computing",
          name: "Cloud Computing",
          description: "On-demand computing resources, containerized workloads, serverless services, and cloud architecture.",
          subjects: [
            {
              id: "cloud-infrastructure",
              name: "Cloud Infrastructure & Containers",
              description: "Modern infrastructure paradigms including Docker containers, Kubernetes orchestration, and cloud primitives.",
              topics: [
                {
                  id: "docker-fundamentals",
                  subtopic: "Containerization",
                  title: "Docker Containers & Images",
                  type: "Video",
                  level: "Beginner",
                  link: "https://example.com/demo/cloud/docker-fundamentals",
                  notes: "Understanding containerization vs virtualization, Dockerfiles, multi-stage builds, and container networking.",
                  time: 30,
                  why_it_matters: "Ensures environment parity across local development, testing, and production servers.",
                  related_topics: ["kubernetes-orchestration"]
                },
                {
                  id: "kubernetes-orchestration",
                  subtopic: "Orchestration",
                  title: "Kubernetes Architecture & Pod Lifecycle",
                  type: "Article",
                  level: "Advanced",
                  link: "https://example.com/demo/cloud/kubernetes-orchestration",
                  notes: "Control plane components, worker nodes, Pods, Deployments, Services, Ingress controllers, and automated scaling.",
                  time: 40,
                  why_it_matters: "Kubernetes is the de facto operating system for enterprise-scale distributed cloud applications.",
                  related_topics: ["docker-fundamentals"]
                }
              ]
            }
          ]
        },
        {
          id: "programming-languages",
          name: "Programming Languages",
          description: "Language paradigms, memory safety, compilers, and modern idiomatic programming practices.",
          subjects: [
            {
              id: "modern-javascript",
              name: "Modern JavaScript & TypeScript",
              description: "Deep dive into execution context, event loop, asynchronous patterns, and static type safety.",
              topics: [
                {
                  id: "event-loop-async",
                  subtopic: "Runtime Mechanics",
                  title: "The JavaScript Event Loop & Concurrency",
                  type: "Video",
                  level: "Intermediate",
                  link: "https://example.com/demo/languages/event-loop-async",
                  notes: "Call stack, Web APIs, microtask queue, macrotask queue, Promises, and async/await mechanics.",
                  time: 25,
                  why_it_matters: "Mastering asynchronous flow prevents UI freezes, race conditions, and unhandled promise rejections in web apps.",
                  related_topics: ["typescript-generics"]
                },
                {
                  id: "typescript-generics",
                  subtopic: "Type Safety",
                  title: "TypeScript Generics & Utility Types",
                  type: "Article",
                  level: "Intermediate",
                  link: "https://example.com/demo/languages/typescript-generics",
                  notes: "Generic constraints, type inference, conditional types, Mapped Types, and built-in helpers (Pick, Omit, Partial).",
                  time: 28,
                  why_it_matters: "Allows developers to build reusable, resilient libraries with strict compile-time guarantees.",
                  related_topics: ["event-loop-async"]
                }
              ]
            }
          ]
        },
        {
          id: "full-stack-dev",
          name: "Full Stack Development",
          description: "End-to-end web architecture from accessible frontend interfaces to scalable backend APIs.",
          subjects: [
            {
              id: "web-architecture",
              name: "Web Application Architecture",
              description: "System design for web applications, state management, caching, and database design.",
              topics: [
                {
                  id: "rest-api-design",
                  subtopic: "API Architecture",
                  title: "RESTful API Design & HTTP Semantics",
                  type: "Article",
                  level: "Beginner",
                  link: "https://example.com/demo/fullstack/rest-api-design",
                  notes: "HTTP methods, status code semantics, idempotent operations, pagination strategies, and API versioning patterns.",
                  time: 22,
                  why_it_matters: "Well-architected APIs are intuitive, stable for client integrations, and easy to maintain over time.",
                  related_topics: ["sql-injection", "cors-architecture"]
                },
                {
                  id: "database-indexing",
                  subtopic: "Storage Optimization",
                  title: "Relational Database Indexing & Query Tuning",
                  type: "Article",
                  level: "Intermediate",
                  link: "https://example.com/demo/fullstack/database-indexing",
                  notes: "B-Tree indexes, composite indexes, query execution plans (EXPLAIN), and table scan mitigation.",
                  time: 30,
                  why_it_matters: "Poor indexing is the most common cause of catastrophic performance degradation as data volume grows.",
                  related_topics: ["rest-api-design"]
                }
              ]
            }
          ]
        },
        {
          id: "devops",
          name: "DevOps",
          description: "Automating software delivery, infrastructure management, continuous testing, and observability.",
          subjects: [
            {
              id: "continuous-delivery",
              name: "Continuous Integration & Delivery (CI/CD)",
              description: "Automated pipelines for testing, linting, packaging, and deploying software reliably.",
              topics: [
                {
                  id: "cicd-best-practices",
                  subtopic: "Pipeline Automation",
                  title: "Building Reliable CI/CD Pipelines",
                  type: "Video",
                  level: "Beginner",
                  link: "https://example.com/demo/devops/cicd-best-practices",
                  notes: "Trigger mechanisms, stage parallelization, automated smoke tests, rollback strategies, and immutable artifacts.",
                  time: 25,
                  why_it_matters: "Enables teams to ship high-quality updates rapidly and with confidence, reducing downtime.",
                  related_topics: ["docker-fundamentals"]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "non-tech",
      name: "Non-Tech",
      description: "Disciplines from humanities, business, economics, cognitive psychology, and visual design.",
      icon: "compass",
      domains: [
        {
          id: "design-ux",
          name: "Design & UX",
          description: "User experience research, visual hierarchy, interaction design, and cognitive accessibility.",
          subjects: [
            {
              id: "interaction-design",
              name: "Interaction Design Principles",
              description: "Foundational ergonomics, mental models, feedback loops, and usability heuristics for human-computer interfaces.",
              topics: [
                {
                  id: "nielsen-heuristics",
                  subtopic: "Usability Evaluation",
                  title: "Jakob Nielsen's 10 Usability Heuristics",
                  type: "Article",
                  level: "Beginner",
                  link: "https://example.com/demo/design/nielsen-heuristics",
                  notes: "Walkthrough of visibility of system status, match between system and real world, error prevention, and recognition over recall.",
                  time: 25,
                  why_it_matters: "Provides a universally respected framework for spotting usability issues before user testing even begins.",
                  related_topics: ["visual-hierarchy-typography"]
                },
                {
                  id: "visual-hierarchy-typography",
                  subtopic: "Visual Layout",
                  title: "Visual Hierarchy, Spacing & Typography",
                  type: "Video",
                  level: "Beginner",
                  link: "https://example.com/demo/design/visual-hierarchy-typography",
                  notes: "Scale, contrast, whitespace, grouping (Gestalt laws), and typographic scales to guide human eye scanning.",
                  time: 20,
                  why_it_matters: "Users scan web interfaces in F-shaped and Z-shaped patterns; clear hierarchy ensures immediate comprehension.",
                  related_topics: ["nielsen-heuristics"]
                }
              ]
            }
          ]
        },
        {
          id: "cognitive-science",
          name: "Cognitive Science & Psychology",
          description: "Understanding human perception, memory consolidation, mental models, and decision-making.",
          subjects: [
            {
              id: "learning-science",
              name: "The Science of Learning",
              description: "Evidence-based techniques for mastering complex topics, long-term retention, and deliberate practice.",
              topics: [
                {
                  id: "spaced-repetition-retrieval",
                  subtopic: "Memory Consolidation",
                  title: "Spaced Repetition & Active Retrieval",
                  type: "Article",
                  level: "Beginner",
                  link: "https://example.com/demo/cognitive/spaced-repetition-retrieval",
                  notes: "Ebbinghaus forgetting curve, Leitner system, active recall testing effect, and interval scheduling.",
                  time: 18,
                  why_it_matters: "Active retrieval produces significantly higher long-term retention compared to passive rereading or highlighting.",
                  related_topics: ["cognitive-load-theory"]
                },
                {
                  id: "cognitive-load-theory",
                  subtopic: "Working Memory",
                  title: "Cognitive Load Theory in Knowledge Acquisition",
                  type: "Article",
                  level: "Intermediate",
                  link: "https://example.com/demo/cognitive/cognitive-load-theory",
                  notes: "Intrinsic, extraneous, and germane cognitive load; working memory limitations; and chunking strategies.",
                  time: 24,
                  why_it_matters: "Helps learners and educators structure information so working memory is not overwhelmed.",
                  related_topics: ["spaced-repetition-retrieval"]
                }
              ]
            }
          ]
        },
        {
          id: "business-strategy",
          name: "Business Strategy & Product",
          description: "Frameworks for validating market needs, building sustainable products, and strategic execution.",
          subjects: [
            {
              id: "product-discovery",
              name: "Product Discovery & Management",
              description: "Identifying customer problems, hypothesis testing, unit economics, and prioritizing product features.",
              topics: [
                {
                  id: "jobs-to-be-done",
                  subtopic: "Customer Research",
                  title: "Jobs-to-be-Done (JTBD) Framework",
                  type: "Article",
                  level: "Beginner",
                  link: "https://example.com/demo/business/jobs-to-be-done",
                  notes: "Focusing on the underlying progress a customer desires rather than demographic traits or superficial feature requests.",
                  time: 20,
                  why_it_matters: "Products fail when they build features customers requested but that do not solve their core underlying struggle.",
                  related_topics: ["nielsen-heuristics"]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "interdisciplinary",
      name: "Interdisciplinary",
      description: "Subjects connecting computing, biological systems, policy, economics, and ethical governance.",
      icon: "git-merge",
      domains: [
        {
          id: "tech-ethics",
          name: "Tech Ethics & Digital Rights",
          description: "Moral philosophies, algorithmic accountability, data sovereignty, and technological governance.",
          subjects: [
            {
              id: "ai-governance",
              name: "AI Ethics & Algorithmic Fairness",
              description: "Analyzing bias in automated decision systems, transparency, privacy rights, and responsible AI guidelines.",
              topics: [
                {
                  id: "algorithmic-bias",
                  subtopic: "Fairness in Machine Learning",
                  title: "Detecting & Mitigating Algorithmic Bias",
                  type: "Article",
                  level: "Intermediate",
                  link: "https://example.com/demo/ethics/algorithmic-bias",
                  notes: "Disparate impact, representation disparities in training corpora, demographic parity, and ethical auditing methods.",
                  time: 28,
                  why_it_matters: "Automated scoring systems can amplify historic societal discrimination if unchecked.",
                  related_topics: ["supervised-learning", "nielsen-heuristics"]
                }
              ]
            }
          ]
        },
        {
          id: "bioinformatics",
          name: "Bioinformatics & Computational Biology",
          description: "Applying algorithmic computation and statistical modeling to biological sequences and molecular structures.",
          subjects: [
            {
              id: "genomic-data",
              name: "Sequence Analysis & Genomics",
              description: "Dynamic programming for sequence alignment, BLAST heuristics, and genome variant discovery.",
              topics: [
                {
                  id: "sequence-alignment",
                  subtopic: "Algorithmic Genomics",
                  title: "Pairwise Sequence Alignment (Needleman-Wunsch & Smith-Waterman)",
                  type: "Article",
                  level: "Advanced",
                  link: "https://example.com/demo/bioinformatics/sequence-alignment",
                  notes: "Global vs local sequence alignment using dynamic programming matrices, scoring schemas, and gap penalty formulations.",
                  time: 35,
                  why_it_matters: "Fundamental to identifying evolutionary relationships, functional gene domains, and disease-causing mutations.",
                  related_topics: ["supervised-learning"]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "miscellaneous",
      name: "Miscellaneous",
      description: "Productivity systems, academic research methodologies, and meta-learning disciplines.",
      icon: "layers",
      domains: [
        {
          id: "knowledge-management",
          name: "Personal Knowledge Management",
          description: "Systems, taxonomies, and digital tools for collecting, organizing, and synthesizing insights over a lifetime.",
          subjects: [
            {
              id: "pkm-systems",
              name: "PKM Architectures & Note-Taking",
              description: "Systematic frameworks for personal knowledge organization, bidirectional linking, and lifelong learning.",
              topics: [
                {
                  id: "zettelkasten-method",
                  subtopic: "Note Organization",
                  title: "The Zettelkasten Method & Atomic Notes",
                  type: "Article",
                  level: "Beginner",
                  link: "https://example.com/demo/misc/zettelkasten-method",
                  notes: "Niklas Luhmann's slip-box system: literature notes vs permanent notes, atomic concepts, and emergent connections.",
                  time: 22,
                  why_it_matters: "Transforms passive bookmarking into active intellectual compounding and synthesis.",
                  related_topics: ["spaced-repetition-retrieval"]
                },
                {
                  id: "building-second-brain",
                  subtopic: "Information Workflow",
                  title: "CODE & PARA Organization Frameworks",
                  type: "Video",
                  level: "Beginner",
                  link: "https://example.com/demo/misc/building-second-brain",
                  notes: "Capture, Organize, Distill, Express (CODE) and Projects, Areas, Resources, Archives (PARA) organizational taxonomy.",
                  time: 20,
                  why_it_matters: "Eliminates digital clutter and aligns saved information with actionable outcomes and projects.",
                  related_topics: ["zettelkasten-method"]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  learning_paths: [
    {
      id: "path-web-security",
      title: "Web Application Security Specialist",
      domain: "Cybersecurity",
      description: "A curated sequence covering client-side vulnerabilities, backend injection flaws, and transport-layer security.",
      estimated_hours: 12,
      topic_ids: ["sql-injection", "xss-fundamentals", "csrf-defense", "cors-architecture", "tls-handshake"]
    },
    {
      id: "path-modern-fullstack",
      title: "Modern Full-Stack Engineering",
      domain: "Tech Foundations",
      description: "Build high-performance, robust web applications from frontend concurrency to API architecture and database indexing.",
      estimated_hours: 15,
      topic_ids: ["event-loop-async", "typescript-generics", "rest-api-design", "database-indexing", "docker-fundamentals"]
    },
    {
      id: "path-effective-learner",
      title: "Meta-Learning & Knowledge Mastery",
      domain: "Cognitive Science & PKM",
      description: "Master evidence-based study techniques, active recall, cognitive load management, and personal knowledge systems.",
      estimated_hours: 8,
      topic_ids: ["spaced-repetition-retrieval", "cognitive-load-theory", "zettelkasten-method", "building-second-brain"]
    }
  ]
};

// ----------------------------------------------------------------------------
// 2. State Management
// ----------------------------------------------------------------------------
const STORAGE_KEY_COMPLETED = 'study_hub_completed_topics';
const STORAGE_KEY_RECENT = 'study_hub_recent_topics';

const state = {
  data: null,
  completedTopics: new Set(),
  recentTopics: [],
  currentRoute: {
    view: 'home', // 'home', 'field', 'domain', 'subject', 'topic', 'paths', 'about'
    fieldId: null,
    domainId: null,
    subjectId: null,
    topicId: null
  },
  subjectFilters: {
    search: '',
    difficulty: 'all',
    type: 'all'
  }
};

// Load saved learning progress from localStorage
function loadLocalState() {
  try {
    const savedCompleted = localStorage.getItem(STORAGE_KEY_COMPLETED);
    if (savedCompleted) {
      state.completedTopics = new Set(JSON.parse(savedCompleted));
    }
    const savedRecent = localStorage.getItem(STORAGE_KEY_RECENT);
    if (savedRecent) {
      state.recentTopics = JSON.parse(savedRecent);
    }
  } catch (err) {
    console.warn('Unable to load localStorage learning state:', err);
  }
}

// Save topic completion state to localStorage
function saveCompletedState() {
  try {
    localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify([...state.completedTopics]));
  } catch (err) {
    console.warn('Unable to save completed state to localStorage:', err);
  }
}

// Record recently visited topic
function recordRecentTopic(topicId) {
  state.recentTopics = [topicId, ...state.recentTopics.filter(id => id !== topicId)].slice(0, 8);
  try {
    localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(state.recentTopics));
  } catch (err) {
    console.warn('Unable to save recent topics:', err);
  }
}

// ----------------------------------------------------------------------------
// 3. UI Helpers & Toast Notifications
// ----------------------------------------------------------------------------
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${escapeHTML(message)}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 200);
  }, 2800);
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

function getFieldIconSvg(iconName) {
  switch (iconName) {
    case 'code':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
    case 'compass':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`;
    case 'git-merge':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path></svg>`;
    case 'layers':
    default:
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`;
  }
}

// ----------------------------------------------------------------------------
// 4. Data Loading & Indexing
// ----------------------------------------------------------------------------
async function loadDataset() {
  const viewContainer = document.getElementById('view-container');
  try {
    const response = await fetch('data/study-hub.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch data/study-hub.json`);
    }
    const json = await response.json();
    state.data = json;
  } catch (err) {
    console.warn('Network fetch for study-hub.json encountered an issue; falling back to bundled dataset:', err);
    // Graceful fallback allows opening index.html directly via file://
    state.data = FALLBACK_DATA;
  }

  // Once data is loaded, initialize router
  handleRoute();
}

// Lookup Helpers
function findField(fieldId) {
  if (!state.data || !state.data.fields) return null;
  return state.data.fields.find(f => f.id === fieldId) || null;
}

function findDomain(domainId) {
  if (!state.data || !state.data.fields) return null;
  for (const field of state.data.fields) {
    if (field.domains) {
      const dom = field.domains.find(d => d.id === domainId);
      if (dom) return { domain: dom, field };
    }
  }
  return null;
}

function findSubject(subjectId) {
  if (!state.data || !state.data.fields) return null;
  for (const field of state.data.fields) {
    for (const domain of (field.domains || [])) {
      const sub = (domain.subjects || []).find(s => s.id === subjectId);
      if (sub) return { subject: sub, domain, field };
    }
  }
  return null;
}

function findTopic(topicId) {
  if (!state.data || !state.data.fields) return null;
  for (const field of state.data.fields) {
    for (const domain of (field.domains || [])) {
      for (const subject of (domain.subjects || [])) {
        const topics = subject.topics || [];
        const index = topics.findIndex(t => t.id === topicId);
        if (index !== -1) {
          return {
            topic: topics[index],
            subject,
            domain,
            field,
            index,
            prevTopic: index > 0 ? topics[index - 1] : null,
            nextTopic: index < topics.length - 1 ? topics[index + 1] : null
          };
        }
      }
    }
  }
  return null;
}

// ----------------------------------------------------------------------------
// 5. Router & Navigation Feedback
// ----------------------------------------------------------------------------
function navigateTo(route) {
  state.currentRoute = { ...state.currentRoute, ...route };
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderCurrentView();
  updateBreadcrumbs();
  updateNavActiveState();
}

function updateNavActiveState() {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const view = state.currentRoute.view;
  if (view === 'paths') {
    document.getElementById('nav-paths')?.classList.add('active');
  } else if (view === 'about') {
    document.getElementById('nav-about')?.classList.add('active');
  } else {
    document.getElementById('nav-explore')?.classList.add('active');
  }
}

function updateBreadcrumbs() {
  const bar = document.getElementById('breadcrumb-bar');
  const list = document.getElementById('breadcrumb-list');
  if (!bar || !list) return;

  const { view, fieldId, domainId, subjectId, topicId } = state.currentRoute;

  // Hide breadcrumbs on Home, Learning Paths, and About
  if (view === 'home' || view === 'paths' || view === 'about') {
    bar.style.display = 'none';
    list.innerHTML = '';
    return;
  }

  bar.style.display = 'block';
  const crumbs = [
    { label: 'Home', action: () => navigateTo({ view: 'home', fieldId: null, domainId: null, subjectId: null, topicId: null }) }
  ];

  if (fieldId) {
    const field = findField(fieldId);
    if (field) {
      crumbs.push({
        label: field.name,
        action: () => navigateTo({ view: 'field', fieldId, domainId: null, subjectId: null, topicId: null }),
        active: view === 'field'
      });
    }
  }

  if (domainId) {
    const dInfo = findDomain(domainId);
    if (dInfo) {
      crumbs.push({
        label: dInfo.domain.name,
        action: () => navigateTo({ view: 'domain', fieldId: dInfo.field.id, domainId, subjectId: null, topicId: null }),
        active: view === 'domain'
      });
    }
  }

  if (subjectId) {
    const sInfo = findSubject(subjectId);
    if (sInfo) {
      crumbs.push({
        label: sInfo.subject.name,
        action: () => navigateTo({ view: 'subject', fieldId: sInfo.field.id, domainId: sInfo.domain.id, subjectId, topicId: null }),
        active: view === 'subject'
      });
    }
  }

  if (topicId) {
    const tInfo = findTopic(topicId);
    if (tInfo) {
      crumbs.push({
        label: tInfo.topic.title,
        action: null,
        active: true
      });
    }
  }

  list.innerHTML = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    return `
      <li class="breadcrumb-item ${c.active || isLast ? 'active' : ''}">
        ${isLast || !c.action
          ? `<span>${escapeHTML(c.label)}</span>`
          : `<button type="button" class="breadcrumb-link" data-index="${i}">${escapeHTML(c.label)}</button>`
        }
        ${!isLast ? `<span class="breadcrumb-separator" aria-hidden="true">&rsaquo;</span>` : ''}
      </li>
    `;
  }).join('');

  // Attach crumb click listeners
  list.querySelectorAll('.breadcrumb-link').forEach(btn => {
    const index = parseInt(btn.getAttribute('data-index'), 10);
    btn.addEventListener('click', () => {
      crumbs[index].action?.();
    });
  });
}

function handleRoute() {
  renderCurrentView();
  updateBreadcrumbs();
  updateNavActiveState();
}

// ----------------------------------------------------------------------------
// 6. View Rendering Engine
// ----------------------------------------------------------------------------
function renderCurrentView() {
  const container = document.getElementById('view-container');
  if (!container || !state.data) return;

  const { view, fieldId, domainId, subjectId, topicId } = state.currentRoute;

  switch (view) {
    case 'home':
      renderHomeView(container);
      break;
    case 'field':
      renderFieldView(container, fieldId);
      break;
    case 'domain':
      renderDomainView(container, domainId);
      break;
    case 'subject':
      renderSubjectView(container, subjectId);
      break;
    case 'topic':
      renderTopicView(container, topicId);
      break;
    case 'paths':
      renderPathsView(container);
      break;
    case 'about':
      renderAboutView(container);
      break;
    default:
      renderHomeView(container);
  }
}

// ----------------------------------------------------------------------------
// View 1: Home View (Hero, Field Explorer, Popular Domains, Continue Learning)
// ----------------------------------------------------------------------------
function renderHomeView(container) {
  const fields = state.data.fields || [];

  // Flatten popular domains dynamically
  const popularDomains = [];
  fields.forEach(f => {
    (f.domains || []).forEach(d => {
      popularDomains.push({ domain: d, field: f });
    });
  });

  // Calculate continue learning items (completed or recent)
  const continueItems = [];
  const visitedIds = [...new Set([...state.recentTopics, ...state.completedTopics])];
  visitedIds.slice(0, 4).forEach(tId => {
    const tInfo = findTopic(tId);
    if (tInfo) continueItems.push(tInfo);
  });

  container.innerHTML = `
    <!-- SECTION 1: HERO SECTION -->
    <section class="hero-section" aria-labelledby="hero-heading">
      <div class="hero-pill">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
        </svg>
        Structured Knowledge Directory
      </div>
      <h1 id="hero-heading" class="hero-heading">Explore Knowledge. Learn Anything.</h1>
      <p class="hero-description">
        Discover high-quality learning resources organized into clear subjects, curated topics, and structured disciplines.
      </p>

      <form class="hero-search-form" id="hero-search-form" role="search">
        <div class="hero-search-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="search" id="hero-search-input" class="hero-search-input" placeholder="Search for a subject, topic, or skill..." aria-label="Search for a subject, topic, or skill">
        </div>
        <button type="submit" class="hero-search-btn">Search Knowledge</button>
      </form>

      <div class="hero-quick-actions">
        <button type="button" class="btn-secondary" id="btn-hero-explore">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          Explore Fields
        </button>
        <button type="button" class="btn-secondary" id="btn-hero-paths">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="12 6 12 12 16 14"></polygon>
          </svg>
          Learning Paths
        </button>
      </div>
    </section>

    <!-- SECTION 2: FIELD EXPLORER -->
    <section class="section-block" id="field-explorer" aria-labelledby="fields-heading">
      <div class="section-header">
        <h2 id="fields-heading">Explore by Field</h2>
        <p>Choose an area of knowledge to begin exploring disciplines and topics.</p>
      </div>

      <div class="field-grid">
        ${fields.map(f => {
          const domainCount = (f.domains || []).length;
          return `
            <div class="field-card" data-field-id="${f.id}" tabindex="0" role="button" aria-label="Explore field ${escapeHTML(f.name)}">
              <div class="field-card-top">
                <div class="field-icon" aria-hidden="true">
                  ${getFieldIconSvg(f.icon)}
                </div>
                <h3 class="field-title">${escapeHTML(f.name)}</h3>
                <p class="field-desc">${escapeHTML(f.description)}</p>
              </div>
              <div class="field-card-bottom">
                <span class="field-domain-count">${domainCount} ${domainCount === 1 ? 'Domain' : 'Domains'}</span>
                <span class="field-explore-link">Explore &rarr;</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- SECTION 3: POPULAR DOMAINS -->
    <section class="section-block" aria-labelledby="domains-heading">
      <div class="section-header">
        <h2 id="domains-heading">Explore Popular Domains</h2>
        <p>Direct access to foundational and high-demand disciplines.</p>
      </div>

      <div class="popular-domains-grid">
        ${popularDomains.map(item => {
          const subCount = (item.domain.subjects || []).length;
          return `
            <div class="domain-pill-card" data-domain-id="${item.domain.id}" data-field-id="${item.field.id}" tabindex="0" role="button" aria-label="Explore domain ${escapeHTML(item.domain.name)}">
              <span class="domain-pill-title">${escapeHTML(item.domain.name)}</span>
              <span class="domain-pill-meta">${escapeHTML(item.field.name)} &bull; ${subCount} ${subCount === 1 ? 'Subject' : 'Subjects'}</span>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- SECTION 4: CONTINUE LEARNING -->
    <section class="section-block" aria-labelledby="continue-heading">
      <div class="section-header">
        <h2 id="continue-heading">Continue Learning</h2>
        <p>Track completed topics and resume where you left off.</p>
      </div>

      ${continueItems.length === 0 ? `
        <div class="empty-learning-state">
          <div class="empty-state-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <h3>Your learning journey starts here.</h3>
          <p>Explore a subject and mark topics as completed to track your progress across disciplines.</p>
          <button type="button" class="btn-open-resource" id="btn-empty-explore">Explore Knowledge</button>
        </div>
      ` : `
        <div class="continue-grid">
          ${continueItems.map(item => {
            const isDone = state.completedTopics.has(item.topic.id);
            return `
              <div class="continue-card">
                <div class="continue-card-top">
                  <div>
                    <h4 class="continue-topic-title" data-topic-id="${item.topic.id}">${escapeHTML(item.topic.title)}</h4>
                    <span class="continue-topic-path">${escapeHTML(item.domain.name)} &rsaquo; ${escapeHTML(item.subject.name)}</span>
                  </div>
                  <span class="badge ${isDone ? 'badge-completed' : 'badge-beginner'}">
                    ${isDone ? '✓ Completed' : 'In Progress'}
                  </span>
                </div>
                <div class="continue-card-bottom">
                  <span class="topic-time">⏱ ${item.topic.time || 15} mins</span>
                  <button type="button" class="field-explore-link" data-topic-id="${item.topic.id}">
                    ${isDone ? 'Review Topic &rarr;' : 'Continue &rarr;'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </section>
  `;

  // Attach Home Listeners
  // Hero Search Form
  document.getElementById('hero-search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('hero-search-input')?.value.trim();
    if (query) triggerSearch(query);
  });

  // Hero Quick Action Buttons
  document.getElementById('btn-hero-explore')?.addEventListener('click', () => {
    document.getElementById('field-explorer')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('btn-hero-paths')?.addEventListener('click', () => {
    navigateTo({ view: 'paths' });
  });
  document.getElementById('btn-empty-explore')?.addEventListener('click', () => {
    document.getElementById('field-explorer')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Field Cards
  container.querySelectorAll('.field-card').forEach(card => {
    const fieldId = card.getAttribute('data-field-id');
    const handleClick = () => navigateTo({ view: 'field', fieldId, domainId: null, subjectId: null, topicId: null });
    card.addEventListener('click', handleClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    });
  });

  // Popular Domain Cards
  container.querySelectorAll('.domain-pill-card').forEach(card => {
    const domainId = card.getAttribute('data-domain-id');
    const fieldId = card.getAttribute('data-field-id');
    const handleClick = () => navigateTo({ view: 'domain', fieldId, domainId, subjectId: null, topicId: null });
    card.addEventListener('click', handleClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    });
  });

  // Continue Learning Topic Click
  container.querySelectorAll('[data-topic-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const topicId = btn.getAttribute('data-topic-id');
      navigateTo({ view: 'topic', topicId });
    });
  });
}

// ----------------------------------------------------------------------------
// View 2: Field View (Lists domains within a selected Field)
// ----------------------------------------------------------------------------
function renderFieldView(container, fieldId) {
  const field = findField(fieldId);
  if (!field) {
    container.innerHTML = `
      <div class="error-state">
        <h3>Field Not Found</h3>
        <p>The requested knowledge field could not be found in the current dataset.</p>
        <button type="button" class="btn-retry" id="btn-back-home">Return to Home</button>
      </div>
    `;
    document.getElementById('btn-back-home')?.addEventListener('click', () => navigateTo({ view: 'home' }));
    return;
  }

  const domains = field.domains || [];

  container.innerHTML = `
    <div class="view-header">
      <h1 class="view-header-title">${escapeHTML(field.name)}</h1>
      <p class="view-header-desc">${escapeHTML(field.description)}</p>
    </div>

    <div class="section-header">
      <h2>Domains in ${escapeHTML(field.name)}</h2>
      <p>Select a domain to view its organized subjects and learning topics.</p>
    </div>

    ${domains.length === 0 ? `
      <div class="empty-learning-state">
        <p>No domains currently available for this field.</p>
      </div>
    ` : `
      <div class="grid-cards">
        ${domains.map(d => {
          const subjects = d.subjects || [];
          let topicCount = 0;
          subjects.forEach(s => topicCount += (s.topics || []).length);
          return `
            <div class="standard-card" data-domain-id="${d.id}" tabindex="0" role="button" aria-label="Explore domain ${escapeHTML(d.name)}">
              <div>
                <h3 class="card-title">${escapeHTML(d.name)}</h3>
                <p class="card-desc">${escapeHTML(d.description || 'Structured discipline exploring foundational and modern principles.')}</p>
              </div>
              <div class="card-footer">
                <span>${subjects.length} ${subjects.length === 1 ? 'Subject' : 'Subjects'} &bull; ${topicCount} Topics</span>
                <span class="card-action">View Subjects &rarr;</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;

  // Attach Domain Card Listeners
  container.querySelectorAll('.standard-card').forEach(card => {
    const domainId = card.getAttribute('data-domain-id');
    const handleClick = () => navigateTo({ view: 'domain', fieldId: field.id, domainId, subjectId: null, topicId: null });
    card.addEventListener('click', handleClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    });
  });
}

// ----------------------------------------------------------------------------
// View 3: Domain View (Lists subjects within a selected Domain)
// ----------------------------------------------------------------------------
function renderDomainView(container, domainId) {
  const dInfo = findDomain(domainId);
  if (!dInfo) {
    container.innerHTML = `
      <div class="error-state">
        <h3>Domain Not Found</h3>
        <p>The requested domain could not be found.</p>
        <button type="button" class="btn-retry" id="btn-back-home">Return to Home</button>
      </div>
    `;
    document.getElementById('btn-back-home')?.addEventListener('click', () => navigateTo({ view: 'home' }));
    return;
  }

  const { domain, field } = dInfo;
  const subjects = domain.subjects || [];

  container.innerHTML = `
    <div class="view-header">
      <h1 class="view-header-title">${escapeHTML(domain.name)}</h1>
      <p class="view-header-desc">${escapeHTML(domain.description || 'Domain of study within ' + field.name + '.')}</p>
    </div>

    <div class="section-header">
      <h2>Subjects in ${escapeHTML(domain.name)}</h2>
      <p>Explore curated study areas and their step-by-step topic curriculums.</p>
    </div>

    ${subjects.length === 0 ? `
      <div class="empty-learning-state">
        <p>No subjects currently available in this domain.</p>
      </div>
    ` : `
      <div class="grid-cards">
        ${subjects.map(s => {
          const topics = s.topics || [];
          const completedInSub = topics.filter(t => state.completedTopics.has(t.id)).length;
          const percent = topics.length > 0 ? Math.round((completedInSub / topics.length) * 100) : 0;
          return `
            <div class="standard-card" data-subject-id="${s.id}" tabindex="0" role="button" aria-label="Explore subject ${escapeHTML(s.name)}">
              <div>
                <h3 class="card-title">${escapeHTML(s.name)}</h3>
                <p class="card-desc">${escapeHTML(s.description || 'Core study area covering theoretical concepts and practical applications.')}</p>
              </div>
              <div class="card-footer">
                <span>${topics.length} ${topics.length === 1 ? 'Topic' : 'Topics'} ${percent > 0 ? `&bull; ${percent}% completed` : ''}</span>
                <span class="card-action">View Topics &rarr;</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;

  // Attach Subject Card Listeners
  container.querySelectorAll('.standard-card').forEach(card => {
    const subjectId = card.getAttribute('data-subject-id');
    const handleClick = () => navigateTo({ view: 'subject', fieldId: field.id, domainId: domain.id, subjectId, topicId: null });
    card.addEventListener('click', handleClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    });
  });
}

// ----------------------------------------------------------------------------
// View 4: Subject View (Topics with Search, Filters, and Completion Controls)
// ----------------------------------------------------------------------------
function renderSubjectView(container, subjectId) {
  const sInfo = findSubject(subjectId);
  if (!sInfo) {
    container.innerHTML = `
      <div class="error-state">
        <h3>Subject Not Found</h3>
        <p>The requested subject could not be found.</p>
        <button type="button" class="btn-retry" id="btn-back-home">Return to Home</button>
      </div>
    `;
    document.getElementById('btn-back-home')?.addEventListener('click', () => navigateTo({ view: 'home' }));
    return;
  }

  const { subject, domain, field } = sInfo;
  const topics = subject.topics || [];

  // Filter topics based on local subject filters
  const filteredTopics = topics.filter(t => {
    const matchesSearch = !state.subjectFilters.search ||
      t.title.toLowerCase().includes(state.subjectFilters.search.toLowerCase()) ||
      (t.subtopic && t.subtopic.toLowerCase().includes(state.subjectFilters.search.toLowerCase()));

    const matchesDifficulty = state.subjectFilters.difficulty === 'all' ||
      (t.level && t.level.toLowerCase() === state.subjectFilters.difficulty.toLowerCase());

    const matchesType = state.subjectFilters.type === 'all' ||
      (t.type && t.type.toLowerCase() === state.subjectFilters.type.toLowerCase());

    return matchesSearch && matchesDifficulty && matchesType;
  });

  const completedCount = topics.filter(t => state.completedTopics.has(t.id)).length;
  const progressPercent = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  container.innerHTML = `
    <div class="view-header">
      <h1 class="view-header-title">${escapeHTML(subject.name)}</h1>
      <p class="view-header-desc">${escapeHTML(subject.description || 'Curated topics and learning resources for ' + subject.name + '.')}</p>
    </div>

    <!-- Progress Card -->
    <div class="progress-card">
      <div class="progress-info">
        <span class="progress-label">Subject Mastery</span>
        <span class="progress-percentage">${completedCount} of ${topics.length} completed (${progressPercent}%)</span>
      </div>
      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" style="width: ${progressPercent}%;"></div>
      </div>
    </div>

    <!-- Toolbar: Search within Subject & Filters -->
    <div class="subject-toolbar">
      <div class="subject-search-wrapper">
        <input type="search" id="subject-search-input" class="subject-search-input" placeholder="Filter topics in this subject..." value="${escapeHTML(state.subjectFilters.search)}" aria-label="Filter topics in this subject">
      </div>

      <div class="subject-filters">
        <div class="filter-group">
          <label for="filter-difficulty" class="filter-label">Difficulty:</label>
          <select id="filter-difficulty" class="filter-select" aria-label="Filter by difficulty">
            <option value="all" ${state.subjectFilters.difficulty === 'all' ? 'selected' : ''}>All Levels</option>
            <option value="beginner" ${state.subjectFilters.difficulty === 'beginner' ? 'selected' : ''}>Beginner</option>
            <option value="intermediate" ${state.subjectFilters.difficulty === 'intermediate' ? 'selected' : ''}>Intermediate</option>
            <option value="advanced" ${state.subjectFilters.difficulty === 'advanced' ? 'selected' : ''}>Advanced</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="filter-type" class="filter-label">Format:</label>
          <select id="filter-type" class="filter-select" aria-label="Filter by format">
            <option value="all" ${state.subjectFilters.type === 'all' ? 'selected' : ''}>All Formats</option>
            <option value="article" ${state.subjectFilters.type === 'article' ? 'selected' : ''}>Article</option>
            <option value="video" ${state.subjectFilters.type === 'video' ? 'selected' : ''}>Video</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Topic List -->
    <div class="topic-list" id="subject-topic-list">
      ${filteredTopics.length === 0 ? `
        <div class="empty-learning-state">
          <p>No topics match your current filter criteria.</p>
        </div>
      ` : filteredTopics.map(t => {
        const isCompleted = state.completedTopics.has(t.id);
        const levelClass = t.level ? `badge-${t.level.toLowerCase()}` : 'badge-beginner';
        const typeClass = t.type ? `badge-${t.type.toLowerCase()}` : 'badge-article';
        return `
          <div class="topic-row ${isCompleted ? 'completed' : ''}" data-topic-id="${t.id}">
            <div class="topic-row-left">
              <button type="button" class="completion-check-btn ${isCompleted ? 'completed' : ''}" data-toggle-id="${t.id}" aria-label="${isCompleted ? 'Mark incomplete: ' + t.title : 'Mark complete: ' + t.title}">
                ${isCompleted ? '✓' : ''}
              </button>
              <div class="topic-row-details">
                <button type="button" class="topic-row-title" data-nav-id="${t.id}">${escapeHTML(t.title)}</button>
                ${t.subtopic ? `<span class="topic-row-subtopic">${escapeHTML(t.subtopic)}</span>` : ''}
              </div>
            </div>
            <div class="topic-row-right">
              <span class="badge ${levelClass}">${escapeHTML(t.level || 'Beginner')}</span>
              <span class="badge ${typeClass}">${escapeHTML(t.type || 'Article')}</span>
              <span class="topic-time">⏱ ${t.time || 15}m</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Attach Filter Listeners
  document.getElementById('subject-search-input')?.addEventListener('input', (e) => {
    state.subjectFilters.search = e.target.value;
    renderSubjectView(container, subjectId);
  });

  document.getElementById('filter-difficulty')?.addEventListener('change', (e) => {
    state.subjectFilters.difficulty = e.target.value;
    renderSubjectView(container, subjectId);
  });

  document.getElementById('filter-type')?.addEventListener('change', (e) => {
    state.subjectFilters.type = e.target.value;
    renderSubjectView(container, subjectId);
  });

  // Attach Topic Row Listeners
  container.querySelectorAll('[data-nav-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const topicId = btn.getAttribute('data-nav-id');
      navigateTo({ view: 'topic', topicId });
    });
  });

  // Completion Checkbox Toggles
  container.querySelectorAll('[data-toggle-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const topicId = btn.getAttribute('data-toggle-id');
      toggleTopicCompletion(topicId);
      renderSubjectView(container, subjectId);
    });
  });
}

// ----------------------------------------------------------------------------
// View 5: Topic Detail View (Metadata, Notes, Resource Button, Nav, Related)
// ----------------------------------------------------------------------------
function renderTopicView(container, topicId) {
  const tInfo = findTopic(topicId);
  if (!tInfo) {
    container.innerHTML = `
      <div class="error-state">
        <h3>Topic Not Found</h3>
        <p>The requested topic could not be located in the curriculum.</p>
        <button type="button" class="btn-retry" id="btn-back-home">Return to Home</button>
      </div>
    `;
    document.getElementById('btn-back-home')?.addEventListener('click', () => navigateTo({ view: 'home' }));
    return;
  }

  const { topic, subject, domain, field, prevTopic, nextTopic } = tInfo;
  recordRecentTopic(topic.id);

  const isCompleted = state.completedTopics.has(topic.id);
  const levelClass = topic.level ? `badge-${topic.level.toLowerCase()}` : 'badge-beginner';
  const typeClass = topic.type ? `badge-${topic.type.toLowerCase()}` : 'badge-article';

  // Validate link URL
  let safeLink = '#';
  try {
    const parsed = new URL(topic.link);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      safeLink = parsed.href;
    }
  } catch (e) {
    safeLink = '#';
  }

  container.innerHTML = `
    <div class="topic-detail-card">
      <div class="topic-detail-header">
        <div class="topic-meta-row">
          <span class="badge ${levelClass}">${escapeHTML(topic.level || 'Beginner')}</span>
          <span class="badge ${typeClass}">${escapeHTML(topic.type || 'Article')}</span>
          <span class="topic-time">⏱ Estimated Learning Time: ${topic.time || 15} minutes</span>
          ${isCompleted ? `<span class="badge badge-completed">✓ Completed</span>` : ''}
        </div>
        <h1 class="topic-detail-title">${escapeHTML(topic.title)}</h1>
        ${topic.subtopic ? `<p class="topic-subtopic-text">${escapeHTML(topic.subtopic)} &bull; Part of ${escapeHTML(subject.name)}</p>` : ''}
      </div>

      ${topic.why_it_matters ? `
        <div class="topic-section-box why-matters">
          <h4>Why this topic matters</h4>
          <p>${escapeHTML(topic.why_it_matters)}</p>
        </div>
      ` : ''}

      ${topic.notes ? `
        <div class="topic-notes-box">
          <h4>Key Concepts & Summary</h4>
          <p>${escapeHTML(topic.notes)}</p>
        </div>
      ` : ''}

      <!-- Action Bar -->
      <div class="topic-actions-bar">
        <div class="action-buttons-left">
          <a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="btn-open-resource" id="btn-open-resource">
            <span>Open Resource</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>

          <button type="button" class="btn-toggle-completion ${isCompleted ? 'completed' : ''}" id="btn-topic-complete">
            ${isCompleted ? '✓ Marked as Completed' : 'Mark as Completed'}
          </button>
        </div>
      </div>
      <p class="resource-notice">
        Note: Demonstration resource link. In production, this directs to verified academic courses, documentation, and research articles.
      </p>

      <!-- Topic Navigation (Previous / Next) -->
      <div class="topic-nav-controls">
        <button type="button" class="btn-nav-topic" id="btn-prev-topic" ${!prevTopic ? 'disabled' : ''}>
          &larr; Previous Topic: ${prevTopic ? escapeHTML(prevTopic.title) : 'None'}
        </button>
        <button type="button" class="btn-nav-topic" id="btn-next-topic" ${!nextTopic ? 'disabled' : ''}>
          Next Topic: ${nextTopic ? escapeHTML(nextTopic.title) : 'None'} &rarr;
        </button>
      </div>

      <!-- Related Topics -->
      ${(topic.related_topics && topic.related_topics.length > 0) ? `
        <div class="related-topics-section">
          <h4>Related Knowledge Topics</h4>
          <div class="related-chips-list">
            ${topic.related_topics.map(relId => {
              const relInfo = findTopic(relId);
              const label = relInfo ? relInfo.topic.title : relId;
              return `<button type="button" class="related-chip" data-rel-id="${relId}">${escapeHTML(label)}</button>`;
            }).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // Attach Detail Listeners
  document.getElementById('btn-topic-complete')?.addEventListener('click', () => {
    toggleTopicCompletion(topic.id);
    renderTopicView(container, topic.id);
  });

  document.getElementById('btn-prev-topic')?.addEventListener('click', () => {
    if (prevTopic) navigateTo({ view: 'topic', topicId: prevTopic.id });
  });

  document.getElementById('btn-next-topic')?.addEventListener('click', () => {
    if (nextTopic) navigateTo({ view: 'topic', topicId: nextTopic.id });
  });

  container.querySelectorAll('[data-rel-id]').forEach(chip => {
    chip.addEventListener('click', () => {
      const relId = chip.getAttribute('data-rel-id');
      const found = findTopic(relId);
      if (found) {
        navigateTo({ view: 'topic', topicId: found.topic.id });
      } else {
        showToast(`Related topic: ${relId}`);
      }
    });
  });
}

// ----------------------------------------------------------------------------
// View 6: Learning Paths View
// ----------------------------------------------------------------------------
function renderPathsView(container) {
  const paths = state.data.learning_paths || [];

  container.innerHTML = `
    <div class="view-header">
      <h1 class="view-header-title">Curated Learning Paths</h1>
      <p class="view-header-desc">Structured learning sequences connecting progressive topics across disciplines.</p>
    </div>

    ${paths.length === 0 ? `
      <div class="empty-learning-state">
        <h3>No learning paths configured yet.</h3>
        <p>Curated learning sequences will appear here once defined in the Study Hub knowledge database.</p>
      </div>
    ` : `
      <div class="paths-grid">
        ${paths.map(path => {
          const topicIds = path.topic_ids || [];
          const completedInPath = topicIds.filter(id => state.completedTopics.has(id)).length;
          const percent = topicIds.length > 0 ? Math.round((completedInPath / topicIds.length) * 100) : 0;
          return `
            <div class="path-card">
              <div>
                <span class="path-domain-badge">${escapeHTML(path.domain)}</span>
                <h3 class="path-title">${escapeHTML(path.title)}</h3>
                <p class="path-desc">${escapeHTML(path.description)}</p>

                <ul class="path-topics-list">
                  ${topicIds.map(tId => {
                    const tInfo = findTopic(tId);
                    const isDone = state.completedTopics.has(tId);
                    const title = tInfo ? tInfo.topic.title : tId;
                    return `
                      <li class="path-topic-item ${isDone ? 'completed' : ''}">
                        <span>${escapeHTML(title)}</span>
                        <span>${isDone ? '✓' : '•'}</span>
                      </li>
                    `;
                  }).join('')}
                </ul>
              </div>

              <div class="path-progress-container">
                <div class="progress-info" style="margin-bottom: 0.5rem;">
                  <span class="progress-label">Path Progress</span>
                  <span class="progress-percentage">${percent}%</span>
                </div>
                <div class="progress-track" aria-hidden="true" style="max-width: 100%;">
                  <div class="progress-fill" style="width: ${percent}%;"></div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
}

// ----------------------------------------------------------------------------
// View 7: About View
// ----------------------------------------------------------------------------
function renderAboutView(container) {
  container.innerHTML = `
    <div class="about-card">
      <h2>About Study Hub</h2>
      <p>
        Study Hub is a structured knowledge navigation platform designed for lifelong learners, students, and researchers.
        Rather than attempting to duplicate or host external courses, Study Hub's philosophy is to <strong>organize existing human knowledge</strong> into clean, hierarchical paths that make self-directed discovery effortless.
      </p>

      <div class="about-pillars">
        <div class="pillar-item">
          <h4>Rigorous Hierarchy</h4>
          <p>Navigate logically from Fields to Domains, Subjects, and focused individual Topics with estimated learning times.</p>
        </div>
        <div class="pillar-item">
          <h4>Open Architecture</h4>
          <p>Built with pure web standards (HTML5, Vanilla CSS, Vanilla JavaScript). Ready to sync with Google Sheets data pipelines.</p>
        </div>
        <div class="pillar-item">
          <h4>Privacy & Local Progress</h4>
          <p>Learning progress is stored directly in your browser. No third-party tracking, paywalls, or forced accounts.</p>
        </div>
      </div>

      <h3 style="margin-bottom: 0.75rem;">Future Roadmap</h3>
      <p>
        Future iterations of Study Hub will support real-time synchronisation with Google Sheets via Google Apps Script and deep semantic discovery powered by our dedicated Study Hub Assistant.
      </p>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// 7. Topic Completion Logic
// ----------------------------------------------------------------------------
function toggleTopicCompletion(topicId) {
  if (state.completedTopics.has(topicId)) {
    state.completedTopics.delete(topicId);
    showToast('Topic marked as incomplete.');
  } else {
    state.completedTopics.add(topicId);
    showToast('Topic marked as completed! Progress updated.');
  }
  saveCompletedState();
}

// ----------------------------------------------------------------------------
// 8. Global Search System
// ----------------------------------------------------------------------------
function searchKnowledge(query) {
  if (!state.data || !state.data.fields) return [];
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results = [];

  // Search Fields
  state.data.fields.forEach(f => {
    if (f.name.toLowerCase().includes(q) || (f.description && f.description.toLowerCase().includes(q))) {
      results.push({
        type: 'Field',
        title: f.name,
        path: 'Knowledge Field',
        action: () => navigateTo({ view: 'field', fieldId: f.id })
      });
    }

    // Search Domains
    (f.domains || []).forEach(d => {
      if (d.name.toLowerCase().includes(q) || (d.description && d.description.toLowerCase().includes(q))) {
        results.push({
          type: 'Domain',
          title: d.name,
          path: `${f.name} > ${d.name}`,
          action: () => navigateTo({ view: 'domain', fieldId: f.id, domainId: d.id })
        });
      }

      // Search Subjects
      (d.subjects || []).forEach(s => {
        if (s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q))) {
          results.push({
            type: 'Subject',
            title: s.name,
            path: `${f.name} > ${d.name} > ${s.name}`,
            action: () => navigateTo({ view: 'subject', fieldId: f.id, domainId: d.id, subjectId: s.id })
          });
        }

        // Search Topics
        (s.topics || []).forEach(t => {
          if (
            t.title.toLowerCase().includes(q) ||
            (t.subtopic && t.subtopic.toLowerCase().includes(q)) ||
            (t.notes && t.notes.toLowerCase().includes(q))
          ) {
            results.push({
              type: 'Topic',
              title: t.title,
              path: `${d.name} > ${s.name}`,
              action: () => navigateTo({ view: 'topic', topicId: t.id })
            });
          }
        });
      });
    });
  });

  return results;
}

function triggerSearch(query) {
  const overlay = document.getElementById('search-overlay');
  const resultsContainer = document.getElementById('search-results-list');
  const clearBtn = document.getElementById('clear-search-btn');
  const title = document.getElementById('search-results-title');

  if (!query || !query.trim()) {
    closeSearchOverlay();
    return;
  }

  if (clearBtn) clearBtn.style.display = 'block';
  const matches = searchKnowledge(query);

  if (title) title.textContent = `Search results for "${query}" (${matches.length})`;

  if (matches.length === 0) {
    resultsContainer.innerHTML = `
      <div class="search-empty">
        <p>No knowledge domains, subjects, or topics found matching <strong>"${escapeHTML(query)}"</strong>.</p>
      </div>
    `;
  } else {
    resultsContainer.innerHTML = matches.slice(0, 12).map((item, index) => `
      <div class="search-result-item" data-index="${index}" tabindex="0" role="button">
        <div class="search-item-info">
          <span class="search-item-title">${escapeHTML(item.title)}</span>
          <span class="search-item-path">${escapeHTML(item.path)}</span>
        </div>
        <span class="search-item-badge">${escapeHTML(item.type)}</span>
      </div>
    `).join('');

    resultsContainer.querySelectorAll('.search-result-item').forEach(itemEl => {
      const idx = parseInt(itemEl.getAttribute('data-index'), 10);
      const action = () => {
        closeSearchOverlay();
        matches[idx].action();
      };
      itemEl.addEventListener('click', action);
      itemEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          action();
        }
      });
    });
  }

  overlay.style.display = 'block';
}

function closeSearchOverlay() {
  const overlay = document.getElementById('search-overlay');
  const clearBtn = document.getElementById('clear-search-btn');
  if (overlay) overlay.style.display = 'none';
  if (clearBtn) clearBtn.style.display = 'none';
}

// ----------------------------------------------------------------------------
// ============================================================================
// 9. CHATBOT INTEGRATION POINT
// ============================================================================
// ----------------------------------------------------------------------------
function initChatbot() {
  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const panel = document.getElementById('chatbot-panel');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const openIcon = toggleBtn?.querySelector('.chat-open-icon');
  const closeIcon = toggleBtn?.querySelector('.chat-close-icon');
  const form = document.getElementById('chatbot-input-form');
  const textInput = document.getElementById('chatbot-text-input');
  const messagesBox = document.getElementById('chatbot-messages');

  if (!toggleBtn || !panel) return;

  function setChatbotOpen(isOpen) {
    panel.style.display = isOpen ? 'flex' : 'none';
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (openIcon) openIcon.style.display = isOpen ? 'none' : 'block';
    if (closeIcon) closeIcon.style.display = isOpen ? 'block' : 'none';
    if (isOpen) {
      setTimeout(() => textInput?.focus(), 150);
    }
  }

  toggleBtn.addEventListener('click', () => {
    const isCurrentlyOpen = panel.style.display === 'flex';
    setChatbotOpen(!isCurrentlyOpen);
  });

  closeBtn?.addEventListener('click', () => {
    setChatbotOpen(false);
  });

  // Assistant query processor: matches against local knowledge dataset
  function handleChatSubmit(userQuery) {
    if (!userQuery.trim()) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-bubble user-message';
    userMsg.textContent = userQuery;
    messagesBox.appendChild(userMsg);

    // Search the dataset for matching topics or subjects
    const results = searchKnowledge(userQuery);

    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-bubble bot-message';

      if (results.length > 0) {
        const top = results.slice(0, 3);
        botMsg.innerHTML = `
          <p>I found ${results.length} related match${results.length === 1 ? '' : 'es'} in Study Hub:</p>
          <ul style="padding-left: 1.2rem; margin-top: 0.35rem;">
            ${top.map(r => `<li><strong>${escapeHTML(r.title)}</strong> (${escapeHTML(r.type)})</li>`).join('')}
          </ul>
          <p style="margin-top: 0.5rem;"><small>Would you like me to open any of these?</small></p>
        `;
      } else {
        botMsg.innerHTML = `
          <p>I couldn't find exact matches for "${escapeHTML(userQuery)}".</p>
          <p>Try searching for fields like <em>Tech</em> or domains like <em>Cybersecurity</em>, <em>AI</em>, or <em>Design &amp; UX</em>.</p>
        `;
      }

      messagesBox.appendChild(botMsg);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }, 350);

    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = textInput?.value.trim();
    if (query) {
      handleChatSubmit(query);
      textInput.value = '';
    }
  });

  // Chat Suggestion Chips
  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query) {
        setChatbotOpen(true);
        handleChatSubmit(query);
      }
    });
  });
}

// ----------------------------------------------------------------------------
// 10. Application Initialization
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadLocalState();

  // Navigation Links
  document.getElementById('nav-brand')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo({ view: 'home', fieldId: null, domainId: null, subjectId: null, topicId: null });
  });

  document.getElementById('nav-explore')?.addEventListener('click', () => {
    navigateTo({ view: 'home', fieldId: null, domainId: null, subjectId: null, topicId: null });
  });

  document.getElementById('nav-paths')?.addEventListener('click', () => {
    navigateTo({ view: 'paths' });
  });

  document.getElementById('nav-about')?.addEventListener('click', () => {
    navigateTo({ view: 'about' });
  });

  // Global Quick Search Bar
  const searchInput = document.getElementById('global-search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  const closeSearchBtn = document.getElementById('close-search-btn');

  searchInput?.addEventListener('input', (e) => {
    triggerSearch(e.target.value);
  });

  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    closeSearchOverlay();
  });

  closeSearchBtn?.addEventListener('click', () => {
    closeSearchOverlay();
  });

  // Close search overlay with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearchOverlay();
      const panel = document.getElementById('chatbot-panel');
      if (panel && panel.style.display === 'flex') {
        panel.style.display = 'none';
        document.getElementById('chatbot-toggle-btn')?.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Initialize Chatbot widget
  initChatbot();

  // Load Knowledge Dataset
  loadDataset();
});
