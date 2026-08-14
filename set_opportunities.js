import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eedhxjxfhwbemqvyvlmm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZGh4anhmaHdiZW1xdnl2bG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjQ1MjcsImV4cCI6MjA5MTYwMDUyN30.ZFJONAXUjbtfb230Mkn421po1VT5wY974tf5ItxKAUc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Buscando produtos...');
  const { data, error } = await supabase.from('produtos').select('*');
  
  if (error) {
    console.error('Erro:', error);
    return;
  }

  let count = 0;
  for (const p of data) {
    if (p.original_price) {
      console.log(`Marcando "${p.name}" como oportunidade...`);
      const { error: updateErr } = await supabase
        .from('produtos')
        .update({ is_opportunity: true })
        .eq('id', p.id);
        
      if (updateErr) {
        console.error(`Erro ao atualizar ${p.name}:`, updateErr);
      } else {
        count++;
      }
    } else {
      // Garantir que seja false para os demais
      await supabase
        .from('produtos')
        .update({ is_opportunity: false })
        .eq('id', p.id);
    }
  }

  console.log(`\\nSucesso! ${count} produtos foram marcados com o selo Oportunidade.`);
}

run();
