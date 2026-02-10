"use server";

import { createClient } from "@/lib/supabase/server";

export async function getShops(category?: string) {
  const supabase = await createClient();
  
  let query = supabase
    .from("shops")
    .select("*")
    .eq("is_active", true);
    
  if (category && category !== "all" && category) {
    query = query.eq("category", category);
  }
  
  const { data, error } = await query.order("rating", { ascending: false });
  
  if (error) {
    console.error("Error fetching shops:", error);
    return [];
  }
  
  return data;
}

export async function getShopById(id: string) {
  const supabase = await createClient();
  
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
}

export async function seedDatabase() {
  const supabase = await createClient();
  
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
      image_url: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "Detailing Pro",
      category: "detailing",
      rating: 4.9,
      address: "Rua Augusta, 500 - São Paulo, SP",
      latitude: -23.551631,
      longitude: -46.648004,
      image_url: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "Speed Tire Shop",
      category: "repair",
      rating: 4.7,
      address: "Beco do Batman - São Paulo, SP",
      latitude: -23.553942,
      longitude: -46.684449,
      image_url: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=2162&auto=format&fit=crop"
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
}
