// InternshipTracker.js  ─  CampusFlow
import { useState } from "react";

/* ── helpers ── */
const STATUS_META = {
  Applied:   { bg: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "rgba(167,139,250,0.30)" },
  OA:        { bg: "rgba(245,158,11,0.12)",  color: "#f59e0b", border: "rgba(245,158,11,0.30)"  },
  Interview: { bg: "rgba(6,182,212,0.12)",   color: "#06b6d4", border: "rgba(6,182,212,0.30)"   },
  Offer:     { bg: "rgba(16,185,129,0.12)",  color: "#10b981", border: "rgba(16,185,129,0.30)"  },
  Rejected:  { bg: "rgba(239,68,68,0.10)",   color: "#ef4444", border: "rgba(239,68,68,0.25)"   },
  Ghosted:   { bg: "rgba(255,255,255,0.06)", color: "#6b7280", border: "rgba(255,255,255,0.10)" },
};

const STATUSES = Object.keys(STATUS_META);

const STATUS_COLORS = {
  Applied: "#a78bfa", OA: "#f59e0b", Interview: "#06b6d4",
  Offer: "#10b981", Rejected: "#ef4444", Ghosted: "#6b7280",
};

const INIT_DATA = [
  { id: 1, company: "Google",    role: "SWE Intern",      appliedDate: "2025-03-10", status: "Interview", notes: "Round 2 scheduled for next week. Focus on system design.", successRate: 72 },
  { id: 2, company: "Microsoft", role: "SWE Intern",      appliedDate: "2025-03-14", status: "OA",        notes: "OA link received. 90 min, 3 questions.", successRate: 65 },
  { id: 3, company: "Flipkart",  role: "Product Intern",  appliedDate: "2025-03-18", status: "Applied",   notes: "Applied via referral through Priya.", successRate: 48 },
  { id: 4, company: "Razorpay",  role: "Backend Intern",  appliedDate: "2025-03-05", status: "Offer",     notes: "Offer letter received. Stipend: ₹60K/mo.", successRate: 90 },
  { id: 5, company: "Swiggy",    role: "ML Intern",       appliedDate: "2025-03-01", status: "Rejected",  notes: "Rejected after round 2. Work on ML breadth.", successRate: 30 },
  { id: 6, company: "Zepto",     role: "Data Intern",     appliedDate: "2025-03-20", status: "Ghosted",   notes: "", successRate: 20 },
];

function Badge({ status }) {
  const m = STATUS_META[status] || STATUS_META.Applied;
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `0.5px solid ${m.border}` }}>
      {status}
    </span>
  );
}

/* ── SVG Pie Chart ── */
function PieChart({ data }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  if (total === 0) return null;
  let cum = 0;
  const slices = data.map(d => {
    const start = (cum / total) * 360;
    cum += d.value;
    const end = (cum / total) * 360;
    return { ...d, start, end };
  });

  const polarToXY = (angle, r) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return [50 + r * Math.cos(rad), 50 + r * Math.sin(rad)];
  };

  const arc = (start, end, r) => {
    if (end - start >= 360) end = 359.99;
    const [x1, y1] = polarToXY(start, r);
    const [x2, y2] = polarToXY(end, r);
    const large = end - start > 180 ? 1 : 0;
    return `M 50 50 L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex items-center gap-6">
      <svg width="110" height="110" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="38" fill="rgba(255,255,255,0.03)" />
        {slices.map((s, i) => (
          <path key={i} d={arc(s.start, s.end, 38)} fill={s.color} opacity="0.85">
            <title>{s.label}: {s.value}</title>
          </path>
        ))}
        <circle cx="50" cy="50" r="22" fill="#060210" />
        <text x="50" y="54" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="Syne,sans-serif">{total}</text>
      </svg>
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-[11px] text-white/55">{d.label}</span>
            <span className="text-[11px] font-bold ml-auto pl-3" style={{ color: d.color }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Modal ── */
function Modal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item || { company: "", role: "", appliedDate: "", status: "Applied", notes: "", successRate: 50 });
  const isNew = !item?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }} />
      <div
        className="relative w-full max-w-lg rounded-3xl p-7 slide-in"
        style={{ background: "rgba(8,2,20,0.97)", border: "0.5px solid rgba(6,182,212,0.30)", boxShadow: "0 32px 80px rgba(6,182,212,0.10)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(6,182,212,0.08),transparent 70%)", filter: "blur(30px)" }} />
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Syne',sans-serif" }}>
            {isNew ? "Add Application" : "Edit Application"}
          </h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Company</label>
              <input className="auth-input" placeholder="Google" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Role</label>
              <input className="auth-input" placeholder="SWE Intern" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Applied Date</label>
              <input className="auth-input" type="date" value={form.appliedDate} onChange={e => setForm({ ...form, appliedDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Status</label>
              <select className="auth-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ background: "rgba(255,255,255,0.04)" }}>
                {STATUSES.map(s => <option key={s} value={s} style={{ background: "#0a0218" }}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">
              Success Rate — <span style={{ color: "#06b6d4" }}>{form.successRate}%</span>
            </label>
            <input type="range" min="0" max="100" value={form.successRate}
              onChange={e => setForm({ ...form, successRate: Number(e.target.value) })}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#06b6d4" }} />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Notes</label>
            <textarea className="auth-input resize-none" rows={3} placeholder="Interview notes, referral details, tips..." value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/40 transition-all hover:bg-white/5"
            style={{ border: "0.5px solid rgba(255,255,255,0.10)" }}>
            Cancel
          </button>
          <button
            onClick={() => { if (form.company.trim()) { onSave(form); onClose(); } }}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#06b6d4,#0891b2)", boxShadow: "0 6px 20px rgba(6,182,212,0.30)" }}>
            {isNew ? "Add Application →" : "Save Changes →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function InternshipTracker() {
  const [apps, setApps] = useState(INIT_DATA);
  const [modal, setModal] = useState(null); // null | "add" | item
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const filtered = apps.filter(a => {
    const matchSearch = a.company.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pieData = STATUSES.map(s => ({ label: s, value: apps.filter(a => a.status === s).length, color: STATUS_COLORS[s] })).filter(d => d.value > 0);
  const offerRate = apps.length ? Math.round((apps.filter(a => a.status === "Offer").length / apps.length) * 100) : 0;
  const activeCount = apps.filter(a => ["Applied", "OA", "Interview"].includes(a.status)).length;

  const saveApp = (form) => {
    if (form.id) {
      setApps(apps.map(a => a.id === form.id ? { ...form } : a));
    } else {
      setApps([{ ...form, id: Date.now() }, ...apps]);
    }
  };

  const deleteApp = (id) => setApps(apps.filter(a => a.id !== id));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-[10px] font-bold tracking-widest uppercase text-cyan-300 bg-cyan-500/10 border border-cyan-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ animation: "pulse2 2s infinite" }} />
          Internship Tracker
        </div>
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
          Applications <span className="shimmer">Pipeline</span>
        </h1>
        <p className="text-sm text-white/35">Track every application from cold email to offer letter.</p>
      </div>

      {/* Stats + Pie row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-7">
        {/* Pie */}
        <div className="lg:col-span-1 rounded-3xl p-6 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.022)", border: "0.5px solid rgba(6,182,212,0.18)" }}>
          <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg,transparent,rgba(6,182,212,0.3),transparent)" }} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Status Breakdown</p>
          <PieChart data={pieData} />
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-3">
          {[
            { label: "Total Applied", value: apps.length, accent: "#06b6d4", icon: "📨" },
            { label: "Active Rounds", value: activeCount, accent: "#a78bfa", icon: "🔄" },
            { label: "Offer Rate", value: `${offerRate}%`, accent: "#10b981", icon: "🎯" },
          ].map((s, i) => (
            <div key={i} className="rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.022)", border: `0.5px solid ${s.accent}30` }}>
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full" style={{ background: `radial-gradient(circle,${s.accent}15,transparent 70%)`, filter: "blur(15px)" }} />
              <span className="text-2xl mb-3">{s.icon}</span>
              <div>
                <div className="text-3xl font-black" style={{ fontFamily: "'Syne',sans-serif", color: s.accent }}>{s.value}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="auth-input pl-9 text-sm" placeholder="Search company or role..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["All", ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-150"
              style={{
                background: filterStatus === s ? `${STATUS_COLORS[s] || "#7c3aed"}20` : "rgba(255,255,255,0.04)",
                color: filterStatus === s ? (STATUS_COLORS[s] || "#a78bfa") : "rgba(255,255,255,0.35)",
                border: `0.5px solid ${filterStatus === s ? (STATUS_COLORS[s] || "#7c3aed") + "50" : "rgba(255,255,255,0.08)"}`,
              }}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => setModal("add")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#06b6d4,#0891b2)", boxShadow: "0 4px 16px rgba(6,182,212,0.30)" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Application
        </button>
      </div>

      {/* Table */}
      <div className="rounded-3xl overflow-hidden" style={{ border: "0.5px solid rgba(6,182,212,0.15)", background: "rgba(255,255,255,0.015)" }}>
        {/* Head */}
        <div className="grid grid-cols-12 gap-3 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white/25 border-b border-white/5">
          <div className="col-span-3">Company / Role</div>
          <div className="col-span-2">Applied</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Success Rate</div>
          <div className="col-span-2">Notes</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-white/25 text-sm">No applications found.</div>
        )}

        {filtered.map((a) => {
          const expanded = expandedId === a.id;
          const m = STATUS_META[a.status] || STATUS_META.Applied;
          return (
            <div key={a.id} className="border-b transition-all duration-200 hover:bg-white/[0.02]"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <div className="grid grid-cols-12 gap-3 px-5 py-4 items-center cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : a.id)}>
                {/* Company */}
                <div className="col-span-3 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{ background: `${m.color}18`, border: `0.5px solid ${m.color}40`, color: m.color, fontFamily: "'Syne',sans-serif" }}>
                    {a.company[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white/90 truncate">{a.company}</div>
                    <div className="text-[11px] text-white/35 truncate">{a.role}</div>
                  </div>
                </div>
                {/* Date */}
                <div className="col-span-2 text-xs text-white/40">{a.appliedDate || "—"}</div>
                {/* Status */}
                <div className="col-span-2"><Badge status={a.status} /></div>
                {/* Success rate */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${a.successRate}%`, background: `linear-gradient(90deg,${m.color},${m.color}99)` }} />
                    </div>
                    <span className="text-[11px] font-bold flex-shrink-0" style={{ color: m.color }}>{a.successRate}%</span>
                  </div>
                </div>
                {/* Notes preview */}
                <div className="col-span-2 text-[11px] text-white/30 truncate">{a.notes || "—"}</div>
                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1.5">
                  <button onClick={e => { e.stopPropagation(); setModal(a); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-cyan-400 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={e => { e.stopPropagation(); deleteApp(a.id); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  </button>
                </div>
              </div>
              {/* Expanded notes */}
              {expanded && a.notes && (
                <div className="px-5 pb-4">
                  <div className="rounded-2xl px-4 py-3 text-sm text-white/55 leading-relaxed"
                    style={{ background: `${m.color}08`, border: `0.5px solid ${m.color}20` }}>
                    📝 {a.notes}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          item={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={saveApp}
        />
      )}
    </div>
  );
}