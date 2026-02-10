"use client";

import { Home, Receipt, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-3 px-6 md:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-sm mx-auto">
        <Link href="/" className={`flex flex-col items-center gap-1 ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}>
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/orders" className={`flex flex-col items-center gap-1 ${isActive("/orders") ? "text-primary" : "text-muted-foreground"}`}>
          <Receipt className="h-6 w-6" />
          <span className="text-[10px] font-medium">Orders</span>
        </Link>
        <Link href="/account" className={`flex flex-col items-center gap-1 ${isActive("/account") ? "text-primary" : "text-muted-foreground"}`}>
          <User className="h-6 w-6" />
          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </div>
    </div>
  );
}
