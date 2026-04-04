import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from "recharts";

const STORAGE_KEY = "it_tracker_final";

const checklistDefault = [
  { task: "Check system performance", done: false },
  { task: "Run antivirus scan", done: false },
  { task: "Verify backups", done: false },
  { task: "Check network connectivity", done: false },
  { task: "Inspect hardware condition", done: false }
];

const PIE_COLORS = ["#f59e0b", "#38bdf8", "#4ade80"];
const STATUS_COLORS = {
  Open: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  "In Progress": { bg: "#e0f2fe", text: "#0c4a6e", dot: "#38bdf8" },
  Closed: { bg: "#dcfce7", text: "#14532d", dot: "#4ade80" },
};
const PRIORITY_COLORS = {
  Low: { bg: "#f0fdf4", text: "#15803d" },
  Medium: { bg: "#fefce8", text: "#a16207" },
  High: { bg: "#fff1f2", text: "#be123c" },
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(15,23,42,0.92)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: "8px 14px",
        color: "#f8fafc",
        fontSize: 13,
        fontFamily: "inherit",
        backdropFilter: "blur(10px)"
      }}>
        <strong>{payload[0].name}</strong>: {payload[0].value}
      </div>
    );
  }
  return null;
};

export default function App() {
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).records || [] : [];
    } catch { return []; }
  });

  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).checklist || checklistDefault : checklistDefault;
    } catch { return checklistDefault; }
  });

  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).dark ?? true : true;
    } catch { return true; }
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [form, setForm] = useState({
    date: "", serialNumber: "", equipmentId: "", issue: "",
    status: "Open", priority: "Medium", assignedTo: "",
    fixed: "Not Fixed", comment: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ records, checklist, dark }));
  }, [records, checklist, dark]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const saveRecord = () => {
    if (!form.issue.trim()) {
      showToast("Issue description is required.", "error");
      return;
    }
    const now = new Date().toISOString();
    if (editingId) {
      const existing = records.find(r => r.id === editingId);
      const updated = {
        ...existing, ...form, id: editingId,
        createdAt: existing.createdAt,
        closedAt: form.status === "Closed" ? existing.closedAt || now : null
      };
      setRecords(records.map(r => r.id === editingId ? updated : r));
      setEditingId(null);
      showToast("Record updated successfully.");
    } else {
      const newRecord = {
        ...form, id: Date.now(), createdAt: now,
        closedAt: form.status === "Closed" ? now : null
      };
      setRecords(prev => [newRecord, ...prev]);
      showToast("Record added successfully.");
    }
    setForm({ date: "", serialNumber: "", equipmentId: "", issue: "", status: "Open", priority: "Medium", assignedTo: "", fixed: "Not Fixed", comment: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ date: "", serialNumber: "", equipmentId: "", issue: "", status: "Open", priority: "Medium", assignedTo: "", fixed: "Not Fixed", comment: "" });
  };

  const getSLA = (r) => {
    if (!r.createdAt) return "—";
    const start = new Date(r.createdAt);
    const end = r.closedAt ? new Date(r.closedAt) : new Date();
    const mins = Math.floor((end - start) / 60000);
    if (mins < 60) return `${mins}m`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${Math.floor(mins / 1440)}d ${Math.floor((mins % 1440) / 60)}h`;
  };

  const stats = useMemo(() => ({
    total: records.length,
    open: records.filter(r => r.status === "Open").length,
    closed: records.filter(r => r.status === "Closed").length,
    progress: records.filter(r => r.status === "In Progress").length,
    fixed: records.filter(r => r.fixed === "Fixed").length,
    notFixed: records.filter(r => r.fixed === "Not Fixed").length,
    highPriority: records.filter(r => r.priority === "High").length,
  }), [records]);

  const pieData = [
    { name: "Open", value: stats.open },
    { name: "In Progress", value: stats.progress },
    { name: "Closed", value: stats.closed }
  ];

  const barData = [
    { name: "Fixed", value: stats.fixed },
    { name: "Not Fixed", value: stats.notFixed }
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch = searchTerm === "" ||
        [r.issue, r.serialNumber, r.equipmentId, r.assignedTo, r.comment]
          .some(v => v?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = filterStatus === "All" || r.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [records, searchTerm, filterStatus]);

  const exportCSV = () => {
    const headers = ["Date","Serial Number","Equipment ID","Issue","Status","Priority","Assigned To","Fixed","Comment","SLA"];
    const rows = records.map(r =>
      [r.date, r.serialNumber, r.equipmentId, r.issue, r.status, r.priority, r.assignedTo, r.fixed, r.comment, getSLA(r)]
        .map(val => `"${val ?? ""}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "it_tracker.csv";
    link.click();
    showToast("CSV exported successfully.");
  };

  const toggleChecklist = (i) => {
    const updated = [...checklist];
    updated[i].done = !updated[i].done;
    setChecklist(updated);
  };

  const checklistProgress = Math.round((checklist.filter(i => i.done).length / checklist.length) * 100);

  const d = dark;
  const bg = d ? "#0a0f1e" : "#f0f4f8";
  const surface = d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const surfaceBorder = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const cardBg = d ? "rgba(255,255,255,0.05)" : "#ffffff";
  const cardBorder = d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.09)";
  const textPrimary = d ? "#f1f5f9" : "#0f172a";
  const textSecondary = d ? "#94a3b8" : "#64748b";
  const inputBg = d ? "rgba(255,255,255,0.07)" : "#ffffff";
  const inputBorder = d ? "rgba(255,255,255,0.12)" : "#cbd5e1";
  const tableBg = d ? "rgba(255,255,255,0.03)" : "#f8fafc";
  const tableHeadBg = d ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const accent = "#6366f1";

  const navItems = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "records", icon: "⊞", label: "Records" },
    { id: "checklist", icon: "◻", label: "Checklist" },
  ];

  return (
    <div style={{
      display: "flex", minHeight: "100vh", background: bg,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: textPrimary, transition: "background 0.3s, color 0.3s",
      position: "relative", overflow: "hidden"
    }}>
      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: d
          ? "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(56,189,248,0.05) 0%, transparent 50%)"
          : "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.04) 0%, transparent 50%)",
        pointerEvents: "none"
      }} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          background: toast.type === "error" ? "#ef4444" : "#22c55e",
          color: "#fff", padding: "12px 20px", borderRadius: 10,
          fontWeight: 600, fontSize: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          animation: "slideIn 0.3s ease"
        }}>
          {toast.type === "error" ? "✕ " : "✓ "}{toast.msg}
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{
        width: 220, flexShrink: 0, padding: "28px 16px",
        background: d ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        borderRight: `1px solid ${surfaceBorder}`,
        display: "flex", flexDirection: "column", gap: 6,
        position: "relative", zIndex: 10
      }}>
        {/* Logo area */}
        <div style={{ padding: "0 8px 24px", borderBottom: `1px solid ${surfaceBorder}` }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
            color: accent, textTransform: "uppercase", marginBottom: 4
          }}>IT Operations</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: textPrimary, lineHeight: 1.2 }}>
            Maintenance<br/>Tracker
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: textSecondary }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, paddingTop: 12 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              background: activeTab === item.id
                ? (d ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.1)")
                : "transparent",
              color: activeTab === item.id ? accent : textSecondary,
              fontWeight: activeTab === item.id ? 700 : 500,
              fontSize: 14, transition: "all 0.2s", textAlign: "left",
              borderLeft: activeTab === item.id ? `3px solid ${accent}` : "3px solid transparent",
            }}>
              <span style={{ fontSize: 16, opacity: 0.9 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Quick stats at bottom of sidebar */}
        <div style={{
          borderTop: `1px solid ${surfaceBorder}`, paddingTop: 16,
          display: "flex", flexDirection: "column", gap: 8
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: textSecondary, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
            Quick Stats
          </div>
          {[
            { label: "Open", val: stats.open, color: "#f59e0b" },
            { label: "In Progress", val: stats.progress, color: "#38bdf8" },
            { label: "High Priority", val: stats.highPriority, color: "#ef4444" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
              <span style={{ color: textSecondary, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block" }} />
                {s.label}
              </span>
              <span style={{ fontWeight: 700, color: textPrimary }}>{s.val}</span>
            </div>
          ))}

          {/* Dark mode toggle */}
          <button onClick={() => setDark(!dark)} style={{
            marginTop: 10, padding: "9px 14px", borderRadius: 10, border: `1px solid ${surfaceBorder}`,
            background: inputBg, color: textSecondary, cursor: "pointer", fontSize: 13, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
          }}>
            {dark ? "🌤 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "32px 36px", overflowX: "auto", position: "relative", zIndex: 1 }}>

        {/* ── DASHBOARD ── */}
        {activeTab === "dashboard" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: textPrimary }}>Dashboard</h1>
              <p style={{ margin: "4px 0 0", color: textSecondary, fontSize: 14 }}>
                Overview of all IT maintenance activity
              </p>
            </div>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total Records", val: stats.total, icon: "⊞", color: "#6366f1" },
                { label: "Open Issues", val: stats.open, icon: "◉", color: "#f59e0b" },
                { label: "In Progress", val: stats.progress, icon: "◑", color: "#38bdf8" },
                { label: "Closed", val: stats.closed, icon: "◎", color: "#4ade80" },
              ].map(c => (
                <div key={c.label} style={{
                  background: cardBg, border: `1px solid ${cardBorder}`,
                  borderRadius: 16, padding: "20px 22px",
                  boxShadow: d ? "0 4px 24px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "transform 0.2s", cursor: "default",
                  position: "relative", overflow: "hidden"
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{
                    position: "absolute", top: -12, right: -12, fontSize: 64,
                    opacity: 0.06, color: c.color, fontWeight: 900, pointerEvents: "none"
                  }}>{c.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: textSecondary, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: c.color, marginTop: 6, lineHeight: 1 }}>
                    {c.val}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Pie */}
              <div style={{
                background: cardBg, border: `1px solid ${cardBorder}`,
                borderRadius: 16, padding: "22px 24px",
                boxShadow: d ? "0 4px 24px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.06)"
              }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: textPrimary }}>Issue Status</div>
                <div style={{ fontSize: 12, color: textSecondary, marginBottom: 16 }}>Distribution by current status</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
                  {pieData.map((entry, i) => (
                    <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: textSecondary }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[i], display: "inline-block" }} />
                      {entry.name}: <strong style={{ color: textPrimary }}>{entry.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar */}
              <div style={{
                background: cardBg, border: `1px solid ${cardBorder}`,
                borderRadius: 16, padding: "22px 24px",
                boxShadow: d ? "0 4px 24px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.06)"
              }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: textPrimary }}>Resolution Rate</div>
                <div style={{ fontSize: 12, color: textSecondary, marginBottom: 16 }}>Fixed vs unresolved issues</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} barSize={40}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textSecondary, fontSize: 13 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: textSecondary, fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#4ade80" : "#f87171"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent activity */}
              <div style={{
                gridColumn: "1 / -1",
                background: cardBg, border: `1px solid ${cardBorder}`,
                borderRadius: 16, padding: "22px 24px",
                boxShadow: d ? "0 4px 24px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.06)"
              }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: textPrimary }}>Recent Activity</div>
                <div style={{ fontSize: 12, color: textSecondary, marginBottom: 16 }}>Last 5 records</div>
                {records.length === 0 ? (
                  <div style={{ textAlign: "center", color: textSecondary, padding: "24px 0", fontSize: 14 }}>
                    No records yet. Add one in the Records tab.
                  </div>
                ) : (
                  records.slice(0, 5).map(r => {
                    const sc = STATUS_COLORS[r.status] || {};
                    const pc = PRIORITY_COLORS[r.priority] || {};
                    return (
                      <div key={r.id} style={{
                        display: "flex", alignItems: "center", gap: 16,
                        padding: "12px 0", borderBottom: `1px solid ${surfaceBorder}`,
                        fontSize: 14
                      }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: sc.dot || "#94a3b8", flexShrink: 0
                        }} />
                        <span style={{ flex: 1, fontWeight: 600, color: textPrimary }}>{r.issue}</span>
                        <span style={{ color: textSecondary, fontSize: 12 }}>{r.equipmentId}</span>
                        <span style={{
                          padding: "2px 10px", borderRadius: 20,
                          background: sc.bg, color: sc.text, fontSize: 11, fontWeight: 700
                        }}>{r.status}</span>
                        <span style={{
                          padding: "2px 10px", borderRadius: 20,
                          background: pc.bg, color: pc.text, fontSize: 11, fontWeight: 700
                        }}>{r.priority}</span>
                        <span style={{ color: textSecondary, fontSize: 12, minWidth: 60, textAlign: "right" }}>
                          {getSLA(r)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

        {/* ── RECORDS ── */}
        {activeTab === "records" && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: textPrimary }}>Records</h1>
              <p style={{ margin: "4px 0 0", color: textSecondary, fontSize: 14 }}>
                Log and manage all IT maintenance issues
              </p>
            </div>

            {/* Form card */}
            <div style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: 16, padding: "24px 26px", marginBottom: 24,
              boxShadow: d ? "0 4px 24px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.06)"
            }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: textPrimary, marginBottom: 16 }}>
                {editingId ? "✎ Edit Record" : "+ New Record"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { key: "date", type: "date", placeholder: "Date" },
                  { key: "serialNumber", type: "text", placeholder: "Serial Number" },
                  { key: "equipmentId", type: "text", placeholder: "Equipment ID" },
                  { key: "issue", type: "text", placeholder: "Issue Description *" },
                  { key: "assignedTo", type: "text", placeholder: "Assigned To" },
                  { key: "comment", type: "text", placeholder: "Comment / Notes" },
                ].map(f => (
                  <input key={f.key} type={f.type} placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{
                      background: inputBg, border: `1px solid ${inputBorder}`,
                      borderRadius: 8, padding: "10px 14px", fontSize: 14,
                      color: textPrimary, outline: "none", transition: "border-color 0.2s",
                      fontFamily: "inherit"
                    }}
                    onFocus={e => e.target.style.borderColor = accent}
                    onBlur={e => e.target.style.borderColor = inputBorder}
                  />
                ))}
                {[
                  { key: "status", options: ["Open", "In Progress", "Closed"] },
                  { key: "priority", options: ["Low", "Medium", "High"] },
                  { key: "fixed", options: ["Fixed", "Not Fixed"] },
                ].map(sel => (
                  <select key={sel.key} value={form[sel.key]}
                    onChange={e => setForm({ ...form, [sel.key]: e.target.value })}
                    style={{
                      background: inputBg, border: `1px solid ${inputBorder}`,
                      borderRadius: 8, padding: "10px 14px", fontSize: 14,
                      color: textPrimary, outline: "none", cursor: "pointer",
                      fontFamily: "inherit"
                    }}>
                    {sel.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={saveRecord} style={{
                  padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: editingId ? "#6366f1" : "#22c55e", color: "#fff",
                  fontWeight: 700, fontSize: 14, fontFamily: "inherit",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "all 0.2s"
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  {editingId ? "✓ Update Record" : "+ Add Record"}
                </button>
                {editingId && (
                  <button onClick={cancelEdit} style={{
                    padding: "10px 18px", borderRadius: 8, border: `1px solid ${inputBorder}`,
                    background: "transparent", color: textSecondary,
                    fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit"
                  }}>Cancel</button>
                )}
                <button onClick={exportCSV} style={{
                  marginLeft: "auto", padding: "10px 20px", borderRadius: 8,
                  border: `1px solid ${inputBorder}`, background: "transparent",
                  color: textSecondary, fontWeight: 600, fontSize: 14, cursor: "pointer",
                  fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8,
                  transition: "all 0.2s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = inputBg; e.currentTarget.style.color = textPrimary; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = textSecondary; }}
                >
                  ↓ Export CSV
                </button>
              </div>
            </div>

            {/* Search & filter */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <input placeholder="🔍 Search records..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  flex: 1, background: inputBg, border: `1px solid ${inputBorder}`,
                  borderRadius: 8, padding: "9px 14px", fontSize: 14, color: textPrimary,
                  outline: "none", fontFamily: "inherit"
                }}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = inputBorder}
              />
              {["All", "Open", "In Progress", "Closed"].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{
                  padding: "9px 16px", borderRadius: 8, border: `1px solid ${inputBorder}`,
                  background: filterStatus === s ? accent : inputBg,
                  color: filterStatus === s ? "#fff" : textSecondary,
                  fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.2s"
                }}>{s}</button>
              ))}
            </div>

            {/* Table */}
            <div style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: 16, overflow: "hidden",
              boxShadow: d ? "0 4px 24px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.06)"
            }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: tableHeadBg }}>
                      {["Date","Serial","Equip. ID","Issue","Status","Priority","Assigned","Fixed","Comment","SLA","Actions"]
                        .map(h => (
                          <th key={h} style={{
                            padding: "12px 14px", textAlign: "left", fontWeight: 700,
                            color: textSecondary, fontSize: 11, textTransform: "uppercase",
                            letterSpacing: "0.07em", whiteSpace: "nowrap",
                            borderBottom: `1px solid ${surfaceBorder}`
                          }}>{h}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={11} style={{ padding: "32px 0", textAlign: "center", color: textSecondary }}>
                          No records found.
                        </td>
                      </tr>
                    ) : filteredRecords.map((r, idx) => {
                      const sc = STATUS_COLORS[r.status] || {};
                      const pc = PRIORITY_COLORS[r.priority] || {};
                      return (
                        <tr key={r.id} style={{
                          borderBottom: `1px solid ${surfaceBorder}`,
                          background: r.priority === "High"
                            ? (d ? "rgba(239,68,68,0.07)" : "rgba(239,68,68,0.04)")
                            : idx % 2 === 0 ? "transparent" : tableBg,
                          transition: "background 0.15s"
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = d ? "rgba(255,255,255,0.04)" : "rgba(99,102,241,0.04)"}
                          onMouseLeave={e => e.currentTarget.style.background = r.priority === "High"
                            ? (d ? "rgba(239,68,68,0.07)" : "rgba(239,68,68,0.04)")
                            : idx % 2 === 0 ? "transparent" : tableBg}
                        >
                          <td style={{ padding: "11px 14px", color: textSecondary, whiteSpace: "nowrap" }}>{r.date || "—"}</td>
                          <td style={{ padding: "11px 14px", color: textPrimary, fontFamily: "monospace", fontSize: 12 }}>{r.serialNumber || "—"}</td>
                          <td style={{ padding: "11px 14px", color: textPrimary, fontFamily: "monospace", fontSize: 12 }}>{r.equipmentId || "—"}</td>
                          <td style={{ padding: "11px 14px", color: textPrimary, fontWeight: 600, maxWidth: 200 }}>{r.issue}</td>
                          <td style={{ padding: "11px 14px" }}>
                            <span style={{
                              padding: "3px 10px", borderRadius: 20,
                              background: sc.bg, color: sc.text, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                              display: "inline-flex", alignItems: "center", gap: 5
                            }}>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot }} />
                              {r.status}
                            </span>
                          </td>
                          <td style={{ padding: "11px 14px" }}>
                            <span style={{
                              padding: "3px 10px", borderRadius: 20,
                              background: pc.bg, color: pc.text, fontSize: 11, fontWeight: 700
                            }}>{r.priority}</span>
                          </td>
                          <td style={{ padding: "11px 14px", color: textSecondary }}>{r.assignedTo || "—"}</td>
                          <td style={{ padding: "11px 14px" }}>
                            <span style={{
                              color: r.fixed === "Fixed" ? "#22c55e" : "#f87171",
                              fontWeight: 700, fontSize: 12
                            }}>
                              {r.fixed === "Fixed" ? "✓ Fixed" : "✗ Not Fixed"}
                            </span>
                          </td>
                          <td style={{ padding: "11px 14px", color: textSecondary, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {r.comment || "—"}
                          </td>
                          <td style={{ padding: "11px 14px", color: textSecondary, fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap" }}>{getSLA(r)}</td>
                          <td style={{ padding: "11px 14px" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => { setForm(r); setEditingId(r.id); }} style={{
                                padding: "5px 12px", borderRadius: 6, border: "none",
                                background: d ? "rgba(99,102,241,0.2)" : "#e0e7ff",
                                color: "#6366f1", fontWeight: 700, fontSize: 12,
                                cursor: "pointer", fontFamily: "inherit"
                              }}>Edit</button>
                              <button onClick={() => {
                                setRecords(records.filter(x => x.id !== r.id));
                                showToast("Record deleted.", "error");
                              }} style={{
                                padding: "5px 12px", borderRadius: 6, border: "none",
                                background: d ? "rgba(239,68,68,0.15)" : "#fee2e2",
                                color: "#ef4444", fontWeight: 700, fontSize: 12,
                                cursor: "pointer", fontFamily: "inherit"
                              }}>Del</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredRecords.length > 0 && (
                <div style={{
                  padding: "10px 16px", borderTop: `1px solid ${surfaceBorder}`,
                  fontSize: 12, color: textSecondary
                }}>
                  Showing {filteredRecords.length} of {records.length} records
                </div>
              )}
            </div>
          </>
        )}

        {/* ── CHECKLIST ── */}
        {activeTab === "checklist" && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: textPrimary }}>Maintenance Checklist</h1>
              <p style={{ margin: "4px 0 0", color: textSecondary, fontSize: 14 }}>
                Daily / weekly routine tasks
              </p>
            </div>

            {/* Progress bar */}
            <div style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: 16, padding: "22px 26px", marginBottom: 24,
              boxShadow: d ? "0 4px 24px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.06)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: textPrimary }}>Overall Progress</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: checklistProgress === 100 ? "#4ade80" : accent }}>
                  {checklistProgress}%
                </div>
              </div>
              <div style={{ height: 10, background: d ? "rgba(255,255,255,0.1)" : "#e2e8f0", borderRadius: 999 }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  width: `${checklistProgress}%`,
                  background: checklistProgress === 100 ? "#4ade80" : `linear-gradient(90deg, ${accent}, #38bdf8)`,
                  transition: "width 0.4s ease"
                }} />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: textSecondary }}>
                {checklist.filter(i => i.done).length} of {checklist.length} tasks completed
              </div>
            </div>

            {/* Tasks */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {checklist.map((item, i) => (
                <div key={i} onClick={() => toggleChecklist(i)} style={{
                  background: cardBg, border: `1px solid ${item.done ? (d ? "rgba(74,222,128,0.3)" : "rgba(74,222,128,0.4)") : cardBorder}`,
                  borderRadius: 12, padding: "16px 20px",
                  display: "flex", alignItems: "center", gap: 14,
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: d ? "0 2px 12px rgba(0,0,0,0.15)" : "0 1px 6px rgba(0,0,0,0.05)",
                  opacity: item.done ? 0.75 : 1
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    border: `2px solid ${item.done ? "#4ade80" : (d ? "rgba(255,255,255,0.2)" : "#cbd5e1")}`,
                    background: item.done ? "#4ade80" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s", color: "#fff", fontSize: 13, fontWeight: 900
                  }}>
                    {item.done && "✓"}
                  </div>
                  <span style={{
                    fontSize: 15, fontWeight: 600, color: textPrimary,
                    textDecoration: item.done ? "line-through" : "none",
                    flex: 1
                  }}>{item.task}</span>
                  {item.done && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: "#4ade80",
                      background: d ? "rgba(74,222,128,0.1)" : "rgba(74,222,128,0.12)",
                      padding: "3px 10px", borderRadius: 20
                    }}>Done</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        * { box-sizing: border-box; }
        input::placeholder { color: #94a3b8; }
        select option { background: #1e293b; color: #f1f5f9; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}
