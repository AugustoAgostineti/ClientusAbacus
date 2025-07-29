
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cliente público (para uso no frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente com service role (para uso no backend/API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Configurações do banco de dados
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  serviceKey: supabaseServiceKey
}
