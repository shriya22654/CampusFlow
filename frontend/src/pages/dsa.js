// DSATracker.js  ─  CampusFlow
import { useState } from "react";

/* ── constants ── */
const PLATFORMS = ["LeetCode", "GFG", "Codeforces", "HackerRank", "CodeChef", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const TOPICS = ["Arrays", "Strings", "Linked List", "Trees", "Graphs", "DP", "Backtracking", "Greedy", "Binary Search", "Heap", "Stack/Queue", "Math"];

const DIFF_COLORS = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" };
const DIFF_BG     = { Easy: "rgba(16,185,129,0.10)", Medium: "rgba(245,158,11,0.10)", Hard: "rgba(239,68,68,0.10)" };

const TOPIC_COLORS = {
  Arrays: "#06b6d4", Strings: "#a78bfa", "Linked List": "#f59e0b",
  Trees: "#10b981", Graphs: "#e879f9", DP: "#ef4444",
  Backtracking: "#f97316", Greedy: "#84cc16", "Binary Search": "#06b6d4",
  Heap: "#8b5cf6", "Stack/Queue": "#ec4899", Math: "#14b8a6",
};

const NOW = Date.now();
const DAY = 86400000;

const INIT_PROBLEMS = [
  { id: 1, name: "Two Sum",                   platform: "LeetCode",   link: "https://leetcode.com/problems/two-sum",                  difficulty: "Easy",   topic: "Arrays",        timeTaken: 12, revisions: 3, lastRevised: NOW - 2*DAY,  notes: "Use hashmap for O(n). Edge: duplicate values." },
  { id: 2, name: "LCS",                        platform: "LeetCode",   link: "https://leetcode.com/problems/longest-common-subsequence", difficulty: "Hard",   topic: "DP",            timeTaken: 55, revisions: 1, lastRevised: NOW - 9*DAY,  notes: "dp[i][j] = dp[i-1][j-1]+1 if match else max. Watch 0-indexing." },
  { id: 3, name: "Binary Tree Level Order",    platform: "LeetCode",   link: "https://leetcode.com/problems/binary-tree-level-order-traversal", difficulty: "Medium", topic: "Trees",  timeTaken: 20, revisions: 2, lastRevised: NOW - 5*DAY,  notes: "BFS with queue. Track level size." },
  { id: 4, name: "Course Schedule II",         platform: "LeetCode",   link: "https://leetcode.com/problems/course-schedule-ii",       difficulty: "Hard",   topic: "Graphs",        timeTaken: 45, revisions: 0, lastRevised: NOW - 10*DAY, notes: "Topological sort via DFS. Cycle detection critical." },
  { id: 5, name: "Sliding Window Maximum",     platform: "LeetCode",   link: "https://leetcode.com/problems/sliding-window-maximum",   difficulty: "Hard",   topic: "Stack/Queue",   timeTaken: 40, revisions: 1, lastRevised: NOW - 3*DAY,  notes: "Monotonic deque. Pop from front when out of window." },
  { id: 6, name: "Merge Intervals",            platform: "LeetCode",   link: "https://leetcode.com/problems/merge-intervals",          difficulty: "Medium", topic: "Arrays",        timeTaken: 18, revisions: 2, lastRevised: NOW - 1*DAY,  notes: "Sort by start. Merge if curr.start <= prev.end." },
  { id: 7, name: "Word Break",                 platform: "GFG",        link: "https://practice.geeksforgeeks.org/problems/word-break",  difficulty: "Medium", topic: "DP",            timeTaken: 30, revisions: 0, lastRevised: NOW - 8*DAY,  notes: "dp[i] = true if word in dict and dp[j] is true." },
  { id: 8, name: "Kth Largest in Stream",      platform: "LeetCode",   link: "https://leetcode.com/problems/kth-largest-element-in-a-stream", difficulty: "Easy", topic: "Heap",   timeTaken: 15, revisions: 1, lastRevised: NOW - 6*DAY,  notes: "Min-heap of size k. Top is answer." },
];

/* ── Radar Chart (SVG, no deps) ── */
function RadarChart({ topics }) {
  const N = topics.length;
  const cx = 100, cy = 100, r = 75;
  const angle = (i) => (i / N) * 2 * Math.PI - Math.PI / 2;
  const point = (i, frac) => [cx + frac * r * Math.cos(angle(i)), cy + frac * r * Math.sin(angle(i))];

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const dataPoints = topics.map((t, i) => point(i, t.pct));
  const polyStr = dataPoints.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {/* Grid rings */}
      {gridLevels.map((lv, li) => (
        <polygon key={li}
          points={topics.map((_, i) => point(i, lv).join(",")).join(" ")}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      ))}
      {/* Spokes */}
      {topics.map((_, i) => {
        const [x, y] = point(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />;
      })}
      {/* Data polygon */}
      <polygon points={polyStr} fill="rgba(16,185,129,0.12)" stroke="#10b981" strokeWidth="1.5" />
      {/* Data dots */}
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#10b981" opacity="0.9" />
      ))}
      {/* Labels */}
      {topics.map((t, i) => {
        const [lx, ly] = point(i, 1.22);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.45)" fontSize="7.5" fontFamily="DM Sans,sans-serif">
            {t.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Donut for difficulty ── */
function DonutChart({ easy, medium, hard }) {
  const total = easy + medium + hard;
  if (!total) return null;
  const data = [
    { val: easy,   color: "#10b981" },
    { val: medium, color: "#f59e0b" },
    { val: hard,   color: "#ef4444" },
  ];
  const cx = 50, cy = 50, r = 38;
  let cum = 0;
  const slices = data.map(d => {
    const start = (cum / total) * 360;
    cum += d.val;
    return { ...d, start, end: (cum / total) * 360 };
  });
  const polar = (angle, rad) => {
    const a = ((angle - 90) * Math.PI) / 180;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  };
  const arc = (s, e, rad) => {
    if (e - s >= 360) e = 359.99;
    const [x1, y1] = polar(s, rad);
    const [x2, y2] = polar(e, rad);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${rad} ${rad} 0 ${e - s > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
  };
  return (
    <div className="flex items-center gap-4">
      <svg width="90" height="90" viewBox="0 0 100 100">
        {slices.map((s, i) => <path key={i} d={arc(s.start, s.end, r)} fill={s.color} opacity="0.85" />)}
        <circle cx={cx} cy={cy} r="22" fill="#060210" />
        <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="900" fontFamily="Syne,sans-serif">{total}</text>
      </svg>
      <div className="space-y-1.5">
        {[["Easy", easy, "#10b981"], ["Medium", medium, "#f59e0b"], ["Hard", hard, "#ef4444"]].map(([l, v, c]) => (
          <div key={l} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: c }} />
            <span className="text-[11px] text-white/50">{l}</span>
            <span className="text-[11px] font-bold ml-2" style={{ color: c }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Modal ── */
function Modal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item || { name: "", platform: "LeetCode", link: "", difficulty: "Medium", topic: "Arrays", timeTaken: 30, revisions: 0, lastRevised: new Date().toISOString().split("T")[0], notes: "" });
  const isNew = !item?.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto py-6" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }} />
      <div className="relative w-full max-w-lg rounded-3xl p-7 slide-in my-auto"
        style={{ background: "rgba(8,2,20,0.97)", border: "0.5px solid rgba(16,185,129,0.28)", boxShadow: "0 32px 80px rgba(16,185,129,0.08)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white" style={{ fontFamily: "'Syne',sans-serif" }}>
            {isNew ? "Log Problem" : "Edit Problem"}
          </h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Problem Name</label>
            <input className="auth-input" placeholder="e.g. Two Sum" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Platform</label>
              <select className="auth-input" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} style={{ background: "rgba(255,255,255,0.04)" }}>
                {PLATFORMS.map(p => <option key={p} value={p} style={{ background: "#0a0218" }}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Difficulty</label>
              <select className="auth-input" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} style={{ background: "rgba(255,255,255,0.04)" }}>
                {DIFFICULTIES.map(d => <option key={d} value={d} style={{ background: "#0a0218" }}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Topic</label>
              <select className="auth-input" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} style={{ background: "rgba(255,255,255,0.04)" }}>
                {TOPICS.map(t => <option key={t} value={t} style={{ background: "#0a0218" }}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Time Taken (min)</label>
              <input className="auth-input" type="number" min="1" value={form.timeTaken} onChange={e => setForm({ ...form, timeTaken: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Problem Link</label>
            <input className="auth-input" type="url" placeholder="https://leetcode.com/problems/..." value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Notes / Logic & Edge Cases</label>
            <textarea className="auth-input resize-none" rows={3} placeholder="Approach, edge cases, gotchas..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/40 transition-all hover:bg-white/5" style={{ border: "0.5px solid rgba(255,255,255,0.10)" }}>Cancel</button>
          <button onClick={() => { if (form.name.trim()) { onSave({ ...form, lastRevised: Date.now() }); onClose(); } }}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#10b981,#059669)", boxShadow: "0 6px 20px rgba(16,185,129,0.28)" }}>
            {isNew ? "Log Problem →" : "Save →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function DSATracker() {
  const [problems, setProblems] = useState(INIT_PROBLEMS);
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState("problems");
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("All");
  const [topicFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const saveProb = (form) => {
    if (form.id) setProblems(problems.map(p => p.id === form.id ? form : p));
    else setProblems([{ ...form, id: Date.now() }, ...problems]);
  };
  const deleteProb = (id) => setProblems(problems.filter(p => p.id !== id));
  const markRevised = (id) => setProblems(problems.map(p => p.id === id ? { ...p, revisions: p.revisions + 1, lastRevised: Date.now() } : p));

  const filtered = problems.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.topic.toLowerCase().includes(search.toLowerCase());
    const md = diffFilter === "All" || p.difficulty === diffFilter;
    const mt = topicFilter === "All" || p.topic === topicFilter;
    return ms && md && mt;
  });

  // Revision queue: not revised in 7+ days
  const revQueue = problems.filter(p => (NOW - p.lastRevised) >= 7 * DAY);

  // Topic breakdown for radar
  const topicCounts = {};
  problems.forEach(p => { topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1; });
  const maxCount = Math.max(...Object.values(topicCounts), 1);
  const radarTopics = Object.entries(topicCounts).slice(0, 8).map(([label, count]) => ({ label, pct: count / maxCount }));

  // Diff split
  const easy = problems.filter(p => p.difficulty === "Easy").length;
  const medium = problems.filter(p => p.difficulty === "Medium").length;
  const hard = problems.filter(p => p.difficulty === "Hard").length;

  const avgTime = problems.length ? Math.round(problems.reduce((a, p) => a + p.timeTaken, 0) / problems.length) : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-[10px] font-bold tracking-widest uppercase text-emerald-300 bg-emerald-500/10 border border-emerald-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse2 2s infinite" }} />
          DSA Tracker
        </div>
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
          Problem <span className="shimmer">Arsenal</span>
        </h1>
        <p className="text-sm text-white/35">Log every problem. Track every pattern. Revise before you forget.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Solved", val: problems.length, accent: "#10b981", icon: "✅" },
          { label: "Avg Time", val: `${avgTime}m`, accent: "#06b6d4", icon: "⏱️" },
          { label: "Due Revision", val: revQueue.length, accent: "#f59e0b", icon: "🔄" },
          { label: "Hard Solved", val: hard, accent: "#ef4444", icon: "💀" },
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
        {/* Radar */}
        <div className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.022)", border: "0.5px solid rgba(16,185,129,0.18)" }}>
          <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg,transparent,rgba(16,185,129,0.3),transparent)" }} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Topic Strength Radar</p>
          <div className="flex justify-center">
            <RadarChart topics={radarTopics} />
          </div>
        </div>
        {/* Difficulty donut + revision queue */}
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl p-6 relative overflow-hidden flex-1"
            style={{ background: "rgba(255,255,255,0.022)", border: "0.5px solid rgba(245,158,11,0.18)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Difficulty Split</p>
            <DonutChart easy={easy} medium={medium} hard={hard} />
          </div>
          {/* Revision queue */}
          <div className="rounded-3xl p-5 relative overflow-hidden"
            style={{ background: "rgba(245,158,11,0.04)", border: "0.5px solid rgba(245,158,11,0.22)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#f59e0b" }}>
              🔄 Revision Queue ({revQueue.length})
            </p>
            {revQueue.length === 0 ? (
              <p className="text-xs text-white/30">All problems revised recently ✅</p>
            ) : (
              <div className="space-y-2 max-h-28 overflow-y-auto">
                {revQueue.map(p => (
                  <div key={p.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-white/70 truncate block">{p.name}</span>
                      <span className="text-[10px] text-white/30">{Math.floor((NOW - p.lastRevised) / DAY)}d ago · {p.topic}</span>
                    </div>
                    <button onClick={() => markRevised(p.id)}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 transition-all hover:scale-105"
                      style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "0.5px solid rgba(245,158,11,0.30)" }}>
                      Revise ✓
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-2xl w-fit" style={{ background: "rgba(255,255,255,0.04)" }}>
        {[["problems", "All Problems"], ["revision", "Revision Queue"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200"
            style={{
              background: tab === id ? "rgba(16,185,129,0.15)" : "transparent",
              color: tab === id ? "#10b981" : "rgba(255,255,255,0.35)",
              border: tab === id ? "0.5px solid rgba(16,185,129,0.30)" : "0.5px solid transparent",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="auth-input pl-9 text-sm" placeholder="Search problem or topic..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5">
          {["All", ...DIFFICULTIES].map(d => (
            <button key={d} onClick={() => setDiffFilter(d)}
              className="px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all"
              style={{
                background: diffFilter === d ? `${DIFF_COLORS[d] || "#7c3aed"}20` : "rgba(255,255,255,0.04)",
                color: diffFilter === d ? (DIFF_COLORS[d] || "#a78bfa") : "rgba(255,255,255,0.35)",
                border: `0.5px solid ${diffFilter === d ? (DIFF_COLORS[d] || "#7c3aed") + "50" : "rgba(255,255,255,0.08)"}`,
              }}>
              {d}
            </button>
          ))}
        </div>
        <button onClick={() => setModal("add")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#10b981,#059669)", boxShadow: "0 4px 16px rgba(16,185,129,0.28)" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Log Problem
        </button>
      </div>

      {/* Problem table */}
      {tab === "problems" && (
        <div className="rounded-3xl overflow-hidden" style={{ border: "0.5px solid rgba(16,185,129,0.15)", background: "rgba(255,255,255,0.015)" }}>
          <div className="grid grid-cols-12 gap-2 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white/25 border-b border-white/5">
            <div className="col-span-3">Problem</div>
            <div className="col-span-1">Platform</div>
            <div className="col-span-1">Diff</div>
            <div className="col-span-2">Topic</div>
            <div className="col-span-1">Time</div>
            <div className="col-span-2">Revisions</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {filtered.length === 0 && <div className="py-14 text-center text-white/25 text-sm">No problems found.</div>}
          {filtered.map(p => {
            const expanded = expandedId === p.id;
            const daysSince = Math.floor((NOW - p.lastRevised) / DAY);
            const needsRevision = daysSince >= 7;
            return (
              <div key={p.id} className="border-b transition-all duration-200 hover:bg-white/[0.02]"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <div className="grid grid-cols-12 gap-2 px-5 py-4 items-center cursor-pointer"
                  onClick={() => setExpandedId(expanded ? null : p.id)}>
                  {/* Name */}
                  <div className="col-span-3 min-w-0">
                    <div className="flex items-center gap-2">
                      {needsRevision && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-amber-400" title="Due for revision" />}
                      <span className="text-sm font-bold text-white/85 truncate">{p.name}</span>
                    </div>
                  </div>
                  {/* Platform */}
                  <div className="col-span-1 text-[11px] text-white/40">{p.platform}</div>
                  {/* Diff */}
                  <div className="col-span-1">
                    <span className="text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider"
                      style={{ background: DIFF_BG[p.difficulty], color: DIFF_COLORS[p.difficulty] }}>
                      {p.difficulty}
                    </span>
                  </div>
                  {/* Topic */}
                  <div className="col-span-2">
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-md"
                      style={{ background: `${TOPIC_COLORS[p.topic] || "#a78bfa"}15`, color: TOPIC_COLORS[p.topic] || "#a78bfa" }}>
                      {p.topic}
                    </span>
                  </div>
                  {/* Time */}
                  <div className="col-span-1 text-xs text-white/40">{p.timeTaken}m</div>
                  {/* Revisions */}
                  <div className="col-span-2 flex items-center gap-1">
                    {[...Array(Math.min(p.revisions, 5))].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
                    ))}
                    {p.revisions === 0 && <span className="text-[10px] text-white/25">None</span>}
                    <span className="text-[10px] text-white/30 ml-1">×{p.revisions}</span>
                  </div>
                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-emerald-400 transition-colors"
                        style={{ background: "rgba(255,255,255,0.04)" }}>
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    )}
                    <button onClick={e => { e.stopPropagation(); markRevised(p.id); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-amber-400 transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)" }} title="Mark revised">
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="17 1 21 5 13 13"/><path d="M7 7H3a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-4"/></svg>
                    </button>
                    <button onClick={e => { e.stopPropagation(); setModal(p); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-emerald-400 transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)" }}>
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={e => { e.stopPropagation(); deleteProb(p.id); }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)" }}>
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                    </button>
                  </div>
                </div>
                {expanded && p.notes && (
                  <div className="px-5 pb-4">
                    <div className="rounded-2xl px-4 py-3 text-sm text-white/55 leading-relaxed"
                      style={{ background: "rgba(16,185,129,0.06)", border: "0.5px solid rgba(16,185,129,0.18)" }}>
                      🧠 <span className="font-semibold text-emerald-300">Logic & Edge Cases:</span> {p.notes}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Revision tab */}
      {tab === "revision" && (
        <div className="rounded-3xl overflow-hidden" style={{ border: "0.5px solid rgba(245,158,11,0.20)", background: "rgba(245,158,11,0.02)" }}>
          {revQueue.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <div className="text-white/40 text-sm">No problems due for revision. You're on top of it!</div>
            </div>
          ) : (
            revQueue.map(p => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4 border-b transition-all hover:bg-white/[0.02]"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white/85">{p.name}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md"
                      style={{ background: DIFF_BG[p.difficulty], color: DIFF_COLORS[p.difficulty] }}>
                      {p.difficulty}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/35">{p.topic} · {p.platform} · Last revised {Math.floor((NOW - p.lastRevised) / DAY)}d ago</div>
                  {p.notes && <div className="text-[11px] text-white/40 mt-1 truncate">🧠 {p.notes}</div>}
                </div>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", border: "0.5px solid rgba(16,185,129,0.25)" }}>
                    Open →
                  </a>
                )}
                <button onClick={() => markRevised(p.id)}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "0.5px solid rgba(245,158,11,0.25)" }}>
                  Done ✓
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {modal && <Modal item={modal === "add" ? null : modal} onClose={() => setModal(null)} onSave={saveProb} />}
    </div>
  );
}