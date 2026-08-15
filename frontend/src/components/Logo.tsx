interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export default function Logo({ className = 'h-8 w-auto', showWordmark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 font-sans ${className}`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
        <defs>
          <linearGradient id="fiq-grad1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="fiq-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        <rect width="40" height="40" rx="10" fill="#0f172a" />

        <rect x="9" y="12" width="5" height="16" rx="2.5" fill="url(#fiq-grad1)" />
        <path
          d="M14 12H27C28.3807 12 29.5 13.1193 29.5 14.5V14.5C29.5 15.8807 28.3807 17 27 17H14V12Z"
          fill="url(#fiq-grad1)"
        />
        <path
          d="M14 19.5H23C24.3807 19.5 25.5 20.6193 25.5 22V22C25.5 23.3807 24.3807 24.5 23 24.5H14V19.5Z"
          fill="url(#fiq-grad2)"
        />

        <circle cx="29" cy="24" r="2" fill="#10b981" />
      </svg>
      {showWordmark && (
        <span className="text-xl font-extrabold tracking-tight text-white">
          financial<span className="text-emerald-500">IQ</span>
        </span>
      )}
    </div>
  );
}
