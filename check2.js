import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eedhxjxfhwbemqvyvlmm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZGh4anhmaHdiZW1xdnl2bG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjQ1MjcsImV4cCI6MjA5MTYwMDUyN30.ZFJONAXUjbtfb230Mkn421po1VT5wY974tf5ItxKAUc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('produtos').select('name, price, original_price').like('name', '%McQueen%');
  console.log(data);
}

run();
