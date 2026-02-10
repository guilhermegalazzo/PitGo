"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Camera, CheckCircle2, Store, MapPin, Briefcase, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { LocationSearch } from "@/components/maps/LocationSearch";
import { ServiceRangeMap } from "@/components/maps/ServiceRangeMap";

export default function ProviderRegisterPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    lat: -23.561414,
    lng: -46.655881,
    radius: 10000, // 10km
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setFormData({ ...formData, address, lat, lng });
  };

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
            {[1, 2, 3, 4].map((s) => (
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
                        <input 
                          className="w-full bg-secondary/5 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50" 
                          placeholder="e.g. Master Polish Auto"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold ml-1">Business Address</label>
                        <LocationSearch 
                          onLocationSelect={handleLocationSelect}
                          initialValue={formData.address}
                          placeholder="Search your business address"
                        />
                    </div>
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="flex flex-col items-center justify-center mb-4">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Globe className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-center">Your Service Area</h1>
                    <p className="text-muted-foreground text-center mt-2 px-6">Select your location on the map and define how far you travel.</p>
                </div>

                <ServiceRangeMap 
                   center={{ lat: formData.lat, lng: formData.lng }}
                   radius={formData.radius}
                   onRadiusChange={(r) => setFormData({ ...formData, radius: r })}
                />
                
                <div className="bg-secondary/5 p-4 rounded-xl border border-border">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Radius</span>
                        <span className="font-bold text-primary">{(formData.radius / 1000).toFixed(1)} km</span>
                    </div>
                    <input 
                        type="range" 
                        min="1000" 
                        max="50000" 
                        step="500" 
                        value={formData.radius} 
                        onChange={(e) => setFormData({ ...formData, radius: parseInt(e.target.value) })}
                        className="w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            </div>
        )}

        {step === 3 && (
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

        {step === 4 && (
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
        <Button 
          className="flex-[2] py-6 rounded-xl h-auto font-bold text-white shadow-lg shadow-primary/20" 
          onClick={step === totalSteps ? () => window.location.href = '/account' : nextStep}
          disabled={step === 1 && (!formData.name || !formData.address)}
        >
            {step === totalSteps ? "Complete Registration" : "Next Step"}
            {step < totalSteps && <ChevronRight className="ml-2 h-4 w-4" />}
            {step === totalSteps && <CheckCircle2 className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
