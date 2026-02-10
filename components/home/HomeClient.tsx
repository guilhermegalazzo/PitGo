"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Filter, Car, Wrench, SprayCan, Disc, Database, MapPin, Loader2, Navigation, User } from "lucide-react";
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
  const [address, setAddress] = useState("Detecting location...");
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
    <div className="flex flex-col min-h-screen pb-20 bg-background text-foreground animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md shadow-sm pb-2">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Logo />
             <Link href="/account" className="hidden md:flex items-center gap-1.5 p-2 bg-secondary/10 rounded-xl hover:bg-secondary/20 transition-colors">
                <User className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-foreground">My Account</span>
             </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleSeed} title="Seed Database" className="hover:bg-primary/10">
                <Database className="h-4 w-4 text-primary" />
            </Button>
            
            <Link href="/account" className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 rounded-xl">
                    <User className="h-5 w-5 text-primary" />
                </Button>
            </Link>

            <div 
              className="flex flex-col cursor-pointer group items-end"
              onClick={() => setShowLocationSearch(!showLocationSearch)}
            >
                <div className="flex items-center gap-1 text-primary group-hover:opacity-80 transition-opacity">
                    <Navigation className="h-2.5 w-2.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">Current Location</span>
                </div>
                <div className="flex items-center gap-1 text-primary group-hover:opacity-80 transition-opacity">
                    <span className="font-bold text-xs truncate max-w-[150px] text-foreground">
                        {address === "Detecting location..." ? (
                            <span className="animate-pulse">Locating...</span>
                        ) : address}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                </div>
            </div>
          </div>
        </div>
        
        {showLocationSearch && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
            <LocationSearch 
              onLocationSelect={handleLocationSelect}
              placeholder="Where are you located?"
              initialValue={address === "Detecting location..." ? "" : address}
              autoDetect={true}
            />
          </div>
        )}

        {/* This invisible Search is just to trigger autoDetect on mount if needed */}
        {address === "Detecting location..." && !showLocationSearch && (
            <div className="hidden">
                 <LocationSearch 
                    onLocationSelect={handleLocationSelect}
                    autoDetect={true}
                />
            </div>
        )}

        {!showLocationSearch && (
          <div className="px-4 pb-2">
              <div className="relative flex items-center bg-secondary/10 rounded-xl px-4 py-2 hover:bg-secondary/20 transition-all cursor-text border border-transparent focus-within:border-primary/30">
                  <Search className="h-4 w-4 text-muted-foreground mr-2" />
                  <input 
                      type="text"
                      placeholder="Search for car care..."
                      className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground h-9"
                  />
              </div>
          </div>
        )}
      </header>

      {/* Categories Scroll */}
      <section className="py-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 px-4 min-w-max">
            {CATEGORIES.map((cat, i) => (
                <div key={i} onClick={() => toggleCategory(cat.value)} className="cursor-pointer">
                    <CategoryItem icon={cat.icon} label={cat.label} isActive={selectedCategory === cat.value} />
                </div>
            ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-4">
        <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-extrabold tracking-tight">
                {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Specialists` : "Recommended Nearby"}
             </h2>
             <div className="bg-secondary/10 p-2 rounded-xl cursor-pointer hover:bg-secondary/20 transition-all">
                <Filter className="h-4 w-4 text-foreground" />
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
                <div className="text-center py-16 bg-secondary/5 rounded-3xl border border-dashed border-border flex flex-col items-center px-8">
                    <MapPin className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-bold mb-2">No partners in this area</h3>
                    <p className="text-sm text-muted-foreground mb-6">We haven't reached this location yet. Try searching in São Paulo for a demo!</p>
                    
                    <div className="flex flex-col gap-2 w-full">
                        <Button variant="outline" onClick={() => handleLocationSelect("Av. Paulista, São Paulo", -23.561414, -46.655881)} className="rounded-xl">
                            Try São Paulo Demo
                        </Button>
                        <Button variant="link" onClick={() => {setSelectedCategory(null); setCoordinates(null); setAddress("Discovery Mode");}} className="text-primary">
                            Show all shops
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
