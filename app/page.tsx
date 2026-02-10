"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, Filter, Car, Wrench, SprayCan, Disc, ClipboardCheck, Database, MapPin } from "lucide-react";
import { CategoryItem } from "@/components/CategoryItem";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { getShops, seedDatabase } from "@/app/actions/shops";
import { LocationSearch } from "@/components/maps/LocationSearch";

const CATEGORIES = [
  { label: "Wash", value: "wash", icon: Car },
  { label: "Detailing", value: "detailing", icon: SprayCan },
  { label: "Mechanic", value: "repair", icon: Wrench },
  { label: "Tires", value: "tires", icon: Disc },
  { label: "Wrap", value: "detailing", icon: SprayCan },
  { label: "Inspection", value: "repair", icon: ClipboardCheck },
];

export default function Home() {
  const [address, setAddress] = useState("Search your location...");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  useEffect(() => {
    fetchShops();
  }, [selectedCategory, coordinates]);

  const fetchShops = async () => {
    setLoading(true);
    // In a real scenario, we'd pass coordinates to getShops for proximity filtering
    const data = await getShops(selectedCategory || "all");
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
    if (selectedCategory === value) {
        setSelectedCategory(null);
    } else {
        setSelectedCategory(value);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-background text-foreground">
      {/* Header Section */}
      <header className="sticky top-0 z-40 bg-background shadow-sm pb-2">
        <div className="px-4 py-3 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleSeed} title="Seed Database">
                <Database className="h-4 w-4 text-primary" />
            </Button>
            <div 
              className="flex flex-col cursor-pointer group items-end"
              onClick={() => setShowLocationSearch(!showLocationSearch)}
            >
                <span className="text-[10px] text-primary font-bold uppercase tracking-wide">Delivery to</span>
                <div className="flex items-center gap-1 text-primary group-hover:opacity-80 transition-opacity">
                    <span className="font-bold text-xs truncate max-w-[150px] text-foreground">{address}</span>
                    <ChevronDown className="h-3 w-3" />
                </div>
            </div>
          </div>
        </div>
        
        {/* Real Address Search Autocomplete Overlay */}
        {showLocationSearch && (
          <div className="px-4 pb-4 animate-in slide-in-from-top duration-300">
            <LocationSearch 
              onLocationSelect={handleLocationSelect}
              placeholder="Enter your address..."
            />
          </div>
        )}

        {/* Global Search Bar (Only show if not searching location) */}
        {!showLocationSearch && (
          <div className="px-4 pb-2">
              <div className="relative flex items-center bg-secondary/5 rounded-full px-4 py-2 hover:bg-secondary/10 transition-colors cursor-text">
                  <Search className="h-4 w-4 text-muted-foreground mr-2" />
                  <input 
                      type="text"
                      placeholder="Search for car care..."
                      className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground h-8"
                  />
              </div>
          </div>
        )}
      </header>

      {/* Categories Scroll */}
      <section className="py-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 px-4 min-w-max">
            {CATEGORIES.map((cat, i) => (
                <div key={i} onClick={() => toggleCategory(cat.value)}>
                    <CategoryItem icon={cat.icon} label={cat.label} isActive={selectedCategory === cat.value} />
                </div>
            ))}
        </div>
      </section>

      {/* Featured Section (Only hide if filtering) */}
      {!selectedCategory && !loading && shops.length > 0 && (
        <section className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Featured Partners</h2>
                <span className="text-sm font-semibold text-primary cursor-pointer hover:underline">See all</span>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                {shops.slice(0, 3).map((shop) => (
                    <div key={shop.id} className="min-w-[260px]">
                        <ServiceCard 
                            id={shop.id}
                            image={shop.image_url}
                            title={shop.name}
                            rating={shop.rating}
                            reviews={100}
                            price="$$"
                            deliveryTime="20-30 min"
                        />
                    </div>
                ))}
            </div>
        </section>
      )}

      {/* All Services List */}
       <section className="px-4">
        <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-bold">{selectedCategory ? `${selectedCategory} Shops` : "All Shops"}</h2>
             <div className="bg-secondary/5 p-1.5 rounded-full cursor-pointer hover:bg-secondary/10 transition-colors">
                <Filter className="h-4 w-4 text-foreground" />
             </div>
        </div>
        
        <div className="flex flex-col gap-6">
            {loading ? (
                <div className="text-center py-10 text-muted-foreground">Finding nearby shops...</div>
            ) : shops.length > 0 ? (
                shops.map((shop) => (
                    <ServiceCard 
                        key={shop.id}
                        id={shop.id}
                        image={shop.image_url}
                        title={shop.name}
                        rating={shop.rating}
                        reviews={100}
                        price="$$"
                        deliveryTime="20-30 min"
                    />
                ))
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <p>No shops found in this area.</p>
                    {shops.length === 0 && !selectedCategory && (
                        <Button variant="default" onClick={handleSeed} className="mt-4">
                            Initialize Database Data
                        </Button>
                    )}
                    <Button variant="link" onClick={() => setSelectedCategory(null)} className="text-primary mt-2">Clear filters</Button>
                </div>
            )}
        </div>
      </section>

    </div>
  );
}
