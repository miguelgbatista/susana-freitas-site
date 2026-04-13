import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// SENHA DO PAINEL ADMINISTRATIVO
// ============================================================
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
