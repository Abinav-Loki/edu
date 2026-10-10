-- ============================================================================
-- EduGuard AI — Full Supabase Database Schema & Seed Data
-- ============================================================================
-- Run this script directly in your Supabase SQL Editor (https://supabase.com/dashboard)
-- It will create all tables, set up Row Level Security (RLS) policies, and seed
-- demo data matching the application's student, faculty, and admin records.
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. PROFILES (Base User Accounts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
  avatar TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 2. STUDENTS (Academic & Demographic Profiles)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  course TEXT DEFAULT 'B.Tech IT',
  year TEXT DEFAULT '3rd Year',
  attendance_percent NUMERIC DEFAULT 75,
  quiz_average NUMERIC DEFAULT 65,
  assignment_average NUMERIC DEFAULT 70,
  late_submissions INT DEFAULT 0,
  total_assignments INT DEFAULT 10,
  gpa NUMERIC DEFAULT 3.2,
  journey_type TEXT DEFAULT 'stable',
  assigned_mentor_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  weak_topics JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. MENTORS / FACULTY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mentors (
  id TEXT PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  department TEXT DEFAULT 'Computer Science',
  specialization JSONB DEFAULT '[]'::jsonb,
  availability JSONB DEFAULT '[]'::jsonb,
  current_location TEXT DEFAULT 'Faculty Block',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. FACULTY SCHEDULES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faculty_schedules (
  id TEXT PRIMARY KEY DEFAULT ('sched_' || floor(extract(epoch from now()))::text),
  faculty_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  date TEXT,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  subject TEXT NOT NULL,
  room TEXT,
  building TEXT,
  activity_type TEXT DEFAULT 'CLASS',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. FACULTY AVAILABILITY SLOTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faculty_availability (
  id TEXT PRIMARY KEY DEFAULT ('avail_' || floor(extract(epoch from now()))::text),
  faculty_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 6. MENTOR REQUESTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mentor_requests (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'suggest_alternate', 'completed', 'cancelled')),
  proposed_time TEXT,
  proposed_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 7. CAMPUS ASSETS (Hardware, Projectors, Labs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('AC', 'Projector', 'Computer', 'Printer', 'Other')),
  building TEXT NOT NULL,
  room TEXT NOT NULL,
  operating_hours NUMERIC DEFAULT 0,
  last_service DATE,
  service_incidents INT DEFAULT 0,
  status TEXT DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 8. MAINTENANCE TICKETS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.maintenance_tickets (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 9. SUPPORT TICKETS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 10. CAMPUS FEEDBACK
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  text TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 11. STUDY MATERIALS & UPLOADS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.materials (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  subject TEXT NOT NULL,
  description TEXT,
  uploaded_by TEXT NOT NULL,
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 12. LEARNING PROFILES & ARENA GAMIFICATION
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_profiles (
  student_id TEXT PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  level INT DEFAULT 1,
  total_xp INT DEFAULT 0,
  arena_coins INT DEFAULT 0,
  streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_learning_date TEXT DEFAULT '',
  completed_quests INT DEFAULT 0,
  quiz_accuracy NUMERIC DEFAULT 0,
  quizzes_completed INT DEFAULT 0,
  title TEXT DEFAULT 'New Explorer',
  current_focus TEXT DEFAULT 'General',
  avatar_id TEXT DEFAULT 'av-1',
  frame_id TEXT DEFAULT 'fr-1',
  background_id TEXT DEFAULT 'bg-1',
  title_id TEXT DEFAULT 'ti-1',
  unlocked_cosmetics JSONB DEFAULT '["av-1", "fr-1", "bg-1", "ti-1"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 13. XP EVENTS (Gamification History)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.xp_events (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  reason TEXT NOT NULL,
  source TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 14. MISSIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.missions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  difficulty TEXT DEFAULT 'BEGINNER',
  xp_reward INT DEFAULT 100,
  progress INT DEFAULT 0,
  target INT DEFAULT 100,
  completed BOOLEAN DEFAULT false,
  due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 15. QUESTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quests (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'BEGINNER',
  tasks JSONB DEFAULT '[]'::jsonb,
  xp_reward INT DEFAULT 150,
  status TEXT DEFAULT 'AVAILABLE',
  recommended_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 16. SKILLS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  proficiency INT DEFAULT 0,
  level TEXT DEFAULT 'Novice',
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 17. ACHIEVEMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  requirement INT DEFAULT 1,
  progress INT DEFAULT 0,
  unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 18. TUTOR MESSAGES (AI Tutor Chats)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tutor_messages (
  id TEXT PRIMARY KEY DEFAULT ('msg_' || floor(extract(epoch from now()))::text || '_' || substr(md5(random()::text), 1, 6)),
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'bot', 'system')),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 19. RECOVERY PLANS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recovery_plans (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  focus TEXT NOT NULL,
  days INT DEFAULT 7,
  tasks_completed INT DEFAULT 0,
  total_tasks INT DEFAULT 5,
  progress_percent INT DEFAULT 0,
  status TEXT DEFAULT 'in_progress',
  current_day INT DEFAULT 1,
  tasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on all tables and grant full access to anonymous & authenticated clients
-- for smooth frontend functionality.
-- ============================================================================

DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'profiles', 'students', 'mentors', 'faculty_schedules', 'faculty_availability',
    'mentor_requests', 'assets', 'maintenance_tickets', 'support_tickets',
    'feedback', 'materials', 'learning_profiles', 'xp_events', 'missions',
    'quests', 'skills', 'achievements', 'tutor_messages', 'recovery_plans'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Public access policy for %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public access policy for %I" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);', tbl, tbl);
  END LOOP;
END $$;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- 1. Profiles
INSERT INTO public.profiles (id, name, email, role, department, avatar)
VALUES
  ('admin1', 'Campus Admin', 'admin@campus.edu', 'admin', 'Administration', NULL),
  ('f1', 'Rahul Kumar', 'rahul.kumar@campus.edu', 'faculty', 'Computer Science', NULL),
  ('f2', 'Priya Sharma', 'priya.sharma@campus.edu', 'faculty', 'Information Technology', NULL),
  ('s1', 'Arun Kumar', 'arun.k@student.edu', 'student', 'Information Technology', NULL),
  ('s2', 'Ananya Roy', 'ananya.r@student.edu', 'student', 'Computer Science', NULL),
  ('s3', 'Rahul Verma', 'rahul.v@student.edu', 'student', 'Electronics', NULL),
  ('s4', 'Priya Nair', 'priya.n@student.edu', 'student', 'Information Technology', NULL),
  ('s5', 'Vikram Singh', 'vikram.s@student.edu', 'student', 'Mechanical Engineering', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  department = EXCLUDED.department;

-- 2. Mentors
INSERT INTO public.mentors (id, department, specialization, availability, current_location)
VALUES
  ('f1', 'Computer Science', '["DBMS", "SQL", "Database Design"]'::jsonb, '["Monday 4:30 PM", "Tuesday 3:00 PM"]'::jsonb, 'Faculty Block / Room 204'),
  ('f2', 'Information Technology', '["Data Structures", "Algorithms"]'::jsonb, '["Wednesday 10:00 AM"]'::jsonb, 'Block A / Room 101')
ON CONFLICT (id) DO UPDATE SET
  specialization = EXCLUDED.specialization,
  availability = EXCLUDED.availability;

-- 3. Students
INSERT INTO public.students (id, course, year, attendance_percent, quiz_average, assignment_average, late_submissions, total_assignments, gpa, journey_type, weak_topics)
VALUES
  ('s1', 'B.Tech IT', '3rd Year', 65, 49, 72, 2, 10, 2.9, 'declining', '["DBMS Normalization", "SQL Joins"]'::jsonb),
  ('s2', 'B.Tech CSE', '3rd Year', 95, 92, 94, 0, 12, 3.9, 'stable', '[]'::jsonb),
  ('s3', 'B.Tech ECE', '2nd Year', 79, 74, 78, 1, 9, 3.3, 'improving', '["Fourier Transform"]'::jsonb),
  ('s4', 'B.Tech IT', '3rd Year', 52, 41, 48, 4, 8, 2.4, 'high_risk', '["Web Development", "Data Structures", "DBMS"]'::jsonb),
  ('s5', 'B.Tech ME', '3rd Year', 76, 78, 81, 2, 9, 3.4, 'stable', '["Thermodynamics", "Fluid Mechanics"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  attendance_percent = EXCLUDED.attendance_percent,
  quiz_average = EXCLUDED.quiz_average,
  assignment_average = EXCLUDED.assignment_average;

-- 4. Assets
INSERT INTO public.assets (id, name, category, building, room, operating_hours, last_service, service_incidents, status)
VALUES
  ('PRJ-B204-001', 'Projector B204', 'Projector', 'Block B', '204', 1200, '2026-03-15', 3, 'online'),
  ('AC-C301-002', 'AC Unit C301', 'AC', 'Block C', '301', 4500, '2025-10-10', 5, 'online')
ON CONFLICT (id) DO NOTHING;

-- 5. Faculty Schedules
INSERT INTO public.faculty_schedules (id, faculty_id, day, start_time, end_time, subject, room, building, activity_type)
VALUES
  ('sched_1', 'f1', 'Monday', '09:00', '10:00', 'DBMS', '204', 'Block A', 'CLASS'),
  ('sched_2', 'f1', 'Monday', '11:00', '12:00', 'DBMS Lab', 'Lab 3', 'Block A', 'LAB'),
  ('sched_3', 'f1', 'Monday', '14:00', '15:00', 'Faculty Meeting', 'Admin Room', 'Admin Block', 'MEETING'),
  ('sched_4', 'f1', 'Monday', '16:00', '18:00', 'Mentoring', '204', 'Faculty Block', 'MENTORING')
ON CONFLICT (id) DO NOTHING;

-- 6. Faculty Availability Slots
INSERT INTO public.faculty_availability (id, faculty_id, day, start_time, end_time)
VALUES
  ('avail_1', 'f1', 'Monday', '16:00', '18:00'),
  ('avail_2', 'f1', 'Tuesday', '15:00', '17:00')
ON CONFLICT (id) DO NOTHING;

-- 7. Mentor Requests
INSERT INTO public.mentor_requests (id, student_id, mentor_id, subject, date, time, status)
VALUES
  ('mr_1', 's1', 'f1', 'DBMS Normalization Help', '2026-10-15', '16:30', 'pending')
ON CONFLICT (id) DO NOTHING;

-- 8. Materials
INSERT INTO public.materials (id, file_name, file_type, file_size, subject, description, uploaded_by, student_id)
VALUES
  ('MAT-001', 'DBMS_Notes_Chap1.pdf', 'PDF', 1450000, 'DBMS', 'Introduction and ER Models', 'Arun Kumar', 's1')
ON CONFLICT (id) DO NOTHING;

-- 9. Feedback
INSERT INTO public.feedback (id, category, text, location)
VALUES
  ('fb1', 'Wi-Fi', 'Wi-Fi in Block C is very slow in the evening.', 'Block C'),
  ('fb2', 'Wi-Fi', 'Can not connect to Wi-Fi near Library.', 'Library')
ON CONFLICT (id) DO NOTHING;

-- 10. Learning Profile for Student s1
INSERT INTO public.learning_profiles (
  student_id, level, total_xp, arena_coins, streak, longest_streak,
  last_learning_date, completed_quests, quiz_accuracy, quizzes_completed,
  title, current_focus, avatar_id, frame_id, background_id, title_id, unlocked_cosmetics
)
VALUES (
  's1', 12, 1840, 420, 5, 12, 'Today', 8, 76, 14,
  'Algorithm Adept', 'DBMS Normalization', 'av-1', 'fr-2', 'bg-1', 'ti-2',
  '["av-1", "av-2", "fr-1", "fr-2", "bg-1", "ti-1", "ti-2"]'::jsonb
)
ON CONFLICT (student_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 20. CALENDAR EVENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id TEXT PRIMARY KEY DEFAULT ('evt_' || floor(extract(epoch from now()))::text || '_' || substr(md5(random()::text), 1, 6)),
  student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('quiz', 'assignment', 'exam', 'plan', 'other')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 21. STUDY TASKS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_tasks (
  id TEXT PRIMARY KEY DEFAULT ('st_' || floor(extract(epoch from now()))::text || '_' || substr(md5(random()::text), 1, 6)),
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  topic_title TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 45,
  activity_type TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'Medium',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 22. QUIZ RESULTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id TEXT PRIMARY KEY DEFAULT ('qr_' || floor(extract(epoch from now()))::text || '_' || substr(md5(random()::text), 1, 6)),
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  accuracy NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Extend learning_profiles & students
ALTER TABLE public.learning_profiles 
  ADD COLUMN IF NOT EXISTS arena_progress JSONB DEFAULT '{"completedTopicIds": {}, "currentMissionTopicId": {}, "activeQuestionIndex": {}, "quizScores": {}}'::jsonb;

ALTER TABLE public.students 
  ADD COLUMN IF NOT EXISTS performance_history JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.students 
  ADD COLUMN IF NOT EXISTS subject_scores JSONB DEFAULT '[]'::jsonb;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mentor_requests_student ON public.mentor_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_mentor_requests_mentor ON public.mentor_requests(mentor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_messages_student ON public.tutor_messages(student_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_student ON public.xp_events(student_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_student ON public.study_tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_student ON public.calendar_events(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_student ON public.quiz_results(student_id);
CREATE INDEX IF NOT EXISTS idx_recovery_plans_student ON public.recovery_plans(student_id);

-- RLS for new tables
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access policy for calendar_events" ON public.calendar_events;
CREATE POLICY "Public access policy for calendar_events" ON public.calendar_events FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access policy for study_tasks" ON public.study_tasks;
CREATE POLICY "Public access policy for study_tasks" ON public.study_tasks FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access policy for quiz_results" ON public.quiz_results;
CREATE POLICY "Public access policy for quiz_results" ON public.quiz_results FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 11. Seed Calendar Events
INSERT INTO public.calendar_events (id, student_id, title, date, time, type)
VALUES
  ('e1', 's1', 'Database Quiz 4', '2026-10-05', '10:00 AM', 'quiz'),
  ('e2', 's1', 'Assignment 3 Deadline', '2026-10-07', '11:59 PM', 'assignment'),
  ('e3', 's1', 'OS Mid-Term Exam', '2026-10-12', '9:00 AM', 'exam'),
  ('e4', 's1', 'Recovery Plan — Day 5 Review', '2026-10-03', '6:00 PM', 'plan')
ON CONFLICT (id) DO NOTHING;

-- 12. Seed Study Tasks
INSERT INTO public.study_tasks (id, student_id, day, subject_id, subject_name, topic_title, duration_minutes, activity_type, completed, priority)
VALUES
  ('st-1', 's1', 'Monday', 'dbms', 'Database Systems', 'SQL Joins & Multi-Table Queries', 45, 'Practice', true, 'High'),
  ('st-2', 's1', 'Monday', 'dsa', 'Data Structures', 'Array Sliding Window Technique', 60, 'Learn', true, 'Medium'),
  ('st-3', 's1', 'Tuesday', 'os', 'Operating Systems', 'CPU Process Scheduling Gantt Charts', 45, 'Quiz', false, 'High'),
  ('st-4', 's1', 'Wednesday', 'dbms', 'Database Systems', '2NF and 3NF Normalization Decompositions', 50, 'Learn', false, 'High'),
  ('st-5', 's1', 'Thursday', 'cn', 'Computer Networks', 'Subnetting & CIDR Address Masks', 40, 'Revision', false, 'Medium'),
  ('st-6', 's1', 'Friday', 'dsa', 'Data Structures', 'Binary Search Tree Traversals', 45, 'Practice', false, 'Low')
ON CONFLICT (id) DO NOTHING;

-- 13. Seed Recovery Plans
INSERT INTO public.recovery_plans (id, student_id, title, focus, days, tasks_completed, total_tasks, progress_percent, status, current_day, tasks)
VALUES
  ('rp-1', 's1', 'Database Normalization Mastery', 'DBMS Normalization & SQL Joins', 7, 2, 5, 40, 'in_progress', 3,
   '[
     {"id": "rt-1", "title": "Watch 1NF to BCNF Video Lesson", "duration": "35 mins", "type": "Video", "completed": true},
     {"id": "rt-2", "title": "Solve 5 Functional Dependency Practice Problems", "duration": "45 mins", "type": "Practice", "completed": true},
     {"id": "rt-3", "title": "Adaptive Diagnostic Quiz on Normal Forms", "duration": "20 mins", "type": "Quiz", "completed": false},
     {"id": "rt-4", "title": "Read Chapter 4 Relational Algebra Summary Notes", "duration": "30 mins", "type": "Reading", "completed": false},
     {"id": "rt-5", "title": "Submit Mentor Clarification Request to Prof. Rahul Kumar", "duration": "15 mins", "type": "Mentor", "completed": false}
   ]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  tasks_completed = EXCLUDED.tasks_completed,
  progress_percent = EXCLUDED.progress_percent,
  tasks = EXCLUDED.tasks;

-- 14. Seed Missions
INSERT INTO public.missions (id, student_id, title, description, subject, difficulty, xp_reward, progress, target, completed, due_date)
VALUES
  ('m-1', 's1', 'Master SQL Joins', 'Complete all practice modules on INNER, LEFT, RIGHT and FULL OUTER joins.', 'DBMS', 'BEGINNER', 150, 3, 3, true, '2026-10-15'),
  ('m-2', 's1', 'Normalization Expert', 'Achieve 100% on the 2NF and 3NF dependency quiz.', 'DBMS', 'INTERMEDIATE', 200, 1, 2, false, '2026-10-18'),
  ('m-3', 's1', 'ACID Concurrency Trial', 'Simulate multi-transaction commit and rollback scenarios without deadlocks.', 'DBMS', 'ADVANCED', 300, 0, 1, false, '2026-10-22')
ON CONFLICT (id) DO NOTHING;

-- 15. Seed Quests
INSERT INTO public.quests (id, student_id, title, subject, description, difficulty, tasks, xp_reward, status, recommended_reason)
VALUES
  ('q-1', 's1', 'Relational Foundations', 'DBMS', 'Prove complete mastery of fundamental relational algebra and table schemas.', 'BEGINNER',
   '[{"id": "qt-1", "description": "Review Chapter 1 ER Models", "completed": true}, {"id": "qt-2", "description": "Execute 5 SELECT queries with WHERE filters", "completed": true}, {"id": "qt-3", "description": "Score 80%+ on Diagnostic Quiz", "completed": false}]'::jsonb,
   180, 'IN_PROGRESS', 'Recommended based on your recent DBMS quiz score')
ON CONFLICT (id) DO NOTHING;

-- 16. Seed Skills
INSERT INTO public.skills (id, student_id, name, subject, proficiency, level, last_updated)
VALUES
  ('sk-1', 's1', 'SQL Querying', 'DBMS', 82, 'Adept', now()),
  ('sk-2', 's1', 'Normalization', 'DBMS', 48, 'Novice', now()),
  ('sk-3', 's1', 'Transactions & ACID', 'DBMS', 60, 'Intermediate', now()),
  ('sk-4', 's1', 'Binary Search Trees', 'DSA', 74, 'Intermediate', now())
ON CONFLICT (id) DO NOTHING;

-- 17. Seed Achievements
INSERT INTO public.achievements (id, student_id, title, description, icon, requirement, progress, unlocked, unlocked_at)
VALUES
  ('ach-1', 's1', 'First Step', 'Complete your first learning arena mission', '🎯', 1, 1, true, now()),
  ('ach-2', 's1', 'Quiz Champion', 'Score 100% on any adaptive quiz', '🏆', 1, 1, true, now()),
  ('ach-3', 's1', 'Streak Master', 'Maintain a 7-day continuous study streak', '🔥', 7, 5, false, null),
  ('ach-4', 's1', 'Grand Scholar', 'Accumulate over 2,000 XP in learning arena', '⭐', 2000, 1840, false, null)
ON CONFLICT (id) DO NOTHING;

-- 18. Update Student s1 Performance History
UPDATE public.students
SET 
  performance_history = '[
    {"week": "Week 1", "quiz": 72, "assignment": 75, "attendance": 80},
    {"week": "Week 2", "quiz": 65, "assignment": 70, "attendance": 76},
    {"week": "Week 3", "quiz": 60, "assignment": 65, "attendance": 72},
    {"week": "Week 4", "quiz": 58, "assignment": 62, "attendance": 68}
  ]'::jsonb,
  subject_scores = '[
    {"subject": "Database Management", "score": 58, "total": 100},
    {"subject": "Operating Systems", "score": 71, "total": 100},
    {"subject": "Computer Networks", "score": 65, "total": 100},
    {"subject": "Software Engineering", "score": 74, "total": 100}
  ]'::jsonb
WHERE id = 's1';

