"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Star, Clock, MapPin, Share, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getShopById } from "@/app/actions/shops";

export default function ServiceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const shopId = params.id as string;
  
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shopId) {
      fetchShop();
    }
  }, [shopId]);

  const fetchShop = async () => {
    setLoading(true);
    const data = await getShopById(shopId);
    setShop(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading shop details...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-xl font-bold">Shop not found</h1>
        <p className="text-muted-foreground mb-4">We couldn't find the shop you're looking for.</p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-background text-foreground relative">
      {/* Hero Image */}
      <div className="relative h-64 w-full">
         <img src={shop.image_url} alt={shop.name} className="w-full h-full object-cover" />
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
            <h1 className="text-2xl font-bold">{shop.name}</h1>
            <div className="bg-secondary/10 px-3 py-1 rounded-full text-xs font-bold text-primary">
                Open Now
            </div>
         </div>

         <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-bold text-foreground">{shop.rating}</span>
                <span>(100+)</span>
            </div>
            <span>•</span>
            <span>$$</span>
            <span>•</span>
            <span>1.2 mi</span>
         </div>
         
         <div className="flex items-start gap-3 mb-8 text-sm">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
            <p>{shop.address}</p>
         </div>

         <h2 className="text-lg font-bold mb-4">Services Menu</h2>
         <div className="space-y-4">
            {shop.services && shop.services.length > 0 ? (
                shop.services.map((service: any, i: number) => (
                    <div key={service.id} className="flex justify-between items-center p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="flex-1 pr-4">
                            <h3 className="font-bold group-hover:text-primary transition-colors">{service.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{service.description || "No description available."}</p>
                            <p className="mt-2 font-semibold">${service.price}</p>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0 hover:bg-primary hover:text-primary-foreground border-primary/20 text-primary">
                            Add
                        </Button>
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground text-center py-4">No services available for this shop.</p>
            )}
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
