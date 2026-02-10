"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Filter, Car, Wrench, SprayCan, Disc, Database, MapPin, Loader2, Navigation, User, Home, Sparkles, MoreHorizontal } from "lucide-react";
import { CategoryItem } from "@/components/CategoryItem";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceCardSkeleton } from "@/components/ServiceCardSkeleton";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { getShops, seedDatabase } from "@/app/actions/shops";
import { LocationSearch } from "@/components/maps/LocationSearch";
import Link from "next/link";

const CATEGORIES = [
  { label: "Wash", value: "wash", icon: Car },
  { label: "Detailing", value: "detailing", icon: SprayCan },
  { label: "Mechanic", value: "repair", icon: Wrench },
  { label: "Tires", value: "tires", icon: Disc },
];

interface HomeClientProps {
  initialShops: any[];
}

export function HomeClient({ initialShops }: HomeClientProps) {
  const [address, setAddress] = useState("Locating...");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [shops, setShops] = useState<any[]>(initialShops);
  const [loading, setLoading] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  // Re-fetch only if filters or coordinates change after initial mount
  useEffect(() => {
    if (selectedCategory !== null || coordinates !== null) {
      fetchShops();
    }
  }, [selectedCategory, coordinates]);

  const fetchShops = async () => {
    setLoading(true);
    const data = await getShops(selectedCategory || "all", coordinates || undefined);
    setShops(data || []);
    setLoading(false);
  };

  const handleLocationSelect = (newAddress: string, lat: number, lng: number) => {
    setAddress(newAddress);
    setCoordinates({ lat, lng });
    setShowLocationSearch(false);
  };

  const handleSeed = async () => {
    const res = await seedDatabase();
    alert(res.message || res.error);
    fetchShops();
  };

  const toggleCategory = (value: string) => {
    setSelectedCategory(selectedCategory === value ? null : value);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-[#F9F9FF] text-foreground animate-in fade-in duration-500">
      {/* Header Section - Pill Style matching image */}
      <header className="px-4 pt-6 pb-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/5 px-6 py-4 flex items-center justify-between border border-white">
          <Logo className="h-8" />
          
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setShowLocationSearch(!showLocationSearch)}
            >
                <Navigation className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-[#1A1A3D] truncate max-w-[100px]">
                    {address}
                </span>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground opacity-40" />
            </div>
            
            {/* Action Buttons hidden in a clean way */}
            <div className="flex items-center gap-2 border-l border-secondary/20 pl-3 ml-1">
                <Link href="/account">
                    <User className="h-5 w-5 text-[#1A1A3D] opacity-40 hover:opacity-100 transition-opacity" />
                </Link>
                <Button variant="ghost" size="icon" onClick={handleSeed} className="h-8 w-8 text-primary/40 hover:text-primary">
                    <Database className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </div>
        
        {showLocationSearch && (
          <div className="mt-4 px-2 animate-in slide-in-from-top-2 duration-300">
            <LocationSearch 
              onLocationSelect={handleLocationSelect}
              placeholder="Where should we meet you?"
              initialValue={address === "Locating..." ? "" : address}
              autoDetect={true}
            />
          </div>
        )}

        {/* Auto Detect Trigger */}
        {address === "Locating..." && !showLocationSearch && (
            <div className="hidden">
                 <LocationSearch 
                    onLocationSelect={handleLocationSelect}
                    autoDetect={true}
                />
            </div>
        )}
      </header>

      {/* Hero Banner - Mobile Emphasis */}
      {!loading && !selectedCategory && (
          <div className="px-5 mb-4">
              <div className="bg-gradient-to-br from-[#2D1A47] to-[#1A1A3D] p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">On-Demand fleet</span>
                    </div>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-1 leading-none">PITGO <br/>AT YOUR DOOR</h3>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.1em] mt-3">Professional car care everywhere.</p>
                  </div>
                  <Car className="absolute -right-8 -bottom-8 h-40 w-40 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              </div>
          </div>
      )}

      {/* Categories Grid - Matching mockup */}
      <section className="py-6 px-4">
        <div className="grid grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
                <div key={i} onClick={() => toggleCategory(cat.value)} className="cursor-pointer">
                    <CategoryItem icon={cat.icon} label={cat.label} isActive={selectedCategory === cat.value} />
                </div>
            ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-2">
        <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-black italic tracking-tighter uppercase text-[#1A1A3D]">
                {selectedCategory ? `${selectedCategory} fleet` : "Top Rated Nearby"}
             </h2>
             <div className="bg-white p-2.5 rounded-2xl cursor-pointer hover:bg-secondary/10 transition-all shadow-sm border border-white">
                <Filter className="h-4 w-4 text-[#1A1A3D]" />
             </div>
        </div>
        
        <div className="flex flex-col gap-6 pb-6">
            {loading ? (
                <div className="flex flex-col gap-6">
                    {[1, 2, 3].map((i) => (
                        <ServiceCardSkeleton key={i} />
                    ))}
                </div>
            ) : shops.length > 0 ? (
                shops.map((shop) => (
                    <ServiceCard 
                        key={shop.id}
                        id={shop.id}
                        image={shop.image_url}
                        title={shop.name}
                        rating={shop.rating}
                        reviews={120}
                        price="$$"
                        deliveryTime={shop.distance ? `${Math.round(shop.distance * 2 + 5)}-${Math.round(shop.distance * 2 + 10)} min` : "20-30 min"}
                        distance={shop.distance ? `${shop.distance.toFixed(1)} km` : undefined}
                    />
                ))
            ) : (
                <div className="text-center py-16 bg-white rounded-[3rem] border border-white flex flex-col items-center px-8 shadow-xl shadow-black-[0.02]">
                    <MapPin className="h-12 w-12 text-primary/20 mb-4" />
                    <h3 className="text-lg font-black uppercase italic tracking-tighter text-[#1A1A3D]">Out of service area</h3>
                    <p className="text-xs text-muted-foreground mb-8 text-center max-w-[200px] leading-relaxed">
                        We are currently deploying in São Paulo. Try the demo to see the magic.
                    </p>
                    
                    <div className="flex flex-col gap-3 w-full max-w-[200px]">
                        <Button variant="default" onClick={() => handleLocationSelect("Av. Paulista, São Paulo", -23.561414, -46.655881)} className="rounded-2xl h-12 shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px]">
                            Try São Paulo Demo
                        </Button>
                        <Button variant="ghost" onClick={() => {setSelectedCategory(null); setCoordinates(null); setAddress("All Shops");}} className="text-[#1A1A3D]/40 text-[10px] uppercase font-black tracking-widest h-10">
                            Clear Filters
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
