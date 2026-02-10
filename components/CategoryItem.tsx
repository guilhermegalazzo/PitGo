import { LucideIcon } from "lucide-react";

interface CategoryItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
}

export function CategoryItem({ icon: Icon, label, isActive }: CategoryItemProps) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer min-w-[72px]">
      <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${isActive ? "bg-primary/10" : "bg-secondary/5"}`}>
        <Icon className={`h-8 w-8 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
        {label}
      </span>
    </div>
  );
}
