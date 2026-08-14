import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eedhxjxfhwbemqvyvlmm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZGh4anhmaHdiZW1xdnl2bG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjQ1MjcsImV4cCI6MjA5MTYwMDUyN30.ZFJONAXUjbtfb230Mkn421po1VT5wY974tf5ItxKAUc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Corrigindo preços duplicados...');
  const { data, error } = await supabase.from('produtos').select('*');
  
  if (error) {
    console.error('Erro:', error);
    return;
  }

  let count = 0;
  for (const p of data) {
    if (p.price && p.price.toLowerCase().includes('por ')) {
      // Ex: "R$ 689,90 Por R$ 489,90" -> ["R$ 689,90 ", " R$ 489,90"]
      const parts = p.price.toLowerCase().split('por ');
      if (parts.length === 2) {
        // Encontrar a parte original pra manter maiusculas se necessário
        const index = p.price.toLowerCase().indexOf('por ');
        const finalPrice = p.price.substring(index + 4).trim();
        
        console.log(`Corrigindo "${p.name}": de "${p.price}" para "${finalPrice}"`);
        
        const { error: updateErr } = await supabase
          .from('produtos')
          .update({ price: finalPrice })
          .eq('id', p.id);
          
        if (updateErr) {
          console.error(`Erro ao atualizar ${p.name}:`, updateErr);
        } else {
          count++;
        }
      }
    }
  }

  console.log(`\\nSucesso! ${count} produtos foram corrigidos.`);
}

run();
