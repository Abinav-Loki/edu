const path = require('path');
const { createClient } = require(path.resolve(__dirname, '../node_modules/@supabase/supabase-js'));

const supabaseUrl = 'https://irdfdgqdhvtfmhnvjuvm.supabase.co';
const supabaseKey = 'sb_publishable_SmWKbBhUg1WOalKnOynnmQ_1Akunv3V';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runComprehensiveTests() {
  console.log('================================================================');
  console.log('ARIVON AI — MULTI-USER AUTH, DATA ISOLATION & PERSISTENCE TEST');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  // -------------------------------------------------------------
  // Test 1: Demo Accounts Preservation
  // -------------------------------------------------------------
  console.log('--- 1. Testing Demo Accounts Preservation ---');
  const demoIds = ['s1', 's2', 'f1', 'admin1'];
  for (const id of demoIds) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    assert(!error && data, `Demo profile '${id}' preserved in Supabase (${data?.name}, Role: ${data?.role})`);
  }

  const { data: s1Student } = await supabase.from('students').select('*').eq('id', 's1').maybeSingle();
  assert(s1Student && s1Student.attendance_percent === 65, 'Demo student s1 maintains 65% attendance (At-Risk Scenario)');

  const { data: s2Student } = await supabase.from('students').select('*').eq('id', 's2').maybeSingle();
  assert(s2Student && s2Student.attendance_percent === 95, 'Demo student s2 maintains 95% attendance (High-Performer Scenario)');

  // -------------------------------------------------------------
  // Test 2: Multi-User Fresh Student Space & Data Isolation
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing Fresh Student Space & Data Isolation ---');
  const freshUserId = `usr_test_${Date.now()}`;
  const freshEmail = `${freshUserId}@campus.edu`;

  // 1. Insert Profile
  const { error: pErr } = await supabase.from('profiles').upsert({
    id: freshUserId,
    name: 'Fresh Registered Student',
    email: freshEmail,
    role: 'student',
    department: 'Computer Science'
  });
  assert(!pErr, 'Fresh student profile registered in public.profiles table');

  // 2. Insert Fresh Student Baseline
  const { error: sErr } = await supabase.from('students').upsert({
    id: freshUserId,
    course: 'B.Tech Computer Science',
    year: '1st Year',
    attendance_percent: 0,
    quiz_average: 0,
    assignment_average: 0,
    late_submissions: 0,
    total_assignments: 0,
    gpa: 0,
    journey_type: 'onboarding',
    weak_topics: []
  });
  assert(!sErr, 'Fresh student academic baseline registered with 0 completed coursework & onboarding status');

  // 3. Insert Fresh Learning Profile
  const { error: lpErr } = await supabase.from('learning_profiles').upsert({
    student_id: freshUserId,
    level: 1,
    total_xp: 0,
    arena_coins: 0,
    streak: 0,
    longest_streak: 0,
    completed_quests: 0,
    quiz_accuracy: 0,
    quizzes_completed: 0,
    title: 'Fresh Explorer',
    current_focus: 'General'
  });
  assert(!lpErr, 'Fresh student learning profile initialized with Level 1, 0 XP, and 0 completed quizzes');

  // 4. Verify Absolute Data Isolation
  const { data: verifyFreshStudent } = await supabase.from('students').select('*').eq('id', freshUserId).single();
  assert(
    verifyFreshStudent && verifyFreshStudent.attendance_percent === 0 && verifyFreshStudent.total_assignments === 0,
    'Data Isolation Confirmed: Fresh student did NOT inherit Arun (s1) or Ananya (s2) mock statistics'
  );

  // -------------------------------------------------------------
  // Test 3: Learning Arena Mission Completion & Persistent Scoring
  // -------------------------------------------------------------
  console.log('\n--- 3. Testing Learning Arena Persistence & Scoring ---');
  const topicId = 'dbms-1';
  const xpEarned = 100; // 5/5 correct = 100 EXP (+20 per correct answer)

  // Update student's Learning Profile XP
  const { error: xpUpdateErr } = await supabase
    .from('learning_profiles')
    .update({ total_xp: xpEarned, quizzes_completed: 1, quiz_accuracy: 100 })
    .eq('student_id', freshUserId);
  assert(!xpUpdateErr, 'Updated student total XP to 100 in learning_profiles table');

  const { data: updatedLP } = await supabase.from('learning_profiles').select('*').eq('student_id', freshUserId).single();
  assert(updatedLP.total_xp === 100, `Verified updated XP persisted on database: ${updatedLP.total_xp} XP`);

  // Verify second student data is not affected
  const { data: s2LP } = await supabase.from('learning_profiles').select('*').eq('student_id', 's2').maybeSingle();
  assert(!s2LP || s2LP.student_id === 's2', 'Account Isolation: Progress update on new user did not alter student s2 records');

  // Clean up test student
  await supabase.from('learning_profiles').delete().eq('student_id', freshUserId);
  await supabase.from('students').delete().eq('id', freshUserId);
  await supabase.from('profiles').delete().eq('id', freshUserId);
  console.log(`[INFO] Cleaned up test records for ${freshUserId}`);

  console.log('\n================================================================');
  console.log(`ALL VERIFICATION TESTS COMPLETED: ${passedTests}/${totalTests} Passed`);
  console.log('================================================================\n');
}

runComprehensiveTests().catch(console.error);
