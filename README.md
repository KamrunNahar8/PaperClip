<div align="center">

# <img src="Logos/PaperClip-Logo.png" height="32"> PaperClip

### **Enterprise-grade Academic PDF Orchestrator**

A high-performance web application designed for students at **Daffodil International University** to streamline the generation of standardized academic documentation — featuring a local REST API backend for intelligent faculty data management.

</div>

---

## 💎 Features

- 🟦 **Intelligent Templating**: Dynamic generation of DIU-standard cover pages for Assignments, Lab Reports, Lab Tasks, Presentations (supporting **Multi-Student groups up to 8 members**), and Quizzes, featuring custom document-specific evaluation metrics and scalable multi-line criteria tables.
- 🟧 **Client-Side Processing**: Leveraging the power of the browser for PDF synthesis—ensuring zero latency and 100% data privacy.
- 🤖 **Local AI Academic PDF Scorer & Advisor**: Deep academic rubric evaluation powered by local open-source LLMs (`qwen2.5:3b` via Ollama) with zero cloud dependencies and zero data leakage.
- 🛡️ **5-Layer Enterprise Academic Guardrails**:
  - *Layer 1 (Sanitization)*: Strips zero-width characters, control sequences, and malicious scripts.
  - *Layer 2 (Prompt-Injection Defense)*: Pre-flight regex scanner that intercepts adversarial grading overrides and assigns an automatic Academic Misconduct flag (`0/100 Grade F`).
  - *Layer 3 (Blind Grading Protocol)*: Auto-masks student IDs, emails, and names (`[STUDENT_REDACTED]`) to eliminate demographic, gender, and personal bias.
  - *Layer 4 (Calibrated Professor Persona)*: Chain-of-Thought (CoT) qualitative justifications, anti-verbosity/anti-fluff penalties, and realistic university benchmark calibration.
  - *Layer 5 (Mathematical Assertion Verifier)*: Hard-clamps sub-scores, validates categorical bounds, and calculates official DIU letter grades (`A+` to `F`) deterministically in code.
- 📋 **DIU Cover Page Status Verification**: Automatic non-scoring Page 1 audit checking for DIU headers, Teacher Mark Rubric tables, and course/student metadata with visual pass/warning badges.
- 📄 **Exportable Clean Evaluation Reports**: Instant one-click PDF report generation featuring PaperClip branding, structured rubric tables, and browser URL/title suppression.
- 🟩 **Fluid UX**: Modern, responsive interface with adaptive light/dark theming and smooth micro-interactions.
- 🟪 **Advanced Asset Handling**: Drag-and-drop orchestration with support for multi-format merging (Images & PDFs).
- 🟫 **Native PDF Compression**: Built-in, on-demand document compression to optimize image assets directly in-browser.
- 🧮 **Professional CGPA Calculator**: Comprehensive DIU-standard (4.00 scale) calculator with real-time cumulative tracking.
- 📄 **PDF Transcript Export**: Generate and download professional, organized PDF reports of academic calculations with one click.
- 🟦 **Attendance Guardian**: Automatic, DIU-standard 75% threshold planning and skip-limit simulation for semesters.
- 🌐 **PWA & Offline Support**: Full Progressive Web App implementation with optimized v3.9 "Instant Load" engine and 100% offline reliability.
- 🟥 **Real-time Preview**: High-fidelity document rendering before final export.
- 🖥️ **Local Faculty & AI Scorer APIs**: Lightweight Node.js/Express backend services serving faculty directory autocomplete and local AI scoring proxies.

---

## 🛠 Tech Stack

| Layer              | Technology                                                                                                                                                                                                                                                                                                     | Role                                               |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------- |
| **Frontend**       | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Core UI, DOM manipulation & responsive layout      |
| **Local AI Engine**| ![Ollama](https://img.shields.io/badge/Ollama-000000?style=flat-square&logo=ollama&logoColor=white) ![Qwen](https://img.shields.io/badge/Qwen_2.5_3B-6366F1?style=flat-square)                                                                                                                            | Local GPU-accelerated academic evaluation (100% private) |
| **Backend Services**| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)                                                                                             | REST APIs for Faculty Data (:3000) & AI Proxy (:3001)|
| **PDF Engines**    | [pdf-lib](https://pdf-lib.js.org/) & [pdf.js](https://mozilla.github.io/pdf.js/)                                                                                                                                                                                                                               | PDF synthesis, merging & client text extraction     |
| **Neural OCR**     | [Tesseract.js](https://tesseract.projectnaptha.com/)                                                                                                                                                                                                                                                           | Client-side neural text extraction (Image-to-Text) |
| **Doc Processing** | [Mammoth.js](https://github.com/mwilliamson/mammoth.js) & [JSZip](https://stuk.github.io/jszip/)                                                                                                                                                                                                               | Word and PowerPoint structure parsing              |
| **Data Engine**    | [SheetJS](https://sheetjs.com/) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jspdf-autotable)                                                                                                                                                                                                         | Excel parsing and high-fidelity table generation   |
| **Design**         | [Inter Font](https://rsms.me/inter/) & [FontAwesome](https://fontawesome.com/)                                                                                                                                                                                                                                 | Typography & Iconography                           |

---

## 🚀 Architectural Overview

PaperClip operates on a **privacy-first hybrid architecture**: document processing, PDF synthesis, and evaluation run locally on the client or local GPU daemon, backed by optional lightweight Node microservices.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PAPERCLIP CLIENT                              │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ Cover Generator    │ CGPA & Attendance  │ AI Scorer & Guardrails       │
│ - pdf-lib          │ - Real-time math   │ - PDF.js Text Extractor      │
│ - Tesseract.js OCR │ - LocalStorage sync│ - Sanitizer & PII Redactor   │
│ - Ephemeral Blobs  │ - Printable export │ - Prompt Injection Firewall  │
└─────────┬──────────┴────────────────────┴──────────────┬───────────────┘
          │ (Optional REST)                              │ (Local Inference)
          ▼                                              ▼
┌───────────────────────┐                      ┌─────────────────────────┐
│ Backend Faculty API   │                      │ Local Ollama Service    │
│ - Port 3000           │                      │ - Port 11434            │
│ - Express + JSON data │                      │ - Qwen 2.5 3B (GPU)     │
└───────────────────────┘                      └─────────────────────────┘
```

1.  **Metadata Injection**: Form data maps to high-resolution coordinate planes on standardized DIU templates.
2.  **Asset Buffer Management**: Uploaded images and PDFs convert to ArrayBuffers for unified synthesis.
3.  **Neural Text Extraction**: Tesseract.js (WASM) workers process images locally to extract editable text.
4.  **Local AI Scoring Pipeline**:
    - Extracted PDF text is pre-processed through a **5-layer guardrail suite**.
    - Blind grading redacts student PII (`\d{3}-\d{2}-\d{4}`) to eliminate demographic bias.
    - Deterministic decoding (`temperature: 0.0`, `seed: 42`) guarantees consistent, reproducible evaluations.
    - Mathematical assertions enforce sub-score boundaries and calculate official DIU letter grades (`A+` to `F`).
5.  **DIU Cover Page Status Verification**: Non-scoring Page 1 audit verifies the presence of official DIU cover page tables.
6.  **Edge Caching & PWA**: Service workers (v3.9) provide 100% offline access.

---

## 🖥️ Local Services & AI Setup

### 1. AI Scoring Engine (Ollama + Qwen 2.5 3B)

To enable local GPU-accelerated PDF scoring on your machine (e.g. Intel Arc A750, RTX series, or multi-core CPU):

```bash
# Step 1: Install Ollama (https://ollama.com) and start the service
ollama run qwen2.5:3b

# Step 2: Verify the model is ready
ollama list
```

Once running, navigate to `analyze.html` in your browser. The status bar will automatically illuminate green: **"AI Evaluation Engine Active"**.

### 2. Local Backend Services (Optional)

```bash
# Step 1: Navigate to the backend directory
cd PaperClip/backend

# Step 2: Install dependencies
npm install

# Step 3: Start the Faculty API Server (Port 3000)
node server.js

# Step 4: (Optional) Start the AI Proxy Scorer Service (Port 3001)
node ai_scorer.js
```

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/KamrunNahar8/PaperClip.git

# Navigate to project directory
cd PaperClip

# Serve using any local web server (e.g., Live Server in VS Code or Python HTTP server)
python -m http.server 5500
```

---

## 📁 Project Structure

```
PaperClip/
├── backend/                  # 🖥️ Local Node.js Backend Services
│   ├── data/
│   │   └── faculty.json      # Faculty data source (JSON)
│   ├── server.js             # Express Faculty REST API (:3000)
│   ├── ai_scorer.js          # AI Scorer Proxy & Guardrail Service (:3001)
│   └── package.json          # Node.js dependencies
├── css/
│   ├── style.css             # Core application stylesheet
│   └── scorer.css            # AI Scorer & Scorecard styling
├── js/
│   ├── app.js                # Core PDF synthesis & faculty fetch
│   ├── pdf_scorer.js         # AI Scorer, 5-layer guardrails & cover check
│   ├── scorer_bridge.js      # Bridge linking Generator to Scorer
│   ├── faculty_data.js       # Static fallback faculty data
│   ├── cgpa.js               # DIU CGPA calculator
│   ├── attendance.js         # Attendance threshold planner
│   └── navigation.js         # Mobile drawer & navigation logic
├── Logos/
│   ├── PaperClip-Logo.png
│   └── Logo-DIU.png
├── index.html                # PDF Generator & Cover Orchestrator
├── analyze.html              # Local AI Academic PDF Scorer & Advisor
├── cgpa.html                 # CGPA Calculator
├── attendance.html           # Attendance Tracker
├── about.html                # About PaperClip
├── how-it-works.html         # User Guide & Documentation
├── manifest.json             # PWA Web App Manifest
└── service-worker.js         # Offline cache worker (v3.9)
```

---

## 👥 Collaborators

- **Kamrun Nahar Kamona**
- **Prionti Maliha**
- **Md Nurzaman Hossain**

_Department of Software Engineering, Daffodil International University_  
📍 Dhaka, Bangladesh

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0** (GPL-3.0). See the [LICENSE](LICENSE) file for details.

---

## 🌐 Deployment

Live version available at: [**https://kamrunnahar8.github.io/PaperClip/**](https://kamrunnahar8.github.io/PaperClip/)
