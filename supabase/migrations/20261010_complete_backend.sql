  -- ============================================================================
-- EduGuard AI / Edu-main — Complete Backend Supabase Migration
-- ============================================================================
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- This migration is IDEMPOTENT (safe to run multiple times).
-- It creates missing tables, adds indexes, updates RLS policies, and inserts
-- comprehensive seed data for study tasks, calendar events, recovery plans,
-- missions, quests, skills, and achievements.
-- ============================================================================

-- 1. Create calendar_events table
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id TEXT PRIMARY KEY DEFAULT ('evt_' || floor(extract(epoch from now()))::text || '_' || substr(md5(random()::text), 1, 6)),
  student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('quiz', 'assignment', 'exam', 'plan', 'other')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create study_tasks table
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

-- 3. Create quiz_results table
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id TEXT PRIMARY KEY DEFAULT ('qr_' || floor(extract(epoch from now()))::text || '_' || substr(md5(random()::text), 1, 6)),
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  accuracy NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Extend existing tables with additional persistent columns
ALTER TABLE public.learning_profiles 
  ADD COLUMN IF NOT EXISTS arena_progress JSONB DEFAULT '{"completedTopicIds": {}, "currentMissionTopicId": {}, "activeQuestionIndex": {}, "quizScores": {}}'::jsonb;

ALTER TABLE public.students 
  ADD COLUMN IF NOT EXISTS performance_history JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.students 
  ADD COLUMN IF NOT EXISTS subject_scores JSONB DEFAULT '[]'::jsonb;

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_mentor_requests_student ON public.mentor_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_mentor_requests_mentor ON public.mentor_requests(mentor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_messages_student ON public.tutor_messages(student_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_student ON public.xp_events(student_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_student ON public.study_tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_student ON public.calendar_events(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_student ON public.quiz_results(student_id);
CREATE INDEX IF NOT EXISTS idx_recovery_plans_student ON public.recovery_plans(student_id);

-- 6. Row Level Security on new tables
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access policy for calendar_events" ON public.calendar_events;
CREATE POLICY "Public access policy for calendar_events" ON public.calendar_events 
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access policy for study_tasks" ON public.study_tasks;
CREATE POLICY "Public access policy for study_tasks" ON public.study_tasks 
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access policy for quiz_results" ON public.quiz_results;
CREATE POLICY "Public access policy for quiz_results" ON public.quiz_results 
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 7. Seed Calendar Events
INSERT INTO public.calendar_events (id, student_id, title, date, time, type)
VALUES
  ('e1', 's1', 'Database Quiz 4', '2026-10-05', '10:00 AM', 'quiz'),
  ('e2', 's1', 'Assignment 3 Deadline', '2026-10-07', '11:59 PM', 'assignment'),
  ('e3', 's1', 'OS Mid-Term Exam', '2026-10-12', '9:00 AM', 'exam'),
  ('e4', 's1', 'Recovery Plan — Day 5 Review', '2026-10-03', '6:00 PM', 'plan')
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Study Tasks
INSERT INTO public.study_tasks (id, student_id, day, subject_id, subject_name, topic_title, duration_minutes, activity_type, completed, priority)
VALUES
  ('st-1', 's1', 'Monday', 'dbms', 'Database Systems', 'SQL Joins & Multi-Table Queries', 45, 'Practice', true, 'High'),
  ('st-2', 's1', 'Monday', 'dsa', 'Data Structures', 'Array Sliding Window Technique', 60, 'Learn', true, 'Medium'),
  ('st-3', 's1', 'Tuesday', 'os', 'Operating Systems', 'CPU Process Scheduling Gantt Charts', 45, 'Quiz', false, 'High'),
  ('st-4', 's1', 'Wednesday', 'dbms', 'Database Systems', '2NF and 3NF Normalization Decompositions', 50, 'Learn', false, 'High'),
  ('st-5', 's1', 'Thursday', 'cn', 'Computer Networks', 'Subnetting & CIDR Address Masks', 40, 'Revision', false, 'Medium'),
  ('st-6', 's1', 'Friday', 'dsa', 'Data Structures', 'Binary Search Tree Traversals', 45, 'Practice', false, 'Low')
ON CONFLICT (id) DO NOTHING;

-- 9. Seed Recovery Plans
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

-- 10. Seed Missions for Learning Arena
INSERT INTO public.missions (id, student_id, title, description, subject, difficulty, xp_reward, progress, target, completed, due_date)
VALUES
  ('m-1', 's1', 'Master SQL Joins', 'Complete all practice modules on INNER, LEFT, RIGHT and FULL OUTER joins.', 'DBMS', 'BEGINNER', 150, 3, 3, true, '2026-10-15'),
  ('m-2', 's1', 'Normalization Expert', 'Achieve 100% on the 2NF and 3NF dependency quiz.', 'DBMS', 'INTERMEDIATE', 200, 1, 2, false, '2026-10-18'),
  ('m-3', 's1', 'ACID Concurrency Trial', 'Simulate multi-transaction commit and rollback scenarios without deadlocks.', 'DBMS', 'ADVANCED', 300, 0, 1, false, '2026-10-22')
ON CONFLICT (id) DO NOTHING;

-- 11. Seed Quests
INSERT INTO public.quests (id, student_id, title, subject, description, difficulty, tasks, xp_reward, status, recommended_reason)
VALUES
  ('q-1', 's1', 'Relational Foundations', 'DBMS', 'Prove complete mastery of fundamental relational algebra and table schemas.', 'BEGINNER',
   '[{"id": "qt-1", "description": "Review Chapter 1 ER Models", "completed": true}, {"id": "qt-2", "description": "Execute 5 SELECT queries with WHERE filters", "completed": true}, {"id": "qt-3", "description": "Score 80%+ on Diagnostic Quiz", "completed": false}]'::jsonb,
   180, 'IN_PROGRESS', 'Recommended based on your recent DBMS quiz score')
ON CONFLICT (id) DO NOTHING;

-- 12. Seed Skills
INSERT INTO public.skills (id, student_id, name, subject, proficiency, level, last_updated)
VALUES
  ('sk-1', 's1', 'SQL Querying', 'DBMS', 82, 'Adept', now()),
  ('sk-2', 's1', 'Normalization', 'DBMS', 48, 'Novice', now()),
  ('sk-3', 's1', 'Transactions & ACID', 'DBMS', 60, 'Intermediate', now()),
  ('sk-4', 's1', 'Binary Search Trees', 'DSA', 74, 'Intermediate', now())
ON CONFLICT (id) DO NOTHING;

-- 13. Seed Achievements
INSERT INTO public.achievements (id, student_id, title, description, icon, requirement, progress, unlocked, unlocked_at)
VALUES
  ('ach-1', 's1', 'First Step', 'Complete your first learning arena mission', '🎯', 1, 1, true, now()),
  ('ach-2', 's1', 'Quiz Champion', 'Score 100% on any adaptive quiz', '🏆', 1, 1, true, now()),
  ('ach-3', 's1', 'Streak Master', 'Maintain a 7-day continuous study streak', '🔥', 7, 5, false, null),
  ('ach-4', 's1', 'Grand Scholar', 'Accumulate over 2,000 XP in learning arena', '⭐', 2000, 1840, false, null)
ON CONFLICT (id) DO NOTHING;

-- 14. Update Student s1 Performance History & Subject Scores
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
