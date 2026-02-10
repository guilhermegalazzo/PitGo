import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = "https://zotruzuokkvbpekiqvxd.supabase.co";
  const supabaseAnonKey = "sb_publishable_nlAIs5ltpgwOvlY2JXwFVQ_UVslba81";

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
