import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'ERRO CRÍTICO: Variáveis do Supabase não encontradas. ' +
    'Verifique se o arquivo .env existe localmente ou se os "Secrets" estão configurados no GitHub.'
  );
}

// Inicializamos mesmo se nulas para evitar erros de importação em outros arquivos,
// mas as chamadas ao banco falharão com o erro acima no console.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// ============================================================
// SENHA DO PAINEL ADMINISTRATIVO
// ============================================================
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'default_password';

