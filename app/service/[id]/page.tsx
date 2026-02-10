"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Clock, MapPin, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServiceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  
  // Mock data - in a real app, fetch based on params.id
  const service = {
    title: "Sparkle Auto Spa",
    rating: 4.8,
    reviews: 120,
    priceRange: "$$",
    address: "123 Main St, New York, NY",
    distance: "1.2 mi",
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop",
    categories: ["Wash", "Detailing"],
    services: [
        { name: "Bronze Wash", price: "$25.00", desc: "Exterior wash & dry, tire shine" },
        { name: "Silver Detail", price: "$45.00", desc: "Bronze + Interior vacuum & wipe down" },
        { name: "Gold Package", price: "$85.00", desc: "Full detail, wax, leather conditioning" },
    ]
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-background text-foreground relative">
      {/* Hero Image */}
      <div className="relative h-64 w-full">
         <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
         <button 
           onClick={() => router.back()}
           className="absolute top-4 left-4 h-10 w-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
         >
            <ArrowLeft className="h-5 w-5 text-black" />
         </button>
         <button className="absolute top-4 right-4 h-10 w-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
            <Share className="h-5 w-5 text-black" />
         </button>
      </div>

      <div className="flex-1 px-4 py-6 -mt-6 bg-background rounded-t-3xl relative z-10">
         <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold">{service.title}</h1>
            <div className="bg-secondary/10 px-3 py-1 rounded-full text-xs font-bold text-primary">
                Open Now
            </div>
         </div>

         <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-bold text-foreground">{service.rating}</span>
                <span>({service.reviews})</span>
            </div>
            <span>•</span>
            <span>{service.priceRange}</span>
            <span>•</span>
            <span>{service.distance}</span>
         </div>
         
         <div className="flex items-start gap-3 mb-8 text-sm">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
            <p>{service.address}</p>
         </div>

         <h2 className="text-lg font-bold mb-4">Services Menu</h2>
         <div className="space-y-4">
            {service.services.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex-1 pr-4">
                        <h3 className="font-bold group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.desc}</p>
                        <p className="mt-2 font-semibold">{item.price}</p>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0 hover:bg-primary hover:text-primary-foreground border-primary/20 text-primary">
                        Add
                    </Button>
                </div>
            ))}
         </div>
      </div>
      
      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:hidden z-20">
         <Button size="lg" className="w-full text-lg font-bold">
            Book Appointment
         </Button>
      </div>
    </div>
  );
}
