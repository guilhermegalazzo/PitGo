"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows returned'
      console.error("Error fetching profile:", error);
      return null;
    }
    
    // If no profile exists, return a basic object with the user ID
    if (!profile) {
      return { id: user.id, full_name: user.email?.split('@')[0] || "User" };
    }
      
    return profile;
  } catch (err) {
    console.error("Unexpected error in getProfile:", err);
    return null;
  }
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/login");
}
