"use client";

import { useState } from "react";
import { Settings, Percent, Wallet, Users, ChevronLeft, ShieldCheck, PieChart, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import Link from "next/link";

const STATS = [
    { label: "Active Partners", value: "24", icon: Users },
    { label: "Revenue (MTD)", value: "$12,450", icon: Wallet },
    { label: "Completion Rate", value: "98.2%", icon: Activity },
];

export default function AdminPage() {
  const [commission, setCommission] = useState(15);
  const [paymentEnabled, setPaymentEnabled] = useState({ card: true, transfer: false, cash: true });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-10">
      {/* Header Admin */}
      <div className="p-4 border-b-4 border-primary bg-secondary/5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="h-5 w-5" />
            <span className="font-bold text-sm">EXIT ADMIN</span>
        </Link>
        <div className="flex items-center gap-2">
           <ShieldCheck className="h-5 w-5 text-primary" />
           <span className="text-sm font-black italic">SUPERUSER</span>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-2xl mx-auto w-full">
        <header className="flex flex-col items-center">
             <Logo className="h-10 mb-2" />
             <h1 className="text-3xl font-black italic tracking-tighter uppercase">Operations Panel</h1>
             <p className="text-muted-foreground font-medium">Platform Management & Settings</p>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
            {STATS.map((stat) => (
                <div key={stat.label} className="bg-card border border-border p-3 rounded-2xl text-center">
                    <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground font-bold uppercase truncate">{stat.label}</p>
                    <p className="text-lg font-black italic">{stat.value}</p>
                </div>
            ))}
        </div>

        {/* Commission Setting */}
        <section className="bg-card border border-border rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <PieChart className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Commission Rate</h2>
            </div>
            
            <div className="flex items-center justify-between bg-primary/5 p-4 rounded-2xl mb-4 border border-primary/20">
                <span className="text-lg font-medium text-muted-foreground uppercase text-xs tracking-widest font-black">PitGo Earnings %</span>
                <span className="text-3xl font-black italic text-primary">{commission}%</span>
            </div>
            
            <input 
                type="range" 
                min="0" 
                max="40" 
                step="5"
                value={commission}
                onChange={(e) => setCommission(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <span>0% Free</span>
                <span>40% Max</span>
            </div>
        </section>

        {/* Payment Configuration */}
        <section className="bg-card border border-border rounded-[2rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <Settings className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Payment Methods</h2>
            </div>
            
            <div className="space-y-3">
                {[
                    { id: 'card', name: "Credit/Debit Card", active: paymentEnabled.card },
                    { id: 'transfer', name: "Bank Transfer", active: paymentEnabled.transfer },
                    { id: 'cash', name: "Pay at Shop (Cash)", active: paymentEnabled.cash },
                ].map((method) => (
                    <div 
                        key={method.id} 
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${method.active ? "bg-primary/10 border-primary/30" : "bg-transparent border-border opacity-60"}`}
                        onClick={() => setPaymentEnabled(prev => ({ ...prev, [method.id]: !method.active }))}
                    >
                        <span className="font-bold">{method.name}</span>
                        <div className={`h-6 w-11 rounded-full relative transition-colors ${method.active ? "bg-primary" : "bg-muted"}`}>
                            <div className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all ${method.active ? "right-1" : "left-1"}`} />
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <Button className="w-full py-8 rounded-[1.5rem] font-black text-lg italic shadow-xl shadow-primary/30 flex gap-2">
            SAVE OPERATIONAL CHANGES
        </Button>
      </div>
    </div>
  );
}
