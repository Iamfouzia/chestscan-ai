# ChestScan AI

**An AI-powered chest X-ray analysis tool that generates structured radiology reports automatically.**


🔗 **Live Demo:**
[chestscan-ai-seven.vercel.app](https://chestscan-ai-seven.vercel.app)  


---

## Overview

ChestScan AI is a clinical-grade web application that analyzes chest X-ray images using multimodal AI. It generates structured radiology reports covering 9 anatomical structures, with severity classification and confidence scoring in seconds.

Built for radiologists, medical students, and healthcare developers who need fast, explainable AI-assisted CXR interpretation.

> **Disclaimer:** AI-generated analysis only. Not a substitute for licensed radiologist review.

---

## Features

- Upload any chest X-ray (JPEG/PNG) via click or drag-and-drop
- Automated analysis of 9 anatomical structures
- Per-finding severity classification: NORMAL / MEDIUM / HIGH
- Per-finding confidence score with color-coded progress bars
- Structured radiology report: Clinical Findings, Impression, Recommendation
- Real-time brightness and zoom controls for image review
- PDF export of full radiology report
- Patient info management with case ID generation
- Fully responsive dark-mode UI

---

## Structures Analyzed

| Structure | Description |
|---|---|
| Cardiothoracic Ratio | Heart-to-chest width ratio assessment |
| Cardiac Silhouette | Heart size, shape, and contour |
| Lung Fields | Bilateral aeration, consolidation, infiltrates |
| Costophrenic Angles | Pleural effusion detection |
| Pleural Spaces | Effusion and thickening assessment |
| Mediastinum & Trachea | Width and tracheal deviation |
| Diaphragm | Elevation and contour |
| Bony Structures | Rib and vertebral integrity |
| Soft Tissues | Chest wall assessment |

---

## Algorithm

```
Input: Chest X-ray image (JPEG/PNG)
          ↓
Base64 encoding → multimodal API payload
          ↓
Llama 4 Scout Vision Model (via Groq)
          ↓
Structured JSON response parsing
  ├── findings[ ] → name, detail, severity, confidence
  └── report → Clinical Findings, Impression, Recommendation
          ↓
Severity classification: NORMAL / MEDIUM / HIGH
Confidence scoring: 0.70 – 0.99
          ↓
Rendered UI + PDF export
```

**Confidence Color Logic:**
- ≥ 90% → Blue (High confidence)
- 75–89% → Amber (Moderate confidence)
- < 75% → Red (Low confidence)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Styling | CSS-in-JS (inline STYLES constant) |
| AI Model | Llama 4 Scout 17B (meta-llama/llama-4-scout-17b-16e-instruct) |
| AI Inference | Groq API (ultra-low latency LLM inference) |
| Image Handling | FileReader API, Base64 encoding |
| PDF Export | Browser Print API (window.open + print) |
| Deployment | Vercel |
| Font | Inter, JetBrains Mono (Google Fonts) |

---

## Project Structure

```
chestscan-ai/
├── src/
│   └── App.jsx          
├── public/
├── .env                
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## Setup & Installation

**Prerequisites:** Node.js 18+, Groq API key

```bash
# Clone repository
git clone https://github.com/Iamfouzia/chestscan-ai.git
cd chestscan-ai

# Install dependencies
npm install

# Create environment file
New-Item .env   
# or
touch .env      

# Add your Groq API key to .env
VITE_GROQ_API_KEY=your api key

# Start development server
npm run dev
```

**Get Groq API Key:** [console.groq.com](https://console.groq.com) → API Keys → Create Key

---

## Deployment (Vercel)

```bash
# Build for production
npm run build

# Deploy via Vercel CLI
vercel --prod
```

Or connect GitHub repo directly at [vercel.com](https://vercel.com) and add `VITE_GROQ_API_KEY` in Environment Variables.

---

## Limitations

- Analysis accuracy depends on image quality and AI model output
- Not validated for clinical use research and educational purposes only
- Requires valid Groq API key with sufficient rate limits
- PA view X-rays produce most accurate results; AP or lateral views may reduce accuracy

