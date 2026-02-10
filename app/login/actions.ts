'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return { error: "Supabase configuration error" }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return { error: "Supabase configuration error" }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }
  
  // Real World: Ensure profile exists
  if (authData.user) {
    // Check if profile already exists to avoid conflicts
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .single();
        
    if (!existingProfile) {
        const { error: profileError } = await supabase.from('profiles').insert([
            { 
                id: authData.user.id, 
                full_name: data.email.split('@')[0],
                role: 'customer' // Default role
            }
        ]);
        
        if (profileError) {
            console.error("Critical: Profile creation failed during signup:", profileError);
            // We don't return error here to avoid blocking user if Auth succeeded
        }
    }
  }

  return { success: true }
}
