import React, { createContext, useContext, useState, ReactNode } from "react";
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

interface CampusContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  currentUser: User | null;
  login: (role: Role, userId?: string) => void;
  signup: (role: Role, userData: Partial<User>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  
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
  const [activeRole, setActiveRole] = useState<Role>("student");
  
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [mentors, setMentors] = useState<Mentor[]>(initialMentors);
  const [adminUser, setAdminUser] = useState<User>({ id: "admin1", name: "Campus Admin", role: "admin", department: "Administration" });
  
  const [assets] = useState<Asset[]>(initialAssets);
  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>(initialMentorRequests);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(initialMaintenanceTickets);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [feedbacks] = useState<Feedback[]>(initialFeedback);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  
  const [facultySchedules, setFacultySchedules] = useState<ScheduleItem[]>(initialSchedules);
  const [mentorAvailability, setMentorAvailability] = useState<AvailabilitySlot[]>(initialAvailability);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  function login(role: Role, userId?: string) {
    setActiveRole(role);
    if (role === "student") {
      setCurrentUser(students.find(s => s.id === userId) || students[0]);
    } else if (role === "faculty") {
      setCurrentUser(mentors.find(m => m.id === userId) || mentors[0]);
    } else {
      setCurrentUser(adminUser);
    }
  }

  function signup(role: Role, userData: Partial<User>) {
    const newId = `new_${Date.now()}`;
    const newUser = { id: newId, role, ...userData } as any;
    
    if (role === "student") {
      setStudents(prev => [...prev, newUser]);
    } else if (role === "faculty") {
      setMentors(prev => [...prev, newUser]);
    }
    
    setActiveRole(role);
    setCurrentUser(newUser);
  }

  function logout() {
    setCurrentUser(null);
  }

  function updateProfile(updates: Partial<User>) {
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
  }

  function addMaterial(material: Omit<Material, "id" | "uploadedAt">) {
    const newMat: Material = {
      ...material,
      id: `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
      uploadedAt: new Date().toISOString()
    };
    setMaterials(prev => [newMat, ...prev]);
  }

  function deleteMaterial(id: string) {
    setMaterials(prev => prev.filter(m => m.id !== id));
  }

  function addMentorRequest(req: Omit<MentorRequest, "id" | "status">) {
    const newReq: MentorRequest = {
      ...req,
      id: `mr_${Date.now()}`,
      status: "pending"
    };
    setMentorRequests((prev) => [...prev, newReq]);
  }

  function updateMentorRequest(id: string, status: MentorRequest["status"], proposedTime?: string, proposedDate?: string) {
    setMentorRequests((prev) => prev.map((req) => 
      req.id === id ? { ...req, status, proposedTime: proposedTime || req.proposedTime, proposedDate: proposedDate || req.proposedDate } : req
    ));
  }

  function addMaintenanceTicket(ticket: Omit<MaintenanceTicket, "id" | "createdAt" | "status">) {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `MT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    setMaintenanceTickets((prev) => [newTicket, ...prev]);
  }

  function updateMaintenanceTicket(id: string, status: MaintenanceTicket["status"]) {
    setMaintenanceTickets((prev) => prev.map((ticket) => 
      ticket.id === id ? { ...ticket, status } : ticket
    ));
  }

  function addSupportTicket(ticket: Omit<SupportTicket, "id" | "createdAt" | "status">) {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `ST-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
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
