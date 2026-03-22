// AssignmentTracker.js  ─  CampusFlow
import { useState } from "react";

const SUBJECTS = ["Data Structures", "Operating Systems", "DBMS", "Computer Networks", "Maths IV", "Software Engg", "Other"];
const STATUSES = ["Pending", "In Progress", "Done", "Submitted"];
const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];

const URGENCY_META = {
  Low:      { bg: "rgba(16,185,129,0.10)",  color: "#10b981", border: "rgba(16,185,129,0.25)",  icon: "🟢" },
  Medium:   { bg: "rgba(245,158,11,0.10)",  color: "#f59e0b", border: "rgba(245,158,11,0.25)",  icon: "🟡" },
  High:     { bg: "rgba(239,68,68,0.10)",   color: "#ef4444", border: "rgba(239,68,68,0.25)",   icon: "🔴" },
  Critical: { bg: "rgba(239,68,68,0.18)",   color: "#fca5a5", border: "rgba(239,68,68,0.45)",   icon: "🚨" },
};

const STATUS_META = {
  Pending:     { bg: "rgba(107,114,128,0.12)", color: "#9ca3af", border: "rgba(107,114,128,0.25)" },
  "In Progress":{ bg: "rgba(6,182,212,0.12)",  color: "#06b6d4", border: "rgba(6,182,212,0.25)"  },
  Done:        { bg: "rgba(16,185,129,0.12)",  color: "#10b981", border: "rgba(16,185,129,0.25)" },
  Submitted:   { bg: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "rgba(167,139,250,0.25)"},
};

const SUBJ_COLORS = {
  "Data Structures": "#06b6d4", "Operating Systems": "#a78bfa", "DBMS": "#f59e0b",
  "Computer Networks": "#10b981", "Maths IV": "#e879f9", "Software Engg": "#f97316", Other: "#9ca3af",
};

const NOW = Date.now();

const parseDeadline = (str) => new Date(str).getTime();
const daysLeft = (str) => {
  const diff = parseDeadline(str) - NOW;
  return Math.ceil(diff / 86400000);
};

const INIT_DATA = [
  { id: 1, subject: "Data Structures",   title: "AVL Tree Implementation",      deadline: "2025-03-25T23:59", weightage: 20, status: "In Progress", urgency: "Critical", notes: "Submit .cpp + report. Prof wants both iterative & recursive." },
  { id: 2, subject: "Operating Systems", title: "Process Scheduling Report",     deadline: "2025-03-26T17:00", weightage: 15, status: "Pending",     urgency: "High",     notes: "Compare FCFS, SJF, Round Robin with examples." },
  { id: 3, subject: "DBMS",              title: "ER Diagram Assignment",         deadline: "2025-03-28T23:59", weightage: 10, status: "Done",         urgency: "Low",      notes: "Done. Need to cross-check normalization part." },
  { id: 4, subject: "Computer Networks", title: "TCP/IP Protocol Analysis",      deadline: "2025-03-30T17:00", weightage: 25, status: "Pending",     urgency: "Medium",   notes: "Wireshark capture required. Borrow lab slot." },
  { id: 5, subject: "Maths IV",          title: "Fourier Series Problems",       deadline: "2025-04-01T23:59", weightage: 10, status: "Pending",     urgency: "Low",      notes: "" },
  { id: 6, subject: "Software Engg",     title: "UML Diagrams - Case Study",     deadline: "2025-03-23T17:00", weightage: 30, status: "Pending",     urgency: "Critical", notes: "OVERDUE! Submit ASAP to avoid 0." },
  { id: 7, subject: "DBMS",              title: "SQL Lab Assignment",            deadline: "2025-04-05T23:59", weightage: 15, status: "Submitted",   urgency: "Low",      notes: "Submitted on time." },
];

/* ── Burndown Chart (SVG) ── */
function BurndownChart({ assignments }) {
  const done = assignments.filter(a => ["Done","Submitted"].includes(a.status)).length;
  const total = assignments.length;
  const days = 14;

  // Simulated burndown: ideal vs actual
  const points = Array.from({ length: days + 1 }, (_, i) => {
    const ideal = total - (total / days) * i;
    const actual = i <= 7 ? total - i * 0.3 : total - i * 0.9;
    return { i, ideal: Math.max(0, ideal), actual: Math.max(done, actual) };
  });

  const W = 320, H = 120;
  const px = (i) => (i / days) * (W - 20) + 10;
  const py = (v) => H - 10 - (v / total) * (H - 20);

  const idealPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.i)} ${py(p.ideal)}`).join(" ");
  const actualPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.i)} ${py(p.actual)}`).join(" ");

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Burndown Chart</p>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((lv, i) => (
          <line key={i} x1="10" y1={py(lv * total)} x2={W - 10} y2={py(lv * total)}
            stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
        ))}
        {/* Ideal */}
        <path d={idealPath} fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* Actual */}
        <path d={actualPath} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        {/* Labels */}
        <text x="10" y={py(total) - 4} fill="rgba(255,255,255,0.25)" fontSize="7">Total: {total}</text>
        <text x="10" y={py(0) + 10} fill="rgba(255,255,255,0.25)" fontSize="7">0</text>
      </svg>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-[2px] rounded" style={{ background: "rgba(255,255,255,0.25)", backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,0.25) 0,rgba(255,255,255,0.25) 4px,transparent 4px,transparent 7px)" }} />
          <span className="text-[10px] text-white/30">Ideal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-[2px] rounded" style={{ background: "#f59e0b" }} />
          <span className="text-[10px] text-white/30">Actual</span>
        </div>
      </div>
    </div>
  );
}

/* ── Modal ── */
function Modal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item || { subject: "Data Structures", title: "", deadline: "", weightage: 10, status: "Pending", urgency: "Medium", notes: "" });
  const isNew = !item?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-6" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }} />
      <div className="relative w-full max-w-lg rounded-3xl p-7 slide-in my-auto"
        style={{ background: "rgba(8,2,20,0.97)", border: "0.5px solid rgba(245,158,11,0.28)", boxShadow: "0 32px 80px rgba(245,158,11,0.08)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Syne',sans-serif" }}>
            {isNew ? "Add Assignment" : "Edit Assignment"}
          </h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Subject</label>
              <select className="auth-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ background: "rgba(255,255,255,0.04)" }}>
                {SUBJECTS.map(s => <option key={s} value={s} style={{ background: "#0a0218" }}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Status</label>
              <select className="auth-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ background: "rgba(255,255,255,0.04)" }}>
                {STATUSES.map(s => <option key={s} value={s} style={{ background: "#0a0218" }}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Assignment Title</label>
            <input className="auth-input" placeholder="e.g. AVL Tree Implementation" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Deadline</label>
              <input className="auth-input" type="datetime-local" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">
                Weightage — <span style={{ color: "#f59e0b" }}>{form.weightage}%</span>
              </label>
              <input type="range" min="1" max="100" value={form.weightage}
                onChange={e => setForm({ ...form, weightage: Number(e.target.value) })}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer mt-3"
                style={{ accentColor: "#f59e0b" }} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-2">Urgency</label>
            <div className="flex gap-2 flex-wrap">
              {URGENCY_LEVELS.map(u => {
                const m = URGENCY_META[u];
                return (
                  <button key={u} onClick={() => setForm({ ...form, urgency: u })}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
                    style={{
                      background: form.urgency === u ? m.bg : "rgba(255,255,255,0.04)",
                      color: form.urgency === u ? m.color : "rgba(255,255,255,0.35)",
                      border: `0.5px solid ${form.urgency === u ? m.border : "rgba(255,255,255,0.08)"}`,
                    }}>
                    {m.icon} {u}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Notes</label>
            <textarea className="auth-input resize-none" rows={2} placeholder="Submission instructions, tips..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/40 hover:bg-white/5 transition-all" style={{ border: "0.5px solid rgba(255,255,255,0.10)" }}>Cancel</button>
          <button onClick={() => { if (form.title.trim()) { onSave(form); onClose(); } }}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:-translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 6px 20px rgba(245,158,11,0.28)" }}>
            {isNew ? "Add Assignment →" : "Save →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function AssignmentTracker() {
  const [assignments, setAssignments] = useState(INIT_DATA);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const saveAssignment = (form) => {
    if (form.id) setAssignments(assignments.map(a => a.id === form.id ? form : a));
    else setAssignments([{ ...form, id: Date.now() }, ...assignments]);
  };
  const deleteAssignment = (id) => setAssignments(assignments.filter(a => a.id !== id));
  const toggleStatus = (id) => {
    setAssignments(assignments.map(a => {
      if (a.id !== id) return a;
      const next = { Pending: "In Progress", "In Progress": "Done", Done: "Submitted", Submitted: "Pending" };
      return { ...a, status: next[a.status] || "Pending" };
    }));
  };

  const overdue = assignments.filter(a => !["Done","Submitted"].includes(a.status) && daysLeft(a.deadline) < 0);
  const dueToday = assignments.filter(a => !["Done","Submitted"].includes(a.status) && daysLeft(a.deadline) === 0);
  const done = assignments.filter(a => ["Done","Submitted"].includes(a.status));
  const completionRate = assignments.length ? Math.round((done.length / assignments.length) * 100) : 0;

  const filtered = assignments.filter(a => {
    const ms = a.title.toLowerCase().includes(search.toLowerCase()) || a.subject.toLowerCase().includes(search.toLowerCase());
    const mf = filter === "All" ? true
      : filter === "Overdue" ? (daysLeft(a.deadline) < 0 && !["Done","Submitted"].includes(a.status))
      : filter === "Today" ? daysLeft(a.deadline) === 0
      : a.status === filter;
    return ms && mf;
  });

  // Subject breakdown for bar chart
  const subjectGroups = {};
  assignments.forEach(a => {
    if (!subjectGroups[a.subject]) subjectGroups[a.subject] = { total: 0, done: 0 };
    subjectGroups[a.subject].total++;
    if (["Done","Submitted"].includes(a.status)) subjectGroups[a.subject].done++;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-[10px] font-bold tracking-widest uppercase text-amber-300 bg-amber-500/10 border border-amber-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" style={{ animation: "pulse2 2s infinite" }} />
          Assignment Tracker
        </div>
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
          Deadlines <span className="shimmer">Command Center</span>
        </h1>
        <p className="text-sm text-white/35">Zero missed deadlines. Every submission, on time.</p>
      </div>

      {/* Alert banners */}
      {overdue.length > 0 && (
        <div className="mb-4 flex items-start gap-3 px-5 py-4 rounded-2xl"
          style={{ background: "rgba(239,68,68,0.08)", border: "0.5px solid rgba(239,68,68,0.35)" }}>
          <span className="text-xl flex-shrink-0">🚨</span>
          <div>
            <div className="text-sm font-bold text-red-400 mb-1">Overdue Alert — {overdue.length} assignment{overdue.length > 1 ? "s" : ""} past deadline!</div>
            <div className="text-[12px] text-white/45">{overdue.map(a => a.title).join(" · ")}</div>
          </div>
        </div>
      )}
      {dueToday.length > 0 && (
        <div className="mb-4 flex items-start gap-3 px-5 py-4 rounded-2xl"
          style={{ background: "rgba(245,158,11,0.07)", border: "0.5px solid rgba(245,158,11,0.30)" }}>
          <span className="text-xl flex-shrink-0">⏰</span>
          <div>
            <div className="text-sm font-bold text-amber-400 mb-1">Due Today — {dueToday.length} assignment{dueToday.length > 1 ? "s" : ""} due today!</div>
            <div className="text-[12px] text-white/45">{dueToday.map(a => a.title).join(" · ")}</div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Completion Rate", val: `${completionRate}%`, accent: "#10b981", icon: "✅" },
          { label: "Overdue", val: overdue.length, accent: "#ef4444", icon: "🚨" },
          { label: "Due This Week", val: assignments.filter(a => !["Done","Submitted"].includes(a.status) && daysLeft(a.deadline) <= 7 && daysLeft(a.deadline) >= 0).length, accent: "#f59e0b", icon: "📅" },
          { label: "Total Weight", val: `${assignments.filter(a => !["Done","Submitted"].includes(a.status)).reduce((sum, a) => sum + a.weightage, 0)}%`, accent: "#a78bfa", icon: "⚖️" },
        ].map((s, i) => (
          <div key={i} className="rounded-3xl p-5 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.022)", border: `0.5px solid ${s.accent}30` }}>
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full" style={{ background: `radial-gradient(circle,${s.accent}18,transparent 70%)`, filter: "blur(12px)" }} />
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="text-2xl font-black" style={{ fontFamily: "'Syne',sans-serif", color: s.accent }}>{s.val}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Burndown */}
        <div className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.022)", border: "0.5px solid rgba(245,158,11,0.18)" }}>
          <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg,transparent,rgba(245,158,11,0.3),transparent)" }} />
          <BurndownChart assignments={assignments} />
        </div>

        {/* Subject breakdown */}
        <div className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.022)", border: "0.5px solid rgba(167,139,250,0.18)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Subject Progress</p>
          <div className="space-y-3">
            {Object.entries(subjectGroups).map(([subj, { total, done }]) => {
              const pct = Math.round((done / total) * 100);
              const color = SUBJ_COLORS[subj] || "#9ca3af";
              return (
                <div key={subj}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white/60 font-semibold">{subj}</span>
                    <span style={{ color }}>{done}/{total}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}99)` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="auth-input pl-9 text-sm" placeholder="Search assignment or subject..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["All", "Overdue", "Today", "Pending", "In Progress", "Done"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all"
              style={{
                background: filter === f ? "rgba(245,158,11,0.18)" : "rgba(255,255,255,0.04)",
                color: filter === f ? "#f59e0b" : "rgba(255,255,255,0.35)",
                border: `0.5px solid ${filter === f ? "rgba(245,158,11,0.40)" : "rgba(255,255,255,0.08)"}`,
              }}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setModal("add")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 4px 16px rgba(245,158,11,0.30)" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Assignment
        </button>
      </div>

      {/* Assignment cards */}
      <div className="space-y-3">
        {filtered.length === 0 && <div className="py-14 text-center text-white/25 text-sm rounded-3xl" style={{ border: "0.5px solid rgba(255,255,255,0.06)" }}>No assignments found.</div>}
        {filtered.map(a => {
          const dl = daysLeft(a.deadline);
          const isOverdue = dl < 0 && !["Done","Submitted"].includes(a.status);
          const isDone = ["Done","Submitted"].includes(a.status);
          const um = URGENCY_META[a.urgency] || URGENCY_META.Medium;
          const sm = STATUS_META[a.status] || STATUS_META.Pending;
          const expanded = expandedId === a.id;
          const subjColor = SUBJ_COLORS[a.subject] || "#9ca3af";

          return (
            <div key={a.id}
              className="rounded-3xl overflow-hidden transition-all duration-200"
              style={{
                background: isOverdue ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.022)",
                border: isOverdue ? "0.5px solid rgba(239,68,68,0.30)" : "0.5px solid rgba(245,158,11,0.12)",
                opacity: isDone ? 0.65 : 1,
              }}>
              <div className="flex items-start gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpandedId(expanded ? null : a.id)}>
                {/* Checkbox / status cycle */}
                <div className="mt-0.5 flex-shrink-0"
                  onClick={e => { e.stopPropagation(); toggleStatus(a.id); }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110"
                    style={{
                      background: isDone ? "linear-gradient(135deg,#10b981,#059669)" : "rgba(255,255,255,0.05)",
                      border: isDone ? "none" : "0.5px solid rgba(255,255,255,0.15)",
                      boxShadow: isDone ? "0 2px 8px rgba(16,185,129,0.35)" : "none",
                    }}>
                    {isDone && <svg width="11" height="11" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Subject tag row */}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                      style={{ background: `${subjColor}15`, color: subjColor }}>{a.subject}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: um.bg, color: um.color, border: `0.5px solid ${um.border}` }}>
                      {um.icon} {a.urgency}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: sm.bg, color: sm.color, border: `0.5px solid ${sm.border}` }}>
                      {a.status}
                    </span>
                    {isOverdue && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-red-300"
                        style={{ background: "rgba(239,68,68,0.15)", border: "0.5px solid rgba(239,68,68,0.35)" }}>
                        ⚠️ Overdue {Math.abs(dl)}d
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div className={`text-sm font-bold mb-1 ${isDone ? "line-through text-white/35" : "text-white/90"}`}>
                    {a.title}
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 flex-wrap text-[11px] text-white/35">
                    <span>📅 {a.deadline ? new Date(a.deadline).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                    {!isDone && !isOverdue && <span style={{ color: dl <= 1 ? "#ef4444" : dl <= 3 ? "#f59e0b" : "rgba(255,255,255,0.35)" }}>
                      {dl === 0 ? "Due today!" : dl === 1 ? "Due tomorrow" : `${dl} days left`}
                    </span>}
                    <span>⚖️ {a.weightage}% weightage</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); setModal(a); }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-amber-400 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={e => { e.stopPropagation(); deleteAssignment(a.id); }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                  </button>
                </div>
              </div>

              {/* Expanded notes */}
              {expanded && a.notes && (
                <div className="px-5 pb-4">
                  <div className="rounded-2xl px-4 py-3 text-sm text-white/55 leading-relaxed"
                    style={{ background: "rgba(245,158,11,0.06)", border: "0.5px solid rgba(245,158,11,0.18)" }}>
                    📝 {a.notes}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modal && <Modal item={modal === "add" ? null : modal} onClose={() => setModal(null)} onSave={saveAssignment} />}
    </div>
  );
}