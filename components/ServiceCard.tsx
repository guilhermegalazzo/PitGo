import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  image: string;
  title: string;
  rating: number;
  reviews: number;
  price: string;
  deliveryTime?: string;
}

export function ServiceCard({ image, title, rating, reviews, price, deliveryTime }: ServiceCardProps) {
  // Mock ID generation for prototype
  const id = title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Link href={`/service/${id}`} className="block">
        <div className="flex flex-col gap-2 cursor-pointer group w-full min-w-[200px]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-secondary/5">
            <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            />
            {deliveryTime && (
            <div className="absolute bottom-2 right-2 bg-background/90 px-2 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm">
                {deliveryTime}
            </div>
            )}
        </div>
        <div className="flex flex-col gap-0.5">
            <div className="flex justify-between items-start">
            <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">{title}</h3>
            <div className="bg-secondary/5 rounded-full h-6 w-6 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-secondary-foreground">{rating}</span>
            </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-1">
            <span className="font-medium text-secondary-foreground">{rating}</span>
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>({reviews}+)</span>
            <span>•</span>
            <span>{price}</span>
            </div>
        </div>
        </div>
    </Link>
  );
}
