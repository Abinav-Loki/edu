-- ============================================================================
-- EduGuard AI — User-Wise Progress Tracking & Row-Level Security (RLS) Migration
-- File: supabase/migrations/20261011_user_wise_progress_rls.sql
-- ============================================================================
-- This migration ensures that every student and staff member has their own
-- separate, persistent, and authorized progress records in Supabase.
--
-- Key Improvements:
-- 1. Creates `user_progress` table for granular, idempotent activity tracking.
-- 2. Enforces unique constraints preventing duplicate XP / completions.
-- 3. Implements strict, role-aware Row Level Security (RLS) policies:
--    - Students can only view and mutate their own records.
--    - Staff (Faculty/Admin) can inspect student records for academic support.
--    - Staff personal progress is completely isolated from student cohorts.
--    - Anonymous clients are prohibited from accessing private student progress.
-- ============================================================================

-- 1. Create or Adapt `user_progress` Table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id TEXT PRIMARY KEY DEFAULT ('prog_' || floor(extract(epoch from now()))::text || '_' || substr(md5(random()::text), 1, 6)),
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('topic_mission', 'quiz', 'quest', 'mission', 'study_task', 'learning_module')),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage NUMERIC DEFAULT 100,
  xp_earned INT DEFAULT 0,
  score NUMERIC,
  metadata JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_user_activity UNIQUE (user_id, activity_type, activity_id)
);

-- Performance and Query Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_activity ON public.user_progress(user_id, activity_type);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON public.user_progress(user_id, status);

-- 2. Add Idempotency Tracking to `xp_events`
ALTER TABLE public.xp_events ADD COLUMN IF NOT EXISTS activity_id TEXT;
ALTER TABLE public.xp_events ADD COLUMN IF NOT EXISTS activity_type TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS uq_xp_event_idempotency 
  ON public.xp_events(student_id, activity_type, activity_id) 
  WHERE activity_id IS NOT NULL;

-- 3. Ensure Unique Scoping on Gamification Tables
CREATE UNIQUE INDEX IF NOT EXISTS uq_missions_student_id ON public.missions(student_id, id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_quests_student_id ON public.quests(student_id, id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_skills_student_name ON public.skills(student_id, name);
CREATE UNIQUE INDEX IF NOT EXISTS uq_achievements_student_id ON public.achievements(student_id, id);

-- 4. Enable RLS on All User-Progress & Activity Tables
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 5. Drop Permissive / Unrestricted Policies
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public access policy for user_progress" ON public.user_progress;
DROP POLICY IF EXISTS "Public access policy for learning_profiles" ON public.learning_profiles;
DROP POLICY IF EXISTS "Public access policy for xp_events" ON public.xp_events;
DROP POLICY IF EXISTS "Public access policy for missions" ON public.missions;
DROP POLICY IF EXISTS "Public access policy for quests" ON public.quests;
DROP POLICY IF EXISTS "Public access policy for skills" ON public.skills;
DROP POLICY IF EXISTS "Public access policy for achievements" ON public.achievements;
DROP POLICY IF EXISTS "Public access policy for quiz_results" ON public.quiz_results;
DROP POLICY IF EXISTS "Public access policy for study_tasks" ON public.study_tasks;
DROP POLICY IF EXISTS "Students can view their own interventions" ON public.interventions;
DROP POLICY IF EXISTS "Faculty can manage interventions" ON public.interventions;

-- ----------------------------------------------------------------------------
-- 6. Helper Security Functions (Security Definer)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()::text
    AND role IN ('faculty', 'admin')
  );
$$;

-- ----------------------------------------------------------------------------
-- 7. Strict RLS Policies for `user_progress`
-- ----------------------------------------------------------------------------
CREATE POLICY "user_progress_select_policy"
  ON public.user_progress FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id OR public.is_staff());

CREATE POLICY "user_progress_insert_policy"
  ON public.user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "user_progress_update_policy"
  ON public.user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "user_progress_delete_policy"
  ON public.user_progress FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- ----------------------------------------------------------------------------
-- 8. Strict RLS Policies for `learning_profiles`
-- ----------------------------------------------------------------------------
CREATE POLICY "learning_profiles_select_policy"
  ON public.learning_profiles FOR SELECT
  TO authenticated
  USING (auth.uid()::text = student_id OR public.is_staff());

CREATE POLICY "learning_profiles_insert_policy"
  ON public.learning_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = student_id);

CREATE POLICY "learning_profiles_update_policy"
  ON public.learning_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = student_id)
  WITH CHECK (auth.uid()::text = student_id);

-- ----------------------------------------------------------------------------
-- 9. Strict RLS Policies for `xp_events`
-- ----------------------------------------------------------------------------
CREATE POLICY "xp_events_select_policy"
  ON public.xp_events FOR SELECT
  TO authenticated
  USING (auth.uid()::text = student_id OR public.is_staff());

CREATE POLICY "xp_events_insert_policy"
  ON public.xp_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = student_id);

-- ----------------------------------------------------------------------------
-- 10. Strict RLS Policies for `missions`
-- ----------------------------------------------------------------------------
CREATE POLICY "missions_select_policy"
  ON public.missions FOR SELECT
  TO authenticated
  USING (auth.uid()::text = student_id OR public.is_staff());

CREATE POLICY "missions_insert_policy"
  ON public.missions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = student_id);

CREATE POLICY "missions_update_policy"
  ON public.missions FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = student_id)
  WITH CHECK (auth.uid()::text = student_id);

-- ----------------------------------------------------------------------------
-- 11. Strict RLS Policies for `quests`
-- ----------------------------------------------------------------------------
CREATE POLICY "quests_select_policy"
  ON public.quests FOR SELECT
  TO authenticated
  USING (auth.uid()::text = student_id OR public.is_staff());

CREATE POLICY "quests_insert_policy"
  ON public.quests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = student_id);

CREATE POLICY "quests_update_policy"
  ON public.quests FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = student_id)
  WITH CHECK (auth.uid()::text = student_id);

-- ----------------------------------------------------------------------------
-- 12. Strict RLS Policies for `skills`
-- ----------------------------------------------------------------------------
CREATE POLICY "skills_select_policy"
  ON public.skills FOR SELECT
  TO authenticated
  USING (auth.uid()::text = student_id OR public.is_staff());

CREATE POLICY "skills_insert_policy"
  ON public.skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = student_id);

CREATE POLICY "skills_update_policy"
  ON public.skills FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = student_id)
  WITH CHECK (auth.uid()::text = student_id);

-- ----------------------------------------------------------------------------
-- 13. Strict RLS Policies for `achievements`
-- ----------------------------------------------------------------------------
CREATE POLICY "achievements_select_policy"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (auth.uid()::text = student_id OR public.is_staff());

CREATE POLICY "achievements_insert_policy"
  ON public.achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = student_id);

CREATE POLICY "achievements_update_policy"
  ON public.achievements FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = student_id)
  WITH CHECK (auth.uid()::text = student_id);

-- ----------------------------------------------------------------------------
-- 14. Strict RLS Policies for `quiz_results`
-- ----------------------------------------------------------------------------
CREATE POLICY "quiz_results_select_policy"
  ON public.quiz_results FOR SELECT
  TO authenticated
  USING (auth.uid()::text = student_id OR public.is_staff());

CREATE POLICY "quiz_results_insert_policy"
  ON public.quiz_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = student_id);

-- ----------------------------------------------------------------------------
-- 15. Strict RLS Policies for `study_tasks`
-- ----------------------------------------------------------------------------
CREATE POLICY "study_tasks_select_policy"
  ON public.study_tasks FOR SELECT
  TO authenticated
  USING (auth.uid()::text = student_id OR public.is_staff());

CREATE POLICY "study_tasks_insert_policy"
  ON public.study_tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = student_id);

CREATE POLICY "study_tasks_update_policy"
  ON public.study_tasks FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = student_id)
  WITH CHECK (auth.uid()::text = student_id);

CREATE POLICY "study_tasks_delete_policy"
  ON public.study_tasks FOR DELETE
  TO authenticated
  USING (auth.uid()::text = student_id);

-- ----------------------------------------------------------------------------
-- 16. Strict RLS Policies for `interventions`
-- ----------------------------------------------------------------------------
-- Students can only view interventions assigned to them
CREATE POLICY "interventions_student_select_policy"
  ON public.interventions FOR SELECT
  TO authenticated
  USING (auth.uid()::text = student_id OR public.is_staff());

-- Only faculty and admin can create or modify interventions
CREATE POLICY "interventions_staff_manage_policy"
  ON public.interventions FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- ----------------------------------------------------------------------------
-- 17. Safe Seed Data for Initial Students (Idempotent)
-- ----------------------------------------------------------------------------
-- Populate clean, initial learning profile for student s2 (Ananya Roy)
INSERT INTO public.learning_profiles (student_id, level, total_xp, arena_coins, streak, longest_streak, last_learning_date, completed_quests, quiz_accuracy, quizzes_completed, title, current_focus, arena_progress)
VALUES ('s2', 1, 0, 0, 0, 0, '', 0, 0, 0, 'New Explorer', 'General', '{"completedTopicIds": {}, "currentMissionTopicId": {}, "activeQuestionIndex": {}, "quizScores": {}}'::jsonb)
ON CONFLICT (student_id) DO NOTHING;

-- Populate clean learning profile for staff f1 (Prof. Rahul Kumar)
INSERT INTO public.learning_profiles (student_id, level, total_xp, arena_coins, streak, longest_streak, last_learning_date, completed_quests, quiz_accuracy, quizzes_completed, title, current_focus, arena_progress)
VALUES ('f1', 5, 620, 620, 2, 5, now()::text, 2, 90, 4, 'Senior Scholar', 'DBMS Architecture', '{"completedTopicIds": {}, "currentMissionTopicId": {}, "activeQuestionIndex": {}, "quizScores": {}}'::jsonb)
ON CONFLICT (student_id) DO NOTHING;
