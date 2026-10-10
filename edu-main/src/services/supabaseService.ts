import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  Student,
  Mentor,
  Asset,
  MentorRequest,
  MaintenanceTicket,
  SupportTicket,
  Feedback,
  Material,
  ScheduleItem,
  AvailabilitySlot,
  User
} from "../data/centralData";
import { LearningProfile, Mission, Quest, Skill, Achievement, XPEvent } from "../data/learningData";

// Extended Student Interface to support performance data
export interface ExtendedStudent extends Student {
  email?: string;
  gpa?: number;
  journeyType?: string;
  performanceHistory?: Array<{ week: string; quiz: number; assignment: number; attendance: number }>;
  subjectScores?: Array<{ subject: string; score: number; total: number }>;
}

export interface StudyTaskRecord {
  id: string;
  studentId: string;
  day: string;
  subjectId: string;
  subjectName: string;
  topicTitle: string;
  durationMinutes: number;
  activityType: "Learn" | "Practice" | "Quiz" | "Revision" | "AI Tutor" | "Assignment";
  completed: boolean;
  priority: "High" | "Medium" | "Low";
}

export interface CalendarEventRecord {
  id: string;
  studentId?: string;
  title: string;
  date: string;
  time: string;
  type: "quiz" | "assignment" | "exam" | "plan" | "other";
}

export interface RecoveryPlanRecord {
  id: string;
  studentId: string;
  title: string;
  focus: string;
  days: number;
  tasksCompleted: number;
  totalTasks: number;
  progressPercent: number;
  status: "not_started" | "in_progress" | "completed" | "overdue";
  currentDay: number;
  tasks: Array<{
    id: string;
    title: string;
    duration: string;
    type: "Video" | "Practice" | "Quiz" | "Reading" | "Mentor" | "Revision";
    completed: boolean;
  }>;
}

export interface TutorMessageRecord {
  id: string;
  studentId: string;
  role: "bot" | "user" | "system";
  content: string;
  timestamp: string;
  attachedFile?: {
    name: string;
    size: string;
    type: string;
    url?: string;
  };
}

export interface QuizResultRecord {
  id: string;
  studentId: string;
  topic: string;
  score: number;
  total: number;
  accuracy: number;
  createdAt: string;
}

// ============================================================================
// 1. PROFILES & USERS
// ============================================================================

export async function fetchProfileById(userId: string): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return null;
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      avatar: data.avatar || undefined,
      department: data.department || undefined
    };
  } catch (err) {
    console.error("fetchProfileById error:", err);
    return null;
  }
}

export async function fetchProfileByEmail(email: string): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (error || !data) return null;
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      avatar: data.avatar || undefined,
      department: data.department || undefined
    };
  } catch (err) {
    console.error("fetchProfileByEmail error:", err);
    return null;
  }
}

export async function saveProfileToDB(user: Partial<User> & { id: string; name: string; role: any }): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      name: user.name,
      role: user.role,
      department: user.department || null,
      avatar: user.avatar || null
    });
    if (error) console.error("saveProfileToDB error:", error.message);
  } catch (err) {
    console.error("Failed to save profile to Supabase:", err);
  }
}

// ============================================================================
// 2. STUDENTS
// ============================================================================

export async function fetchStudentsFromDB(): Promise<ExtendedStudent[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*, profiles!students_id_fkey(*)");

    if (error) {
      console.warn("Supabase fetchStudents error:", error.message);
      return null;
    }
    if (!data || data.length === 0) return [];

    return data.map((row: any) => ({
      id: row.id,
      name: row.profiles?.name || row.name || "Student",
      email: row.profiles?.email || undefined,
      role: "student" as const,
      avatar: row.profiles?.avatar || undefined,
      department: row.profiles?.department || undefined,
      course: row.course || "B.Tech IT",
      year: row.year || "3rd Year",
      attendancePercent: Number(row.attendance_percent ?? 75),
      quizAverage: Number(row.quiz_average ?? 65),
      assignmentAverage: Number(row.assignment_average ?? 70),
      lateSubmissions: Number(row.late_submissions ?? 0),
      totalAssignments: Number(row.total_assignments ?? 10),
      gpa: Number(row.gpa ?? 3.2),
      journeyType: row.journey_type || "stable",
      weakTopics: Array.isArray(row.weak_topics) ? row.weak_topics : [],
      performanceHistory: Array.isArray(row.performance_history) && row.performance_history.length > 0
        ? row.performance_history
        : undefined,
      subjectScores: Array.isArray(row.subject_scores) && row.subject_scores.length > 0
        ? row.subject_scores
        : undefined
    }));
  } catch (err) {
    console.error("Failed to load students from Supabase:", err);
    return null;
  }
}

export async function fetchStudentById(studentId: string): Promise<ExtendedStudent | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*, profiles!students_id_fkey(*)")
      .eq("id", studentId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.profiles?.name || "Student",
      email: data.profiles?.email || undefined,
      role: "student",
      avatar: data.profiles?.avatar || undefined,
      department: data.profiles?.department || undefined,
      course: data.course || "B.Tech IT",
      year: data.year || "3rd Year",
      attendancePercent: Number(data.attendance_percent ?? 75),
      quizAverage: Number(data.quiz_average ?? 65),
      assignmentAverage: Number(data.assignment_average ?? 70),
      lateSubmissions: Number(data.late_submissions ?? 0),
      totalAssignments: Number(data.total_assignments ?? 10),
      gpa: Number(data.gpa ?? 3.2),
      journeyType: data.journey_type || "stable",
      weakTopics: Array.isArray(data.weak_topics) ? data.weak_topics : [],
      performanceHistory: Array.isArray(data.performance_history) ? data.performance_history : undefined,
      subjectScores: Array.isArray(data.subject_scores) ? data.subject_scores : undefined
    };
  } catch (err) {
    console.error("fetchStudentById error:", err);
    return null;
  }
}

export async function saveStudentToDB(student: Partial<ExtendedStudent> & { id: string }): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const payload: any = { id: student.id };
    if (student.course !== undefined) payload.course = student.course;
    if (student.year !== undefined) payload.year = student.year;
    if (student.attendancePercent !== undefined) payload.attendance_percent = student.attendancePercent;
    if (student.quizAverage !== undefined) payload.quiz_average = student.quizAverage;
    if (student.assignmentAverage !== undefined) payload.assignment_average = student.assignmentAverage;
    if (student.lateSubmissions !== undefined) payload.late_submissions = student.lateSubmissions;
    if (student.totalAssignments !== undefined) payload.total_assignments = student.totalAssignments;
    if (student.gpa !== undefined) payload.gpa = student.gpa;
    if (student.journeyType !== undefined) payload.journey_type = student.journeyType;
    if (student.weakTopics !== undefined) payload.weak_topics = student.weakTopics;
    if (student.performanceHistory !== undefined) payload.performance_history = student.performanceHistory;
    if (student.subjectScores !== undefined) payload.subject_scores = student.subjectScores;

    const { error } = await supabase.from("students").upsert(payload);
    if (error) console.error("saveStudentToDB error:", error.message);
  } catch (err) {
    console.error("Failed to save student in Supabase:", err);
  }
}

// ============================================================================
// 3. FACULTY & MENTORS
// ============================================================================

export async function fetchMentorsFromDB(): Promise<Mentor[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("mentors")
      .select("*, profiles(*)");

    if (error) {
      console.warn("Supabase fetchMentors error:", error.message);
      return null;
    }
    if (!data || data.length === 0) return [];

    return data.map((row: any) => ({
      id: row.id,
      name: row.profiles?.name || row.name || "Faculty Mentor",
      role: "faculty" as const,
      avatar: row.profiles?.avatar || undefined,
      department: row.department || row.profiles?.department || "Computer Science",
      specialization: Array.isArray(row.specialization) ? row.specialization : [],
      availability: Array.isArray(row.availability) ? row.availability : [],
      currentLocation: row.current_location || "Faculty Block"
    }));
  } catch (err) {
    console.error("Failed to load mentors from Supabase:", err);
    return null;
  }
}

export async function saveMentorToDB(mentor: Partial<Mentor> & { id: string }): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const payload: any = { id: mentor.id };
    if (mentor.department !== undefined) payload.department = mentor.department;
    if (mentor.specialization !== undefined) payload.specialization = mentor.specialization;
    if (mentor.availability !== undefined) payload.availability = mentor.availability;
    if (mentor.currentLocation !== undefined) payload.current_location = mentor.currentLocation;

    const { error } = await supabase.from("mentors").upsert(payload);
    if (error) console.error("saveMentorToDB error:", error.message);
  } catch (err) {
    console.error("Failed to save mentor in Supabase:", err);
  }
}

export async function fetchFacultySchedulesFromDB(): Promise<ScheduleItem[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from("faculty_schedules").select("*");
    if (error) {
      console.warn("Supabase fetchFacultySchedules error:", error.message);
      return null;
    }
    if (!data || data.length === 0) return [];

    return data.map((row: any) => ({
      id: row.id,
      facultyId: row.faculty_id,
      day: row.day,
      date: row.date || undefined,
      startTime: row.start_time,
      endTime: row.end_time,
      subject: row.subject,
      room: row.room || "",
      building: row.building || "",
      activityType: row.activity_type,
      notes: row.notes || undefined
    }));
  } catch (err) {
    console.error("Failed to load faculty schedules from Supabase:", err);
    return null;
  }
}

export async function saveFacultyScheduleToDB(sched: ScheduleItem): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("faculty_schedules").upsert({
      id: sched.id,
      faculty_id: sched.facultyId,
      day: sched.day,
      date: sched.date || null,
      start_time: sched.startTime,
      end_time: sched.endTime,
      subject: sched.subject,
      room: sched.room,
      building: sched.building,
      activity_type: sched.activityType,
      notes: sched.notes || null
    });
  } catch (err) {
    console.error("saveFacultyScheduleToDB error:", err);
  }
}

export async function fetchMentorAvailabilityFromDB(): Promise<AvailabilitySlot[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from("faculty_availability").select("*");
    if (error) {
      console.warn("Supabase fetchMentorAvailability error:", error.message);
      return null;
    }
    if (!data || data.length === 0) return [];

    return data.map((row: any) => ({
      id: row.id,
      facultyId: row.faculty_id,
      day: row.day,
      startTime: row.start_time,
      endTime: row.end_time
    }));
  } catch (err) {
    console.error("Failed to load faculty availability from Supabase:", err);
    return null;
  }
}

export async function saveMentorAvailabilityToDB(slot: AvailabilitySlot): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("faculty_availability").upsert({
      id: slot.id,
      faculty_id: slot.facultyId,
      day: slot.day,
      start_time: slot.startTime,
      end_time: slot.endTime
    });
  } catch (err) {
    console.error("saveMentorAvailabilityToDB error:", err);
  }
}

// ============================================================================
// 4. MENTOR REQUESTS
// ============================================================================

export async function fetchMentorRequestsFromDB(): Promise<MentorRequest[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from("mentor_requests").select("*");
    if (error) {
      console.warn("Supabase fetchMentorRequests error:", error.message);
      return null;
    }
    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      studentId: row.student_id,
      mentorId: row.mentor_id,
      subject: row.subject,
      date: row.date,
      time: row.time,
      status: row.status,
      proposedTime: row.proposed_time || undefined,
      proposedDate: row.proposed_date || undefined
    }));
  } catch (err) {
    console.error("Failed to load mentor requests from Supabase:", err);
    return null;
  }
}

export async function saveMentorRequestToDB(req: MentorRequest): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("mentor_requests").upsert({
      id: req.id,
      student_id: req.studentId,
      mentor_id: req.mentorId,
      subject: req.subject,
      date: req.date,
      time: req.time,
      status: req.status,
      proposed_time: req.proposedTime || null,
      proposed_date: req.proposedDate || null
    });
    if (error) console.error("saveMentorRequestToDB error:", error.message);
  } catch (err) {
    console.error("Failed to save mentor request to Supabase:", err);
  }
}

// ============================================================================
// 5. ASSETS & MAINTENANCE
// ============================================================================

export async function fetchAssetsFromDB(): Promise<Asset[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from("assets").select("*");
    if (error) {
      console.warn("Supabase fetchAssets error:", error.message);
      return null;
    }
    if (!data || data.length === 0) return [];

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      building: row.building,
      room: row.room,
      operatingHours: Number(row.operating_hours ?? 0),
      lastService: row.last_service || new Date().toISOString().split("T")[0],
      serviceIncidents: Number(row.service_incidents ?? 0),
      status: row.status || "online"
    }));
  } catch (err) {
    console.error("Failed to load assets from Supabase:", err);
    return null;
  }
}

export async function fetchMaintenanceTicketsFromDB(): Promise<MaintenanceTicket[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from("maintenance_tickets").select("*");
    if (error) {
      console.warn("Supabase fetchMaintenanceTickets error:", error.message);
      return null;
    }
    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      assetId: row.asset_id,
      description: row.description,
      priority: row.priority,
      status: row.status,
      createdAt: row.created_at
    }));
  } catch (err) {
    console.error("Failed to load maintenance tickets from Supabase:", err);
    return null;
  }
}

export async function saveMaintenanceTicketToDB(ticket: MaintenanceTicket): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("maintenance_tickets").upsert({
      id: ticket.id,
      asset_id: ticket.assetId,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      created_at: ticket.createdAt
    });
    if (error) console.error("saveMaintenanceTicketToDB error:", error.message);
  } catch (err) {
    console.error("Failed to save maintenance ticket to Supabase:", err);
  }
}

// ============================================================================
// 6. SUPPORT TICKETS & FEEDBACK
// ============================================================================

export async function fetchSupportTicketsFromDB(): Promise<SupportTicket[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from("support_tickets").select("*");
    if (error) {
      console.warn("Supabase fetchSupportTickets error:", error.message);
      return null;
    }
    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      creatorId: row.creator_id,
      category: row.category,
      description: row.description,
      status: row.status,
      createdAt: row.created_at,
      attachments: row.attachments || []
    }));
  } catch (err) {
    console.error("Failed to load support tickets from Supabase:", err);
    return null;
  }
}

export async function saveSupportTicketToDB(ticket: SupportTicket): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("support_tickets").upsert({
      id: ticket.id,
      creator_id: ticket.creatorId,
      category: ticket.category,
      description: ticket.description,
      status: ticket.status,
      attachments: ticket.attachments || [],
      created_at: ticket.createdAt
    });
    if (error) console.error("saveSupportTicketToDB error:", error.message);
  } catch (err) {
    console.error("Failed to save support ticket to Supabase:", err);
  }
}

export async function fetchFeedbackFromDB(): Promise<Feedback[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from("feedback").select("*");
    if (error) {
      console.warn("Supabase fetchFeedback error:", error.message);
      return null;
    }
    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      category: row.category,
      text: row.text,
      location: row.location || undefined,
      createdAt: row.created_at
    }));
  } catch (err) {
    console.error("Failed to load feedback from Supabase:", err);
    return null;
  }
}

export async function saveFeedbackToDB(fb: Feedback): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("feedback").upsert({
      id: fb.id,
      category: fb.category,
      text: fb.text,
      location: fb.location || null,
      created_at: fb.createdAt
    });
    if (error) console.error("saveFeedbackToDB error:", error.message);
  } catch (err) {
    console.error("saveFeedbackToDB error:", err);
  }
}

// ============================================================================
// 7. STUDY MATERIALS & SUPABASE STORAGE
// ============================================================================

export async function fetchMaterialsFromDB(): Promise<Material[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from("materials").select("*");
    if (error) {
      console.warn("Supabase fetchMaterials error:", error.message);
      return null;
    }
    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      fileName: row.file_name,
      fileType: row.file_type,
      fileSize: row.file_size ? Number(row.file_size) : undefined,
      fileUrl: row.file_url || undefined,
      subject: row.subject,
      description: row.description || "",
      uploadedBy: row.uploaded_by,
      studentId: row.student_id,
      uploadedAt: row.uploaded_at
    }));
  } catch (err) {
    console.error("Failed to load materials from Supabase:", err);
    return null;
  }
}

export async function saveMaterialToDB(mat: Material): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("materials").upsert({
      id: mat.id,
      file_name: mat.fileName,
      file_type: mat.fileType,
      file_size: mat.fileSize || null,
      file_url: mat.fileUrl || null,
      subject: mat.subject,
      description: mat.description,
      uploaded_by: mat.uploadedBy,
      student_id: mat.studentId,
      uploaded_at: mat.uploadedAt
    });
    if (error) console.error("saveMaterialToDB error:", error.message);
  } catch (err) {
    console.error("Failed to save material to Supabase:", err);
  }
}

export async function deleteMaterialFromDB(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("materials").delete().eq("id", id);
    if (error) console.error("deleteMaterialFromDB error:", error.message);
  } catch (err) {
    console.error("Failed to delete material from Supabase:", err);
  }
}

export async function uploadFileToStorage(file: File, bucket = "materials"): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const ext = file.name.split(".").pop();
    const filePath = `uploads/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) {
      console.warn("Storage upload error (using local path fallback):", error.message);
      return null;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error("Storage upload exception:", err);
    return null;
  }
}

// ============================================================================
// 8. USER PROGRESS & PERSONAL LEARNING ARCHITECTURE
// ============================================================================

export interface UserProgressRecord {
  id: string;
  userId: string;
  activityId: string;
  activityType: "topic_mission" | "quiz" | "quest" | "mission" | "study_task" | "learning_module";
  status: "not_started" | "in_progress" | "completed";
  progressPercentage: number;
  xpEarned: number;
  score?: number;
  metadata?: Record<string, any>;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchUserProgressFromDB(userId: string): Promise<UserProgressRecord[]> {
  if (!userId) return [];
  const localKey = `edu_user_progress_${userId}`;
  let localList: UserProgressRecord[] = [];
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) localList = JSON.parse(raw);
  } catch (e) {
    console.warn("fetchUserProgressFromDB localStorage read error:", e);
  }

  if (!isSupabaseConfigured()) return localList;

  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) return localList;
    if (data && data.length > 0) {
      const mapped: UserProgressRecord[] = data.map((d: any) => ({
        id: d.id,
        userId: d.user_id,
        activityId: d.activity_id,
        activityType: d.activity_type,
        status: d.status,
        progressPercentage: Number(d.progress_percentage ?? 100),
        xpEarned: Number(d.xp_earned ?? 0),
        score: d.score !== null ? Number(d.score) : undefined,
        metadata: d.metadata || {},
        completedAt: d.completed_at,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
      try {
        localStorage.setItem(localKey, JSON.stringify(mapped));
      } catch (e) {}
      return mapped;
    }
    return localList;
  } catch (err) {
    console.error("fetchUserProgressFromDB error:", err);
    return localList;
  }
}

export async function saveUserActivityProgressToDB(
  progress: UserProgressRecord
): Promise<{ success: boolean; isDuplicate: boolean }> {
  if (!progress.userId) return { success: false, isDuplicate: false };
  const localKey = `edu_user_progress_${progress.userId}`;

  let localList: UserProgressRecord[] = [];
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) localList = JSON.parse(raw);
  } catch (e) {}

  const existingIndex = localList.findIndex(
    (p) => p.activityType === progress.activityType && p.activityId === progress.activityId
  );

  if (existingIndex >= 0 && localList[existingIndex].status === "completed") {
    // Idempotent: already completed, skip duplicate persistence and reward
    return { success: true, isDuplicate: true };
  }

  const updatedRecord: UserProgressRecord = {
    ...progress,
    updatedAt: new Date().toISOString(),
    completedAt: progress.status === "completed" ? (progress.completedAt || new Date().toISOString()) : undefined,
  };

  if (existingIndex >= 0) {
    localList[existingIndex] = updatedRecord;
  } else {
    localList.unshift(updatedRecord);
  }

  try {
    localStorage.setItem(localKey, JSON.stringify(localList));
  } catch (e) {}

  if (!isSupabaseConfigured()) {
    return { success: true, isDuplicate: false };
  }

  try {
    const { error } = await supabase.from("user_progress").upsert(
      {
        id: updatedRecord.id,
        user_id: updatedRecord.userId,
        activity_id: updatedRecord.activityId,
        activity_type: updatedRecord.activityType,
        status: updatedRecord.status,
        progress_percentage: updatedRecord.progressPercentage,
        xp_earned: updatedRecord.xpEarned,
        score: updatedRecord.score ?? null,
        metadata: updatedRecord.metadata ?? {},
        completed_at: updatedRecord.completedAt ?? null,
        updated_at: updatedRecord.updatedAt,
      },
      { onConflict: "user_id,activity_type,activity_id" }
    );

    if (error) {
      console.warn("saveUserActivityProgressToDB upsert error:", error.message);
      return { success: false, isDuplicate: false };
    }
    return { success: true, isDuplicate: false };
  } catch (err) {
    console.error("saveUserActivityProgressToDB error:", err);
    return { success: false, isDuplicate: false };
  }
}

export async function fetchLearningProfileFromDB(studentId: string): Promise<LearningProfile | null> {
  if (!studentId) return null;
  const localKey = `edu_learning_profile_${studentId}`;
  let localProfile: LearningProfile | null = null;
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) localProfile = JSON.parse(raw);
  } catch (e) {}

  if (!isSupabaseConfigured()) return localProfile;

  try {
    const { data, error } = await supabase
      .from("learning_profiles")
      .select("*")
      .eq("student_id", studentId)
      .maybeSingle();

    if (error || !data) return localProfile;

    const profile: LearningProfile = {
      studentId: data.student_id,
      level: Number(data.level ?? 1),
      totalXP: Number(data.total_xp ?? 0),
      arenaCoins: Number(data.arena_coins ?? 0),
      streak: Number(data.streak ?? 0),
      longestStreak: Number(data.longest_streak ?? 0),
      lastLearningDate: data.last_learning_date || "",
      completedQuests: Number(data.completed_quests ?? 0),
      quizAccuracy: Number(data.quiz_accuracy ?? 0),
      quizzesCompleted: Number(data.quizzes_completed ?? 0),
      title: data.title || "New Explorer",
      currentFocus: data.current_focus || "General",
      avatarId: data.avatar_id || "av-1",
      frameId: data.frame_id || "fr-1",
      backgroundId: data.background_id || "bg-1",
      titleId: data.title_id || "ti-1",
      unlockedCosmetics: Array.isArray(data.unlocked_cosmetics)
        ? data.unlocked_cosmetics
        : ["av-1", "fr-1", "bg-1", "ti-1"],
    };

    try {
      localStorage.setItem(localKey, JSON.stringify(profile));
    } catch (e) {}

    return profile;
  } catch (err) {
    console.error("fetchLearningProfileFromDB error:", err);
    return localProfile;
  }
}

export async function saveLearningProfileToDB(profile: LearningProfile): Promise<void> {
  if (!profile.studentId) return;
  const localKey = `edu_learning_profile_${profile.studentId}`;
  try {
    localStorage.setItem(localKey, JSON.stringify(profile));
  } catch (e) {
    console.warn("saveLearningProfileToDB localStorage write error:", e);
  }

  if (!isSupabaseConfigured()) return;

  try {
    const { error } = await supabase.from("learning_profiles").upsert({
      student_id: profile.studentId,
      level: profile.level,
      total_xp: profile.totalXP,
      arena_coins: profile.arenaCoins,
      streak: profile.streak,
      longest_streak: profile.longestStreak,
      last_learning_date: profile.lastLearningDate,
      completed_quests: profile.completedQuests,
      quiz_accuracy: profile.quizAccuracy,
      quizzes_completed: profile.quizzesCompleted,
      title: profile.title,
      current_focus: profile.currentFocus,
      avatar_id: profile.avatarId,
      frame_id: profile.frameId,
      background_id: profile.backgroundId,
      title_id: profile.titleId,
      unlocked_cosmetics: profile.unlockedCosmetics,
    });
    if (error) console.error("saveLearningProfileToDB error:", error.message);
  } catch (err) {
    console.error("Failed to save learning profile to Supabase:", err);
  }
}

export async function fetchArenaProgressFromDB(studentId: string): Promise<any | null> {
  if (!studentId || studentId === "default") return null;

  // Purge any legacy global keys to prevent cross-account pollution
  try {
    localStorage.removeItem("edu_arena_progress_master");
  } catch (e) {}

  const localKey = `edu_arena_progress_${studentId}`;
  let localData: any = null;
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) {
      localData = JSON.parse(raw);
    }
  } catch (e) {
    console.warn("fetchArenaProgressFromDB localStorage read error:", e);
  }

  if (!isSupabaseConfigured()) return localData;

  try {
    const { data, error } = await supabase
      .from("learning_profiles")
      .select("arena_progress")
      .eq("student_id", studentId)
      .maybeSingle();

    if (error) {
      return localData;
    }

    if (data && data.arena_progress && Object.keys(data.arena_progress).length > 0) {
      try {
        localStorage.setItem(localKey, JSON.stringify(data.arena_progress));
      } catch (e) {}
      return data.arena_progress;
    }

    return localData;
  } catch (err) {
    console.error("fetchArenaProgressFromDB error:", err);
    return localData;
  }
}

export async function saveArenaProgressToDB(studentId: string, arenaProgress: any): Promise<void> {
  if (!studentId || studentId === "default") return;

  // Purge any legacy global keys
  try {
    localStorage.removeItem("edu_arena_progress_master");
  } catch (e) {}

  const localKey = `edu_arena_progress_${studentId}`;
  try {
    localStorage.setItem(localKey, JSON.stringify(arenaProgress));
  } catch (e) {
    console.warn("saveArenaProgressToDB localStorage write error:", e);
  }

  if (!isSupabaseConfigured()) return;

  try {
    const { error } = await supabase
      .from("learning_profiles")
      .update({ arena_progress: arenaProgress })
      .eq("student_id", studentId);

    if (error) {
      console.warn("saveArenaProgressToDB update error:", error.message);
      await supabase.from("learning_profiles").upsert({
        student_id: studentId,
        arena_progress: arenaProgress,
      });
    }
  } catch (err) {
    console.error("saveArenaProgressToDB error:", err);
  }
}

export async function saveXPEventToDB(event: XPEvent): Promise<void> {
  if (!event.studentId) return;

  // Local storage cache scoped to this student
  const localKey = `edu_xp_events_${event.studentId}`;
  try {
    const raw = localStorage.getItem(localKey);
    const list: XPEvent[] = raw ? JSON.parse(raw) : [];
    if (!list.some((e) => e.id === event.id)) {
      list.unshift(event);
      localStorage.setItem(localKey, JSON.stringify(list.slice(0, 50)));
    }
  } catch (e) {}

  if (!isSupabaseConfigured()) return;

  try {
    const { error } = await supabase.from("xp_events").insert({
      id: event.id,
      student_id: event.studentId,
      amount: event.amount,
      reason: event.reason,
      source: event.source,
      timestamp: event.timestamp,
    });
    if (error) console.error("saveXPEventToDB error:", error.message);
  } catch (err) {
    console.error("Failed to save XP event to Supabase:", err);
  }
}

export async function fetchXPEventsFromDB(studentId: string): Promise<XPEvent[] | null> {
  if (!studentId) return null;

  const localKey = `edu_xp_events_${studentId}`;
  let localEvents: XPEvent[] = [];
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) localEvents = JSON.parse(raw);
  } catch (e) {}

  if (!isSupabaseConfigured()) return localEvents;

  try {
    const { data, error } = await supabase
      .from("xp_events")
      .select("*")
      .eq("student_id", studentId)
      .order("timestamp", { ascending: false });

    if (error) return localEvents;
    if (!data) return localEvents;

    const mapped: XPEvent[] = data.map((d: any) => ({
      id: d.id,
      studentId: d.student_id,
      amount: Number(d.amount),
      reason: d.reason,
      source: d.source,
      timestamp: d.timestamp,
    }));

    try {
      localStorage.setItem(localKey, JSON.stringify(mapped));
    } catch (e) {}

    return mapped;
  } catch (err) {
    console.error("fetchXPEventsFromDB error:", err);
    return localEvents;
  }
}


// ============================================================================
// 9. MISSIONS, QUESTS, SKILLS, ACHIEVEMENTS
// ============================================================================

export async function fetchMissionsFromDB(studentId: string): Promise<Mission[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("missions")
      .select("*")
      .eq("student_id", studentId);

    if (error || !data || data.length === 0) return null;

    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      description: d.description || "",
      subject: d.subject,
      difficulty: d.difficulty || "BEGINNER",
      xpReward: Number(d.xp_reward ?? 100),
      progress: Number(d.progress ?? 0),
      target: Number(d.target ?? 100),
      completed: Boolean(d.completed),
      dueDate: d.due_date || ""
    }));
  } catch (err) {
    console.error("fetchMissionsFromDB error:", err);
    return null;
  }
}

export async function saveMissionToDB(mission: Mission, studentId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("missions").upsert({
      id: mission.id,
      student_id: studentId,
      title: mission.title,
      description: mission.description,
      subject: mission.subject,
      difficulty: mission.difficulty,
      xp_reward: mission.xpReward,
      progress: mission.progress,
      target: mission.target,
      completed: mission.completed,
      due_date: mission.dueDate
    });
  } catch (err) {
    console.error("saveMissionToDB error:", err);
  }
}

export async function completeMissionInDB(missionId: string, studentId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("missions").update({
      completed: true,
      progress: 1
    }).match({ id: missionId, student_id: studentId });
  } catch (err) {
    console.error("completeMissionInDB error:", err);
  }
}

export async function fetchQuestsFromDB(studentId: string): Promise<Quest[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("quests")
      .select("*")
      .eq("student_id", studentId);

    if (error || !data || data.length === 0) return null;

    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      subject: d.subject,
      description: d.description || "",
      difficulty: d.difficulty || "BEGINNER",
      tasks: Array.isArray(d.tasks) ? d.tasks : [],
      xpReward: Number(d.xp_reward ?? 150),
      status: d.status || "AVAILABLE",
      recommendedReason: d.recommended_reason || undefined
    }));
  } catch (err) {
    console.error("fetchQuestsFromDB error:", err);
    return null;
  }
}

export async function saveQuestToDB(quest: Quest, studentId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("quests").upsert({
      id: quest.id,
      student_id: studentId,
      title: quest.title,
      subject: quest.subject,
      description: quest.description,
      difficulty: quest.difficulty,
      tasks: quest.tasks,
      xp_reward: quest.xpReward,
      status: quest.status,
      recommended_reason: quest.recommendedReason || null
    });
  } catch (err) {
    console.error("saveQuestToDB error:", err);
  }
}

export async function updateQuestProgressInDB(
  questId: string,
  studentId: string,
  tasks: any[],
  status: string
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("quests").update({
      tasks,
      status
    }).match({ id: questId, student_id: studentId });
  } catch (err) {
    console.error("updateQuestProgressInDB error:", err);
  }
}

export async function fetchSkillsFromDB(studentId: string): Promise<Skill[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("student_id", studentId);

    if (error || !data || data.length === 0) return null;

    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      subject: d.subject,
      proficiency: Number(d.proficiency ?? 0),
      level: d.level || "Novice",
      lastUpdated: d.last_updated
    }));
  } catch (err) {
    console.error("fetchSkillsFromDB error:", err);
    return null;
  }
}

export async function saveSkillToDB(skill: Skill, studentId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("skills").upsert({
      id: skill.id,
      student_id: studentId,
      name: skill.name,
      subject: skill.subject,
      proficiency: skill.proficiency,
      level: skill.level,
      last_updated: skill.lastUpdated
    });
  } catch (err) {
    console.error("saveSkillToDB error:", err);
  }
}

export async function fetchAchievementsFromDB(studentId: string): Promise<Achievement[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("student_id", studentId);

    if (error || !data || data.length === 0) return null;

    return data.map((d: any) => ({
      id: d.id,
      title: d.title,
      description: d.description || "",
      icon: d.icon || "🏆",
      requirement: Number(d.requirement ?? 1),
      progress: Number(d.progress ?? 0),
      unlocked: Boolean(d.unlocked),
      unlockedAt: d.unlocked_at || undefined
    }));
  } catch (err) {
    console.error("fetchAchievementsFromDB error:", err);
    return null;
  }
}

export async function saveAchievementToDB(ach: Achievement, studentId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("achievements").upsert({
      id: ach.id,
      student_id: studentId,
      title: ach.title,
      description: ach.description,
      icon: ach.icon,
      requirement: ach.requirement,
      progress: ach.progress,
      unlocked: ach.unlocked,
      unlocked_at: ach.unlockedAt || null
    });
  } catch (err) {
    console.error("saveAchievementToDB error:", err);
  }
}

// ============================================================================
// 10. RECOVERY PLANS
// ============================================================================

export async function fetchRecoveryPlanFromDB(studentId: string): Promise<RecoveryPlanRecord | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("recovery_plans")
      .select("*")
      .eq("student_id", studentId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      studentId: data.student_id,
      title: data.title,
      focus: data.focus,
      days: Number(data.days ?? 7),
      tasksCompleted: Number(data.tasks_completed ?? 0),
      totalTasks: Number(data.total_tasks ?? 5),
      progressPercent: Number(data.progress_percent ?? 0),
      status: data.status || "in_progress",
      currentDay: Number(data.current_day ?? 1),
      tasks: Array.isArray(data.tasks) ? data.tasks : []
    };
  } catch (err) {
    console.error("fetchRecoveryPlanFromDB error:", err);
    return null;
  }
}

export async function saveRecoveryPlanToDB(plan: RecoveryPlanRecord): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("recovery_plans").upsert({
      id: plan.id,
      student_id: plan.studentId,
      title: plan.title,
      focus: plan.focus,
      days: plan.days,
      tasks_completed: plan.tasksCompleted,
      total_tasks: plan.totalTasks,
      progress_percent: plan.progressPercent,
      status: plan.status,
      current_day: plan.currentDay,
      tasks: plan.tasks
    });
    if (error) console.error("saveRecoveryPlanToDB error:", error.message);
  } catch (err) {
    console.error("saveRecoveryPlanToDB error:", err);
  }
}

// ============================================================================
// 11. TUTOR MESSAGES
// ============================================================================

export async function fetchTutorMessagesFromDB(studentId: string): Promise<TutorMessageRecord[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("tutor_messages")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: true });

    if (error) return null;
    if (!data || data.length === 0) return [];

    return data.map((d: any) => ({
      id: d.id,
      studentId: d.student_id,
      role: d.role,
      content: d.content,
      timestamp: new Date(d.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachedFile: d.attachments && d.attachments[0] ? d.attachments[0] : undefined
    }));
  } catch (err) {
    console.error("fetchTutorMessagesFromDB error:", err);
    return null;
  }
}

export async function saveTutorMessageToDB(message: TutorMessageRecord): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("tutor_messages").insert({
      id: message.id,
      student_id: message.studentId,
      role: message.role,
      content: message.content,
      attachments: message.attachedFile ? [message.attachedFile] : []
    });
    if (error) console.error("saveTutorMessageToDB error:", error.message);
  } catch (err) {
    console.error("saveTutorMessageToDB error:", err);
  }
}

// ============================================================================
// 12. STUDY TASKS (STUDY PLANNER)
// ============================================================================

export async function fetchStudyTasksFromDB(studentId: string): Promise<StudyTaskRecord[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("study_tasks")
      .select("*")
      .eq("student_id", studentId);

    if (error) return null;
    if (!data || data.length === 0) return [];

    return data.map((d: any) => ({
      id: d.id,
      studentId: d.student_id,
      day: d.day,
      subjectId: d.subject_id,
      subjectName: d.subject_name,
      topicTitle: d.topic_title,
      durationMinutes: Number(d.duration_minutes ?? 45),
      activityType: d.activity_type,
      completed: Boolean(d.completed),
      priority: d.priority
    }));
  } catch (err) {
    console.error("fetchStudyTasksFromDB error:", err);
    return null;
  }
}

export async function saveStudyTaskToDB(task: StudyTaskRecord): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("study_tasks").upsert({
      id: task.id,
      student_id: task.studentId,
      day: task.day,
      subject_id: task.subjectId,
      subject_name: task.subjectName,
      topic_title: task.topicTitle,
      duration_minutes: task.durationMinutes,
      activity_type: task.activityType,
      completed: task.completed,
      priority: task.priority
    });
    if (error) console.error("saveStudyTaskToDB error:", error.message);
  } catch (err) {
    console.error("saveStudyTaskToDB error:", err);
  }
}

export async function updateStudyTaskCompletionInDB(taskId: string, completed: boolean): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase
      .from("study_tasks")
      .update({ completed })
      .eq("id", taskId);
    if (error) console.error("updateStudyTaskCompletionInDB error:", error.message);
  } catch (err) {
    console.error("updateStudyTaskCompletionInDB error:", err);
  }
}

export async function deleteStudyTaskFromDB(taskId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from("study_tasks").delete().eq("id", taskId);
  } catch (err) {
    console.error("deleteStudyTaskFromDB error:", err);
  }
}

// ============================================================================
// 13. CALENDAR EVENTS
// ============================================================================

export async function fetchCalendarEventsFromDB(studentId?: string): Promise<CalendarEventRecord[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    let query = supabase.from("calendar_events").select("*");
    if (studentId) {
      query = query.or(`student_id.eq.${studentId},student_id.is.null`);
    }
    const { data, error } = await query;
    if (error) return null;
    if (!data || data.length === 0) return [];

    return data.map((d: any) => ({
      id: d.id,
      studentId: d.student_id || undefined,
      title: d.title,
      date: d.date,
      time: d.time,
      type: d.type
    }));
  } catch (err) {
    console.error("fetchCalendarEventsFromDB error:", err);
    return null;
  }
}

export async function saveCalendarEventToDB(event: CalendarEventRecord): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("calendar_events").upsert({
      id: event.id,
      student_id: event.studentId || null,
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type
    });
    if (error) console.error("saveCalendarEventToDB error:", error.message);
  } catch (err) {
    console.error("saveCalendarEventToDB error:", err);
  }
}

// ============================================================================
// 14. QUIZ RESULTS
// ============================================================================

export async function saveQuizResultToDB(res: QuizResultRecord): Promise<void> {
  if (!res.studentId) return;

  const localKey = `edu_quiz_results_${res.studentId}`;
  try {
    const raw = localStorage.getItem(localKey);
    const list: QuizResultRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift(res);
    localStorage.setItem(localKey, JSON.stringify(list.slice(0, 50)));
  } catch (e) {}

  // Also record to user_progress
  saveUserActivityProgressToDB({
    id: `prog_qr_${res.studentId}_${res.id}`,
    userId: res.studentId,
    activityId: `quiz_${res.topic}`,
    activityType: "quiz",
    status: "completed",
    progressPercentage: res.accuracy,
    xpEarned: res.score * 10,
    score: res.score,
    completedAt: res.createdAt || new Date().toISOString()
  }).catch(console.error);

  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from("quiz_results").insert({
      id: res.id,
      student_id: res.studentId,
      topic: res.topic,
      score: res.score,
      total: res.total,
      accuracy: res.accuracy
    });
    if (error) console.error("saveQuizResultToDB error:", error.message);
  } catch (err) {
    console.error("saveQuizResultToDB error:", err);
  }
}

export async function fetchQuizResultsFromDB(studentId: string): Promise<QuizResultRecord[] | null> {
  if (!studentId) return null;
  const localKey = `edu_quiz_results_${studentId}`;
  let localList: QuizResultRecord[] = [];
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) localList = JSON.parse(raw);
  } catch (e) {}

  if (!isSupabaseConfigured()) return localList;
  try {
    const { data, error } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error || !data) return localList;
    const mapped = data.map((d: any) => ({
      id: d.id,
      studentId: d.student_id,
      topic: d.topic,
      score: Number(d.score),
      total: Number(d.total),
      accuracy: Number(d.accuracy),
      createdAt: d.created_at
    }));
    try {
      localStorage.setItem(localKey, JSON.stringify(mapped));
    } catch (e) {}
    return mapped;
  } catch (err) {
    console.error("fetchQuizResultsFromDB error:", err);
    return localList;
  }
}


// ============================================================================
// 15. STUDENT INTERVENTIONS (SMART CAMPUS ANALYTICS HACKATHON)
// ============================================================================

export interface DBInterventionRecord {
  id: string;
  studentId: string;
  studentName: string;
  category: string;
  recommendation: string;
  notes: string;
  assignedFaculty: string;
  dueDate: string;
  status: "Open" | "In Progress" | "Completed" | "Dismissed";
  outcomeNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export async function fetchInterventionsFromDB(): Promise<DBInterventionRecord[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from("interventions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return null;
    return data.map((d: any) => ({
      id: d.id,
      studentId: d.student_id,
      studentName: d.student_name,
      category: d.category,
      recommendation: d.recommendation,
      notes: d.notes,
      assignedFaculty: d.assigned_faculty,
      dueDate: d.due_date,
      status: d.status,
      outcomeNotes: d.outcome_notes,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  } catch (err) {
    console.error("fetchInterventionsFromDB error:", err);
    return null;
  }
}

export async function saveInterventionToDB(item: DBInterventionRecord): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from("interventions").upsert({
      id: item.id,
      student_id: item.studentId,
      student_name: item.studentName,
      category: item.category,
      recommendation: item.recommendation,
      notes: item.notes,
      assigned_faculty: item.assignedFaculty,
      due_date: item.dueDate,
      status: item.status,
      outcome_notes: item.outcomeNotes,
      created_at: item.createdAt,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error("saveInterventionToDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("saveInterventionToDB error:", err);
    return false;
  }
}

export async function updateInterventionInDB(
  id: string,
  updates: Partial<DBInterventionRecord>
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const dbPayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.status) dbPayload.status = updates.status;
    if (updates.outcomeNotes !== undefined) dbPayload.outcome_notes = updates.outcomeNotes;
    if (updates.notes !== undefined) dbPayload.notes = updates.notes;
    if (updates.dueDate) dbPayload.due_date = updates.dueDate;
    if (updates.assignedFaculty) dbPayload.assigned_faculty = updates.assignedFaculty;

    const { error } = await supabase
      .from("interventions")
      .update(dbPayload)
      .eq("id", id);

    if (error) {
      console.error("updateInterventionInDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("updateInterventionInDB error:", err);
    return false;
  }
}

export async function deleteInterventionInDB(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from("interventions").delete().eq("id", id);
    if (error) {
      console.error("deleteInterventionInDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("deleteInterventionInDB error:", err);
    return false;
  }
}

