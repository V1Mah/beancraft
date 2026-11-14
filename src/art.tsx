export function Bean({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 56" aria-hidden="true">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a5a3c" />
          <stop offset="1" stopColor="#3b2216" />
        </linearGradient>
      </defs>
      <ellipse cx="20" cy="28" rx="17" ry="25" fill="url(#bg)" />
      <path d="M20 4c-9 14 9 34 0 48" stroke="#1d0f09" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function CoffeeCup() {
  return (
    <svg className="cup" viewBox="0 0 400 360" role="img" aria-label="Чашка кофе">
      <defs>
        <linearGradient id="cupg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe3cd" />
          <stop offset="1" stopColor="#d99b6c" />
        </linearGradient>
        <radialGradient id="cof" cx=".4" cy=".4" r=".8">
          <stop offset="0" stopColor="#a8683c" />
          <stop offset="1" stopColor="#3a1f12" />
        </radialGradient>
      </defs>
      <ellipse cx="190" cy="326" rx="150" ry="20" fill="#000" opacity=".35" />
      <ellipse cx="190" cy="300" rx="140" ry="22" fill="#e9b88f" />
      <path d="M70 130h240c0 90-20 150-70 170h-100c-50-20-70-80-70-170z" fill="url(#cupg)" />
      <path d="M310 160c60-10 70 60 10 80l-22 6" stroke="#e9b88f" strokeWidth="18" fill="none" strokeLinecap="round" />
      <ellipse cx="190" cy="130" rx="120" ry="26" fill="#f6d3b4" />
      <ellipse cx="190" cy="132" rx="106" ry="20" fill="url(#cof)" />
      <path d="M150 132c20-10 40 10 70 0s20-8 30 0" stroke="#f5c6a0" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".8" />
      <g className="steam" stroke="#f5c6a0" strokeWidth="6" fill="none" strokeLinecap="round" opacity=".55">
        <path d="M140 90c-20-20 20-30 0-55" />
        <path d="M190 85c-20-20 20-35 0-65" />
        <path d="M240 90c-20-20 20-30 0-55" />
      </g>
    </svg>
  )
}
