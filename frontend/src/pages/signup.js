// signup.js  ─  CampusFlow Sign Up Page
// Props: onGoHome, onGoLogin
import axios from "axios";
import { useState } from "react";
import Logo from "../components/logo";

function SocialBtn({ icon, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
      style={{
        background: hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.7)",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function Signup({
  onGoHome = () => {},
  onGoLogin = () => {},
}) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [step, setStep] = useState(0); // 0 = form, 1 = success

  const handleSubmit = async () => {
  if (!agree) return;
  
  setLoading(true);
  try {
    await axios.post("http://localhost:1485/api/auth/register", {
      name: form.name,
      email: form.email,
      password: form.password,
    });

    // Success screen dikhane ke liye step 1 par set karo
    setStep(1); 
  } catch (err) {
    alert(err.response?.data?.message || "Registration fail!");
  } finally {
    setLoading(false);
  }
};

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthColors = ["#ef4444", "#f59e0b", "#10b981", "#8b5cf6"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  // ── Success Screen ──
  if (step === 1) {
    return (
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="slide-in text-center max-w-sm">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              boxShadow: "0 16px 48px rgba(124,58,237,0.45)",
            }}
          >
            <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2
            className="text-3xl font-black text-white mb-3"
            style={{ fontFamily: "'Syne',sans-serif" }}
          >
            You're in! 🎉
          </h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            Your CampusFlow account has been created. Time to take control of your campus life.
          </p>
          <button
            onClick={onGoLogin}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              boxShadow: "0 8px 28px rgba(124,58,237,0.42)",
            }}
          >
            Go to Sign In →
          </button>
        </div>
      </div>
    );
  }

  // ── Sign Up Form ──
  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-6 md:px-10 py-5"
        style={{ borderBottom: "0.5px solid rgba(139,92,246,0.10)" }}
      >
        <Logo onClick={onGoHome} />
        <div className="flex items-center gap-2 text-sm text-white/40">
          <span>Have an account?</span>
          <button
            onClick={onGoLogin}
            className="text-violet-400 font-semibold hover:text-violet-300 transition-colors"
          >
            Sign in →
          </button>
        </div>
      </nav>

      {/* Ambient orbs */}
      <div
        className="fixed top-1/3 -right-24 w-96 h-96 rounded-full pointer-events-none orb1"
        style={{
          background: "radial-gradient(circle,rgba(232,121,249,0.08),transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="fixed bottom-1/4 -left-16 w-64 h-64 rounded-full pointer-events-none orb2"
        style={{
          background: "radial-gradient(circle,rgba(124,58,237,0.09),transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div
          className="slide-in w-full max-w-md rounded-3xl p-8 md:p-10 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "0.5px solid rgba(139,92,246,0.18)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Card inner glow */}
          <div
            className="absolute -top-12 -left-12 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle,rgba(232,121,249,0.10),transparent 70%)",
              filter: "blur(35px)",
            }}
          />

          {/* Header */}
          <div className="relative mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-[10px] font-bold tracking-widest uppercase text-violet-300 bg-violet-500/10 border border-violet-500/25">
              <span
                className="w-1.5 h-1.5 rounded-full bg-violet-400"
                style={{ animation: "pulse2 2s infinite" }}
              />
              Free forever
            </div>
            <h1
              className="text-3xl font-black text-white mb-2"
              style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-0.03em" }}
            >
              Join <span className="shimmer">CampusFlow</span>
            </h1>
            <p className="text-sm text-white/35">Your campus OS, set up in 30 seconds.</p>
          </div>

          {/* Social logins */}
          <div className="flex gap-3 mb-6">
            <SocialBtn
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.26 9.77A7.24 7.24 0 0 1 12 4.75c1.73 0 3.29.63 4.51 1.65L19.87 3C17.9 1.14 15.1 0 12 0 7.56 0 3.73 2.58 1.84 6.36l3.42 3.41z" />
                  <path fill="#34A853" d="M16.04 18.01A7.19 7.19 0 0 1 12 19.25c-2.96 0-5.5-1.78-6.72-4.36l-3.43 3.4C3.73 21.42 7.56 24 12 24c3.01 0 5.88-1.05 8.01-3.01l-3.97-2.98z" />
                  <path fill="#4A90D9" d="M20.01 20.99C22.41 18.71 24 15.48 24 12c0-.73-.1-1.5-.24-2.25H12v4.75h6.73c-.32 1.64-1.22 2.98-2.69 3.93l3.97 2.56z" />
                  <path fill="#FBBC05" d="M5.28 14.89A7.33 7.33 0 0 1 4.75 12c0-.99.17-1.95.49-2.82L1.82 5.77A11.93 11.93 0 0 0 0 12c0 1.94.46 3.78 1.28 5.41l3.99-2.52z" />
                </svg>
              }
              label="Google"
            />
            <SocialBtn
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.17 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02.005 2.04.138 3 .404 2.28-1.552 3.29-1.23 3.29-1.23.64 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              }
              label="GitHub"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="divider-line" />
            <span className="text-[11px] text-white/25 font-medium uppercase tracking-widest">or</span>
            <div className="divider-line" />
          </div>

          {/* Fields */}
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                className="auth-input"
                type="text"
                placeholder="Arjun Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2">
                College Email
              </label>
              <input
                className="auth-input"
                type="email"
                placeholder="arjun@iit.ac.in"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  className="auth-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: "44px" }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPass ? (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength meter */}
              {form.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{
                          background:
                            i < strength
                              ? strengthColors[strength - 1]
                              : "rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[11px]"
                    style={{
                      color:
                        strength > 0
                          ? strengthColors[strength - 1]
                          : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {strengthLabels[strength - 1] || ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 mb-6 cursor-pointer group">
            <div
              onClick={() => setAgree(!agree)}
              className="mt-0.5 w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200"
              style={{
                background: agree
                  ? "linear-gradient(135deg,#7c3aed,#4f46e5)"
                  : "rgba(255,255,255,0.04)",
                border: agree ? "none" : "0.5px solid rgba(255,255,255,0.15)",
                boxShadow: agree ? "0 2px 10px rgba(124,58,237,0.4)" : "none",
              }}
            >
              {agree && (
                <svg width="11" height="11" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-[12px] text-white/35 leading-relaxed">
              I agree to CampusFlow's{" "}
              <span className="text-violet-400 cursor-pointer hover:text-violet-300">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-violet-400 cursor-pointer hover:text-violet-300">
                Privacy Policy
              </span>
            </span>
          </label>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !agree}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: agree
                ? "linear-gradient(135deg,#7c3aed,#4f46e5)"
                : "rgba(124,58,237,0.25)",
              boxShadow: agree ? "0 8px 28px rgba(124,58,237,0.42)" : "none",
              opacity: loading ? 0.8 : 1,
              cursor: agree ? "pointer" : "not-allowed",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Creating account...
              </span>
            ) : (
              "Create Free Account →"
            )}
          </button>

          {/* Footer link */}
          <p className="text-center text-sm text-white/30 mt-5">
            Already have an account?{" "}
            <button
              onClick={onGoLogin}
              className="text-violet-400 font-semibold hover:text-violet-300 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}