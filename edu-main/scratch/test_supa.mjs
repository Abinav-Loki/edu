import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irdfdgqdhvtfmhnvjuvm.supabase.co';
const supabaseKey = 'sb_publishable_SmWKbBhUg1WOalKnOynnmQ_1Akunv3V';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  const tables = [
    'profiles',
    'students',
    'faculty',
    'user_learning_progress',
    'learning_arena_progress',
    'notifications',
    'interventions',
    'materials',
    'quiz_attempts',
    'attendance_records',
    'support_tickets'
  ];

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`Table [${table}]: ERROR - ${error.message} (${error.code})`);
      } else {
        console.log(`Table [${table}]: EXISTS, count = ${count}`);
      }
    } catch (e) {
      console.log(`Table [${table}]: EXCEPTION - ${e.message}`);
    }
  }
}

testConnection();
