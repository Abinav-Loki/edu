-- ============================================================================
-- ARIVON AI / STUDENTS ANALYTICS: PRODUCTION ROW LEVEL SECURITY & COMPLAINTS
-- Migration: 20261011_production_rls_and_complaints.sql
-- ============================================================================

-- 1. UPDATE SUPPORT_TICKETS SCHEMA (COMPLAINTS REDRESSAL)
ALTER TABLE IF EXISTS public.support_tickets 
  ADD COLUMN IF NOT EXISTS subject TEXT,
  ADD COLUMN IF NOT EXISTS admin_response TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Drop old check constraint if it exists and apply expanded statuses
ALTER TABLE IF EXISTS public.support_tickets 
  DROP CONSTRAINT IF EXISTS support_tickets_status_check;

ALTER TABLE IF EXISTS public.support_tickets 
  ADD CONSTRAINT support_tickets_status_check 
  CHECK (status IN ('pending', 'submitted', 'under_review', 'in_progress', 'resolved'));

-- 2. HELPER FUNCTION TO EXTRACT CURRENT AUTH USER ROLE
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()::text LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. SECURE ROW LEVEL SECURITY: COMPLAINTS (SUPPORT_TICKETS)
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Complaints read policy" ON public.support_tickets;
CREATE POLICY "Complaints read policy" ON public.support_tickets
FOR SELECT TO authenticated
USING (
  -- Students can only read their own complaints
  creator_id = auth.uid()::text
  -- Admins can view all complaints
  OR public.current_user_role() = 'admin'
  -- Faculty can view if assigned or academic category
  OR (public.current_user_role() = 'faculty' AND category IN ('Academic', 'Mentor'))
);

DROP POLICY IF EXISTS "Complaints insert policy" ON public.support_tickets;
CREATE POLICY "Complaints insert policy" ON public.support_tickets
FOR INSERT TO authenticated
WITH CHECK (
  -- Authenticated user must be the complaint creator
  creator_id = auth.uid()::text OR public.current_user_role() = 'admin'
);

DROP POLICY IF EXISTS "Complaints update policy" ON public.support_tickets;
CREATE POLICY "Complaints update policy" ON public.support_tickets
FOR UPDATE TO authenticated
USING (
  -- Admins can update any complaint status and resolution notes
  public.current_user_role() = 'admin'
  -- Creator can update only if complaint is still submitted
  OR (creator_id = auth.uid()::text AND status IN ('submitted', 'pending'))
);

-- 4. SECURE ROW LEVEL SECURITY: STUDENTS TABLE
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students read policy" ON public.students;
CREATE POLICY "Students read policy" ON public.students
FOR SELECT TO authenticated
USING (
  -- Student can only view their own record
  id = auth.uid()::text
  -- Faculty can view department/assigned students
  OR public.current_user_role() IN ('faculty', 'admin')
);

DROP POLICY IF EXISTS "Students update policy" ON public.students;
CREATE POLICY "Students update policy" ON public.students
FOR UPDATE TO authenticated
USING (
  -- Only Faculty and Admin can update attendance and grades
  public.current_user_role() IN ('faculty', 'admin')
);

-- 5. SECURE ROW LEVEL SECURITY: LEARNING RECORDS & XP (STUDENT ISOLATION)
ALTER TABLE public.learning_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Learning profiles isolation policy" ON public.learning_profiles;
CREATE POLICY "Learning profiles isolation policy" ON public.learning_profiles
FOR ALL TO authenticated
USING (student_id = auth.uid()::text OR public.current_user_role() IN ('faculty', 'admin'))
WITH CHECK (student_id = auth.uid()::text OR public.current_user_role() IN ('faculty', 'admin'));

ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "XP events isolation policy" ON public.xp_events;
CREATE POLICY "XP events isolation policy" ON public.xp_events
FOR ALL TO authenticated
USING (student_id = auth.uid()::text OR public.current_user_role() = 'admin')
WITH CHECK (student_id = auth.uid()::text OR public.current_user_role() = 'admin');

ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Missions isolation policy" ON public.missions;
CREATE POLICY "Missions isolation policy" ON public.missions
FOR ALL TO authenticated
USING (student_id = auth.uid()::text OR public.current_user_role() = 'admin')
WITH CHECK (student_id = auth.uid()::text OR public.current_user_role() = 'admin');

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Quests isolation policy" ON public.quests;
CREATE POLICY "Quests isolation policy" ON public.quests
FOR ALL TO authenticated
USING (student_id = auth.uid()::text OR public.current_user_role() = 'admin')
WITH CHECK (student_id = auth.uid()::text OR public.current_user_role() = 'admin');

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Skills isolation policy" ON public.skills;
CREATE POLICY "Skills isolation policy" ON public.skills
FOR ALL TO authenticated
USING (student_id = auth.uid()::text OR public.current_user_role() = 'admin')
WITH CHECK (student_id = auth.uid()::text OR public.current_user_role() = 'admin');

-- 6. PREVENT USERS FROM ELEVATING THEIR OWN ROLE
DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role <> OLD.role AND public.current_user_role() <> 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Only administrator can change account roles.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_role_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();
