"use client";

export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* The Aura / Glow Effect */}
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
        
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-auto relative z-10 opacity-70 transition-opacity hover:opacity-100"
          style={{ 
            filter: 'drop-shadow(0 0 8px rgba(255, 122, 0, 0.6))'
          }}
        >
          {/* Hexagonal Nut Shape - Deep Purple */}
          <path
            d="M50 5L90 25V75L50 95L10 75V25L50 5Z"
            fill="#2D1A47"
          />
          {/* Speed Flash / Lighting Bolt - Orange */}
          <path
            d="M60 25L35 55H55L40 80L70 45H50L60 25Z"
            fill="#FF7A00"
          />
          {/* Subtle highlight line */}
          <path
            d="M50 5L90 25"
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
        </svg>
      </div>
      <span className="text-xl font-black italic tracking-tighter text-foreground">
        PIT<span className="text-primary font-black uppercase">GO</span>
      </span>
    </div>
  );
}
