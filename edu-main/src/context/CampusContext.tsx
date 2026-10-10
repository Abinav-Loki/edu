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
  saveMaterialToDB,
  deleteMaterialFromDB,
  saveProfileToDB,
  fetchProfileById,
  fetchProfileByEmail
} from "../services/supabaseService";

interface CampusContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  currentUser: User | null;
  login: (role: Role, userId?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (role: Role, userData: Partial<User>, password?: string) => Promise<{ success: boolean; error?: string }>;
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

  addMentorRequest: (req: Omit<MentorRequest, "id" | "status">) => void;
  updateMentorRequest: (id: string, status: MentorRequest["status"], proposedTime?: string, proposedDate?: string) => void;
  
  addMaintenanceTicket: (ticket: Omit<MaintenanceTicket, "id" | "createdAt" | "status">) => void;
  updateMaintenanceTicket: (id: string, status: MaintenanceTicket["status"]) => void;

  addSupportTicket: (ticket: Omit<SupportTicket, "id" | "createdAt" | "status">) => void;
  
  addMaterial: (material: Omit<Material, "id" | "uploadedAt">) => void;
  deleteMaterial: (id: string) => void;
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
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedback);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  
  const [facultySchedules, setFacultySchedules] = useState<ScheduleItem[]>(initialSchedules);
  const [mentorAvailability, setMentorAvailability] = useState<AvailabilitySlot[]>(initialAvailability);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("eduguard_user");
      return saved ? JSON.parse(saved) : initialStudents[0];
    } catch {
      return initialStudents[0];
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
    if (!isSupabaseConfigured()) return;

    // Check existing active session on mount
    authGetSession().then(async (session) => {
      if (session?.user) {
        const profile = await fetchProfileById(session.user.id);
        if (profile) {
          setCurrentUser(profile);
          setActiveRole(profile.role);
        }
      }
    }).catch(console.error);

    const { data: { subscription } } = onAuthStateChange(async (event: string, session: any) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await fetchProfileById(session.user.id) || 
          (session.user.email ? await fetchProfileByEmail(session.user.email) : null);
        if (profile) {
          setCurrentUser(profile);
          setActiveRole(profile.role);
        }
      } else if (event === "SIGNED_OUT") {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function login(role: Role, userId?: string, _password?: string): Promise<{ success: boolean; error?: string }> {
    setActiveRole(role);
    const cleanId = userId?.trim() || "";

    // 2. Fallback to existing student/mentor/admin record resolution
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
      if (found) {
        setCurrentUser(found);
        return { success: true };
      } else if (cleanId) {
        const formattedName = cleanId.includes("@")
          ? cleanId.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          : cleanId;
        const newStudent: Student = {
          id: `s_${Date.now()}`,
          name: formattedName,
          role: "student",
          email: cleanId.includes("@") ? cleanId : `${cleanId}@student.edu`,
          course: "B.Tech IT",
          year: "3rd Year",
          attendancePercent: 82,
          quizAverage: 76,
          assignmentAverage: 80,
          lateSubmissions: 0,
          totalAssignments: 8,
          weakTopics: []
        };
        setStudents((prev) => [newStudent, ...prev]);
        setCurrentUser(newStudent);
        if (isSupabaseConfigured()) {
          saveProfileToDB(newStudent).catch(console.error);
        }
        return { success: true };
      } else {
        setCurrentUser(students[0] || null);
        return { success: true };
      }
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
      if (found) {
        setCurrentUser(found);
        return { success: true };
      } else if (cleanId) {
        const formattedName = cleanId.includes("@")
          ? cleanId.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
          : cleanId;
        const newMentor: Mentor = {
          id: `f_${Date.now()}`,
          name: formattedName,
          role: "faculty",
          department: "Computer Science",
          specialization: ["Academics"],
          availability: ["Monday 3:00 PM"],
          currentLocation: "Faculty Block"
        };
        setMentors((prev) => [newMentor, ...prev]);
        setCurrentUser(newMentor);
        if (isSupabaseConfigured()) {
          saveProfileToDB(newMentor).catch(console.error);
        }
        return { success: true };
      } else {
        setCurrentUser(mentors[0] || null);
        return { success: true };
      }
    } else {
      if (cleanId) {
        const customAdmin = {
          ...adminUser,
          name: cleanId.includes("@") ? cleanId.split("@")[0] : cleanId
        };
        setAdminUser(customAdmin);
        setCurrentUser(customAdmin);
      } else {
        setCurrentUser(adminUser);
      }
      return { success: true };
    }
  }

  async function signup(role: Role, userData: Partial<User>, password?: string): Promise<{ success: boolean; error?: string }> {
    const email = (userData as any).email || (userData.name ? `${userData.name.toLowerCase().replace(/\s+/g, ".")}@campus.edu` : undefined);
    


    const newId = `new_${Date.now()}`;
    const newUser = { id: newId, role, ...userData } as any;
    
    if (role === "student") {
      setStudents(prev => [...prev, newUser]);
    } else if (role === "faculty") {
      setMentors(prev => [...prev, newUser]);
    }
    
    setActiveRole(role);
    setCurrentUser(newUser);

    if (isSupabaseConfigured()) {
      await saveProfileToDB(newUser).catch(console.error);
    }
    return { success: true };
  }

  async function logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      await authSignOut().catch(console.error);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem("eduguard_user");
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

  function addSupportTicket(ticket: Omit<SupportTicket, "id" | "createdAt" | "status">) {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `ST-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    setSupportTickets((prev) => [newTicket, ...prev]);

    if (isSupabaseConfigured()) {
      saveSupportTicketToDB(newTicket).catch(console.error);
    }
  }

  return (
    <CampusContext.Provider value={{
      activeRole,
      setActiveRole,
      currentUser,
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
      addMentorRequest,
      updateMentorRequest,
      addMaintenanceTicket,
      updateMaintenanceTicket,
      addSupportTicket,
      addMaterial,
      deleteMaterial
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
