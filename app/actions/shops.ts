"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/* 
  REAL WORLD SHOP FETCHING
  Calculates distance based on database coordinates vs user coordinates.
*/
export async function getShops(category?: string, userCoords?: { lat: number; lng: number }) {
  try {
    const supabase = await createClient();
    if (!supabase) return [];
    
    // 1. Fetch all active shops from database
    let query = supabase
      .from("shops")
      .select("*")
      .eq("is_active", true);
      
    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    
    const { data: shops, error } = await query;
    
    if (error) {
      console.error("Database fetch error:", error);
      return [];
    }

    if (!shops || shops.length === 0) {
      // If database is empty, return empty (No more "Fake" data automatic fallback)
      return [];
    }

    // 2. Map and enrich with real distance if coordinates available
    const enrichedShops = shops.map(shop => {
      let distance = undefined;
      if (userCoords && shop.latitude && shop.longitude) {
        distance = calculateDistance(
          userCoords.lat, 
          userCoords.lng, 
          Number(shop.latitude), 
          Number(shop.longitude)
        );
      }
      return { ...shop, distance };
    });

    // 3. Filter by radius if it exists in the record (Life Real Rule)
    let filtered = enrichedShops;
    if (userCoords) {
        filtered = enrichedShops.filter(shop => {
            const radius = Number(shop.service_radius_km) || 20; // Default 20km if not set
            if (!shop.distance) return true; // Keep if no distance available to calculate
            return shop.distance <= radius;
        });
    }

    return filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999));
  } catch (err) {
    console.error("getShops exception:", err);
    return [];
  }
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
      console.error("Shop details error:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    return null;
  }
}

export async function registerProvider(formData: {
  name: string;
  address: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  categories: string[];
}) {
  try {
    const supabase = await createClient();
    if (!supabase) throw new Error("Supabase config missing");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized access");

    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .insert([
        {
          owner_id: user.id,
          name: formData.name,
          address: formData.address,
          latitude: formData.lat,
          longitude: formData.lng,
          service_radius_km: Math.round(formData.radiusMeters / 1000),
          category: formData.categories[0] || 'wash',
          is_active: true,
          rating: 5.0 // New shops start with a perfect score
        }
      ])
      .select()
      .single();

    if (shopError) throw shopError;

    // Create Initial Services
    const servicesToInsert = formData.categories.map(cat => ({
        shop_id: shop.id,
        title: `Mobile ${cat.charAt(0).toUpperCase() + cat.slice(1)}`,
        price: 50,
        duration_mins: 60
    }));
    await supabase.from("services").insert(servicesToInsert);

    // Update Profile role for real-world permissions
    await supabase.from("profiles").update({ role: "provider" }).eq("id", user.id);

    revalidatePath("/");
    revalidatePath("/account");
    
    return { success: true, shopId: shop.id };
  } catch (error: any) {
    return { error: error.message };
  }
}

/* DELETED: seedDatabase (User wants 100% REAL functionality, no fake scripts) */

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
