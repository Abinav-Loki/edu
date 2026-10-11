import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irdfdgqdhvtfmhnvjuvm.supabase.co';
const supabaseKey = 'sb_publishable_SmWKbBhUg1WOalKnOynnmQ_1Akunv3V';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTables() {
  const tables = ['profiles', 'students', 'materials', 'interventions', 'support_tickets', 'user_learning_progress', 'learning_arena_progress'];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`${t} error:`, error.message);
    } else {
      console.log(`${t} sample row:`, data && data[0] ? Object.keys(data[0]) : 'empty table');
    }
  }
}

inspectTables();
