"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Camera, CheckCircle2, Store, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function ProviderRegisterPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background z-20">
        <Link href="/account" className="p-2 -ml-2">
            <ChevronLeft className="h-6 w-6" />
        </Link>
        <Logo className="h-6" />
        <div className="w-10" />
      </div>

      <div className="flex-1 p-6 max-w-md mx-auto w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-secondary/20"}`} />
            ))}
        </div>

        {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Store className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-center">Join the PitGo Network</h1>
                    <p className="text-muted-foreground text-center mt-2">Let's start with your shop details</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Shop Name</label>
                        <input className="w-full bg-secondary/5 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. Master Polish Auto" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Business Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                            <input className="w-full bg-secondary/5 border border-border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Street, Number, City" />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-center">Select Services</h1>
                    <p className="text-muted-foreground text-center mt-2">What does your shop offer?</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {["Full Wash", "Detailing", "Mechanic", "Oil Change", "Tires", "AC Service"].map((svc) => (
                        <div key={svc} className="flex items-center p-3 border border-border rounded-xl bg-card hover:border-primary cursor-pointer transition-colors group">
                           <div className="h-4 w-4 rounded border border-border mr-2 group-hover:border-primary transition-colors" />
                           <span className="text-sm font-medium">{svc}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="flex flex-col items-center justify-center mb-8 text-center">
                    <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Camera className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Showcase Your Work</h1>
                    <p className="text-muted-foreground mt-2 px-4">Upload at least 3 high-quality photos of your shop or recent services.</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square bg-secondary/10 border-2 border-dashed border-border rounded-xl flex items-center justify-center cursor-pointer hover:bg-secondary/20 transition-all">
                             <Camera className="h-6 w-6 text-muted-foreground" />
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="p-6 border-t border-border bg-background flex gap-4">
        {step > 1 && (
            <Button variant="outline" className="flex-1 py-6 rounded-xl border-border h-auto" onClick={prevStep}>
                Back
            </Button>
        )}
        <Button className="flex-[2] py-6 rounded-xl h-auto font-bold text-white shadow-lg shadow-primary/20" onClick={step === 3 ? () => window.location.href = '/account' : nextStep}>
            {step === 3 ? "Complete Registration" : "Next Step"}
            {step < 3 && <ChevronRight className="ml-2 h-4 w-4" />}
            {step === 3 && <CheckCircle2 className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
