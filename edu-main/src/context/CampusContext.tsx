import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Role,
  User,
  Student,
  Mentor,
  Asset,
  MentorRequest,
  MaintenanceTicket,
  SupportTicket,
  Feedback,
  Material,
  initialStudents,
  initialMentors,
  initialAssets,
  initialMentorRequests,
  initialMaintenanceTickets,
  initialSupportTickets,
  initialFeedback,
  initialMaterials,
  ScheduleItem,
  AvailabilitySlot,
  initialSchedules,
  initialAvailability
} from "../data/centralData";
import { isSupabaseConfigured, authSignIn, authSignUp, authSignOut, authGetSession, onAuthStateChange } from "../lib/supabase";
import {
  fetchStudentsFromDB,
  fetchMentorsFromDB,
  fetchAssetsFromDB,
  fetchMentorRequestsFromDB,
  fetchMaintenanceTicketsFromDB,
  fetchSupportTicketsFromDB,
  fetchMaterialsFromDB,
  fetchFeedbackFromDB,
  fetchFacultySchedulesFromDB,
  fetchMentorAvailabilityFromDB,
  saveMentorRequestToDB,
  saveMaintenanceTicketToDB,
  saveSupportTicketToDB,
  saveStudentToDB,
  saveMaterialToDB,
  deleteMaterialFromDB,
  saveProfileToDB,
  fetchProfileById,
  fetchProfileByEmail,
  provisionNewUserRecordsInDB
} from "../services/supabaseService";

interface CampusContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  currentUser: User | null;
  isAuthLoading: boolean;
  login: (role: Role, userId?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (role: Role, userData: Partial<User> & Record<string, any>, password?: string) => Promise<{ success: boolean; error?: string; pendingApproval?: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshCampusData: () => Promise<void>;
  
  students: Student[];
  mentors: Mentor[];
  assets: Asset[];
  mentorRequests: MentorRequest[];
  maintenanceTickets: MaintenanceTicket[];
  supportTickets: SupportTicket[];
  feedbacks: Feedback[];
  materials: Material[];
  facultySchedules: ScheduleItem[];
  mentorAvailability: AvailabilitySlot[];

  addStudent: (studentData: Omit<Student, "id"> & { id?: string }) => Promise<Student>;
  updateStudent: (studentId: string, updates: Partial<Student>) => Promise<void>;

  addMentorRequest: (req: Omit<MentorRequest, "id" | "status">) => void;
  updateMentorRequest: (id: string, status: MentorRequest["status"], proposedTime?: string, proposedDate?: string) => void;
  
  addMaintenanceTicket: (ticket: Omit<MaintenanceTicket, "id" | "createdAt" | "status">) => void;
  updateMaintenanceTicket: (id: string, status: MaintenanceTicket["status"]) => void;

  addSupportTicket: (ticket: Omit<SupportTicket, "id" | "createdAt" | "status"> & { status?: SupportTicket["status"] }) => void;
  updateSupportTicket: (id: string, updates: Partial<SupportTicket>) => Promise<void>;
  
  addMaterial: (material: Omit<Material, "id" | "uploadedAt">) => void;
  deleteMaterial: (id: string) => void;
  addFeedback: (fb: Omit<Feedback, "id" | "createdAt"> & { id?: string; createdAt?: string }) => Promise<Feedback>;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export function CampusProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<Role>(() => {
    try {
      const saved = localStorage.getItem("eduguard_role");
      return (saved as Role) || "student";
    } catch {
      return "student";
    }
  });
  
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [mentors, setMentors] = useState<Mentor[]>(initialMentors);
  const [adminUser, setAdminUser] = useState<User>({ id: "admin1", name: "Campus Admin", role: "admin", department: "Administration" });
  
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>(initialMentorRequests);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(initialMaintenanceTickets);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    try {
      const stored = localStorage.getItem("eduguard_feedbacks");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Failed to load feedbacks from localStorage:", e);
    }
    return initialFeedback;
  });
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  
  const [facultySchedules, setFacultySchedules] = useState<ScheduleItem[]>(initialSchedules);
  const [mentorAvailability, setMentorAvailability] = useState<AvailabilitySlot[]>(initialAvailability);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("eduguard_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("eduguard_user");
      const isDemo = localStorage.getItem("eduguard_is_demo") === "true";
      // If user session already present, no cold-boot loading is needed
      return !saved && !isDemo;
    } catch {
      return true;
    }
  });


  // Persist session to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("eduguard_user", JSON.stringify(currentUser));
        localStorage.setItem("eduguard_role", activeRole);
      } else {
        localStorage.removeItem("eduguard_user");
      }
    } catch (e) {
      console.warn("Could not save session to localStorage:", e);
    }
  }, [currentUser, activeRole]);

  // Persist feedbacks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("eduguard_feedbacks", JSON.stringify(feedbacks));
    } catch (e) {
      console.warn("Could not save feedbacks to localStorage:", e);
    }
  }, [feedbacks]);

  const refreshCampusData = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const [
        dbStudents,
        dbMentors,
        dbAssets,
        dbRequests,
        dbMaintTickets,
        dbSuppTickets,
        dbMaterials,
        dbFeedbacks,
        dbSchedules,
        dbAvail
      ] = await Promise.all([
        fetchStudentsFromDB(),
        fetchMentorsFromDB(),
        fetchAssetsFromDB(),
        fetchMentorRequestsFromDB(),
        fetchMaintenanceTicketsFromDB(),
        fetchSupportTicketsFromDB(),
        fetchMaterialsFromDB(),
        fetchFeedbackFromDB(),
        fetchFacultySchedulesFromDB(),
        fetchMentorAvailabilityFromDB()
      ]);

      if (dbStudents && dbStudents.length > 0) setStudents(dbStudents);
      if (dbMentors && dbMentors.length > 0) setMentors(dbMentors);
      if (dbAssets && dbAssets.length > 0) setAssets(dbAssets);
      if (dbRequests && dbRequests.length > 0) setMentorRequests(dbRequests);
      if (dbMaintTickets && dbMaintTickets.length > 0) setMaintenanceTickets(dbMaintTickets);
      if (dbSuppTickets && dbSuppTickets.length > 0) setSupportTickets(dbSuppTickets);
      if (dbMaterials && dbMaterials.length > 0) setMaterials(dbMaterials);
      if (dbFeedbacks && dbFeedbacks.length > 0) setFeedbacks(dbFeedbacks);
      if (dbSchedules && dbSchedules.length > 0) setFacultySchedules(dbSchedules);
      if (dbAvail && dbAvail.length > 0) setMentorAvailability(dbAvail);
    } catch (err) {
      console.warn("Could not sync with Supabase, continuing with current state:", err);
    }
  };

  // Initial load from Supabase if configured
  useEffect(() => {
    refreshCampusData();
  }, []);

  // Listen for Supabase Auth state changes (session restoration)
  useEffect(() => {
    const isDemoStored = localStorage.getItem("eduguard_is_demo") === "true";
    const savedUser = localStorage.getItem("eduguard_user");

    // If demo session or user is already saved, authentication initialization is complete
    if (isDemoStored || savedUser) {
      setIsAuthLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setIsAuthLoading(false);
      return;
    }

    // If not a demo session, restore authenticated Supabase session
    authGetSession().then(async (session) => {
      if (session?.user) {
        const profile = await fetchProfileById(session.user.id) || 
          (session.user.email ? await fetchProfileByEmail(session.user.email) : null);
        if (profile) {
          const userWithDemoFlag: User = { ...profile, isDemo: false };
          setCurrentUser(userWithDemoFlag);
          setActiveRole(profile.role);
        }
      }
    }).catch(console.error).finally(() => {
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = onAuthStateChange(async (event: string, session: any) => {
      const isDemo = localStorage.getItem("eduguard_is_demo") === "true";
      if (isDemo) return; // Preserve active demo sessions

      if (event === "SIGNED_IN" && session?.user) {
        const profile = await fetchProfileById(session.user.id) || 
          (session.user.email ? await fetchProfileByEmail(session.user.email) : null);
        if (profile) {
          const userWithDemoFlag: User = { ...profile, isDemo: false };
          setCurrentUser(userWithDemoFlag);
          setActiveRole(profile.role);
        }
      } else if (event === "SIGNED_OUT") {
        if (!isDemo) {
          setCurrentUser(null);
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function login(role: Role, userId?: string, password?: string): Promise<{ success: boolean; error?: string }> {
    const cleanId = userId?.trim() || "";
    const isDemoId = ["s1", "s2", "f1", "f2", "admin1"].includes(cleanId.toLowerCase());
    const isDemoFlow = isDemoId || !password;

    // 1. DEDICATED DEMO ACCOUNT ACCESS (PRESERVES WORKING DEMO STATE)
    if (isDemoFlow) {
      localStorage.setItem("eduguard_is_demo", "true");
      setActiveRole(role);

      if (role === "student") {
        const lower = cleanId.toLowerCase();
        const found = students.find(
          (s) =>
            s.id.toLowerCase() === lower ||
            s.name.toLowerCase() === lower ||
            (s as any).email?.toLowerCase() === lower ||
            (lower.includes("arun") && s.id === "s1") ||
            (lower.includes("ananya") && s.id === "s2")
        );
        const selected = found || students[0];
        const studentDemo: Student = { ...selected, isDemo: true };
        setCurrentUser(studentDemo);
        return { success: true };
      } else if (role === "faculty") {
        const lower = cleanId.toLowerCase();
        const found = mentors.find(
          (m) =>
            m.id.toLowerCase() === lower ||
            m.name.toLowerCase() === lower ||
            (m as any).email?.toLowerCase() === lower ||
            (lower.includes("rahul") && m.id === "f1") ||
            (lower.includes("priya") && m.id === "f2")
        );
        const selected = found || mentors[0];
        const mentorDemo: Mentor = { ...selected, isDemo: true };
        setCurrentUser(mentorDemo);
        return { success: true };
      } else {
        const adminDemo: User = { ...adminUser, isDemo: true };
        setCurrentUser(adminDemo);
        return { success: true };
      }
    }

    // 2. REAL AUTHENTICATED LOGIN (SUPABASE AUTH)
    if (!cleanId || !password) {
      return { success: false, error: "Please provide both email and password." };
    }

    try {
      const authData = await authSignIn(cleanId, password);
      if (!authData?.user) {
        return { success: false, error: "Authentication failed. No user returned." };
      }

      localStorage.setItem("eduguard_is_demo", "false");

      // Load profile from Supabase
      let profile = await fetchProfileById(authData.user.id);
      if (!profile && authData.user.email) {
        profile = await fetchProfileByEmail(authData.user.email);
      }

      // If profile record missing in database, bootstrap it now
      if (!profile) {
        const meta = authData.user.user_metadata || {};
        profile = {
          id: authData.user.id,
          name: meta.name || cleanId.split("@")[0],
          email: authData.user.email || cleanId,
          role: (meta.role as Role) || role,
          department: meta.department || "Computer Science",
          status: meta.status || "active",
          isDemo: false
        };
        saveProfileToDB(profile).catch(console.warn);
      }

      const verifiedUser: User = { ...profile, isDemo: false };
      setCurrentUser(verifiedUser);
      setActiveRole(verifiedUser.role);

      // If student, ensure student academic record is in state
      if (verifiedUser.role === "student") {
        const existingStudent = students.find(s => s.id === verifiedUser.id);
        if (!existingStudent) {
          const freshStudent: Student = {
            id: verifiedUser.id,
            name: verifiedUser.name,
            email: verifiedUser.email,
            role: "student",
            course: (verifiedUser as any).course || "B.Tech Computer Science",
            year: (verifiedUser as any).year || "1st Year",
            attendancePercent: 0,
            quizAverage: 0,
            assignmentAverage: 0,
            lateSubmissions: 0,
            totalAssignments: 0,
            weakTopics: [],
            isDemo: false
          };
          setStudents(prev => [freshStudent, ...prev]);
        }
      }

      return { success: true };
    } catch (err: any) {
      console.warn("Real login error:", err.message);
      let userFriendlyMsg = err.message || "Invalid email or password. Please check your credentials or try Demo Login.";
      if (err.message?.includes("Email not confirmed")) {
        userFriendlyMsg = "Email address has not been confirmed. To log in immediately without email links, disable 'Confirm email' in Supabase Auth Settings, or use the 1-Click Demo Login.";
      }
      return { 
        success: false, 
        error: userFriendlyMsg 
      };
    }
  }

  async function signup(
    role: Role, 
    userData: Partial<User> & Record<string, any>, 
    password?: string
  ): Promise<{ success: boolean; error?: string; pendingApproval?: boolean; message?: string }> {
    const email = userData.email?.trim().toLowerCase();
    const name = userData.name?.trim();

    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid academic or personal email address." };
    }
    if (!password || password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }
    if (!name) {
      return { success: false, error: "Please provide your full legal name." };
    }

    // Zero-Trust Role Security Enforcement:
    // Students can self-register with active status.
    // Faculty & Administrators require authorized campus tokens or administrator verification.
    let accountStatus: "active" | "pending_approval" = "active";
    if (role === "faculty") {
      const isVerifiedToken = userData.authToken === "CAMPUS_VERIFIED_STAFF_2026";
      accountStatus = isVerifiedToken ? "active" : "pending_approval";
    } else if (role === "admin") {
      const isVerifiedAdmin = userData.authToken === "CAMPUS_ADMIN_SUPERUSER_2026";
      accountStatus = isVerifiedAdmin ? "active" : "pending_approval";
    }

    try {
      const signUpRes = await authSignUp(email, password, {
        name,
        role,
        department: userData.department || "Computer Science",
        course: userData.course || "B.Tech Computer Science",
        year: userData.year || "1st Year",
        registration_number: userData.registrationNumber,
        designation: userData.designation,
        institution: userData.institution || "Campus Institute of Technology",
        status: accountStatus
      });

      const newUserId = signUpRes.user?.id || `usr_${Date.now()}`;

      // Provision profile & role records in Supabase
      await provisionNewUserRecordsInDB({
        id: newUserId,
        email,
        name,
        role,
        department: userData.department || "Computer Science",
        course: userData.course || "B.Tech Computer Science",
        year: userData.year || "1st Year",
        registrationNumber: userData.registrationNumber,
        designation: userData.designation,
        institution: userData.institution || "Campus Institute of Technology",
        status: accountStatus
      });

      // Role Security Response Handling
      if (accountStatus === "pending_approval") {
        return {
          success: true,
          pendingApproval: true,
          message: `Your registration for the ${role === "faculty" ? "Faculty" : "Administrator"} Portal has been received. To ensure campus security, your credentials are under review by Campus Administration. You will be able to log in once verified.`
        };
      }

      // Active student login
      localStorage.setItem("eduguard_is_demo", "false");
      const freshUser: User = {
        id: newUserId,
        name,
        email,
        role,
        department: userData.department || "Computer Science",
        status: "active",
        isDemo: false
      };

      if (role === "student") {
        const freshStudent: Student = {
          ...freshUser,
          role: "student",
          course: userData.course || "B.Tech Computer Science",
          year: userData.year || "1st Year",
          attendancePercent: 0,
          quizAverage: 0,
          assignmentAverage: 0,
          lateSubmissions: 0,
          totalAssignments: 0,
          weakTopics: [],
          isDemo: false
        };
        setStudents(prev => [freshStudent, ...prev]);
        setCurrentUser(freshStudent);
      } else {
        setCurrentUser(freshUser);
      }

      setActiveRole(role);
      return { success: true };
    } catch (err: any) {
      console.error("Signup error:", err);
      let userFriendlyMsg = err.message || "Failed to register account. Please check your network connection and retry.";
      if (err.message?.includes("rate limit")) {
        userFriendlyMsg = "Email rate limit reached on free-tier Supabase provider. In production, configure custom SMTP or disable 'Confirm email' in Supabase Auth Settings. For immediate evaluation, explore with the 1-Click Demo accounts.";
      }
      return { 
        success: false, 
        error: userFriendlyMsg
      };
    }
  }

  async function logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      await authSignOut().catch(console.error);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem("eduguard_user");
      localStorage.removeItem("eduguard_role");
      localStorage.removeItem("eduguard_is_demo");
      localStorage.removeItem("edu_arena_progress_master");
    } catch {
      // ignore
    }
  }


  async function updateProfile(updates: Partial<User>): Promise<void> {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...updates } as User;
    setCurrentUser(updatedUser);
    
    if (activeRole === "student") {
      setStudents(prev => prev.map(s => s.id === currentUser.id ? updatedUser as Student : s));
    } else if (activeRole === "faculty") {
      setMentors(prev => prev.map(m => m.id === currentUser.id ? updatedUser as Mentor : m));
    } else {
      setAdminUser(updatedUser);
    }

    if (isSupabaseConfigured()) {
      await saveProfileToDB(updatedUser).catch(console.error);
    }
  }

  function addMaterial(material: Omit<Material, "id" | "uploadedAt">) {
    const newMat: Material = {
      ...material,
      id: `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
      uploadedAt: new Date().toISOString()
    };
    setMaterials(prev => [newMat, ...prev]);

    if (isSupabaseConfigured()) {
      saveMaterialToDB(newMat).catch(console.error);
    }
  }

  function deleteMaterial(id: string) {
    setMaterials(prev => prev.filter(m => m.id !== id));

    if (isSupabaseConfigured()) {
      deleteMaterialFromDB(id).catch(console.error);
    }
  }

  function addMentorRequest(req: Omit<MentorRequest, "id" | "status">) {
    const newReq: MentorRequest = {
      ...req,
      id: `mr_${Date.now()}`,
      status: "pending"
    };
    setMentorRequests((prev) => [...prev, newReq]);

    if (isSupabaseConfigured()) {
      saveMentorRequestToDB(newReq).catch(console.error);
    }
  }

  function updateMentorRequest(id: string, status: MentorRequest["status"], proposedTime?: string, proposedDate?: string) {
    setMentorRequests((prev) => prev.map((req) => {
      if (req.id === id) {
        const updated = { ...req, status, proposedTime: proposedTime || req.proposedTime, proposedDate: proposedDate || req.proposedDate };
        if (isSupabaseConfigured()) {
          saveMentorRequestToDB(updated).catch(console.error);
        }
        return updated;
      }
      return req;
    }));
  }

  function addMaintenanceTicket(ticket: Omit<MaintenanceTicket, "id" | "createdAt" | "status">) {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `MT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    setMaintenanceTickets((prev) => [newTicket, ...prev]);

    if (isSupabaseConfigured()) {
      saveMaintenanceTicketToDB(newTicket).catch(console.error);
    }
  }

  function updateMaintenanceTicket(id: string, status: MaintenanceTicket["status"]) {
    setMaintenanceTickets((prev) => prev.map((ticket) => {
      if (ticket.id === id) {
        const updated = { ...ticket, status };
        if (isSupabaseConfigured()) {
          saveMaintenanceTicketToDB(updated).catch(console.error);
        }
        return updated;
      }
      return ticket;
    }));
  }

  async function addStudent(studentData: Omit<Student, "id"> & { id?: string }): Promise<Student> {
    const studentId = studentData.id || `s_${Date.now()}`;
    const newStudent: Student = {
      ...studentData,
      id: studentId,
      role: "student",
      attendancePercent: studentData.attendancePercent ?? 0,
      quizAverage: studentData.quizAverage ?? 0,
      assignmentAverage: studentData.assignmentAverage ?? 0,
      lateSubmissions: studentData.lateSubmissions ?? 0,
      totalAssignments: studentData.totalAssignments ?? 0,
      weakTopics: studentData.weakTopics || [],
    };

    setStudents((prev) => [newStudent, ...prev]);

    if (isSupabaseConfigured()) {
      try {
        await saveProfileToDB(newStudent);
        await saveStudentToDB(newStudent);
      } catch (err) {
        console.error("addStudent Supabase error:", err);
      }
    }
    return newStudent;
  }

  async function updateStudent(studentId: string, updates: Partial<Student>): Promise<void> {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s)));

    if (currentUser && currentUser.id === studentId) {
      setCurrentUser((prev) => (prev ? ({ ...prev, ...updates } as User) : null));
    }

    if (isSupabaseConfigured()) {
      try {
        await saveStudentToDB({ id: studentId, ...updates });
        if (updates.name || updates.email) {
          const matched = students.find((s) => s.id === studentId);
          if (matched) {
            await saveProfileToDB({ ...matched, ...updates });
          }
        }
      } catch (err) {
        console.error("updateStudent Supabase error:", err);
      }
    }
  }

  function addSupportTicket(ticket: Omit<SupportTicket, "id" | "createdAt" | "status"> & { status?: SupportTicket["status"] }) {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `ST-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: ticket.status || "submitted"
    };
    setSupportTickets((prev) => [newTicket, ...prev]);

    if (isSupabaseConfigured()) {
      saveSupportTicketToDB(newTicket).catch(console.error);
    }
  }

  async function updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<void> {
    let targetTicket: SupportTicket | undefined;
    setSupportTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === id) {
          const updated = { ...ticket, ...updates, updatedAt: new Date().toISOString() };
          targetTicket = updated;
          return updated;
        }
        return ticket;
      })
    );

    if (targetTicket && isSupabaseConfigured()) {
      try {
        await saveSupportTicketToDB(targetTicket);
      } catch (err) {
        console.error("updateSupportTicket Supabase error:", err);
      }
    }
  }

  const addFeedback = async (fb: Omit<Feedback, "id" | "createdAt"> & { id?: string; createdAt?: string }): Promise<Feedback> => {
    const newFb: Feedback = {
      ...fb,
      id: fb.id || `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: fb.createdAt || new Date().toISOString()
    };
    
    setFeedbacks(prev => [newFb, ...prev]);

    // Recalculate mentor rating and reviewsCount in real time if rating provided
    if (newFb.facultyId && typeof newFb.rating === "number") {
      setMentors(prev => prev.map(m => {
        if (m.id === newFb.facultyId) {
          const currentCount = m.reviewsCount || 0;
          const currentRating = m.rating || 4.8;
          const newCount = currentCount + 1;
          const newRating = Number(((currentRating * currentCount + newFb.rating!) / newCount).toFixed(1));
          return {
            ...m,
            reviewsCount: newCount,
            rating: newRating
          };
        }
        return m;
      }));
    }

    return newFb;
  };

  return (
    <CampusContext.Provider value={{
      activeRole,
      setActiveRole,
      currentUser,
      isAuthLoading,
      login,
      signup,
      logout,
      updateProfile,
      refreshCampusData,
      students,
      mentors,
      assets,
      mentorRequests,
      maintenanceTickets,
      supportTickets,
      feedbacks,
      materials,
      facultySchedules,
      mentorAvailability,
      addStudent,
      updateStudent,
      addMentorRequest,
      updateMentorRequest,
      addMaintenanceTicket,
      updateMaintenanceTicket,
      addSupportTicket,
      updateSupportTicket,
      addMaterial,
      deleteMaterial,
      addFeedback
    }}>
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) throw new Error("useCampus must be used within CampusProvider");
  return context;
}
