"use client";

import { LucideIcon } from "lucide-react";

interface CategoryItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
}

export function CategoryItem({ icon: Icon, label, isActive }: CategoryItemProps) {
  return (
    <div className="flex flex-col items-center gap-2 group transition-all">
      <div 
        className={`
          w-20 h-20 rounded-[1.75rem] flex items-center justify-center transition-all duration-500 relative overflow-hidden
          ${isActive 
            ? "bg-white shadow-2xl shadow-primary/20 scale-105 border-2 border-primary/20" 
            : "bg-white border border-secondary/5 shadow-lg shadow-black/[0.03] hover:shadow-xl hover:scale-110"
          }
        `}
      >
        {/* Background icon decoration as seen in design */}
        <Icon 
            className={`
                h-16 w-16 absolute -top-4 -right-4 opacity-[0.05] -rotate-12 transition-transform duration-700
                ${isActive ? "text-primary scale-125" : "text-[#1A1A3D]"}
            `} 
            strokeWidth={1}
        />

        <div className="relative z-10">
            <Icon 
                className={`
                    h-9 w-9 transition-all duration-500
                    ${isActive ? "text-primary drop-shadow-[0_2px_4px_rgba(255,122,0,0.3)]" : "text-[#1A1A3D] opacity-90"}
                `} 
                strokeWidth={2}
            />
        </div>
      </div>
      <span 
        className={`
          text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-500 mt-1
          ${isActive ? "text-primary scale-105" : "text-[#1A1A3D] opacity-60"}
        `}
      >
        {label}
      </span>
    </div>
  );
}
