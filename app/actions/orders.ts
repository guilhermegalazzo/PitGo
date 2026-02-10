"use server";

import { createClient } from "@/lib/supabase/server";

export async function getOrders() {
  try {
    const supabase = await createClient();
    if (!supabase) return [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("orders")
      .select("*, shops(name, image_url)")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Orders fetch error:", error);
      return [];
    }

    return (data || []).map(order => ({
        ...order,
        shop: order.shops // Flatten for UI
    }));
  } catch (err) {
    return [];
  }
}

export async function createOrder(shopId: string, serviceId: string, totalAmount: number) {
    try {
        const supabase = await createClient();
        if (!supabase) throw new Error("Supabase error");

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const { data, error } = await supabase
            .from("orders")
            .insert([
                {
                    customer_id: user.id,
                    shop_id: shopId,
                    total_amount: totalAmount,
                    status: "pending"
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return { success: true, orderId: data.id };
    } catch (error: any) {
        return { error: error.message };
    }
}
