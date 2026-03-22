// logo.js  ─  CampusFlow Shared Logo Component
// Import this in any file that needs the logo.

export default function Logo({ size = 32, onClick }) {
  return (
    <div
      className="flex items-center gap-2.5 cursor-pointer"
      onClick={onClick}
      style={{ filter: "drop-shadow(0 0 8px rgba(167,139,250,0.4))" }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="ngl" x1="0" y1="0" x2="32" y2="32">
            <stop stopColor="#7c3aed" />
            <stop offset="1" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#ngl)" />
        <path
          d="M7 10h18M7 16h12M7 22h15"
          stroke="white"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <circle cx="24" cy="22" r="3.5" fill="#e879f9" />
      </svg>
      <span
        className="text-xl font-black text-white tracking-tight"
        style={{ fontFamily: "'Syne',sans-serif" }}
      >
        Campus
        <span className="shimmer">Flow</span>
      </span>
    </div>
  );
}