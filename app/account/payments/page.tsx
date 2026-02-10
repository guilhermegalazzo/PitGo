"use client";

import { useState } from "react";
import { ChevronLeft, Plus, CreditCard, Wallet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import Link from "next/link";

const SAVED_CARDS = [
  { id: 1, last4: "4242", expiry: "12/28", brand: "Visa" },
  { id: 2, last4: "8899", expiry: "05/27", brand: "Mastercard" },
];

export default function PaymentsPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background z-20">
        <Link href="/account" className="p-2 -ml-2">
            <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-lg font-bold">Payments</h1>
        <Logo className="h-6 opacity-40 shrink-0" />
      </div>

      <div className="p-6 space-y-8">
        {/* Wallet Balance */}
        <div className="bg-primary rounded-3xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-sm font-medium opacity-80 mb-1">Available Credits</p>
                <h2 className="text-4xl font-black italic">$42.50</h2>
            </div>
            <Wallet className="absolute right-[-20px] bottom-[-20px] h-32 w-32 opacity-10 rotate-12" />
        </div>

        {/* Saved Cards */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Saved Cards</h3>
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 px-2" onClick={() => setShowAdd(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add New
                </Button>
            </div>

            <div className="space-y-3">
                {SAVED_CARDS.map((card) => (
                    <div key={card.id} className="flex items-center p-4 bg-card border border-border rounded-2xl group hover:border-primary/50 transition-colors">
                        <div className="h-10 w-12 bg-secondary/5 rounded-md flex items-center justify-center mr-4 border border-border">
                            <CreditCard className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm">•••• •••• •••• {card.last4}</p>
                            <p className="text-xs text-muted-foreground">{card.brand} • Expires {card.expiry}</p>
                        </div>
                        <Trash2 className="h-4 w-4 text-muted-foreground/40 hover:text-destructive cursor-pointer" />
                    </div>
                ))}
            </div>
        </section>

        {/* Form Modal (Simplified) */}
        {showAdd && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-end animate-in fade-in duration-200">
                <div className="bg-background w-full rounded-t-[32px] p-8 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Add Credit Card</h3>
                        <div className="h-1.5 w-12 bg-secondary/20 rounded-full cursor-pointer" onClick={() => setShowAdd(false)} />
                    </div>
                    
                    <div className="space-y-4 mb-8">
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Card Number</label>
                            <input className="w-full bg-secondary/5 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Expiry</label>
                                <input className="w-full bg-secondary/5 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="MM/YY" />
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">CVV</label>
                                <input className="w-full bg-secondary/5 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="123" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 py-6 rounded-xl border-border h-auto" onClick={() => setShowAdd(false)}>Cancel</Button>
                        <Button className="flex-1 py-6 rounded-xl h-auto font-bold text-white" onClick={() => setShowAdd(false)}>Save Card</Button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
