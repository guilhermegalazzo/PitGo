"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Filter, Car, Wrench, SprayCan, Disc, ClipboardCheck } from "lucide-react";
import { CategoryItem } from "@/components/CategoryItem";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const CATEGORIES = [
  { label: "Wash", icon: Car },
  { label: "Detailing", icon: SprayCan },
  { label: "Mechanic", icon: Wrench },
  { label: "Tires", icon: Disc },
  { label: "Wrap", icon: SprayCan },
  { label: "Inspection", icon: ClipboardCheck },
];

const FEATURED_SERVICES = [
  {
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop",
    title: "Sparkle Auto Spa",
    rating: 4.8,
    reviews: 120,
    price: "$$",
    deliveryTime: "20-30 min",
    category: "Wash"
  },
  {
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
    title: "Prestige Detailing",
    rating: 4.9,
    reviews: 350,
    price: "$$$",
    deliveryTime: "45-60 min",
    category: "Detailing"
  },
   {
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=2070&auto=format&fit=crop",
    title: "Quick Fix Mechanics",
    rating: 4.5,
    reviews: 89,
    price: "$",
    deliveryTime: "10-20 min",
    category: "Mechanic"
  },
  {
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop",
    title: "Eco Wash & Go",
    rating: 4.6,
    reviews: 55,
    price: "$",
    deliveryTime: "15-25 min",
    category: "Wash"
  },
  {
    image: "https://images.unsplash.com/photo-1625043484555-47841a750399?q=80&w=2070&auto=format&fit=crop",
    title: "Tire Masters",
    rating: 4.7,
    reviews: 210,
    price: "$$",
    deliveryTime: "30-45 min",
    category: "Tires"
  }
];

export default function Home() {
  const [address, setAddress] = useState("123 Main St, New York, NY");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleCategory = (label: string) => {
    if (selectedCategory === label) {
        setSelectedCategory(null);
    } else {
        setSelectedCategory(label);
    }
  };

  const filteredServices = selectedCategory 
    ? FEATURED_SERVICES.filter(s => s.category === selectedCategory) 
    : FEATURED_SERVICES;

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-background text-foreground">
      {/* Header Section */}
      <header className="sticky top-0 z-40 bg-background shadow-sm pb-2">
        <div className="px-4 py-3 flex items-center justify-between">
          <Logo />
          <div className="flex flex-col cursor-pointer group items-end">
             <span className="text-[10px] text-primary font-bold uppercase tracking-wide">Your Location</span>
             <div className="flex items-center gap-1 text-primary group-hover:opacity-80 transition-opacity">
                <span className="font-bold text-xs truncate max-w-[150px] text-foreground">{address}</span>
                <ChevronDown className="h-3 w-3" />
             </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pb-2">
            <div className="relative flex items-center bg-secondary/5 rounded-full px-4 py-2 hover:bg-secondary/10 transition-colors cursor-text">
                <Search className="h-4 w-4 text-muted-foreground mr-2" />
                <input 
                    type="text"
                    placeholder="Search services, shops..."
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground h-8"
                />
            </div>
        </div>
      </header>

      {/* Categories Scroll */}
      <section className="py-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 px-4 min-w-max">
            {CATEGORIES.map((cat, i) => (
                <div key={i} onClick={() => toggleCategory(cat.label)}>
                    <CategoryItem icon={cat.icon} label={cat.label} isActive={selectedCategory === cat.label} />
                </div>
            ))}
        </div>
      </section>

      {/* Featured Section (Only hide if filtering) */}
      {!selectedCategory && (
        <section className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Featured Partners</h2>
                <span className="text-sm font-semibold text-primary cursor-pointer hover:underline">See all</span>
            </div>
            
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                {FEATURED_SERVICES.slice(0, 3).map((service, i) => (
                    <div key={i} className="min-w-[260px]">
                        <ServiceCard {...service} />
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
            {filteredServices.length > 0 ? (
                filteredServices.map((service, i) => (
                    <ServiceCard key={i} {...service} />
                ))
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <p>No shops found for this category.</p>
                    <Button variant="link" onClick={() => setSelectedCategory(null)} className="text-primary mt-2">Clear filters</Button>
                </div>
            )}
        </div>
      </section>

    </div>
  );
}
