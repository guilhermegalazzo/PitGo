"use server";

import { createClient } from "@/lib/supabase/server";

export async function getShops(category?: string, userCoords?: { lat: number; lng: number }) {
  try {
    const supabase = await createClient();
    if (!supabase) return [];
    
    let query = supabase
      .from("shops")
      .select("*")
      .eq("is_active", true);
      
    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    
    const { data, error } = await query.order("rating", { ascending: false });
    
    if (error) {
      console.error("Error fetching shops:", error);
      return [];
    }

    if (userCoords && data) {
      return data.map(shop => {
          const distance = calculateDistance(
              userCoords.lat, 
              userCoords.lng, 
              Number(shop.latitude), 
              Number(shop.longitude)
          );
          return { ...shop, distance };
      }).filter(shop => {
          const radius = shop.service_radius_km || 10;
          return shop.distance <= radius;
      }).sort((a, b) => a.distance - b.distance);
    }
    
    return data;
  } catch (err) {
    console.error("Shops Action Error:", err);
    return [];
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function getShopById(id: string) {
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from("shops")
      .select("*, services(*)")
      .eq("id", id)
      .single();
      
    if (error) {
      console.error("Error fetching shop details:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    return null;
  }
}

export async function seedDatabase() {
  try {
    const supabase = await createClient();
    if (!supabase) return { error: "Supabase not configured" };
    
    const { count } = await supabase.from("shops").select("*", { count: 'exact', head: true });
    if (count && count > 0) return { message: "Database already has data" };

    const { data: shops, error: shopError } = await supabase.from("shops").insert([
      {
        name: "Elite Car Wash",
        category: "wash",
        rating: 4.8,
        address: "Av. Paulista, 1000 - São Paulo, SP",
        latitude: -23.561414,
        longitude: -46.655881,
        image_url: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2070&auto=format&fit=crop",
        service_radius_km: 15
      },
      {
        name: "Detailing Pro",
        category: "detailing",
        rating: 4.9,
        address: "Rua Augusta, 500 - São Paulo, SP",
        latitude: -23.551631,
        longitude: -46.648004,
        image_url: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2070&auto=format&fit=crop",
        service_radius_km: 10
      },
      {
        name: "Speed Tire Shop",
        category: "repair",
        rating: 4.7,
        address: "Beco do Batman - São Paulo, SP",
        latitude: -23.553942,
        longitude: -46.684449,
        image_url: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=2162&auto=format&fit=crop",
        service_radius_km: 20
      }
    ]).select();

    if (shopError) return { error: shopError.message };

    for (const shop of shops) {
      await supabase.from("services").insert([
        { shop_id: shop.id, title: "Standard Service", price: 50, duration_mins: 30 },
        { shop_id: shop.id, title: "Premium Service", price: 120, duration_mins: 60 }
      ]);
    }

    return { message: "Database seeded successfully with Coordinates!" };
  } catch (err) {
    return { error: "Unexpected error" };
  }
}
