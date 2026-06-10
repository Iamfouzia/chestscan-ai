import { useState, useRef, useCallback, useEffect } from "react";

/* ═══════════════════════════ STYLES ═══════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0d1117;
    --surface:   #161b22;
    --surface2:  #1c2333;
    --surface3:  #21262d;
    --border:    #30363d;
    --border2:   #3d444d;
    --blue:      #388bfd;
    --blue-dim:  #1f3a6e;
    --blue-glow: rgba(56,139,253,0.15);
    --text:      #e6edf3;
    --text2:     #8b949e;
    --text3:     #484f58;
    --green:     #3fb950;
    --green-dim: #1a3a22;
    --red:       #f85149;
    --red-dim:   #3a1a1a;
    --amber:     #d29922;
    --amber-dim: #3a2a00;
    --cyan:      #39d0d8;
    --purple:    #a371f7;
    --sans:      'Inter', sans-serif;
    --mono:      'JetBrains Mono', monospace;
  }

  html, body, #root {
    height: 100%; background: var(--bg); color: var(--text);
    font-family: var(--sans); font-size: 13px;
  }

  .app { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }



  /* ── Topbar ── */
  .topbar {
    display: flex; align-items: center; gap: 16px;
    padding: 0 20px; height: 50px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .brand { display: flex; align-items: center; gap: 9px; flex-shrink: 0; }
  .brand-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, #1f6feb, #388bfd);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 12px rgba(56,139,253,0.4);
  }
  .brand-name { font-size: 14px; font-weight: 700; color: var(--text); letter-spacing: -.3px; }
  .brand-sub  { font-size: 11px; color: var(--text2); margin-left: 2px; }

  .top-tools { display: flex; gap: 4px; flex: 1; justify-content: center; flex-wrap: wrap; }

  /* ── FIX 6: Toolbar buttons with labels/tooltips ── */
  .tbtn {
    height: 30px; padding: 0 11px; border-radius: 6px;
    border: 1px solid var(--border); background: var(--surface3);
    color: var(--text2); font-size: 11px; font-weight: 500;
    cursor: pointer; font-family: var(--sans);
    transition: all .15s; display: flex; align-items: center; gap: 5px;
    white-space: nowrap; position: relative;
  }
  .tbtn:hover    { background: var(--surface2); color: var(--text); border-color: var(--border2); }
  .tbtn:disabled { opacity: .3; cursor: not-allowed; }
  .tbtn.export { color: #fff; border-color: #388bfd26; background: var(--blue); }
  .tbtn.export:hover { background: #1f6feb; }
  .tbtn .tt {
    display: none; position: absolute; bottom: calc(100% + 6px); left: 50%;
    transform: translateX(-50%);
    background: var(--surface2); border: 1px solid var(--border2);
    color: var(--text); font-size: 10px; white-space: nowrap;
    padding: 3px 8px; border-radius: 5px; pointer-events: none;
    z-index: 100;
  }
  .tbtn:hover .tt { display: block; }

  .topbar-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .status-pill  { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--green); font-weight: 500; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .clock { font-size: 11px; color: var(--text2); font-family: var(--mono); }

  /* ── Workspace ── */
  .workspace { display: flex; flex: 1; overflow: hidden; }

  /* ── Sidebar ── */
  .sidebar {
    width: 212px; flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    overflow-y: auto; padding: 12px 11px 16px;
  }
  .sidebar::-webkit-scrollbar { width: 3px; }
  .sidebar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .s-hdr {
    display: flex; align-items: center; justify-content: space-between;
    padding: 5px 2px 5px; cursor: pointer; user-select: none;
    border-bottom: 1px solid var(--border); margin-bottom: 8px; margin-top: 4px;
  }
  .s-hdr:first-child { margin-top: 0; }
  .s-hdr:hover .s-ttl { color: var(--blue); }
  .s-ttl { font-size: 9px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text3); transition: color .15s; }
  .s-chev { font-size: 8px; color: var(--text3); transition: transform .2s; }
  .s-chev.open { transform: rotate(180deg); }
  .s-body { display: flex; flex-direction: column; gap: 9px; margin-bottom: 8px; }
  .s-body.hidden { display: none; }

  .s-row { display: flex; justify-content: space-between; align-items: center; }
  .s-ttl { font-size: 9px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: var(--text2); transition: color .15s; }
  .s-val { font-size: 11px; font-weight: 500; font-family: var(--mono); color: var(--text); }
  .s-val.g { color: var(--green); }
  .s-val.b { color: var(--blue); }

  .s-input {
    width: 100%; padding: 7px 10px;
    border: 1px solid var(--border); border-radius: 7px;
    background: var(--surface3); color: var(--text);
    font-family: var(--sans); font-size: 12px; outline: none;
    transition: all .15s; letter-spacing: .2px;
  }
  .s-input::placeholder { color: var(--text3); font-size: 11px; }
  .s-input:focus { border-color: var(--blue); background: var(--bg); }
  .s-input.err   { border-color: var(--red); }
  .s-input option { background: #1c2333; color: var(--text); }
  .ferr { font-size: 10px; color: var(--red); margin-top: -4px; }

  .notes-ta {
    width: 100%; padding: 7px 9px;
    border: 1px solid var(--border); border-radius: 6px;
    background: var(--surface3); color: var(--text);
    font-family: var(--sans); font-size: 12px; outline: none;
    resize: vertical; min-height: 64px; line-height: 1.5;
    transition: border-color .15s;
  }
  .notes-ta:focus { border-color: var(--blue); }

  /* Upload zone */
  .upload-zone {
    border: 1.5px dashed var(--border2); border-radius: 8px;
    padding: 18px 8px; text-align: center; cursor: pointer;
    transition: all .2s; background: var(--surface3); position: relative;
  }
  .upload-zone:hover, .upload-zone.drag {
    border-color: var(--blue); background: var(--blue-glow);
  }
  .uz-icon  { font-size: 20px; margin-bottom: 5px; }
  .uz-title { font-size: 11px; font-weight: 600; color: var(--text); }
  .uz-sub   { font-size: 10px; color: var(--text2); margin-top: 2px; }

  .thumb { border-radius: 6px; overflow: hidden; border: 1px solid var(--border); background: #000; }
  .thumb img { width: 100%; display: block; }

  .err-bar {
    padding: 7px 10px; border-radius: 6px;
    background: var(--red-dim); border: 1px solid #f8514940;
    font-size: 11px; color: var(--red); display: flex; gap: 6px;
  }

  /* ── FIX 2: Run Analysis button - more prominent ── */
  .run-btn {
    width: 100%; padding: 12px; margin-top: 4px;
    background: linear-gradient(135deg, #1f6feb, #388bfd);
    border: none; border-radius: 8px;
    color: #fff; font-size: 12px; font-weight: 700;
    font-family: var(--sans); cursor: pointer;
    transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 7px;
    box-shadow: 0 2px 12px rgba(56,139,253,0.25);
    letter-spacing: .4px; text-transform: uppercase;
  }
  .run-btn:hover:not(:disabled) {
    background: #1f6feb;
    box-shadow: 0 4px 20px rgba(56,139,253,.5);
    transform: translateY(-1px);
  }
  .run-btn:active:not(:disabled) { transform: translateY(0); }
  .run-btn:disabled { opacity: .35; cursor: not-allowed; box-shadow: none; }

  .new-btn {
    width: 100%; padding: 8px; margin-top: 4px;
    background: transparent; border: 1px solid var(--border2);
    border-radius: 8px; color: var(--text2); font-size: 11px;
    font-family: var(--sans); cursor: pointer; transition: all .15s;
    letter-spacing: .4px; text-transform: uppercase; font-weight: 600;
  }
  .new-btn:hover { color: var(--text); border-color: var(--border2); background: var(--surface3); }

  .spin {
    width: 12px; height: 12px;
    border: 2px solid rgba(255,255,255,.25); border-top-color: #fff;
    border-radius: 50%; animation: spin .7s linear infinite; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Main area ── */
  .main-area { flex: 1; display: flex; overflow: hidden; }

  /* ── Viewer ── */
  .viewer {
    width: 44%; flex-shrink: 0; display: flex; flex-direction: column;
    border-right: 1px solid var(--border); background: #000;
  }
  .viewer-topbar {
    display: flex; align-items: center; justify-content: space-between;
    height: 32px; padding: 0 12px;
    background: var(--surface); border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .analyzed-badge {
    display: flex; align-items: center; gap: 5px; padding: 2px 10px;
    border-radius: 20px; background: var(--green-dim); border: 1px solid #3fb95040;
    font-size: 10px; color: var(--green); font-weight: 600;
  }
  .viewer-canvas {
    flex: 1; display: flex; align-items: center; justify-content: center;
    overflow: hidden; position: relative; min-height: 0;
  }
  .xray-img {
    max-width: 100%; max-height: 100%; object-fit: contain; display: block;
    transition: filter .2s, transform .3s; transform-origin: center;
  }
  .viewer-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .ve-icon { font-size: 44px; opacity: .15; }
  .ve-text { font-size: 11px; color: var(--text3); font-family: var(--mono); letter-spacing: 1px; }

  .viewer-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 5px 10px; background: var(--surface); border-top: 1px solid var(--border);
    flex-shrink: 0;
  }
  .vf-label { font-size: 9px; color: var(--text2); font-family: var(--mono); letter-spacing: .5px; }
  .vf-controls { display: flex; align-items: center; gap: 5px; }
  .vc-btn {
    width: 22px; height: 22px; border-radius: 5px;
    border: 1px solid var(--border); background: var(--surface3);
    color: var(--text2); font-size: 12px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: all .15s;
  }
  .vc-btn:hover { background: var(--surface2); color: var(--text); border-color: var(--border2); }
  .vc-val { font-size: 10px; color: var(--text2); font-family: var(--mono); min-width: 34px; text-align: center; }

  /* Overlays */
  .ov-tl {
    position: absolute; top: 10px; left: 10px;
    display: flex; flex-direction: column; gap: 4px; z-index: 10; pointer-events: none;
  }
  .ov-badge {
    padding: 2px 7px; border-radius: 4px;
    background: rgba(0,0,0,.7); border: 1px solid rgba(255,255,255,.1);
    color: #94a3b8; font-size: 10px; font-weight: 600; font-family: var(--mono); letter-spacing: 1px;
  }
  .ov-r {
    position: absolute; top: 10px; right: 10px; z-index: 10; pointer-events: none;
    padding: 2px 9px; border-radius: 4px;
    background: rgba(31,111,235,.6); border: 1px solid rgba(56,139,253,.4);
    color: #fff; font-size: 12px; font-weight: 800; font-family: var(--mono); letter-spacing: 2px;
  }

  /* ── Right panel ── */
  .right-panel {
    flex: 1; display: flex; flex-direction: column;
    overflow: hidden; min-width: 0; background: var(--bg);
  }

  .stats-row {
    display: flex; background: var(--surface);
    border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .stat-card { flex: 1; padding: 10px 18px; border-right: 1px solid var(--border); }
  .stat-card:last-child { border-right: none; }
  .stat-num { font-size: 24px; font-weight: 700; font-family: var(--mono); line-height: 1; color: var(--text2); }
  .stat-num.b { color: var(--blue); }
  .stat-num.g { color: var(--green); }
  .stat-num.p { color: var(--purple); }
  .stat-num.r { color: var(--red); }
  .stat-lbl { font-size: 9px; color: var(--text2); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

  /* ── FIX 4: Priority Alerts sub-label ── */
  .stat-sub { font-size: 9px; margin-top: 2px; font-weight: 500; }
  .stat-sub.ok  { color: var(--green); }
  .stat-sub.bad { color: var(--red); }

  .report-area {
    flex: 1; overflow-y: auto; padding: 16px;
    display: flex; flex-direction: column; gap: 14px; min-height: 0;
  }
  .report-area::-webkit-scrollbar { width: 4px; }
  .report-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .sec-title {
    font-size: 10px; font-weight: 700; color: var(--text2);
    text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 8px;
    display: flex; align-items: center; gap: 7px;
  }
  .sec-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--blue); flex-shrink: 0; }

  /* Finding cards */
  .fc {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 11px 13px; transition: border-color .15s, background .15s;
  }
  /* ── FIX 9: Hover state on finding cards ── */
  .fc:hover { border-color: var(--border2); background: var(--surface2); }
  .fc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .fc-left { display: flex; align-items: center; gap: 10px; }
  .fc-icon {
    width: 28px; height: 28px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; flex-shrink: 0;
    color: var(--green);
  }
  .fc-icon.n { background: var(--green-dim); border: 1px solid #3fb95040; }
  .fc-icon.m { background: var(--amber-dim); border: 1px solid #d2992240; }
  .fc-icon.h { background: var(--red-dim); border: 1px solid #f8514940; }
  .fc-name { font-size: 12px; font-weight: 600; color: var(--text); }
  .fc-sub  { font-size: 11px; color: var(--text2); margin-top: 2px; line-height: 1.4; }

  /* ── FIX 5: Severity badge includes confidence % ── */
  .sev {
    padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700;
    display: flex; align-items: center; gap: 5px;
  }
  .sev.n { background: var(--surface3); color: var(--text2); border: 1px solid var(--border2); }
  .sev.m { background: var(--amber-dim); color: var(--amber); border: 1px solid #d2992230; }
  .sev.h { background: var(--red-dim);   color: var(--red);   border: 1px solid #f8514930; }
  .sev-pct {
    font-size: 9px; opacity: .75; font-family: var(--mono);
    border-left: 1px solid currentColor; padding-left: 5px;
  }

  /* FIX 8: Progress bar colors by confidence level - hide old conf-row since % is now in badge */
  .conf-row { display: flex; align-items: center; gap: 8px; }
  .conf-track { flex: 1; height: 3px; border-radius: 2px; background: var(--surface3); overflow: hidden; }
  .conf-fill { height: 100%; border-radius: 2px; transition: width .5s ease; }
  .conf-fill.high-conf  { background: var(--blue); }
  .conf-fill.mid-conf   { background: var(--amber); }
  .conf-fill.low-conf   { background: var(--red); }

  /* Report card */
  .rpt-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; overflow: hidden;
  }
  .rpt-header {
    display: flex; align-items: center; gap: 11px;
    padding: 12px 16px; background: var(--surface2);
    border-bottom: 1px solid var(--border);
  }
  .rpt-h-icon {
    width: 32px; height: 32px; border-radius: 7px;
    background: var(--blue-dim); border: 1px solid #388bfd30;
    display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;
  }
  .rpt-h-title { font-size: 14px; font-weight: 700; color: var(--text); letter-spacing: -.2px; }
  .rpt-h-sub   { font-size: 10px; color: var(--text2); margin-top: 3px; font-family: var(--mono); letter-spacing: .3px; }

  /* ── FIX 7: Report sections structured, not dense text ── */
  .rpt-sec { padding: 16px 18px; border-bottom: 1px solid var(--border); }
  .rpt-sec:last-child { border-bottom: none; }
  .rpt-sec-lbl-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .rpt-sec-icon { width: 3px; height: 16px; border-radius: 2px; flex-shrink: 0; }
  .rpt-sec-icon.cf { background: var(--blue); }
  .rpt-sec-icon.im { background: var(--green); }
  .rpt-sec-icon.rc { background: var(--cyan); }
  .rpt-sec-lbl { font-size: 10px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; }
  .rpt-sec-lbl.cf { color: var(--blue); }
  .rpt-sec-lbl.im { color: var(--green); }
  .rpt-sec-lbl.rc { color: var(--cyan); }
  .rpt-sec-text {
    font-size: 12.5px; line-height: 1.85; color: #a8b3be;
    white-space: pre-wrap; word-break: break-word;
    border-left: 2px solid var(--border2); padding-left: 14px;
    background: var(--surface3); border-radius: 0 6px 6px 0;
    padding: 12px 16px; padding-left: 14px;
    font-family: var(--sans); letter-spacing: .15px;
  }

  .disclaimer {
    padding: 10px 13px; border-radius: 8px;
    background: var(--amber-dim); border: 1px solid #d2992230;
    font-size: 11px; color: var(--amber);
    display: flex; gap: 8px; line-height: 1.6;
  }

  .empty-state {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    color: var(--text3); text-align: center; gap: 10px;
  }
  .es-icon { font-size: 38px; opacity: .2; }
  .es-text { font-size: 12px; line-height: 1.9; color: var(--text2); }
  .es-text span { color: var(--blue); font-weight: 600; }

  .ai-thinking {
    padding: 11px 14px; border-radius: 8px;
    background: var(--blue-glow); border: 1px solid #388bfd30;
    font-size: 12px; color: var(--blue);
    display: flex; align-items: center; gap: 9px; font-weight: 500;
  }

  .skeleton { border-radius: 4px; background: var(--surface2); animation: shimmer 1.5s infinite; }
  @keyframes shimmer { 0%,100%{opacity:.4} 50%{opacity:.8} }
  .sk { height: 12px; margin-bottom: 9px; }

  /* Responsive */
  @media (max-width: 860px) {
    .brand-sub { display: none; }
    .viewer { width: 40%; }
  }
  @media (max-width: 640px) {
    .workspace  { flex-direction: column; overflow-y: auto; }
    .sidebar    { width: 100%; overflow-y: visible; }
    .main-area  { flex-direction: column; min-height: 600px; }
    .viewer     { width: 100%; height: 280px; flex-shrink: 0; }
    .right-panel{ min-height: 400px; }
  }
`;

/* ═══════════════════ Helpers ═══════════════════ */
const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const parseSections = (text = "") => {
  if (!text) return [];
  const clean = text.replace(/\*\*/g, "").replace(/\*/g, "");
  const keys = [
    { rx: /CLINICAL\s+FINDINGS?\s*:?\s*/i, label: "Clinical Findings", cls: "cf", icon: "🔬" },
    { rx: /IMPRESSION\s*:?\s*/i, label: "Impression", cls: "im", icon: "📌" },
    { rx: /RECOMMENDATIONS?\s*:?\s*/i, label: "Recommendation", cls: "rc", icon: "💊" },
  ];
  const found = [];
  keys.forEach(k => { const m = k.rx.exec(clean); if (m) found.push({ ...k, cs: m.index + m[0].length, hs: m.index }); });
  if (!found.length) return [{ label: "Report", cls: "cf", icon: "📋", text: clean.trim() }];
  found.sort((a, b) => a.cs - b.cs);
  return found.map((s, i) => ({
    label: s.label, cls: s.cls, icon: s.icon,
    text: clean.slice(s.cs, found[i + 1]?.hs ?? clean.length).trim()
  })).filter(s => s.text.length > 0);
};

const toBase64 = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = (e) => res({ dataUrl: r.result });
  r.onerror = rej;
  r.readAsDataURL(file);
});

const callGroq = async (dataUrl, name, age, sex, caseId, apiKey) => {
  const prompt = `You are an expert radiologist with 20 years of experience. Analyze this chest X-ray systematically like a board-certified radiologist. Respond ONLY with valid JSON, no markdown, no extra text:
{
  "findings": [
    { "name": "Cardiothoracic Ratio", "detail": "detailed observation here", "severity": "NORMAL", "confidence": 0.94 }
  ],
  "report": "CLINICAL FINDINGS:\\n\\n[detailed paragraph]\\n\\nIMPRESSION:\\n\\n[2-3 sentences]\\n\\nRECOMMENDATION:\\n\\n[specific next steps]"
}

Patient: ${name || "Anonymous"}, Age: ${age || "?"}, Sex: ${sex || "?"}, Case: ${caseId}

FINDINGS: Analyze exactly 8-9 structures in this order: Cardiothoracic Ratio, Heart Size/Shape, Right Lung Field, Left Lung Field, Costophrenic Angles, Pleural Spaces, Mediastinum & Trachea, Diaphragm, Bony Structures & Soft Tissues.
For each finding: describe exactly what you see, not what is normal.
severity: NORMAL if within limits, MEDIUM if borderline or needs attention, HIGH if abnormal or critical.
confidence: 0.70 to 0.99 based on image clarity.
If any metallic artifact or foreign body is visible, add it as separate finding with severity NORMAL and note location.

CLINICAL FINDINGS: Write a detailed professional paragraph (5-8 sentences) describing ALL structures systematically: CTR value, heart morphology, lung fields bilaterally, costophrenic angles, pleural spaces, mediastinal width, tracheal position, diaphragm, bony structures, soft tissues.
IMPRESSION: Concise 2-3 sentence clinical summary.
RECOMMENDATION: Specific actionable next steps.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      max_tokens: 1200,
      messages: [{
        role: "user", content: [
          { type: "image_url", image_url: { url: dataUrl } },
          { type: "text", text: prompt }
        ]
      }]
    })
  });
  if (!res.ok) throw new Error(`Groq API Error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || "";
  const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No valid JSON in response");
  return JSON.parse(jsonMatch[0]);
};

const nSev = (s = "") => { const u = s.toUpperCase(); return u === "HIGH" ? "HIGH" : u === "MEDIUM" ? "MEDIUM" : "NORMAL"; };
const sevC = (s) => s === "HIGH" ? "h" : s === "MEDIUM" ? "m" : "n";
const sevIcon = () => "✓";

/* FIX 8: Progress bar class based on confidence level */
const confClass = (pct) => pct >= 90 ? "high-conf" : pct >= 75 ? "mid-conf" : "low-conf";

const exportPDF = (results, findings, sections, caseId, notes) => {
  const sc = (s) => s === "HIGH" ? "#f85149" : s === "MEDIUM" ? "#d29922" : "#3fb950";
  const fHtml = findings.map(f => {
    const sev = nSev(f.severity); const pct = Math.round((f.confidence ?? 0.9) * 100);
    return `<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:10px 13px;border:1px solid #30363d;border-radius:8px;margin-bottom:7px;background:#161b22">
      <div style="flex:1"><div style="font-weight:600;font-size:13px;color:#e6edf3">${f.name || ""}</div>${f.detail ? `<div style="font-size:11px;color:#8b949e;margin-top:3px;line-height:1.5">${f.detail}</div>` : ""}</div>
      <div style="display:flex;align-items:center;gap:10px;margin-left:12px">
        <span style="font-size:11px;color:#8b949e;font-family:monospace">${pct}%</span>
        <span style="padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;color:${sc(sev)};border:1px solid ${sc(sev)}40;background:${sc(sev)}15">${sev}</span>
      </div></div>`;
  }).join("");
  const sHtml = sections.map(s => {
    const c = s.cls === "cf" ? "#388bfd" : s.cls === "im" ? "#3fb950" : "#d29922";
    return `<div style="margin-bottom:18px"><div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${c};margin-bottom:8px">${s.icon} ${s.label}</div>
      <div style="font-size:13px;line-height:1.85;color:#8b949e;white-space:pre-wrap">${s.text}</div></div>`;
  }).join("");
  const nHtml = notes.trim() ? `<div style="margin-top:18px"><div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#8b949e;margin-bottom:8px">📝 Radiologist Notes</div><div style="font-size:13px;line-height:1.85;color:#8b949e;white-space:pre-wrap">${notes}</div></div>` : "";
  const win = window.open("", "_blank");
  win.document.write(`<!DOCTYPE html><html><head><title>ChestScan AI — ${caseId}</title>
  <style>body{font-family:'Inter',sans-serif;margin:0;padding:32px;background:#0d1117;color:#e6edf3;font-size:13px}
  h1{font-size:20px;font-weight:700;margin-bottom:4px}.sub{color:#8b949e;font-size:12px;margin-bottom:24px;font-family:monospace}
  .sec{margin-bottom:22px}.st{font-size:9px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#484f58;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #30363d}
  .disc{margin-top:24px;padding:11px 14px;background:#3a2a00;border:1px solid #d2992230;border-radius:8px;font-size:11px;color:#d29922}
  @media print{body{background:#fff;color:#0d1117}}</style></head><body>
  <h1>🫁 ChestScan AI — Radiology Report</h1>
  <div class="sub">Case: ${caseId} · ${dateStr} · Patient: ${[results?.name, results?.age, results?.sex].filter(Boolean).join(" · ") || "Anonymous"}</div>
  <div class="sec"><div class="st">Detection Results</div>${fHtml}</div>
  <div class="sec"><div class="st">Radiology Report Analysis</div>${sHtml}</div>
  ${nHtml}
  <div class="disc">⚠️ AI-generated report — not for clinical diagnosis. Always consult a licensed radiologist.</div>
  </body></html>`);
  win.document.close(); setTimeout(() => win.print(), 300);
};

/* ═══════════════════ Collapsible Section ═══════════════════ */
function Sec({ title, open: defOpen = true, children }) {
  const [open, setOpen] = useState(defOpen);
  return (
    <>
      <div className="s-hdr" onClick={() => setOpen(p => !p)}>
        <span className="s-ttl">{title}</span>
        <span className={`s-chev ${open ? "open" : ""}`}>▼</span>
      </div>
      <div className={`s-body ${open ? "" : "hidden"}`}>{children}</div>
    </>
  );
}

/* ═══════════════════ App ═══════════════════ */
export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [drag, setDrag] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [bright, setBright] = useState(100);
  const [patName, setPatName] = useState("");
  const [patAge, setPatAge] = useState("");
  const [patSex, setPatSex] = useState("");
  const [vErr, setVErr] = useState({});
  const [liveTime, setLiveTime] = useState(() => new Date().toLocaleTimeString("en-US", { hour12: false }));
  const [caseId] = useState(() => "PT-" + Math.random().toString(36).slice(2, 10).toUpperCase());
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
  const fileRef = useRef();

  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000);
    return () => clearInterval(t);
  }, []);

  const openFilePicker = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.value = "";
      fileRef.current.click();
    }
  }, []);

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setError("Invalid file. Please upload JPEG or PNG."); return; }
    setError(null); setResults(null); setFile(f); setZoom(1); setBright(100);
    const r = new FileReader();
    r.onload = (e) => setPreview(e.target.result);
    r.readAsDataURL(f);
  }, []);

  const onDrop = (e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); };
  const onDragOver = (e) => { e.preventDefault(); setDrag(true); };

  const analyze = async () => {
    if (!file || !apiKey.trim()) return;
    const errs = {};
    if (!patName.trim()) errs.name = "Name required";
    if (!patAge.trim()) errs.age = "Age required";
    if (!patSex) errs.sex = "Sex required";
    if (Object.keys(errs).length) { setVErr(errs); return; }
    setVErr({}); setLoading(true); setError(null); setResults(null);
    try {
      const { dataUrl } = await toBase64(file);
      const parsed = await callGroq(dataUrl, patName, patAge, patSex, caseId, apiKey.trim());
      setResults({ findings: parsed.findings || [], report: parsed.report || "", name: patName, age: patAge, sex: patSex });
    } catch (err) { setError(err.message || "Analysis failed."); }
    finally { setLoading(false); }
  };

  const resetAll = () => {
    setFile(null); setPreview(null); setResults(null); setError(null);
    setZoom(1); setBright(100); setVErr({});
  };

  const findings = results?.findings || [];
  const sections = parseSections(results?.report || "");
  const highCount = findings.filter(f => nSev(f.severity) === "HIGH").length;
  const avgConf = findings.length > 0
    ? Math.round(findings.reduce((a, f) => a + (f.confidence ?? 0.9), 0) / findings.length * 100) : null;
  const status = file ? (loading ? "Processing" : results ? "Complete" : "Ready") : "Awaiting";

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">


        <header className="topbar">
          <div className="brand">
            <div className="brand-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-3" />
                <circle cx="20" cy="10" r="2" />
              </svg>
            </div>
            <span className="brand-name">ChestScan AI</span>
            <span className="brand-sub">AI-Powered CXR Analysis</span>
          </div>

          {/* FIX 6: Toolbar buttons with tooltips */}
          <div className="top-tools">
            <input ref={fileRef} type="file" accept="image/*"
              onChange={e => { handleFile(e.target.files[0]); e.target.value = ""; }}
              style={{ display: "none" }} />
            <button className="tbtn" onClick={() => { resetAll(); setTimeout(openFilePicker, 50); }}>
              📂 Load Study
              <span className="tt">Open new X-Ray file</span>
            </button>
            <button className="tbtn" disabled={!preview} onClick={() => setZoom(z => Math.min(+(z + .25).toFixed(2), 4))}>
              🔍 Zoom In
              <span className="tt">Increase zoom (+25%)</span>
            </button>
            <button className="tbtn" disabled={!preview} onClick={() => setZoom(z => Math.max(+(z - .25).toFixed(2), .25))}>
              🔍 Zoom Out
              <span className="tt">Decrease zoom (−25%)</span>
            </button>
            <button className="tbtn" disabled={!preview} onClick={() => setBright(b => Math.min(b + 20, 220))}>
              ☀ Brighter
              <span className="tt">Increase brightness</span>
            </button>
            <button className="tbtn" disabled={!preview} onClick={() => setBright(b => Math.max(b - 20, 20))}>
              ☀ Dimmer
              <span className="tt">Decrease brightness</span>
            </button>
            <button className="tbtn" disabled={!preview} onClick={() => { setZoom(1); setBright(100); }}>
              ↺ Reset View
              <span className="tt">Reset zoom & brightness</span>
            </button>
            {results && (
              <button className="tbtn export" onClick={() => exportPDF(results, findings, sections, caseId, "")}>
                ⬇ Export PDF
                <span className="tt">Download report as PDF</span>
              </button>
            )}
          </div>

          <div className="topbar-right">
            <div className="status-pill"><span className="dot" /> System Online</div>
            <span className="clock">{liveTime} · {dateStr}</span>
          </div>
        </header>

        <div className="workspace">

          {/* Sidebar */}
          <aside className="sidebar">
            <Sec title="Patient Info">
              <div className="s-row">
                <span className="s-key">Case ID</span>
                <span className="s-val b" style={{ fontSize: 10 }}>{caseId}</span>
              </div>
              <div>
                <input className={`s-input ${vErr.name ? "err" : ""}`} placeholder="Full name *"
                  value={patName} onChange={e => { setPatName(e.target.value); setVErr(p => ({ ...p, name: "" })); }} />
                {vErr.name && <div className="ferr">⚠ {vErr.name}</div>}
              </div>
              <div>


                <input className={`s-input ${vErr.age ? "err" : ""}`} placeholder="Age *" type="text" maxLength="3"
                  value={patAge} onChange={e => { const v = e.target.value.replace(/[^0-9]/g, ""); setPatAge(v); setVErr(p => ({ ...p, age: "" })); }} />
                {vErr.age && <div className="ferr">⚠ {vErr.age}</div>}








              </div>
              <div>
                <select className={`s-input ${vErr.sex ? "err" : ""}`} value={patSex}
                  onChange={e => { setPatSex(e.target.value); setVErr(p => ({ ...p, sex: "" })); }}
                  style={{ appearance: "none", WebkitAppearance: "none" }}>
                  <option value="" disabled>Select Sex *</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {vErr.sex && <div className="ferr">⚠ {vErr.sex}</div>}
              </div>
              <div className="s-row">
                <span className="s-key">Date</span>
                <span className="s-val" style={{ fontSize: 10 }}>{dateStr}</span>
              </div>
            </Sec>

            <Sec title="Study">
              <div className="s-row"><span className="s-key">Type</span><span className="s-val">Chest X-Ray</span></div>
              <div className="s-row"><span className="s-key">Status</span><span className={`s-val ${results ? "g" : ""}`}>{status}</span></div>
              {file && <div className="s-row"><span className="s-key">File</span><span className="s-val" style={{ fontSize: 10, color: "var(--text2)" }}>{file.name.slice(0, 18)}</span></div>}
            </Sec>

            <Sec title="Upload">
              {!file ? (
                <div className={`upload-zone ${drag ? "drag" : ""}`} onClick={openFilePicker}
                  onDrop={onDrop} onDragOver={onDragOver} onDragLeave={() => setDrag(false)}>
                  <div className="uz-icon">🩻</div>
                  <div className="uz-title">Click or Drop X-Ray</div>
                  <div className="uz-sub">JPEG · PNG</div>
                </div>
              ) : (
                <div className="thumb" onClick={openFilePicker} style={{ cursor: "pointer" }} title="Click to change">
                  <img src={preview} alt="thumb" />
                </div>
              )}
              {error && <div className="err-bar"><span>⚠</span><span>{error}</span></div>}
            </Sec>

            {/* FIX 2: Prominent Run Analysis button */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
              <button className="run-btn" disabled={!file || loading} onClick={analyze}>
                {loading ? <><span className="spin" />Analyzing…</> : <> Run Analysis</>}
              </button>
              <button className="new-btn" onClick={resetAll}>New Study</button>
            </div>
          </aside>

          {/* Main */}
          <main className="main-area">

            {/* Viewer */}
            <div className="viewer">
              <div className="viewer-topbar">
                {results
                  ? <div className="analyzed-badge">✓ Analyzed</div>
                  : <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>VIEWER</span>
                }
                <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                  {preview ? `${Math.round(zoom * 100)}% · ${bright}%☀` : "NO STUDY"}
                </span>
              </div>

              <div className="viewer-canvas">
                {preview ? (
                  <>
                    <img src={preview} alt="X-Ray" className="xray-img"
                      style={{ filter: `brightness(${bright}%)`, transform: `scale(${zoom})` }} />
                    <div className="ov-tl">
                      <span className="ov-badge">PA VIEW</span>
                      <span className="ov-badge">CXR</span>
                    </div>
                    <span className="ov-r">R</span>
                  </>
                ) : (
                  <div className="viewer-empty">
                    <div className="ve-icon">🩻</div>
                    <div className="ve-text">NO STUDY LOADED</div>
                  </div>
                )}
              </div>

              <div className="viewer-footer">
                <span className="vf-label">Posteroanterior · Diagnostic Use Only</span>
                {preview && (
                  <div className="vf-controls">
                    <button className="vc-btn" title="Zoom out" onClick={() => setZoom(z => Math.max(+(z - .25).toFixed(2), .25))}>−</button>
                    <span className="vc-val">{Math.round(zoom * 100)}%</span>
                    <button className="vc-btn" title="Zoom in" onClick={() => setZoom(z => Math.min(+(z + .25).toFixed(2), 4))}>+</button>
                    <button className="vc-btn" title="Reset view" onClick={() => { setZoom(1); setBright(100); }}>↺</button>
                  </div>
                )}
              </div>
            </div>

            {/* Right panel */}
            <div className="right-panel">
              <div className="stats-row">
                <div className="stat-card">
                  <div className={`stat-num ${results ? "b" : ""}`}>{loading ? "—" : results ? findings.length : "—"}</div>
                  <div className="stat-lbl">Structures Analyzed</div>
                </div>
                {/* FIX 4: Priority Alerts with clear "All Clear" message */}
                <div className="stat-card">
                  <div className={`stat-num ${loading ? "" : highCount > 0 ? "r" : results ? "g" : ""}`}>
                    {loading ? "—" : results ? highCount : "—"}
                  </div>
                  <div className="stat-lbl">Priority Alerts</div>
                  {results && !loading && (
                    <div className={`stat-sub ${highCount === 0 ? "ok" : "bad"}`}>
                      {highCount === 0 ? "✓ All Clear" : `${highCount} issue${highCount > 1 ? "s" : ""} found`}
                    </div>
                  )}
                </div>
                <div className="stat-card">
                  <div className={`stat-num ${avgConf ? "p" : ""}`}>
                    {loading ? "—" : avgConf ? `${avgConf}%` : "—"}
                  </div>
                  <div className="stat-lbl">Confidence Score</div>
                </div>
              </div>

              <div className="report-area">

                {loading && (
                  <>
                    <div className="ai-thinking">
                      <span className="spin" style={{ borderColor: "#388bfd30", borderTopColor: "var(--blue)" }} />
                      AI analyzing image — please wait…
                    </div>
                    {[75, 60, 85, 65, 50].map((w, i) => <div key={i} className="skeleton sk" style={{ width: `${w}%` }} />)}
                  </>
                )}

                {!loading && findings.length > 0 && (
                  <div>
                    <div className="sec-title"><span className="sec-dot" />Detection Results</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {findings.map((f, i) => {
                        const sev = nSev(f.severity); const sc = sevC(sev);
                        const pct = Math.round((f.confidence ?? 0.9) * 100);
                        return (
                          <div className="fc" key={i}>
                            <div className="fc-top">
                              <div className="fc-left">
                                <div className={`fc-icon ${sc}`}>{sevIcon(sev)}</div>
                                <div>
                                  <div className="fc-name">{f.name || `Finding ${i + 1}`}</div>
                                  {f.detail && <div className="fc-sub">{f.detail}</div>}
                                </div>
                              </div>
                              {/* FIX 5: Severity badge includes confidence % inside */}
                              <span className={`sev ${sc}`}>
                                {sev}
                                <span className="sev-pct">{pct}%</span>
                              </span>
                            </div>
                            {/* FIX 8: Progress bar color based on confidence level */}
                            <div className="conf-row">
                              <div className="conf-track">
                                <div className={`conf-fill ${confClass(pct)}`} style={{ width: `${pct}%` }} />

                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!loading && sections.length > 0 && (
                  <div>
                    <div className="sec-title"><span className="sec-dot" />Radiology Report Analysis</div>
                    <div className="rpt-card">
                      <div className="rpt-header">
                        <div className="rpt-h-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#388bfd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        </div>
                        <div>
                          <div className="rpt-h-title">AI Radiology Report</div>
                          <div className="rpt-h-sub">
                            {caseId} · {dateStr} · {liveTime}
                            {(results?.name || results?.age) && ` · ${[results.name, results.age, results.sex].filter(Boolean).join(", ")}`}
                          </div>
                        </div>
                      </div>
                      {/* FIX 7: Each section has left border for visual separation */}
                      {sections.map((s, i) => (
                        <div className="rpt-sec" key={i}>
                          <div className="rpt-sec-lbl-row">
                            <div className={`rpt-sec-icon ${s.cls}`}></div>
                            <span className={`rpt-sec-lbl ${s.cls}`}>{s.label}</span>
                          </div>
                          <div className="rpt-sec-text">{s.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FIX 1: Bottom disclaimer hidden (moved to top banner) */}

                {results && (
                  <div className="disclaimer">
                    <span>⚠️</span>
                    <span>AI-generated report — not for clinical diagnosis. Always consult a licensed radiologist.</span>
                  </div>
                )}

                {!results && !loading && (
                  <div className="empty-state">
                    <div className="es-icon">📋</div>
                    <div className="es-text">
                      Upload an X-Ray and click<br />
                      <span>Run Analysis</span><br />
                      to generate AI radiology report
                    </div>
                  </div>
                )}

              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}