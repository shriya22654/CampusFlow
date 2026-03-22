// app.js  ─  CampusFlow Root App
// This is the entry point. It holds global CSS, the AppShell wrapper,
// and the page router. Import & render <App /> in your index.js.

import { useState,useEffect } from "react";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard"; // Path sahi check kar lena

/* ─────────────────────────── GLOBAL CSS ─────────────────────────── */
// All shared styles live here so they are injected once at the root level.
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  @keyframes shimmer {
    0%   { background-position: -200% center }
    100% { background-position:  200% center }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px) }
    to   { opacity: 1; transform: translateY(0)    }
  }
  @keyframes floatLogo {
    0%,100% { transform: translateY(0)  }
    50%     { transform: translateY(-8px) }
  }
  @keyframes pulse2 {
    0%,100% { opacity: 1   }
    50%     { opacity: 0.3 }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(30px) scale(0.97) }
    to   { opacity: 1; transform: translateY(0)    scale(1)    }
  }
  @keyframes orb1 {
    0%,100% { transform: translate(0, 0)      }
    50%     { transform: translate(30px, -20px) }
  }
  @keyframes orb2 {
    0%,100% { transform: translate(0, 0)       }
    50%     { transform: translate(-20px, 30px) }
  }

  .shimmer {
    background: linear-gradient(90deg, #a78bfa, #e879f9, #67e8f9, #a78bfa);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 5s linear infinite;
  }

  .fu1 { animation: fadeUp 0.6s ease 0.05s both }
  .fu2 { animation: fadeUp 0.6s ease 0.15s both }
  .fu3 { animation: fadeUp 0.6s ease 0.25s both }
  .fu4 { animation: fadeUp 0.6s ease 0.38s both }

  .slide-in { animation: slideIn 0.5s cubic-bezier(0.16,1,0.3,1) both }

  html { scroll-behavior: smooth }
  * { box-sizing: border-box }

  ::-webkit-scrollbar       { width: 4px }
  ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 9px }

  .grid-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px rgba(124,58,237,0.07) inset !important;
    -webkit-text-fill-color: #fff !important;
    caret-color: #fff;
  }

  .auth-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(139,92,246,0.22);
    border-radius: 14px;
    padding: 13px 16px;
    color: #fff;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: all 0.2s;
  }
  .auth-input::placeholder { color: rgba(255,255,255,0.22) }
  .auth-input:focus {
    border-color: rgba(139,92,246,0.6);
    background: rgba(124,58,237,0.08);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
  }

  .orb1 { animation: orb1 8s  ease-in-out infinite }
  .orb2 { animation: orb2 10s ease-in-out infinite }

  .divider-line { flex: 1; height: 0.5px; background: rgba(255,255,255,0.08) }
`;

/* ─────────────────────────── APP SHELL ─────────────────────────── */
// Wraps every page with the shared dark background, grid overlay,
// and cursor-following glow effect.
function AppShell({ children, mouse, setMouse }) {
  return (
    <div
      onMouseMove={(e) =>
        setMouse({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        })
      }
      className="min-h-screen w-full overflow-x-hidden relative"
      style={{
        background:
          "radial-gradient(ellipse at 25% 0%, #0e0520 0%, #060210 50%, #020108 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Inject global styles once */}
      <style>{GLOBAL_CSS}</style>

      {/* Subtle grid overlay */}
      <div className="grid-bg" />

      {/* Cursor glow */}
      <div
        className="fixed w-[480px] h-[480px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle,rgba(124,58,237,0.11) 0%,transparent 65%)",
          left: `${mouse.x * 100}%`,
          top: `${mouse.y * 100}%`,
          transform: "translate(-50%,-50%)",
          filter: "blur(40px)",
          transition: "left 1s ease, top 1s ease",
        }}
      />

      {children}
    </div>
  );
}

/* ─────────────────────────── ROOT APP ─────────────────────────── */
// Controls which page is shown. Pass navigate callbacks as props
// so each page can trigger routing without knowing about the others.
export default function App() {
  const [page, setPage] = useState("home"); 
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  // 1. Auto-login logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setPage("dashboard"); // Agar token hai toh seedha dashboard dikhao
    }
  }, []);

  // 2. Logout function define karna padega
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName"); // Agar naam save kiya hai toh wo bhi hata do
    setPage("home");
  };

  return (
    <AppShell mouse={mouse} setMouse={setMouse}>
      {page === "home" && (
        <Home
          onLogin={() => setPage("login")}
          onSignup={() => setPage("signup")}
          onGoToTracker={() => setPage("login")}
        />
      )}

      {page === "login" && (
        <Login
          onGoHome={() => setPage("dashboard")} 
          onGoSignup={() => setPage("signup")}
        />
      )}

      {page === "signup" && (
        <Signup
          onGoHome={() => setPage("home")}
          onGoLogin={() => setPage("login")}
        />
      )}

      {/* 3. YAHAN DASHBOARD ADD HO GAYA */}
      {page === "dashboard" && (
        <Dashboard onLogout={handleLogout} />
      )}
    </AppShell>
  );
}