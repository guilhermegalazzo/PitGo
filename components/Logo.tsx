"use client";

export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Subtle white aura around the hexagon */}
        <div className="absolute inset-0 bg-white/60 blur-lg rounded-full scale-110" />
        
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-9 w-auto relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
        >
          {/* Hexagonal Nut Shape - Deep Purple (#2D1A47) */}
          <path
            d="M50 5L90 25V75L50 95L10 75V25L50 5Z"
            fill="#2D1A47"
          />
          
          {/* Internal Gradient for Depth */}
          <defs>
            <linearGradient id="innerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#412763" />
              <stop offset="100%" stopColor="#2D1A47" />
            </linearGradient>
            <linearGradient id="boltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="100%" stopColor="#FF7A00" />
            </linearGradient>
          </defs>
          
          <path
            d="M52 10L86 27V73L52 90L18 73V27L52 10Z"
            fill="url(#innerGlow)"
            opacity="0.5"
          />

          {/* Speed Flash / Lighting Bolt - Custom Shape from image */}
          <path
            d="M65 24L35 52H52L40 82L75 48H58L70 24Z"
            fill="url(#boltGradient)"
          />
        </svg>
      </div>
      
      {/* "PIT" in Deep Purple/Navy, "GO" in Brand Orange - matching image font weight */}
      <span className="text-2xl font-black italic tracking-tighter text-[#1A1A3D] flex items-center">
        PIT<span className="text-[#FF7A00] ml-0.5">GO</span>
      </span>
    </div>
  );
}
