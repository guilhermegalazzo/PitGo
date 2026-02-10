"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkSystem() {
  const supabase = await createClient();
  if (!supabase) return { error: "No client" };

  const results: any = {};
  
  // 1. Check Tables
  const tables = ["profiles", "shops", "services", "orders"];
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select("*", { count: 'exact', head: true });
    results[table] = error ? { error: error.message } : { count };
  }
  
  // 2. Check Auth
  const { data: { user } } = await supabase.auth.getUser();
  results.auth = user ? { id: user.id, email: user.email } : "Not logged in";
  
  return results;
}
