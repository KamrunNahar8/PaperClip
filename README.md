<div align="center">

# <img src="Logos/PaperClip-Logo.png" height="32"> PaperClip

### **Enterprise-grade Academic PDF Orchestrator**

A high-performance web application designed for students at **Daffodil International University** to streamline the generation of standardized academic documentation — featuring a local REST API backend for intelligent faculty data management.

</div>

---

## 💎 Features

- 🟦 **Intelligent Templating**: Dynamic generation of DIU-standard cover pages for Assignments, Lab Reports, Lab Tasks, Presentations (supporting **Multi-Student groups up to 8 members**), and Quizzes, featuring custom document-specific evaluation metrics and scalable multi-line criteria tables.
- 🟧 **Client-Side Processing**: Leveraging the power of the browser for PDF synthesis—ensuring zero latency and maximum privacy.
- 🟩 **Fluid UX**: Modern, responsive interface with adaptive light/dark theming and smooth micro-interactions.
- 🟪 **Advanced Asset Handling**: Drag-and-drop orchestration with support for multi-format merging (Images & PDFs).
- 🟫 **Native PDF Compression**: Built-in, on-demand document compression to optimize image assets directly in-browser.
- 🧮 **Professional CGPA Calculator**: Comprehensive DIU-standard (4.00 scale) calculator with real-time cumulative tracking.
- 📄 **PDF Transcript Export**: Generate and download professional, organized PDF reports of academic calculations with one click.
- 🟨 **AI Academic Analysis**: Integrated "Copy-Paste" analysis workflow supporting Gemini, Claude, ChatGPT, and DeepSeek.
- 🟦 **Attendance Guardian**: Automatic, DIU-standard 75% threshold planning and skip-limit simulation for semesters.
- 🌐 **PWA & Offline Support**: Full Progressive Web App implementation with optimized v3.9 "Instant Load" engine and 100% offline reliability.
- 🟥 **Real-time Preview**: High-fidelity document rendering before final export.
- 🖥️ **Local Faculty API**: Lightweight Node.js/Express backend server that serves DIU faculty data as a REST API, enabling dynamic teacher name autocomplete with intelligent fallback support.

---

## 🛠 Tech Stack

| Layer              | Technology                                                                                                                                                                                                                                                                                                     | Role                                               |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------- |
| **Frontend**       | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Core UI & Logic                                    |
| **Backend**        | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) | Local REST API for Faculty Data                    |
| **PDF Engine**     | [pdf-lib](https://pdf-lib.js.org/) & [pdf.js](https://mozilla.github.io/pdf.js/)                                                                                                                                                                                                                               | PDF synthesis and content extraction               |
| **Neural OCR**     | [Tesseract.js](https://tesseract.projectnaptha.com/)                                                                                                                                                                                                                                                           | Client-side neural text extraction (Image-to-Text) |
| **Doc Processing** | [Mammoth.js](https://github.com/mwilliamson/mammoth.js) & [JSZip](https://stuk.github.io/jszip/)                                                                                                                                                                                                               | Word and PowerPoint structure parsing              |
| **Data Engine**    | [SheetJS](https://sheetjs.com/) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jspdf-autotable)                                                                                                                                                                                                         | Excel parsing and high-fidelity table generation   |
| **Design**         | [Inter Font](https://rsms.me/inter/) & [FontAwesome](https://fontawesome.com/)                                                                                                                                                                                                                                 | Typography & Iconography                           |

---

## 🚀 Architectural Overview

PaperClip uses a **hybrid architecture**: all document processing and PDF synthesis remain privacy-first and client-side, while a lightweight local backend optionally serves faculty data via a REST API.

1.  **Metadata Injection**: Form data is mapped to high-resolution coordinate planes on standardized DIU templates.
2.  **Asset Buffer Management**: Uploaded images and PDFs are converted to ArrayBuffers for unified processing.
3.  **Neural Text Extraction**: Tesseract.js (WASM) workers process images locally to extract editable academic text.
4.  **PDF Synthesis**: The `pdf-lib` engine merges the generated cover page with user assets into a single document stream.
5.  **Blob Orchestration**: The final document is served via an ephemeral Blob URL for instant preview and download.
6.  **AI Integration**: A dedicated "Copy-Paste" lane provides pre-optimized prompts for third-party AI services.
7.  **Local Persistence Engine**: Student course data and grades are synchronized with browser `localStorage` for cross-session availability.
8.  **Automated Compliance Logic**: A dedicated module for DIU attendance compliance (75% rule) with real-time goal planning.
9.  **Edge Caching**: PWA service workers (v3.9) handle navigation with a 2nd fast-fallback for 100% offline reliability.
10. **Local Faculty API**: A Node.js/Express server (`backend/server.js`) exposes `GET /api/faculty` and `GET /api/faculty/search?q=<name>` endpoints. The frontend fetches from this API with a 2-second timeout and silently falls back to static data if the server is not running.

---

## 🖥️ Local Faculty API (Backend)

The project includes a minimal **local REST API** built with Node.js and Express, serving the DIU faculty directory to the frontend autocomplete feature.

### Endpoints

| Method | Endpoint | Description |
| :----- | :------- | :---------- |
| `GET` | `/api/faculty` | Returns the full list of all DIU faculty members |
| `GET` | `/api/faculty/search?q=<name>` | Returns faculty filtered by the given name query |

### Example Response

```json
[
  { "name": "Dr. Imran Mahmud", "designation": "Professor & Head" },
  { "name": "Mr. Md. Khaled Sohel", "designation": "Assistant Professor" }
]
```

### Fallback Behaviour

The frontend is designed to be **resilient**. If the local API server is not running, the app automatically falls back to the static `js/faculty_data.js` file. The application **never breaks** regardless of whether the backend is active.

---

## 💻 Local Development

### 1. Frontend Only (No Backend Required)

```bash
# Clone the repository
git clone https://github.com/KamrunNahar8/PaperClip.git

# Navigate to the project directory
cd PaperClip

# Serve using any local web server (e.g., Live Server in VS Code)
```

### 2. With the Local Backend API (Optional but Recommended)

To enable the live Faculty API, start the backend server alongside your frontend:

```bash
# Step 1: Navigate to the backend directory
cd PaperClip/backend

# Step 2: Install dependencies (only required once)
npm install

# Step 3: Start the local API server
node server.js
```

The server will start on **`http://localhost:3000`**. You should see:

```
╔══════════════════════════════════════════════╗
║         PaperClip - Faculty API Server       ║
╠══════════════════════════════════════════════╣
║  Running on: http://localhost:3000           ║
║  Endpoint:   /api/faculty                    ║
║  Search:     /api/faculty/search?q=<name>    ║
╠══════════════════════════════════════════════╣
║  Press Ctrl+C to stop the server             ║
╚══════════════════════════════════════════════╝
```

Once running, open your browser console and you will see:
```
[PaperClip API] Faculty data loaded from local backend. (128 members)
```

### 3. Project Structure

```
PaperClip/
├── backend/                  # 🖥️ Local Node.js API Server
│   ├── data/
│   │   └── faculty.json      # Faculty data source (JSON)
│   ├── server.js             # Express API server
│   └── package.json          # Node.js dependencies
├── css/
│   └── style.css
├── js/
│   ├── app.js                # Core PDF logic + API fetch
│   ├── faculty_data.js       # Static fallback faculty data
│   ├── cgpa.js
│   ├── attendance.js
│   └── navigation.js
├── Logos/
│   ├── PaperClip-Logo.png
│   └── Logo-DIU.png
├── index.html
├── cgpa.html
├── attendance.html
├── analyze.html
├── about.html
├── how-it-works.html
├── manifest.json
└── service-worker.js
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
