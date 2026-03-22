// home.js  ─  CampusFlow Landing Page
// Props: onLogin, onSignup, onGoToTracker

import { useState, useEffect } from "react";
import Logo from "../components/logo";

const TRACKERS = [
  {
    icon: "💼",
    accent: "#06b6d4",
    accentBg: "rgba(6,182,212,0.07)",
    accentBorder: "rgba(6,182,212,0.22)",
    glow: "rgba(6,182,212,0.10)",
    tag: "Internship Tracker",
    tagCls: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
    title: "Track Every Application",
    desc: "Track every application, OA, interview round, and offer. Your placement journey at a glance.",
    bullets: [
      "Pipeline view from application to offer letter",
      "Deadline alerts for OA windows and interview slots",
      "Success analytics by company, role, and domain",
    ],
    cta: "Open Internship Tracker",
    stat: { val: "12+", label: "Applications tracked avg." },
  },
  {
    icon: "⚡",
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.07)",
    accentBorder: "rgba(16,185,129,0.22)",
    glow: "rgba(16,185,129,0.10)",
    tag: "DSA Tracker",
    tagCls: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
    title: "Master DSA Systematically",
    desc: "Track your LeetCode & GFG progress topic by topic. See exactly where you're strong and build daily streaks.",
    bullets: [
      "Topic-wise breakdown: Arrays, Trees, DP, Graphs & more",
      "Daily streak counter to keep your momentum alive",
      "1,200+ curated problems mapped to interview patterns",
    ],
    cta: "Open DSA Tracker",
    stat: { val: "🔥 14", label: "Day streak average" },
  },
  {
    icon: "📋",
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.07)",
    accentBorder: "rgba(245,158,11,0.22)",
    glow: "rgba(245,158,11,0.10)",
    tag: "Assignment Tracker",
    tagCls: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    title: "Zero Missed Deadlines",
    desc: "All your assignments across every subject — in one board. Urgency flags, submission status, and semester progress.",
    bullets: [
      "Subject-wise board with live deadline countdowns",
      "Red urgent flags before late-night deadlines hit",
      "Semester-wide progress view across all subjects",
    ],
    cta: "Open Assignment Tracker",
    stat: { val: "98%", label: "On-time submission rate" },
  },
];

export default function Home({
  onLogin = () => {},
  onSignup = () => {},
  onGoToTracker = () => {},
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-400"
        style={
          scrolled
            ? {
                background: "rgba(5,1,12,0.88)",
                backdropFilter: "blur(20px)",
                borderBottom: "0.5px solid rgba(139,92,246,0.12)",
              }
            : {}
        }
      >
        <Logo />
        <div className="flex items-center gap-2.5">
          <button
            onClick={onLogin}
            className="text-sm font-semibold text-white/50 hover:text-white px-4 py-2 rounded-xl transition-all duration-200"
            style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
            }
          >
            Sign In
          </button>
          <button
            onClick={onSignup}
            className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              boxShadow: "0 4px 18px rgba(124,58,237,0.38)",
            }}
          >
            Sign Up →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center text-center pt-40 pb-20 px-6 overflow-hidden">
        <div
          className="absolute top-20 left-1/3 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(124,58,237,0.13),transparent 70%)",
            filter: "blur(55px)",
          }}
        />
        <div
          className="absolute top-28 right-1/3 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(232,121,249,0.08),transparent 70%)",
            filter: "blur(55px)",
          }}
        />

        <div className="fu1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7 text-[11px] font-bold tracking-widest uppercase text-violet-300 bg-violet-500/10 border border-violet-500/25">
          <span
            className="w-1.5 h-1.5 rounded-full bg-violet-400"
            style={{ animation: "pulse2 2s infinite" }}
          />
          Your campus. All in one place.
        </div>

        <h1
          className="fu2 font-black leading-none text-white mb-5"
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: "clamp(2rem,5vw,5rem)",
            letterSpacing: "-0.03em",
          }}
        >
          Track everything.
          <br />
          <span className="shimmer">Miss Nothing.</span>
        </h1>

        <p className="fu3 max-w-xl text-base md:text-lg text-gray-400 leading-relaxed font-light mb-9 font-serif">
          CampusFlow is your all-in-one dark campus OS — track internship
          applications, master DSA problems, and never miss an assignment
          deadline again.
        </p>

        <div className="fu4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onSignup}
            className="group relative px-8 py-3.5 rounded-2xl text-white font-bold text-base overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              boxShadow: "0 8px 28px rgba(124,58,237,0.45)",
            }}
          >
            <span className="relative z-10">Start for Free →</span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)" }}
            />
          </button>
          <button
            onClick={onLogin}
            className="px-8 py-3.5 rounded-2xl text-white/55 hover:text-white font-semibold text-base transition-all duration-200 hover:bg-white/[0.04]"
            style={{ border: "0.5px solid rgba(255,255,255,0.11)" }}
          >
            Sign in to campus
          </button>
        </div>
      </section>

      {/* ── TRACKER CARDS ── */}
      <section className="relative z-10 px-6 max-w-4xl mx-auto pb-28">
        <div className="text-center mb-12">
          <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-violet-300 bg-violet-500/10 border border-violet-500/25 px-3 py-1.5 rounded-full mb-4">
            What's inside
          </span>
          <h2
            className="font-black text-white tracking-tight"
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Three trackers. <br />
            <span className="shimmer">One Dashboard.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {TRACKERS.map((t) => (
            <div
              key={t.tag}
              className="group relative rounded-3xl p-8 md:p-9 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.022)",
                border: "0.5px solid rgba(139,92,246,0.11)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = t.accentBorder)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(139,92,246,0.11)")
              }
            >
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at 5% 20%, ${t.glow}, transparent 55%)`,
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-[1.5px] rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg,transparent,${t.accent},transparent)`,
                }}
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{
                        background: t.accentBg,
                        border: `0.5px solid ${t.accentBorder}`,
                      }}
                    >
                      {t.icon}
                    </div>
                    <span
                      className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border ${t.tagCls}`}
                    >
                      {t.tag}
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-black text-white mb-3"
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {t.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 max-w-lg">
                    {t.desc}
                  </p>
                  <ul className="space-y-2.5 mb-7">
                    {t.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm text-white/50"
                      >
                        <div
                          className="mt-1 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{
                            background: t.accentBg,
                            border: `0.5px solid ${t.accentBorder}`,
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: t.accent }}
                          />
                        </div>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onGoToTracker(t.tag)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: t.accentBg,
                      border: `0.5px solid ${t.accentBorder}`,
                      color: t.accent,
                      boxShadow: `0 4px 16px ${t.glow}`,
                    }}
                  >
                    {t.cta} →
                  </button>
                </div>
                <div className="flex-shrink-0 self-center md:self-start mt-2">
                  <div
                    className="w-32 h-32 rounded-2xl flex flex-col items-center justify-center text-center"
                    style={{
                      background: t.accentBg,
                      border: `0.5px solid ${t.accentBorder}`,
                    }}
                  >
                    <div
                      className="text-3xl font-black mb-1"
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        color: t.accent,
                      }}
                    >
                      {t.stat.val}
                    </div>
                    <div className="text-[10px] text-white/30 uppercase tracking-wider font-medium px-2 leading-tight">
                      {t.stat.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative z-10 px-6 pb-24">
        <div
          className="max-w-xl mx-auto text-center rounded-3xl py-14 px-8 overflow-hidden relative"
          style={{
            background: "rgba(124,58,237,0.06)",
            border: "0.5px solid rgba(124,58,237,0.2)",
          }}
        >
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,rgba(124,58,237,0.13),transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          <h2
            className="relative font-black text-white mb-3 tracking-tight"
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: "clamp(1.6rem,3vw,2.4rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to take control?
          </h2>
          <p className="max-w-xl text-base md:text-lg text-gray-400 leading-relaxed font-light mb-9 font-serif">
            Your whole campus life, organized.
          </p>
          <div className="relative flex flex-wrap gap-3 justify-center">
            <button
              onClick={onSignup}
              className="px-8 py-3.5 rounded-2xl text-white font-bold text-base transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                boxShadow: "0 8px 26px rgba(124,58,237,0.45)",
              }}
            >
              Create Free Account →
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-3.5 rounded-2xl text-white/50 hover:text-white font-semibold text-base transition-all duration-200"
              style={{ border: "0.5px solid rgba(255,255,255,0.11)" }}
            >
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 text-center py-8 px-6"
        style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient
                id="flg2"
                x1="0"
                y1="0"
                x2="32"
                y2="32"
              >
                <stop stopColor="#7c3aed" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="9" fill="url(#flg2)" />
            <path
              d="M7 10h18M7 16h12M7 22h15"
              stroke="white"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <circle cx="24" cy="22" r="3.5" fill="#e879f9" />
          </svg>
          <span
            className="text-gray-400 font-bold text-sm"
            style={{ fontFamily: "'Syne',sans-serif" }}
          >
            CampusFlow
          </span>
        </div>
        <p className="text-gray-400 text-xs">
          © 2025 CampusFlow · Built for India's students.
        </p>
      </footer>
    </>
  );
}