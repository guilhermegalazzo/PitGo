"use client";

import Image from "next/image";
import { Star, Clock, MapPin, Home } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  id: string;
  image: string;
  title: string;
  rating: number;
  reviews: number;
  price: string;
  deliveryTime: string;
  distance?: string;
}

export function ServiceCard({
  id,
  image,
  title,
  rating,
  reviews,
  price,
  deliveryTime,
  distance
}: ServiceCardProps) {
  return (
    <Link href={`/service/${id}`} className="group block">
      <div className="flex flex-col bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]">
        {/* Image Container */}
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={image || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2070&auto=format&fit=crop"}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
            <Star className="h-3.5 w-3.5 text-primary fill-primary" />
            <span className="text-xs font-bold">{rating}</span>
          </div>
          
          <div className="absolute bottom-3 left-3 flex gap-2">
            {distance && (
              <div className="bg-primary px-3 py-1 rounded-full flex items-center gap-1 shadow-lg border border-white/20">
                <MapPin className="h-3 w-3 text-white fill-white" />
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{distance}</span>
              </div>
            )}
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-lg border border-white/10">
              <Home className="h-3 w-3 text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-tighter">At Home</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-extrabold text-lg text-foreground group-hover:text-primary transition-colors truncate pr-2">
              {title}
            </h3>
            <span className="text-primary font-black text-sm">{price}</span>
          </div>
          
          <div className="flex items-center gap-3 text-muted-foreground text-xs font-medium">
            <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-md">
                <Clock className="h-3 w-3" />
                <span>Starts in {deliveryTime}</span>
            </div>
            <span className="opacity-30">•</span>
            <span>{reviews} reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
