// dashboard.js  ─  CampusFlow Dashboard Shell
// Opens to Profile page. Sidebar links to each tracker.
// Props: onLogout

import { useState } from "react";
import Logo from "../components/logo";
import InternshipTracker from "./intershipTracker";
import DSATracker from "./dsa";
import AssignmentTracker from "./assignment";

const USER = {
  name: "Arjun Sharma", college: "IIT Delhi", branch: "Computer Science & Engg",
  year: "3rd Year", avatar: "AS", email: "arjun@iit.ac.in",
  streak: 14, totalSolved: 342, applications: 12, assignmentsDue: 3, cgpa: "8.7", joined: "Aug 2022",
};

function StatCard({ icon, label, value, accent, sub }) {
  return (
    <div className="rounded-2xl p-4 relative overflow-hidden" style={{ background: `${accent}08`, border: `0.5px solid ${accent}25` }}>
      <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full" style={{ background: `radial-gradient(circle,${accent}15,transparent 70%)`, filter: "blur(10px)" }} />
      <div className="text-lg mb-2">{icon}</div>
      <div className="text-2xl font-black" style={{ fontFamily: "'Syne',sans-serif", color: accent }}>{value}</div>
      <div className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{label}</div>
      {sub && <div className="text-[10px] mt-1" style={{ color: accent + "99" }}>{sub}</div>}
    </div>
  );
}

function ActivityRow({ icon, label, time, color }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: `${color}15`, border: `0.5px solid ${color}30` }}>{icon}</div>
      <div className="flex-1 min-w-0"><div className="text-xs text-white/70 truncate">{label}</div></div>
      <div className="text-[10px] text-white/25 flex-shrink-0">{time}</div>
    </div>
  );
}

function ProfilePage({ onLogout, onNavigate }) {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(USER);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-[10px] font-bold tracking-widest uppercase text-violet-300 bg-violet-500/10 border border-violet-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ animation: "pulse2 2s infinite" }} />
          My Profile
        </div>
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}>
          Welcome back, <span className="shimmer">{userData.name.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-sm text-white/35 mt-1">Your campus command centre. Pick a tracker from the sidebar.</p>
      </div>

      {/* Profile hero */}
      <div className="rounded-3xl p-7 mb-6 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(124,58,237,0.25)" }}>
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(124,58,237,0.12),transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg,transparent,rgba(124,58,237,0.4),transparent)" }} />
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0 relative">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 12px 40px rgba(124,58,237,0.45)", fontFamily: "'Syne',sans-serif", color: "#fff" }}>
              {userData.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#060210] bg-emerald-400" />
          </div>
          <div className="flex-1">
            {editMode ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input className="auth-input text-sm" value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} placeholder="Full Name" />
                  <input className="auth-input text-sm" value={userData.college} onChange={e => setUserData({ ...userData, college: e.target.value })} placeholder="College" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input className="auth-input text-sm" value={userData.branch} onChange={e => setUserData({ ...userData, branch: e.target.value })} placeholder="Branch" />
                  <input className="auth-input text-sm" value={userData.year} onChange={e => setUserData({ ...userData, year: e.target.value })} placeholder="Year" />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setEditMode(false)} className="px-5 py-2 rounded-xl text-sm font-bold text-white hover:-translate-y-0.5 transition-all" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>Save Profile</button>
                  <button onClick={() => setEditMode(false)} className="px-5 py-2 rounded-xl text-sm font-semibold text-white/40 hover:bg-white/5 transition-all" style={{ border: "0.5px solid rgba(255,255,255,0.10)" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Syne',sans-serif" }}>{userData.name}</h2>
                    <div className="text-sm text-white/45 mt-0.5">{userData.college}</div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-violet-300" style={{ background: "rgba(124,58,237,0.12)", border: "0.5px solid rgba(124,58,237,0.25)" }}>{userData.branch}</span>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-cyan-300" style={{ background: "rgba(6,182,212,0.10)", border: "0.5px solid rgba(6,182,212,0.22)" }}>{userData.year}</span>
                    </div>
                  </div>
                  <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all hover:bg-white/[0.06] flex-shrink-0" style={{ border: "0.5px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.45)" }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-3 text-[12px] text-white/35 flex-wrap">
                  <span>✉️ {userData.email}</span>
                  <span>📅 Since {userData.joined}</span>
                  <span>🎓 CGPA {userData.cgpa}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard icon="💼" label="Applications" value={userData.applications} accent="#06b6d4" sub="Active pipeline" />
        <StatCard icon="⚡" label="DSA Solved"   value={userData.totalSolved}  accent="#10b981" sub="342 problems" />
        <StatCard icon="📋" label="Pending Work" value={userData.assignmentsDue} accent="#f59e0b" sub="Due this week" />
        <StatCard icon="🔥" label="Day Streak"   value={userData.streak}        accent="#e879f9" sub="Keep it up!" />
      </div>

      {/* Streak + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: "rgba(245,158,11,0.05)", border: "0.5px solid rgba(245,158,11,0.22)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Weekly Activity</p>
          <div className="flex items-end gap-1.5 mb-4 h-16">
            {[60, 80, 100, 75, 90, 40, 0].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-lg" style={{ height: `${h * 0.56}px`, background: h > 0 ? "linear-gradient(180deg,#f59e0b,#d97706)" : "rgba(255,255,255,0.06)", transition: "height 0.5s ease", minHeight: "4px" }} />
                <span className="text-[9px] text-white/30">{["M","T","W","T","F","S","S"][i]}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl">🔥</span>
            <div>
              <div className="text-xl font-black" style={{ fontFamily: "'Syne',sans-serif", color: "#f59e0b" }}>{userData.streak} Day Streak</div>
              <div className="text-[11px] text-white/30">Don't break the chain!</div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.022)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Recent Activity</p>
          <ActivityRow icon="✅" label="Solved: Binary Tree Level Order" time="2h ago" color="#10b981" />
          <ActivityRow icon="💼" label="Applied: Google SWE Intern" time="5h ago" color="#06b6d4" />
          <ActivityRow icon="📋" label="Submitted: ER Diagram" time="Yesterday" color="#f59e0b" />
          <ActivityRow icon="⚡" label="Solved: LCS — Hard" time="2d ago" color="#a78bfa" />
          <ActivityRow icon="💼" label="Interview: Microsoft Round 1" time="3d ago" color="#06b6d4" />
        </div>
      </div>

      {/* Quick nav to trackers */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-4">Jump to Tracker</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "💼", label: "Internship Tracker", desc: "Applications, OAs, interviews, offers.", accent: "#06b6d4", accentBg: "rgba(6,182,212,0.07)", accentBorder: "rgba(6,182,212,0.22)", nav: "internship" },
            { icon: "⚡", label: "DSA Tracker",        desc: "Log problems, build streaks, crush interviews.", accent: "#10b981", accentBg: "rgba(16,185,129,0.07)", accentBorder: "rgba(16,185,129,0.22)", nav: "dsa" },
            { icon: "📋", label: "Assignment Tracker", desc: "Zero missed deadlines, every semester.", accent: "#f59e0b", accentBg: "rgba(245,158,11,0.07)", accentBorder: "rgba(245,158,11,0.22)", nav: "assignments" },
          ].map(c => (
            <button key={c.nav} onClick={() => onNavigate(c.nav)}
              className="rounded-3xl p-5 text-left cursor-pointer transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
              style={{ background: c.accentBg, border: `0.5px solid ${c.accentBorder}` }}>
              <div className="absolute bottom-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg,transparent,${c.accent},transparent)` }} />
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="text-base font-black text-white mb-1" style={{ fontFamily: "'Syne',sans-serif" }}>{c.label}</div>
              <div className="text-xs text-white/40">{c.desc}</div>
              <div className="text-xs font-bold mt-3" style={{ color: c.accent }}>Open tracker →</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white/35 transition-all hover:bg-white/5 hover:text-white/55" style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ── Dashboard Shell ── */
export default function Dashboard({ onLogout = () => {} }) {
  const [activePage, setActivePage] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NAV = [
    { id: "profile",     icon: "👤", label: "My Profile",        accent: "#a78bfa" },
    { id: "internship",  icon: "💼", label: "Internship Tracker", accent: "#06b6d4" },
    { id: "dsa",         icon: "⚡", label: "DSA Tracker",        accent: "#10b981" },
    { id: "assignments", icon: "📋", label: "Assignment Tracker", accent: "#f59e0b" },
  ];

  const navigate = (page) => { setActivePage(page); setSidebarOpen(false); };
  const current = NAV.find(n => n.id === activePage);

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 flex-shrink-0">
        <Logo onClick={() => navigate("profile")} />
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="px-3 mb-2 mt-3">
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Navigation</span>
        </div>
        <div className="space-y-1">
          {NAV.map(item => {
            const isActive = activePage === item.id;
            return (
              <button key={item.id} onClick={() => navigate(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 text-left relative"
                style={{
                  background: isActive ? `${item.accent}18` : "transparent",
                  color: isActive ? item.accent : "rgba(255,255,255,0.45)",
                  border: isActive ? `0.5px solid ${item.accent}35` : "0.5px solid transparent",
                }}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full" style={{ background: item.accent }} />}
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mx-3 my-5 h-[0.5px]" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="mx-1 rounded-2xl p-4" style={{ background: "rgba(124,58,237,0.08)", border: "0.5px solid rgba(124,58,237,0.18)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", fontFamily: "'Syne',sans-serif", color: "#fff" }}>
              {USER.avatar}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white/80 truncate">{USER.name}</div>
              <div className="text-[10px] text-white/35 truncate">{USER.year} · {USER.college}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 flex-shrink-0" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-white/30 transition-all hover:bg-white/5 hover:text-white/50" style={{ border: "0.5px solid rgba(255,255,255,0.07)" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="relative z-10 flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 sticky top-0 h-screen"
        style={{ background: "rgba(5,1,14,0.85)", borderRight: "0.5px solid rgba(139,92,246,0.12)", backdropFilter: "blur(20px)" }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col"
            style={{ background: "rgba(5,1,14,0.99)", borderRight: "0.5px solid rgba(139,92,246,0.20)" }}
            onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 md:px-8 py-4 flex-shrink-0 sticky top-0 z-40"
          style={{ background: "rgba(5,1,12,0.80)", backdropFilter: "blur(20px)", borderBottom: "0.5px solid rgba(139,92,246,0.10)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-white/40 hover:text-white/70 transition-colors">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/25 hidden md:block">CampusFlow</span>
              <span className="text-white/25 hidden md:block">›</span>
              <span className="font-semibold" style={{ color: current?.accent || "rgba(255,255,255,0.8)" }}>{current?.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(245,158,11,0.10)", border: "0.5px solid rgba(245,158,11,0.20)" }}>
              <span className="text-sm">🔥</span>
              <span className="text-sm font-black" style={{ fontFamily: "'Syne',sans-serif", color: "#f59e0b" }}>{USER.streak}</span>
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black cursor-pointer hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", fontFamily: "'Syne',sans-serif", color: "#fff" }}
              onClick={() => navigate("profile")}>
              {USER.avatar}
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 md:px-8 py-8 overflow-y-auto">
          {activePage === "profile"     && <ProfilePage onLogout={onLogout} onNavigate={navigate} />}
          {activePage === "internship"  && <InternshipTracker />}
          {activePage === "dsa"         && <DSATracker />}
          {activePage === "assignments" && <AssignmentTracker />}
        </main>
      </div>
    </div>
  );
}