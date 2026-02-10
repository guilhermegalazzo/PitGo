'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  if (!supabase) return { error: "Supabase not configured locally/on server" }

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
  if (!supabase) return { error: "Supabase not configured locally/on server" }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }
  
  // Create profile
  if (authData.user) {
    await supabase.from('profiles').insert([
        { id: authData.user.id, full_name: data.email.split('@')[0] }
    ]);
  }

  return { success: true }
}
