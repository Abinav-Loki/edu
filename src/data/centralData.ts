export type Role = "student" | "faculty" | "admin";

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  department?: string;
}

export interface Student extends User {
  role: "student";
  course: string;
  year: string;
  attendancePercent: number;
  quizAverage: number;
  assignmentAverage: number;
  lateSubmissions: number;
  totalAssignments: number;
  weakTopics: string[];
}

export interface Mentor extends User {
  role: "faculty";
  specialization: string[];
  availability: string[]; // e.g., "Monday 4:00 PM"
  currentLocation?: string;
}

export interface ScheduleItem {
  id: string;
  facultyId: string;
  day: string;
  date?: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  building: string;
  activityType: "CLASS" | "LAB" | "MEETING" | "FREE" | "MENTORING";
  notes?: string;
}

export interface AvailabilitySlot {
  id: string;
  facultyId: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface MentorRequest {
  id: string;
  studentId: string;
  mentorId: string;
  subject: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "rejected" | "suggest_alternate" | "completed" | "cancelled";
  proposedTime?: string;
  proposedDate?: string;
}

export interface Asset {
  id: string;
  name: string;
  category: "AC" | "Projector" | "Computer" | "Printer" | "Other";
  building: string;
  room: string;
  operatingHours: number;
  lastService: string;
  serviceIncidents: number;
  status: "online" | "offline" | "maintenance";
}

export interface MaintenanceTicket {
  id: string;
  assetId: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "resolved";
  createdAt: string;
}

export interface TicketAttachment {
  name: string;
  type: "image" | "file";
  dataUrl?: string;
  size?: string;
}

export interface SupportTicket {
  id: string;
  creatorId: string;
  category: "Academic" | "Mentor" | "Technical" | "Facilities" | "Other";
  description: string;
  status: "pending" | "in_progress" | "resolved";
  createdAt: string;
  attachments?: TicketAttachment[];
}

export interface Feedback {
  id: string;
  category: string;
  text: string;
  location?: string;
  createdAt: string;
}

export interface Material {
  id: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  subject: string;
  description: string;
  uploadedBy: string;
  studentId: string;
  uploadedAt: string;
}

export const initialMaterials: Material[] = [
  {
    id: "MAT-001",
    fileName: "DBMS_Notes_Chap1.pdf",
    fileType: "PDF",
    subject: "DBMS",
    description: "Introduction and ER Models",
    uploadedBy: "Arun Kumar",
    studentId: "s1",
    uploadedAt: new Date().toISOString()
  }
];

export const initialStudents: Student[] = [
  {
    id: "s1",
    name: "Arun Kumar",
    role: "student",
    course: "B.Tech IT",
    year: "3rd Year",
    attendancePercent: 65,
    quizAverage: 49,
    assignmentAverage: 72,
    lateSubmissions: 2,
    totalAssignments: 10,
    weakTopics: ["DBMS Normalization", "SQL Joins"],
  },
  {
    id: "s2",
    name: "Ananya Roy",
    role: "student",
    course: "B.Tech CSE",
    year: "3rd Year",
    attendancePercent: 95,
    quizAverage: 92,
    assignmentAverage: 94,
    lateSubmissions: 0,
    totalAssignments: 12,
    weakTopics: [],
  },
  {
    id: "s3",
    name: "Rahul Verma",
    role: "student",
    course: "B.Tech ECE",
    year: "2nd Year",
    attendancePercent: 79,
    quizAverage: 74,
    assignmentAverage: 78,
    lateSubmissions: 1,
    totalAssignments: 9,
    weakTopics: ["Fourier Transform"],
  },
  {
    id: "s4",
    name: "Priya Nair",
    role: "student",
    course: "B.Tech IT",
    year: "3rd Year",
    attendancePercent: 52,
    quizAverage: 41,
    assignmentAverage: 48,
    lateSubmissions: 4,
    totalAssignments: 8,
    weakTopics: ["Web Development", "Data Structures", "DBMS"],
  },
  {
    id: "s5",
    name: "Vikram Singh",
    role: "student",
    course: "B.Tech ME",
    year: "3rd Year",
    attendancePercent: 76,
    quizAverage: 78,
    assignmentAverage: 81,
    lateSubmissions: 2,
    totalAssignments: 9,
    weakTopics: ["Thermodynamics", "Fluid Mechanics"],
  },
];

export const initialMentors: Mentor[] = [
  {
    id: "f1",
    name: "Rahul Kumar",
    role: "faculty",
    department: "Computer Science",
    specialization: ["DBMS", "SQL", "Database Design"],
    availability: ["Monday 4:30 PM", "Tuesday 3:00 PM"],
    currentLocation: "Faculty Block / Room 204"
  },
  {
    id: "f2",
    name: "Priya Sharma",
    role: "faculty",
    department: "Information Technology",
    specialization: ["Data Structures", "Algorithms"],
    availability: ["Wednesday 10:00 AM"],
    currentLocation: "Block A / Room 101"
  }
];

export const initialAssets: Asset[] = [
  {
    id: "PRJ-B204-001",
    name: "Projector B204",
    category: "Projector",
    building: "Block B",
    room: "204",
    operatingHours: 1200,
    lastService: "2026-03-15",
    serviceIncidents: 3,
    status: "online"
  },
  {
    id: "AC-C301-002",
    name: "AC Unit C301",
    category: "AC",
    building: "Block C",
    room: "301",
    operatingHours: 4500,
    lastService: "2025-10-10",
    serviceIncidents: 5,
    status: "online"
  }
];

export const initialSchedules: ScheduleItem[] = [
  {
    id: "sched_1",
    facultyId: "f1",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    subject: "DBMS",
    room: "204",
    building: "Block A",
    activityType: "CLASS"
  },
  {
    id: "sched_2",
    facultyId: "f1",
    day: "Monday",
    startTime: "11:00",
    endTime: "12:00",
    subject: "DBMS Lab",
    room: "Lab 3",
    building: "Block A",
    activityType: "LAB"
  },
  {
    id: "sched_3",
    facultyId: "f1",
    day: "Monday",
    startTime: "14:00",
    endTime: "15:00",
    subject: "Faculty Meeting",
    room: "Admin Room",
    building: "Admin Block",
    activityType: "MEETING"
  },
  {
    id: "sched_4",
    facultyId: "f1",
    day: "Monday",
    startTime: "16:00",
    endTime: "18:00",
    subject: "Mentoring",
    room: "204",
    building: "Faculty Block",
    activityType: "MENTORING"
  }
];

export const initialAvailability: AvailabilitySlot[] = [
  {
    id: "avail_1",
    facultyId: "f1",
    day: "Monday",
    startTime: "16:00",
    endTime: "18:00"
  },
  {
    id: "avail_2",
    facultyId: "f1",
    day: "Tuesday",
    startTime: "15:00",
    endTime: "17:00"
  }
];

export const initialMentorRequests: MentorRequest[] = [
  {
    id: "mr_1",
    studentId: "s1",
    mentorId: "f1",
    subject: "DBMS Normalization Help",
    date: "2026-10-15",
    time: "16:30",
    status: "pending"
  }
];
export const initialMaintenanceTickets: MaintenanceTicket[] = [];
export const initialSupportTickets: SupportTicket[] = [];
export const initialFeedback: Feedback[] = [
  { id: "fb1", category: "Wi-Fi", text: "Wi-Fi in Block C is very slow in the evening.", location: "Block C", createdAt: new Date().toISOString() },
  { id: "fb2", category: "Wi-Fi", text: "Can't connect to Wi-Fi near Library.", location: "Library", createdAt: new Date().toISOString() },
];
