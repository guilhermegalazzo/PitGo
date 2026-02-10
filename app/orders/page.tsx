"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const PAST_ORDERS = [
  {
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop",
    title: "Sparkle Auto Spa",
    date: "Feb 8, 2026",
    price: "$25.00",
    status: "Completed",
  },
  {
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=2070&auto=format&fit=crop",
    title: "Quick Fix Mechanics",
    date: "Jan 15, 2026",
    price: "$120.00",
    status: "Completed",
  },
];

export default function OrdersPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20 bg-background text-foreground">
      <div className="p-4 border-b border-border sticky top-0 bg-background z-10 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Logo />
      </div>

      <div className="p-4 space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
          <div className="bg-secondary/10 rounded-lg p-8 text-center border border-border border-dashed">
             <p className="text-muted-foreground mb-4">No active appointments</p>
             <Button variant="default" className="text-white hover:bg-primary/90">Find Services</Button>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Past Orders</h2>
          <div className="flex flex-col gap-4">
            {PAST_ORDERS.map((order, i) => (
              <div key={i} className="flex gap-4 p-3 border border-border rounded-lg bg-card hover:bg-secondary/5 transition-colors cursor-pointer">
                 <div className="h-16 w-16 bg-secondary/10 rounded-md overflow-hidden relative shrink-0">
                    <img src={order.image} alt={order.title} className="object-cover w-full h-full" />
                 </div>
                 <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm truncate pr-2">{order.title}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{order.date}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-muted-foreground">{order.price} • {order.status}</p>
                        <div className="text-sm text-primary font-medium hover:underline">
                            Reorder
                        </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
