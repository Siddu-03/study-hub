# Study Hub — Structured Learning Resource Discovery Platform

A clean, modern, responsive academic knowledge platform that enables students, researchers, and self-directed learners to discover curated learning resources across a structured hierarchy of knowledge disciplines.

---

## 🌟 Philosophy & Overview

Unlike traditional learning management systems that attempt to host duplicate courses, **Study Hub** focuses on organizing existing human knowledge. It maps the academic and technical landscape into an intuitive 5-tier taxonomy:

$$\text{Field} \longrightarrow \text{Domain} \longrightarrow \text{Subject} \longrightarrow \text{Topic} \longrightarrow \text{Resource}$$

---

## ✨ Main Features (Implemented)

- **Light-Themed Academic Design System**: Clean, minimal interface built with an 8px spacing scale, subtle shadows, and high contrast typography (Inter / system fonts).
- **Multi-Level Knowledge Navigation**:
  - **Explore by Field**: Categorized into *Tech*, *Non-Tech*, *Interdisciplinary*, and *Miscellaneous*.
  - **Domain Explorer**: Drill down into specific disciplines (e.g., Cybersecurity, Artificial Intelligence, Cognitive Science, PKM).
  - **Subject Curriculums**: View complete topic lists, progress percentages, and subject descriptions.
  - **Topic Detail View**: In-depth view featuring subtopics, difficulty badges, format badges (Article / Video), estimated learning durations, "Why this topic matters", and practical notes.
- **Interactive Learning Features**:
  - **Topic Completion Tracker**: Mark topics as completed with real-time updates and persistence across browser sessions via `localStorage`.
  - **Sequential Topic Navigation**: Step forward and backward through subject topics via "Previous Topic" and "Next Topic" buttons.
  - **Related Topics Discovery**: Instant navigation between related topics across different subjects and domains.
  - **Curated Learning Paths**: High-level multi-topic sequences with visual progress meters (e.g., Web Application Security Specialist, Modern Full-Stack Engineering, Meta-Learning & Knowledge Mastery).
  - **Continue Learning Dashboard**: Jump back into recently visited or in-progress topics directly from the homepage.
- **Instant Global Search System**:
  - Live, case-insensitive partial text search across Fields, Domains, Subjects, Topic titles, and Resource titles.
  - Keyboard accessible overlay with clear buttons and empty result states.
- **Subject-Level Filtering**:
  - Instant text filter for topics within the active subject.
  - Filter by Difficulty (*All*, *Beginner*, *Intermediate*, *Advanced*).
  - Filter by Resource Type (*All*, *Article*, *Video*).
- **Responsive Layout**: Designed for seamless use on desktop, tablet, and mobile displays without external UI frameworks.
- **Study Hub Assistant (Chatbot Integration Point)**:
  - Clean floating circular action button in the bottom-right corner.
  - Light-themed drawer panel that searches the Study Hub knowledge base and provides instant subject/topic recommendations.
  - Clean separation of HTML, CSS, and JS ready for future AI/backend agent connectivity.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) with ARIA accessibility labels and visible focus indicators.
- **Vanilla CSS**: CSS Custom Properties (variables), CSS Grid, Flexbox, media queries for responsive layouts, and `@media (prefers-reduced-motion: reduce)` support. No Tailwind or Bootstrap.
- **Vanilla JavaScript**: Pure modern JavaScript (ES6+) for router management, in-memory search, filtering, `localStorage` state management, and DOM rendering. No React, Vue, or Angular.
- **Data Source**: Pure JSON (`data/study-hub.json`) loaded via the Fetch API with embedded fallback resiliency for local `file://` execution.

---

## 📁 Project Folder Structure

```text
study-hub/
├── index.html              # Main HTML markup and application containers
├── style.css               # Complete stylesheet, design tokens, and responsive rules
├── script.js               # Router, search engine, filtering, and state logic
├── data/
│   └── study-hub.json      # Structured hierarchical learning dataset
├── assets/                 # Directory for static images and media assets
├── .gitignore              # Ignores credentials, secrets, and system files
└── README.md               # Project documentation and guide
```

---

## 🚀 Instructions for Running Locally

Study Hub requires no build steps, bundlers, compilers, or package installations.

### Option 1: Using Python's Built-in HTTP Server (Recommended)
Open a terminal inside the `study-hub/` directory and run:

```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Option 2: Using Node.js (npx serve or http-server)
If you have Node.js installed:

```bash
npx serve .
```

### Option 3: Direct File Opening
Double-click `index.html` or open it directly in Google Chrome, Microsoft Edge, or Mozilla Firefox. The application includes a built-in dataset fallback to ensure full interactivity even when local `file://` browser security policies restrict raw `fetch()` calls.

---

## 📊 Explanation of the JSON Data Source

The dataset located at `data/study-hub.json` follows a strict hierarchical schema:

```json
{
  "fields": [
    {
      "id": "tech",
      "name": "Tech",
      "description": "Technology, computing, and software engineering.",
      "icon": "code",
      "domains": [
        {
          "id": "cybersecurity",
          "name": "Cybersecurity",
          "description": "Security of systems, networks, and applications.",
          "subjects": [
            {
              "id": "web-security",
              "name": "Web Security",
              "description": "Defending web applications against common exploits.",
              "topics": [
                {
                  "id": "sql-injection",
                  "subtopic": "Injection Vulnerabilities",
                  "title": "SQL Injection (SQLi)",
                  "type": "Article",
                  "level": "Beginner",
                  "link": "https://example.com/demo/web-security/sql-injection",
                  "notes": "Covers how unvalidated user inputs allow attackers to manipulate queries.",
                  "time": 20,
                  "why_it_matters": "SQL injection remains one of the most critical vulnerabilities.",
                  "related_topics": ["xss-fundamentals", "csrf-defense"]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "learning_paths": [ ... ]
}
```

*Note: Resource links in the demonstration dataset point to `example.com` placeholders and are labeled as demonstration data.*

---

## 📈 Implementation Status

| Feature / Component | Status | Details |
|---|---|---|
| Light-themed Academic Dashboard | ✅ Completed | Implemented according to design system guidelines |
| Hierarchy Navigation (Field &rarr; Domain &rarr; Subject &rarr; Topic) | ✅ Completed | Complete multi-level browsing with clickable breadcrumbs |
| Instant Global Search | ✅ Completed | Multi-category matching (Fields, Domains, Subjects, Topics) |
| Subject Filters | ✅ Completed | Difficulty and resource format dropdown filters |
| Topic Completion & Local Persistence | ✅ Completed | Stored in `localStorage` with subject progress computation |
| Sequential Navigation (Prev/Next) | ✅ Completed | Topic-by-topic navigation within current subject |
| Curated Learning Paths View | ✅ Completed | Multi-topic tracks with dynamic progress indicators |
| Chatbot Integration Widget | ✅ Completed | Floating trigger button and panel with local query matching |
| Fully Responsive Layout | ✅ Completed | Verified for mobile, tablet, and desktop breakpoints |
| Google Sheets Live Pipeline | ⏳ Planned | Architecture designed; ready for Google Apps Script JSON export |
| Paid / Hosted AI Agent Backend | ⏳ Planned | Chatbot widget is decoupled and ready for external API hookup |

---

## 🔮 Planned Integrations

1. **Google Sheets Sync via Google Apps Script**:
   - The Study Hub schema was intentionally designed so that a Google Sheet containing rows of fields, domains, subjects, and topics can be automatically exported as `study-hub.json` using a lightweight Google Apps Script web app or scheduled export.
   - The frontend remains decoupled from direct Google authentication, consuming standard JSON via `fetch()`.

2. **Advanced Study Hub AI Assistant**:
   - The chatbot panel is designed with dedicated classes and event handlers in `script.js` and `style.css`.
   - In production, the message submit handler can be pointed to a serverless endpoint running an LLM agent without altering the dashboard interface.

---

## 📄 License & Attribution

Created for students, researchers, and self-directed learners. Open and free to adapt for personal and academic knowledge discovery.
