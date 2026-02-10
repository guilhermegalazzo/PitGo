"use client";

export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-auto"
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
      <span className="text-xl font-black italic tracking-tighter text-foreground">
        PIT<span className="text-primary font-black uppercase">GO</span>
      </span>
    </div>
  );
}
