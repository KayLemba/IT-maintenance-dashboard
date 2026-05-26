import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from "recharts";
import "./styles.css";


const LOGO_B64 = "data:image/png;base64,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";
const STORAGE_KEY = "it_tracker_final";

const checklistDefault = [
  { task: "Check physical condition (no cracks, damage, loose parts)", done: false, category: "General Equipment Inspection" },
  { task: "Ensure all cables are properly connected and labeled", done: false, category: "General Equipment Inspection" },
  { task: "Verify proper ventilation (no blocked air vents)", done: false, category: "General Equipment Inspection" },
  { task: "Clean dust from devices (external surfaces)", done: false, category: "General Equipment Inspection" },
  { task: "Boot-up and shutdown functioning properly", done: false, category: "Computers & Laptops" },
  { task: "Check system performance (speed, freezing issues)", done: false, category: "Computers & Laptops" },
  { task: "Update operating system and drivers", done: false, category: "Computers & Laptops" },
  { task: "Run antivirus scan", done: false, category: "Computers & Laptops" },
  { task: "Check storage space (minimum 20% free)", done: false, category: "Computers & Laptops" },
  { task: "Clean keyboard, screen, and ports", done: false, category: "Computers & Laptops" },
  { task: "Verify backup is working", done: false, category: "Computers & Laptops" },
  { task: "Check server uptime and performance", done: false, category: "Servers" },
  { task: "Monitor CPU, RAM, and disk usage", done: false, category: "Servers" },
  { task: "Verify backups completed successfully", done: false, category: "Servers" },
  { task: "Check logs for errors or warnings", done: false, category: "Servers" },
  { task: "Ensure cooling systems are working", done: false, category: "Servers" },
  { task: "Test failover systems (if applicable)", done: false, category: "Servers" },
  { task: "Check internet connectivity and speed", done: false, category: "Networking Equipment" },
  { task: "Inspect cables and ports", done: false, category: "Networking Equipment" },
  { task: "Verify network uptime", done: false, category: "Networking Equipment" },
  { task: "Check firmware updates", done: false, category: "Networking Equipment" },
  { task: "Monitor unusual traffic or security threats", done: false, category: "Networking Equipment" },
  { task: "Restart devices if needed (scheduled)", done: false, category: "Networking Equipment" },
  { task: "Check print quality", done: false, category: "Printers & Scanners" },
  { task: "Refill ink/toner if low", done: false, category: "Printers & Scanners" },
  { task: "Clear paper jams", done: false, category: "Printers & Scanners" },
  { task: "Clean rollers and trays", done: false, category: "Printers & Scanners" },
  { task: "Test scanning functionality", done: false, category: "Printers & Scanners" },
  { task: "Check battery health/status", done: false, category: "UPS & Power Equipment" },
  { task: "Test backup power functionality", done: false, category: "UPS & Power Equipment" },
  { task: "Ensure no overload conditions", done: false, category: "UPS & Power Equipment" },
  { task: "Inspect power cables and sockets", done: false, category: "UPS & Power Equipment" },
  { task: "Ensure antivirus is updated", done: false, category: "Software & Security" },
  { task: "Apply system patches and updates", done: false, category: "Software & Security" },
  { task: "Check user access controls", done: false, category: "Software & Security" },
  { task: "Verify firewall status", done: false, category: "Software & Security" },
  { task: "Review security logs", done: false, category: "Software & Security" },
  { task: "Perform scheduled backups", done: false, category: "Backup & Data Management" },
  { task: "Test data restoration", done: false, category: "Backup & Data Management" },
  { task: "Verify backup storage (external/cloud)", done: false, category: "Backup & Data Management" },
  { task: "Check backup logs for errors", done: false, category: "Backup & Data Management" },
  { task: "Update asset register", done: false, category: "Inventory & Asset Tracking" },
  { task: "Verify serial numbers and tags", done: false, category: "Inventory & Asset Tracking" },
  { task: "Track equipment allocation", done: false, category: "Inventory & Asset Tracking" },
  { task: "Identify faulty or unused equipment", done: false, category: "Inventory & Asset Tracking" },
  { task: "Ensure room temperature is optimal", done: false, category: "Environmental Checks" },
  { task: "Check air conditioning functionality", done: false, category: "Environmental Checks" },
  { task: "Confirm dust-free environment", done: false, category: "Environmental Checks" },
  { task: "Verify proper lighting and humidity levels", done: false, category: "Environmental Checks" },
  { task: "Identify the problem (user explanation or system alert)", done: false, category: "Initial Issue Assessment" },
  { task: "Ask key questions (When did it start? Any changes made?)", done: false, category: "Initial Issue Assessment" },
  { task: "Check if issue is hardware or software related", done: false, category: "Initial Issue Assessment" },
  { task: "Replicate the issue (if possible)", done: false, category: "Initial Issue Assessment" },
  { task: "Record error messages/screenshots", done: false, category: "Initial Issue Assessment" },
  { task: "Restart the computer/device", done: false, category: "Basic Troubleshooting" },
  { task: "Check power supply and cables", done: false, category: "Basic Troubleshooting" },
  { task: "Verify network connection", done: false, category: "Basic Troubleshooting" },
  { task: "Close/reopen affected application", done: false, category: "Basic Troubleshooting" },
  { task: "Test with another user account (if applicable)", done: false, category: "Basic Troubleshooting" },
  { task: "Check for software updates/patches", done: false, category: "Software Troubleshooting" },
  { task: "Reinstall or repair the application", done: false, category: "Software Troubleshooting" },
  { task: "Run antivirus/malware scan", done: false, category: "Software Troubleshooting" },
  { task: "Check system logs for errors", done: false, category: "Software Troubleshooting" },
  { task: "Verify system compatibility (OS, RAM, etc.)", done: false, category: "Software Troubleshooting" },
  { task: "Roll back recent updates (if issue started after update)", done: false, category: "Software Troubleshooting" },
  { task: "Restore system (System Restore or backup)", done: false, category: "Software Troubleshooting" },
  { task: "Check permissions and user access rights", done: false, category: "Software Troubleshooting" },
  { task: "Inspect device for physical damage", done: false, category: "Hardware Troubleshooting" },
  { task: "Check all internal/external connections", done: false, category: "Hardware Troubleshooting" },
  { task: "Swap with a known working component (RAM, HDD, PSU, etc.)", done: false, category: "Hardware Troubleshooting" },
  { task: "Run hardware diagnostics tools", done: false, category: "Hardware Troubleshooting" },
  { task: "Check overheating (fans, dust buildup)", done: false, category: "Hardware Troubleshooting" },
  { task: "Test peripherals (keyboard, mouse, monitor)", done: false, category: "Hardware Troubleshooting" },
  { task: "Replace faulty components if confirmed", done: false, category: "Hardware Troubleshooting" },
  { task: "Boot into Safe Mode", done: false, category: "Advanced Troubleshooting" },
  { task: "Use recovery tools (startup repair, recovery disk)", done: false, category: "Advanced Troubleshooting" },
  { task: "Check BIOS/UEFI settings", done: false, category: "Advanced Troubleshooting" },
  { task: "Update firmware or drivers", done: false, category: "Advanced Troubleshooting" },
  { task: "Perform system reset or OS reinstallation (last resort)", done: false, category: "Advanced Troubleshooting" },
  { task: "Confirm issue is resolved", done: false, category: "Resolution & Testing" },
  { task: "Test all related functions", done: false, category: "Resolution & Testing" },
  { task: "Get user confirmation", done: false, category: "Resolution & Testing" },
  { task: "Monitor system for stability", done: false, category: "Resolution & Testing" },
  { task: "Record issue details and root cause", done: false, category: "Documentation & Reporting" },
  { task: "Document steps taken to resolve", done: false, category: "Documentation & Reporting" },
  { task: "Update ticketing system/logbook", done: false, category: "Documentation & Reporting" },
  { task: "Note recurring issues for future prevention", done: false, category: "Documentation & Reporting" },
  { task: "Escalate unresolved issues to higher-level support/vendor", done: false, category: "Escalation Procedure" },
  { task: "Provide full documentation and logs", done: false, category: "Escalation Procedure" },
  { task: "Track escalation status", done: false, category: "Escalation Procedure" },
  { task: "Apply updates or patches", done: false, category: "Preventive Actions After Fix" },
  { task: "Educate user (if issue was user-related)", done: false, category: "Preventive Actions After Fix" },
  { task: "Schedule regular maintenance", done: false, category: "Preventive Actions After Fix" },
  { task: "Replace aging or failing equipment", done: false, category: "Preventive Actions After Fix" },
];

const PIE_COLORS = ["#f59e0b", "#38bdf8", "#4ade80"];
const STATUS_COLORS = {
  Open:        { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  "In Progress":{ bg: "#e0f2fe", text: "#0c4a6e", dot: "#38bdf8" },
  Closed:      { bg: "#dcfce7", text: "#14532d", dot: "#4ade80" },
};
const PRIORITY_COLORS = {
  Low:    { bg: "#f0fdf4", text: "#15803d" },
  Medium: { bg: "#fefce8", text: "#a16207" },
  High:   { bg: "#fff1f2", text: "#be123c" },
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="recharts-tooltip">
      <strong>{payload[0].name}</strong>: {payload[0].value}
    </div>
  );
};

const KpiSectionLabel = ({ children }) => (
  <div className="kpi-section-label">
    <span className="kpi-section-label__line" />
    {children}
  </div>
);

export default function App() {
  const [records, setRecords] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s).records || [] : [];
    } catch { return []; }
  });

  const [checklist, setChecklist] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      const stored = s ? JSON.parse(s).checklist : null;
      if (!stored || !stored.length || !stored[0].category) return checklistDefault;
      return stored;
    } catch { return checklistDefault; }
  });

  const [dark, setDark] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s).dark ?? true : true;
    } catch { return true; }
  });

  const [activeTab, setActiveTab]     = useState("dashboard");
  const [form, setForm]               = useState({ date:"", serialNumber:"", equipmentId:"", issue:"", status:"Open", priority:"Medium", assignedTo:"", fixed:"Not Fixed", comment:"" });
  const [editingId, setEditingId]     = useState(null);
  const [searchTerm, setSearchTerm]   = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [toast, setToast]             = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ records, checklist, dark }));
  }, [records, checklist, dark]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const saveRecord = () => {
    if (!form.issue.trim()) { showToast("Issue description is required.", "error"); return; }
    const now = new Date().toISOString();
    if (editingId) {
      const existing = records.find(r => r.id === editingId);
      setRecords(records.map(r => r.id === editingId
        ? { ...existing, ...form, id: editingId, createdAt: existing.createdAt, closedAt: form.status === "Closed" ? existing.closedAt || now : null }
        : r));
      setEditingId(null);
      showToast("Record updated successfully.");
    } else {
      setRecords(prev => [{ ...form, id: Date.now(), createdAt: now, closedAt: form.status === "Closed" ? now : null }, ...prev]);
      showToast("Record added successfully.");
    }
    setForm({ date:"", serialNumber:"", equipmentId:"", issue:"", status:"Open", priority:"Medium", assignedTo:"", fixed:"Not Fixed", comment:"" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ date:"", serialNumber:"", equipmentId:"", issue:"", status:"Open", priority:"Medium", assignedTo:"", fixed:"Not Fixed", comment:"" });
  };

  const getSLA = (r) => {
    if (!r.createdAt) return "—";
    const mins = Math.floor((new Date(r.closedAt || Date.now()) - new Date(r.createdAt)) / 60000);
    if (mins < 60)   return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins/60)}h ${mins%60}m`;
    return `${Math.floor(mins/1440)}d ${Math.floor((mins%1440)/60)}h`;
  };

  const exportPDF = async () => {
    const loadScript = (src) => new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement("script");
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });

    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pw = doc.internal.pageSize.getWidth();
    const margin = 14;

    // Logo is already transparent PNG — embed directly
    const getLogoDataUrl = () => Promise.resolve(LOGO_B64);

    const logoUrl = await getLogoDataUrl();

    // Header
    doc.addImage(logoUrl, "PNG", margin, 8, 45, 18);
    doc.setFontSize(9);
    doc.setTextColor(100, 102, 241);
    doc.text("IT OPERATIONS", pw - margin, 12, { align: "right" });
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("KPI Report", pw - margin, 20, { align: "right" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}), pw - margin, 26, { align: "right" });

    doc.setDrawColor(220, 220, 230);
    doc.line(margin, 30, pw - margin, 30);

    let y = 38;

    // Section helper
    const sectionLabel = (label) => {
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(99, 102, 241);
      doc.text(label.toUpperCase(), margin, y);
      y += 6;
    };

    // 01 Records Overview
    sectionLabel("01 — Records Overview");
    const overviewCards = [
      ["Total Issues", kpi.total, [99,102,241]],
      ["Open", kpi.open, [245,158,11]],
      ["In Progress", kpi.inProgress, [56,189,248]],
      ["Closed", kpi.closed, [74,222,128]],
    ];
    const cw = (pw - margin*2 - 9) / 4;
    overviewCards.forEach(([label, val, color], i) => {
      const x = margin + i * (cw + 3);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, y, cw, 16, 2, 2, "F");
      doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(100,116,139);
      doc.text(label, x + cw/2, y + 5, { align: "center" });
      doc.setFontSize(16); doc.setFont("helvetica","bold"); doc.setTextColor(...color);
      doc.text(String(val), x + cw/2, y + 13, { align: "center" });
    });
    y += 22;

    const metricCards = [
      ["Resolution Rate", `${kpi.resolutionRate}%`, [74,222,128]],
      ["Avg Resolution Time", kpi.fmtAvg || "—", [56,189,248]],
      ["High Priority Issues", String(kpi.highPriority), [248,113,113]],
    ];
    const mw = (pw - margin*2 - 6) / 3;
    metricCards.forEach(([label, val, color], i) => {
      const x = margin + i * (mw + 3);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, y, mw, 14, 2, 2, "F");
      doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(100,116,139);
      doc.text(label, x + mw/2, y + 5, { align: "center" });
      doc.setFontSize(13); doc.setFont("helvetica","bold"); doc.setTextColor(...color);
      doc.text(val, x + mw/2, y + 12, { align: "center" });
    });
    y += 20;

    // 02 Priority Breakdown
    sectionLabel("02 — Priority Breakdown");
    [["High", kpi.highPriority, [248,113,113]], ["Medium", kpi.medPriority, [251,191,36]], ["Low", kpi.lowPriority, [74,222,128]]].forEach(([label, val, color]) => {
      const pct = kpi.total > 0 ? Math.round((val/kpi.total)*100) : 0;
      const bw = pw - margin*2;
      doc.setFillColor(230,232,240); doc.roundedRect(margin, y, bw, 4, 1, 1, "F");
      doc.setFillColor(...color); doc.roundedRect(margin, y, bw * pct/100, 4, 1, 1, "F");
      doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(15,23,42);
      doc.text(`${label} Priority`, margin, y - 1);
      doc.setTextColor(...color); doc.text(`${val} (${pct}%)`, pw - margin, y - 1, { align: "right" });
      y += 9;
    });
    y += 4;

    // 03 Top Assignees table
    if (kpi.topAssignees.length > 0) {
      sectionLabel("03 — Top Assignees");
      doc.autoTable({
        startY: y,
        head: [["Assignee", "Issues"]],
        body: kpi.topAssignees.map(([n,c]) => [n, c]),
        margin: { left: margin, right: margin },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [99,102,241], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248,250,252] },
        theme: "grid",
      });
      y = doc.lastAutoTable.finalY + 6;
    }

    // 04 Most Affected Equipment
    if (kpi.topEquipment.length > 0) {
      sectionLabel("04 — Most Affected Equipment");
      doc.autoTable({
        startY: y,
        head: [["Equipment ID", "Issues"]],
        body: kpi.topEquipment.map(([id,c]) => [id, c]),
        margin: { left: margin, right: margin },
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [245,158,11], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248,250,252] },
        theme: "grid",
      });
      y = doc.lastAutoTable.finalY + 6;
    }

    // 05 Open Issues
    const openRecs = records.filter(r => r.status === "Open");
    if (openRecs.length > 0) {
      sectionLabel("05 — Open Issues Requiring Attention");
      doc.autoTable({
        startY: y,
        head: [["Issue", "Equipment ID", "Priority", "Assigned To", "Open For"]],
        body: openRecs.map(r => [r.issue, r.equipmentId||"—", r.priority, r.assignedTo||"—", getSLA(r)]),
        margin: { left: margin, right: margin },
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [15,23,42], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248,250,252] },
        theme: "grid",
      });
    }

    // Footer
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setDrawColor(220,220,230); doc.line(margin, 287, pw-margin, 287);
      doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(148,163,184);
      doc.text("Exponent Bizolution — IT Maintenance Tracker", margin, 291);
      doc.text(`Page ${i} of ${pages}`, pw-margin, 291, { align: "right" });
    }

    doc.save(`IT_KPI_Report_${new Date().toISOString().slice(0,10)}.pdf`);
    showToast("PDF downloaded successfully.");
  };

  const stats = useMemo(() => ({
    total:       records.length,
    open:        records.filter(r => r.status === "Open").length,
    closed:      records.filter(r => r.status === "Closed").length,
    progress:    records.filter(r => r.status === "In Progress").length,
    fixed:       records.filter(r => r.fixed === "Fixed").length,
    notFixed:    records.filter(r => r.fixed === "Not Fixed").length,
    highPriority:records.filter(r => r.priority === "High").length,
  }), [records]);

  const pieData = [
    { name: "Open",        value: stats.open },
    { name: "In Progress", value: stats.progress },
    { name: "Closed",      value: stats.closed },
  ];
  const barData = [
    { name: "Fixed",     value: stats.fixed },
    { name: "Not Fixed", value: stats.notFixed },
  ];

  const filteredRecords = useMemo(() => records.filter(r => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || [r.serialNumber, r.equipmentId, r.assignedTo].some(v => v?.toLowerCase().includes(q));
    return matchSearch && (filterStatus === "All" || r.status === filterStatus);
  }), [records, searchTerm, filterStatus]);

  const exportCSV = () => {
    const headers = ["Date","Serial Number","Equipment ID","Issue","Status","Priority","Assigned To","Fixed","Comment","SLA"];
    const rows = records.map(r =>
      [r.date, r.serialNumber, r.equipmentId, r.issue, r.status, r.priority, r.assignedTo, r.fixed, r.comment, getSLA(r)]
        .map(v => `"${v ?? ""}"`).join(",")
    );
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "it_tracker.csv"; a.click();
    showToast("CSV exported successfully.");
  };

  const highlight = (text, query) => {
    if (!query || !text) return text || "—";
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return <>{text.slice(0,idx)}<mark>{text.slice(idx, idx+query.length)}</mark>{text.slice(idx+query.length)}</>;
  };

  const toggleChecklist = (i) => {
    const updated = [...checklist]; updated[i].done = !updated[i].done; setChecklist(updated);
  };

  const checklistProgress   = Math.round((checklist.filter(i => i.done).length / checklist.length) * 100);
  const checklistCategories = [...new Set(checklist.map(i => i.category || "General"))];

  const kpi = useMemo(() => {
    const total = records.length;
    const open  = records.filter(r => r.status === "Open").length;
    const inProgress = records.filter(r => r.status === "In Progress").length;
    const closed = records.filter(r => r.status === "Closed").length;
    const fixed  = records.filter(r => r.fixed === "Fixed").length;
    const highPriority = records.filter(r => r.priority === "High").length;
    const medPriority  = records.filter(r => r.priority === "Medium").length;
    const lowPriority  = records.filter(r => r.priority === "Low").length;

    const closedRecs = records.filter(r => r.closedAt && r.createdAt);
    const avgMins = closedRecs.length
      ? Math.round(closedRecs.reduce((s,r) => s + Math.floor((new Date(r.closedAt)-new Date(r.createdAt))/60000), 0) / closedRecs.length)
      : 0;
    const fmtAvg = avgMins >= 1440 ? `${Math.floor(avgMins/1440)}d ${Math.floor((avgMins%1440)/60)}h`
                 : avgMins >= 60   ? `${Math.floor(avgMins/60)}h ${avgMins%60}m`
                 : `${avgMins}m`;

    const resolutionRate = total > 0 ? Math.round((fixed/total)*100) : 0;
    const closureRate    = total > 0 ? Math.round((closed/total)*100) : 0;

    const assigneeCounts = {};
    records.forEach(r => { if (r.assignedTo) assigneeCounts[r.assignedTo] = (assigneeCounts[r.assignedTo]||0)+1; });
    const topAssignees = Object.entries(assigneeCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);

    const equipCounts = {};
    records.forEach(r => { if (r.equipmentId) equipCounts[r.equipmentId] = (equipCounts[r.equipmentId]||0)+1; });
    const topEquipment = Object.entries(equipCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);

    const clTotal = checklist.length;
    const clDone  = checklist.filter(i=>i.done).length;
    const clRate  = clTotal > 0 ? Math.round((clDone/clTotal)*100) : 0;
    const catProgress = checklistCategories.map(cat => {
      const items = checklist.filter(i=>(i.category||"General")===cat);
      const done  = items.filter(i=>i.done).length;
      return { cat, done, total: items.length, pct: Math.round((done/items.length)*100) };
    });

    return { total, open, inProgress, closed, fixed, highPriority, medPriority, lowPriority,
             resolutionRate, closureRate, fmtAvg, topAssignees, topEquipment,
             clTotal, clDone, clRate, catProgress };
  }, [records, checklist, checklistCategories]);

  const navItems = [
    { id:"dashboard", icon:"◈", label:"Dashboard" },
    { id:"records",   icon:"⊞", label:"Records" },
    { id:"checklist", icon:"◻", label:"Checklist" },
    { id:"kpi",       icon:"▦", label:"KPI Report" },
  ];

  return (
    <div className="app" data-theme={dark ? "dark" : "light"}>
      <div className="app-bg-overlay" />

      {/* Toast */}
      {toast && <div className={`toast toast--${toast.type}`}>{toast.type==="error"?"✕ ":"✓ "}{toast.msg}</div>}

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo-wrap">
            <img src={LOGO_B64} alt="Exponent Bizolution" className="sidebar__logo" />
          </div>
          <div className="sidebar__brand-tag">IT Operations</div>
          <div className="sidebar__brand-date">
            {new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(item => (
            <button key={item.id} className={`nav-btn${activeTab===item.id?" nav-btn--active":""}`}
              onClick={() => setActiveTab(item.id)}>
              <span className="nav-btn__icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar__stats">
          <div className="sidebar__stats-label">Quick Stats</div>
          {[
            { label:"Open",         val:stats.open,         color:"#f59e0b" },
            { label:"In Progress",  val:stats.progress,     color:"#38bdf8" },
            { label:"High Priority",val:stats.highPriority, color:"#ef4444" },
          ].map(s => (
            <div key={s.label} className="sidebar__stat-row">
              <span className="sidebar__stat-key">
                <span className="sidebar__stat-dot" style={{background:s.color}} />
                {s.label}
              </span>
              <span className="sidebar__stat-val">{s.val}</span>
            </div>
          ))}
          <button className="theme-btn" onClick={() => setDark(!dark)}>
            {dark ? "🌤 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main">

        {/* ── DASHBOARD ── */}
        {activeTab === "dashboard" && (
          <>
            <div className="page-header">
              <h1>Dashboard</h1>
              <p>Overview of all IT maintenance activity</p>
            </div>

            <div className="stat-grid-4">
              {[
                { label:"Total Records", val:stats.total,    icon:"⊞", color:"#6366f1" },
                { label:"Open Issues",   val:stats.open,     icon:"◉", color:"#f59e0b" },
                { label:"In Progress",   val:stats.progress, icon:"◑", color:"#38bdf8" },
                { label:"Closed",        val:stats.closed,   icon:"◎", color:"#4ade80" },
              ].map(c => (
                <div key={c.label} className="stat-card">
                  <div className="stat-card__watermark" style={{color:c.color}}>{c.icon}</div>
                  <div className="stat-card__label">{c.label}</div>
                  <div className="stat-card__value" style={{color:c.color}}>{c.val}</div>
                </div>
              ))}
            </div>

            <div className="charts-grid">
              <div className="card card--pad-lg">
                <div className="chart-card__title">Issue Status</div>
                <div className="chart-card__sub">Distribution by current status</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                      {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-legend">
                  {pieData.map((e,i) => (
                    <div key={e.name} className="chart-legend__item">
                      <span className="chart-legend__dot" style={{background:PIE_COLORS[i]}} />
                      {e.name}: <strong>{e.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card card--pad-lg">
                <div className="chart-card__title">Resolution Rate</div>
                <div className="chart-card__sub">Fixed vs unresolved issues</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} barSize={40}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:"var(--text-secondary)",fontSize:13}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill:"var(--text-secondary)",fontSize:12}} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill:"rgba(99,102,241,0.08)"}} />
                    <Bar dataKey="value" radius={[6,6,0,0]}>
                      {barData.map((_,i) => <Cell key={i} fill={i===0?"#4ade80":"#f87171"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card card--pad-lg charts-grid--full">
                <div className="chart-card__title">Recent Activity</div>
                <div className="chart-card__sub">Last 5 records</div>
                {records.length === 0
                  ? <div className="empty-state">No records yet. Add one in the Records tab.</div>
                  : records.slice(0,5).map(r => {
                      const sc = STATUS_COLORS[r.status]||{};
                      const pc = PRIORITY_COLORS[r.priority]||{};
                      return (
                        <div key={r.id} className="activity-row">
                          <span className="activity-row__dot" style={{background:sc.dot||"#94a3b8"}} />
                          <span className="activity-row__issue">{r.issue}</span>
                          <span className="activity-row__equip">{r.equipmentId}</span>
                          <span className="badge" style={{background:sc.bg,color:sc.text}}>{r.status}</span>
                          <span className="badge" style={{background:pc.bg,color:pc.text}}>{r.priority}</span>
                          <span className="activity-row__sla">{getSLA(r)}</span>
                        </div>
                      );
                    })
                }
              </div>
            </div>
          </>
        )}

        {/* ── RECORDS ── */}
        {activeTab === "records" && (
          <>
            <div className="page-header">
              <h1>Records</h1>
              <p>Log and manage all IT maintenance issues</p>
            </div>

            <div className="card card--pad-form" style={{marginBottom:24}}>
              <div className="form-title">{editingId ? "✎ Edit Record" : "+ New Record"}</div>
              <div className="form-grid">
                {[
                  {key:"date",         type:"date",  placeholder:"Date"},
                  {key:"serialNumber", type:"text",  placeholder:"Serial Number"},
                  {key:"equipmentId",  type:"text",  placeholder:"Equipment ID"},
                  {key:"issue",        type:"text",  placeholder:"Issue Description *"},
                  {key:"assignedTo",   type:"text",  placeholder:"Assigned To"},
                  {key:"comment",      type:"text",  placeholder:"Comment / Notes"},
                ].map(f => (
                  <input key={f.key} className="form-input" type={f.type} placeholder={f.placeholder}
                    value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})} />
                ))}
                {[
                  {key:"status",  options:["Open","In Progress","Closed"]},
                  {key:"priority",options:["Low","Medium","High"]},
                  {key:"fixed",   options:["Fixed","Not Fixed"]},
                ].map(sel => (
                  <select key={sel.key} className="form-select" value={form[sel.key]}
                    onChange={e => setForm({...form,[sel.key]:e.target.value})}>
                    {sel.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ))}
              </div>
              <div className="form-actions">
                <button className={`btn ${editingId?"btn--update":"btn--save"}`} onClick={saveRecord}>
                  {editingId ? "✓ Update Record" : "+ Add Record"}
                </button>
                {editingId && <button className="btn btn--cancel" onClick={cancelEdit}>Cancel</button>}
                <button className="btn btn--export" onClick={exportCSV}>↓ Export CSV</button>
              </div>
            </div>

            <div className="search-bar">
              <div className="search-bar__wrap">
                <input className="search-bar__input"
                  placeholder="🔍 Search by serial number, laptop name, or assignee…"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                {searchTerm && <button className="search-bar__clear" onClick={()=>setSearchTerm("")}>✕</button>}
              </div>
              {["All","Open","In Progress","Closed"].map(s => (
                <button key={s} className={`filter-btn${filterStatus===s?" filter-btn--active":""}`}
                  onClick={() => setFilterStatus(s)}>{s}</button>
              ))}
            </div>

            <div className="card card--overflow">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {["Date","Serial","Equip. ID","Issue","Status","Priority","Assigned","Fixed","Comment","SLA","Actions"].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length === 0
                      ? <tr><td colSpan={11} className="td--secondary" style={{padding:"32px 0",textAlign:"center"}}>No records found.</td></tr>
                      : filteredRecords.map((r,idx) => {
                          const sc = STATUS_COLORS[r.status]||{};
                          const pc = PRIORITY_COLORS[r.priority]||{};
                          const rowClass = r.priority==="High" ? "tr--high" : idx%2===0 ? "tr--even" : "tr--odd";
                          return (
                            <tr key={r.id} className={rowClass}>
                              <td className="td--secondary" style={{whiteSpace:"nowrap"}}>{r.date||"—"}</td>
                              <td className="td--mono">{highlight(r.serialNumber,searchTerm)}</td>
                              <td className="td--mono">{highlight(r.equipmentId,searchTerm)}</td>
                              <td className="td--bold">{r.issue}</td>
                              <td>
                                <span className="badge" style={{background:sc.bg,color:sc.text}}>
                                  <span className="badge__dot" style={{background:sc.dot}} />
                                  {r.status}
                                </span>
                              </td>
                              <td>
                                <span className="badge" style={{background:pc.bg,color:pc.text}}>{r.priority}</span>
                              </td>
                              <td className="td--secondary">{highlight(r.assignedTo,searchTerm)}</td>
                              <td>
                                <span className={r.fixed==="Fixed"?"fixed-yes":"fixed-no"}>
                                  {r.fixed==="Fixed"?"✓ Fixed":"✗ Not Fixed"}
                                </span>
                              </td>
                              <td className="td--truncate">{r.comment||"—"}</td>
                              <td className="td--sla">{getSLA(r)}</td>
                              <td>
                                <div className="action-btns">
                                  <button className="btn-edit" onClick={()=>{setForm(r);setEditingId(r.id);}}>Edit</button>
                                  <button className="btn-del"  onClick={()=>{setRecords(records.filter(x=>x.id!==r.id));showToast("Record deleted.","error");}}>Del</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                    }
                  </tbody>
                </table>
              </div>
              {filteredRecords.length > 0 && (
                <div className="table-footer">Showing {filteredRecords.length} of {records.length} records</div>
              )}
            </div>
          </>
        )}

        {/* ── CHECKLIST ── */}
        {activeTab === "checklist" && (
          <>
            <div className="page-header">
              <h1>Maintenance Checklist</h1>
              <p>{checklist.filter(i=>i.done).length} of {checklist.length} tasks completed across {checklistCategories.length} categories</p>
            </div>

            <div className={`card card--pad checklist-progress-card`}>
              <div className="checklist-progress-header">
                <div className="checklist-progress-title">Overall Progress</div>
                <div className="checklist-progress-pct" style={{color:checklistProgress===100?"#4ade80":"var(--accent)"}}>
                  {checklistProgress}%
                </div>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{
                  width:`${checklistProgress}%`,
                  background: checklistProgress===100 ? "#4ade80" : undefined
                }} />
              </div>
              <div className="checklist-progress-sub">{checklist.filter(i=>i.done).length} of {checklist.length} tasks completed</div>
            </div>

            <div className="checklist-categories">
              {checklistCategories.map(cat => {
                const items = checklist.map((item,idx)=>({...item,idx})).filter(i=>(i.category||"General")===cat);
                const catDone = items.filter(i=>i.done).length;
                const catPct  = Math.round((catDone/items.length)*100);
                return (
                  <div key={cat} className="cat-card">
                    <div className="cat-header">
                      <div className="cat-header__title">{cat}</div>
                      <div className="cat-header__meta">
                        <div className="cat-header__track">
                          <div className="progress-bar" style={{width:`${catPct}%`, background: catPct===100?"#4ade80":"var(--accent)"}} />
                        </div>
                        <span className={`cat-header__count${catPct===100?" cat-header__count--done":""}`}>
                          {catDone}/{items.length}
                        </span>
                      </div>
                    </div>
                    <div className="cat-tasks">
                      {items.map(item => (
                        <div key={item.idx} className={`task-row${item.done?" task-row--done":""}`}
                          onClick={() => toggleChecklist(item.idx)}>
                          <div className={`task-checkbox${item.done?" task-checkbox--done":""}`}>
                            {item.done && "✓"}
                          </div>
                          <span className={`task-label${item.done?" task-label--done":""}`}>{item.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── KPI REPORT ── */}
        {activeTab === "kpi" && (
          <div className="kpi-wrap">
            <div className="kpi-header">
              <div>
                <img src={LOGO_B64} alt="Exponent Bizolution" className="kpi-header__logo" />
                <div className="kpi-header__tag">IT Operations</div>
                <h1 className="kpi-header__title">KPI Report</h1>
                <p className="kpi-header__date">
                  {new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
                </p>
              </div>
              <button className="btn btn--primary" onClick={exportPDF}>⬇ Export PDF</button>
            </div>

            {/* 01 Records Overview */}
            <div className="kpi-section">
              <KpiSectionLabel>01 — Records Overview</KpiSectionLabel>
              <div className="stat-grid-4" style={{marginBottom:12}}>
                {[
                  {label:"Total Issues", val:kpi.total,      color:"#6366f1", icon:"⊞", sub:"All time"},
                  {label:"Open",         val:kpi.open,       color:"#f59e0b", icon:"◉", sub:`${kpi.total>0?Math.round((kpi.open/kpi.total)*100):0}% of total`},
                  {label:"In Progress",  val:kpi.inProgress, color:"#38bdf8", icon:"◑", sub:`${kpi.total>0?Math.round((kpi.inProgress/kpi.total)*100):0}% of total`},
                  {label:"Closed",       val:kpi.closed,     color:"#4ade80", icon:"◎", sub:`${kpi.closureRate}% closure rate`},
                ].map(c => (
                  <div key={c.label} className="kpi-stat-card">
                    <div className="kpi-stat-card__watermark" style={{color:c.color}}>{c.icon}</div>
                    <div className="kpi-stat-card__label">{c.label}</div>
                    <div className="kpi-stat-card__value" style={{color:c.color}}>{c.val}</div>
                    <div className="kpi-stat-card__sub">{c.sub}</div>
                  </div>
                ))}
              </div>
              <div className="stat-grid-3">
                {[
                  {label:"Resolution Rate",     val:`${kpi.resolutionRate}%`, color:"#4ade80", desc:`${kpi.fixed} of ${kpi.total} issues fixed`,             bar:kpi.resolutionRate},
                  {label:"Avg Resolution Time", val:kpi.fmtAvg||"—",          color:"#38bdf8", desc:"Based on closed records",                              bar:null},
                  {label:"High Priority Issues",val:kpi.highPriority,          color:"#f87171", desc:`${kpi.medPriority} medium · ${kpi.lowPriority} low`, bar:kpi.total>0?Math.round((kpi.highPriority/kpi.total)*100):0},
                ].map(c => (
                  <div key={c.label} className="kpi-metric-card">
                    <div className="kpi-metric-card__label">{c.label}</div>
                    <div className="kpi-metric-card__value" style={{color:c.color}}>{c.val}</div>
                    <div className="kpi-metric-card__desc">{c.desc}</div>
                    {c.bar !== null && (
                      <div className="kpi-metric-card__bar">
                        <div className="kpi-metric-card__bar-fill" style={{width:`${c.bar}%`,background:c.color}} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 02 Priority Breakdown */}
            <div className="kpi-section">
              <KpiSectionLabel>02 — Priority Breakdown</KpiSectionLabel>
              <div className="kpi-breakdown-card">
                {[
                  {label:"High",   val:kpi.highPriority, color:"#f87171"},
                  {label:"Medium", val:kpi.medPriority,  color:"#fbbf24"},
                  {label:"Low",    val:kpi.lowPriority,  color:"#4ade80"},
                ].map(p => (
                  <div key={p.label} className="kpi-breakdown-row">
                    <div className="kpi-breakdown-row__header">
                      <div className="kpi-breakdown-row__left">
                        <span className="kpi-breakdown-row__dot" style={{background:p.color}} />
                        <span className="kpi-breakdown-row__name">{p.label} Priority</span>
                      </div>
                      <div className="kpi-breakdown-row__right">
                        <span className="kpi-breakdown-row__pct">{kpi.total>0?Math.round((p.val/kpi.total)*100):0}%</span>
                        <span className="kpi-breakdown-row__val" style={{color:p.color}}>{p.val}</span>
                      </div>
                    </div>
                    <div className="kpi-breakdown-track">
                      <div className="kpi-breakdown-fill" style={{width:`${kpi.total>0?(p.val/kpi.total)*100:0}%`,background:p.color}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 03 + 04 Assignees & Equipment */}
            <div className="kpi-section kpi-two-col">
              <div>
                <KpiSectionLabel>03 — Top Assignees</KpiSectionLabel>
                <div className="kpi-list-card">
                  {kpi.topAssignees.length === 0
                    ? <div className="kpi-list-empty"><div className="kpi-list-empty__icon">👤</div>No assignee data yet</div>
                    : kpi.topAssignees.map(([name,count],i) => (
                        <div key={name} className="kpi-list-item">
                          <div className="kpi-list-item__row">
                            <div className="kpi-list-item__avatar">{name.charAt(0).toUpperCase()}</div>
                            <span className="kpi-list-item__name">{name}</span>
                            <span className="kpi-list-item__count-accent">{count}</span>
                          </div>
                          <div className="kpi-list-item__minibar">
                            <div className="kpi-list-item__minibar-fill" style={{width:`${(count/kpi.topAssignees[0][1])*100}%`,background:"var(--accent)"}} />
                          </div>
                        </div>
                      ))
                  }
                </div>
              </div>
              <div>
                <KpiSectionLabel>04 — Most Affected Equipment</KpiSectionLabel>
                <div className="kpi-list-card">
                  {kpi.topEquipment.length === 0
                    ? <div className="kpi-list-empty"><div className="kpi-list-empty__icon">💻</div>No equipment data yet</div>
                    : kpi.topEquipment.map(([id,count],i) => (
                        <div key={id} className="kpi-list-item">
                          <div className="kpi-list-item__row">
                            <div className="kpi-list-item__equip-icon">💻</div>
                            <span className="kpi-list-item__mono">{id}</span>
                            <span className="kpi-list-item__count-warning">{count}</span>
                          </div>
                          <div className="kpi-list-item__minibar">
                            <div className="kpi-list-item__minibar-fill" style={{width:`${(count/kpi.topEquipment[0][1])*100}%`,background:"#f59e0b"}} />
                          </div>
                        </div>
                      ))
                  }
                </div>
              </div>
            </div>

            {/* 05 Checklist Completion */}
            <div className="kpi-section">
              <KpiSectionLabel>05 — Checklist Completion</KpiSectionLabel>
              <div className="kpi-checklist-summary">
                <div className="kpi-checklist-summary__top">
                  <div className="kpi-checklist-summary__stats">
                    {[
                      {label:"Total Tasks", val:kpi.clTotal, color:"#6366f1"},
                      {label:"Completed",   val:kpi.clDone,  color:"#4ade80"},
                      {label:"Remaining",   val:kpi.clTotal-kpi.clDone, color:"var(--text-secondary)"},
                    ].map(c => (
                      <div key={c.label}>
                        <div className="kpi-checklist-summary__stat-label">{c.label}</div>
                        <div className="kpi-checklist-summary__stat-val" style={{color:c.color}}>{c.val}</div>
                      </div>
                    ))}
                  </div>
                  <div className="kpi-checklist-summary__pct" style={{color:kpi.clRate===100?"#4ade80":kpi.clRate>=50?"var(--accent)":"#f87171"}}>
                    {kpi.clRate}%
                  </div>
                </div>
                <div className="kpi-checklist-summary__track">
                  <div className="kpi-checklist-summary__fill" style={{
                    width:`${kpi.clRate}%`,
                    background: kpi.clRate===100 ? "#4ade80" : "linear-gradient(90deg,var(--accent),#38bdf8)"
                  }} />
                </div>
                <div className="kpi-checklist-summary__note">
                  {kpi.clDone} of {kpi.clTotal} tasks completed across {checklistCategories.length} categories
                </div>
              </div>

              <div className="kpi-cat-grid">
                {kpi.catProgress.map(({cat,done,total,pct}) => (
                  <div key={cat} className={`kpi-cat-item${pct===100?" kpi-cat-item--done":""}`}>
                    <div className="kpi-cat-item__header">
                      <span className="kpi-cat-item__name">{cat}</span>
                      <span className={`kpi-cat-item__pct${pct===100?" kpi-cat-item__pct--done":" kpi-cat-item__pct--pending"}`}>{pct}%</span>
                    </div>
                    <div className="kpi-cat-item__track">
                      <div className="kpi-cat-item__fill" style={{width:`${pct}%`,background:pct===100?"#4ade80":"var(--accent)"}} />
                    </div>
                    <div className="kpi-cat-item__sub">{done} of {total} tasks</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 06 Open Issues */}
            {kpi.open > 0 && (
              <div className="kpi-section">
                <KpiSectionLabel>06 — Open Issues Requiring Attention</KpiSectionLabel>
                <div className="kpi-table-card">
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead className="kpi-table-head">
                      <tr>{["Issue","Equipment ID","Priority","Assigned To","Open For"].map(h=><th key={h} className="kpi-th">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {records.filter(r=>r.status==="Open").map((r,i,arr) => {
                        const pc = PRIORITY_COLORS[r.priority]||{};
                        return (
                          <tr key={r.id} style={{borderBottom:i<arr.length-1?"1px solid var(--surface-border)":"none",transition:"background 0.15s"}}
                            onMouseEnter={e=>e.currentTarget.style.background="var(--row-hover-bg)"}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            <td className="kpi-td-issue">{r.issue}</td>
                            <td className="kpi-td-mono">{r.equipmentId||"—"}</td>
                            <td className="kpi-td"><span className="badge" style={{background:pc.bg,color:pc.text}}>{r.priority}</span></td>
                            <td className="kpi-td">{r.assignedTo||"—"}</td>
                            <td className="kpi-td-sla">{getSLA(r)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}