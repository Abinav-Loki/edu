import { useState } from "react";
import {
  Search,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  X,
  Star,
  Users,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  UserPlus,
  BookOpen,
  Compass,
  UserCheck,
  GraduationCap
} from "lucide-react";
import { useCampus } from "../context/CampusContext";
import { useLearning } from "../context/LearningContext";
import MobileHeader from "../components/MobileHeader";

// Vector Illustration of Student & Mentor collaborating matching reference design
function MentorHeroIllustration() {
  return (
    <div className="relative shrink-0 w-72 sm:w-80 h-44 flex items-center justify-center select-none pointer-events-none">
      {/* Soft Glow Circles */}
      <div className="absolute top-2 right-4 w-32 h-32 rounded-full bg-sky-200/50 dark:bg-sky-900/30 blur-2xl" />
      <div className="absolute bottom-2 left-6 w-28 h-28 rounded-full bg-indigo-200/50 dark:bg-indigo-900/30 blur-2xl" />

      {/* Speech Bubble: "Learn from the best! 🎓" */}
      <div className="absolute top-3 right-6 bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 rounded-2xl px-3 py-1.5 flex items-center gap-1.5 z-20 animate-bounce">
        <span className="text-[10px] font-black text-slate-800 dark:text-white leading-none">
          Learn from the best! 🎓
        </span>
      </div>

      {/* Mini Idea Lightbulb */}
      <div className="absolute top-2 right-44 w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-700 flex items-center justify-center text-amber-500 shadow-sm z-20">
        <Lightbulb className="w-4 h-4 fill-amber-400" />
      </div>

      {/* Decorative Potted Plant on left */}
      <div className="absolute bottom-2 left-2 z-10 opacity-90">
        <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
          <ellipse cx="20" cy="42" rx="14" ry="4" fill="#E2E8F0" />
          <path d="M12 36 L15 44 L25 44 L28 36 Z" fill="#CBD5E1" />
          <path d="M20 36 Q10 24 18 14 Q22 26 20 36 Z" fill="#22C55E" />
          <path d="M20 36 Q28 22 22 10 Q16 22 20 36 Z" fill="#16A34A" />
          <path d="M20 36 Q32 28 26 18 Q22 28 20 36 Z" fill="#4ADE80" />
        </svg>
      </div>

      {/* SVG Characters: Student (Left) & Faculty Mentor (Right) with Laptop */}
      <svg width="280" height="150" viewBox="0 0 280 150" fill="none" className="z-10">
        {/* Desk Line */}
        <line x1="20" y1="138" x2="260" y2="138" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />

        {/* ── STUDENT (Left) in Blue Hoodie ── */}
        <g id="student">
          {/* Body/Hoodie */}
          <path d="M72 136 C72 110 84 94 98 94 C112 94 124 110 124 136 Z" fill="#0EA5E9" />
          <path d="M98 96 L98 120" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          {/* Head & Neck */}
          <rect x="92" y="78" width="12" height="18" rx="4" fill="#FDBA74" />
          <circle cx="98" cy="62" r="18" fill="#FED7AA" />
          {/* Hair */}
          <path d="M80 62 C80 44 94 40 106 42 C114 44 116 52 116 58 C116 60 110 54 104 54 C96 54 86 58 80 62 Z" fill="#1E293B" />
          {/* Face: Eyes & Smile */}
          <circle cx="104" cy="62" r="2" fill="#0F172A" />
          <path d="M102 68 Q106 72 110 68" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Arm gesturing to laptop */}
          <path d="M112 110 Q124 106 132 114" stroke="#FDBA74" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* ── LAPTOP ON DESK ── */}
        <g id="laptop">
          {/* Base */}
          <rect x="122" y="132" width="44" height="4" rx="2" fill="#64748B" />
          {/* Screen tilted */}
          <polygon points="126,132 132,106 158,106 162,132" fill="#334155" />
          <polygon points="128,130 134,108 156,108 160,130" fill="#0284C7" />
          {/* Mini Graduation Cap on back of screen */}
          <rect x="141" y="117" width="8" height="6" rx="1.5" fill="#E2E8F0" opacity="0.8" />
        </g>

        {/* Speech Chat Bubble between them */}
        <g id="chat-dots" transform="translate(136, 68)">
          <rect x="0" y="0" width="32" height="20" rx="10" fill="#818CF8" />
          <circle cx="9" cy="10" r="2" fill="white" />
          <circle cx="16" cy="10" r="2" fill="white" />
          <circle cx="23" cy="10" r="2" fill="white" />
        </g>

        {/* ── FACULTY MENTOR (Right) in Professional Suit & Glasses ── */}
        <g id="mentor">
          {/* Body/Suit Jacket */}
          <path d="M174 136 C174 108 186 92 202 92 C218 92 230 108 230 136 Z" fill="#4F46E5" />
          {/* White Blouse collar */}
          <polygon points="196,94 202,110 208,94" fill="#FFFFFF" />
          {/* Head & Neck */}
          <rect x="196" y="74" width="12" height="20" rx="4" fill="#FDBA74" />
          <circle cx="202" cy="58" r="17" fill="#FED7AA" />
          {/* Professional Hair */}
          <path d="M184 56 C184 38 198 36 212 38 C224 40 224 52 222 70 C222 70 216 60 212 60 C206 60 196 54 184 56 Z" fill="#312E81" />
          {/* Glasses */}
          <circle cx="196" cy="58" r="4.5" stroke="#1E293B" strokeWidth="1.5" fill="none" />
          <circle cx="208" cy="58" r="4.5" stroke="#1E293B" strokeWidth="1.5" fill="none" />
          <line x1="200.5" y1="58" x2="203.5" y2="58" stroke="#1E293B" strokeWidth="1.5" />
          {/* Smile */}
          <path d="M198 68 Q202 72 206 68" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Hand taking notes */}
          <path d="M188 116 Q180 124 176 130" stroke="#FDBA74" strokeWidth="4.5" strokeLinecap="round" />
        </g>

        {/* Stack of books on right */}
        <g id="books" transform="translate(236, 122)">
          <rect x="0" y="10" width="28" height="6" rx="1.5" fill="#38BDF8" />
          <rect x="2" y="4" width="24" height="6" rx="1.5" fill="#818CF8" />
          <rect x="4" y="-2" width="20" height="6" rx="1.5" fill="#F43F5E" />
        </g>
      </svg>
    </div>
  );
}

export default function FindMentorPage() {
  const { mentors, addMentorRequest, currentUser, mentorAvailability, facultySchedules, feedbacks, addFeedback } = useCampus();
  const { awardXP } = useLearning();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "reviews">("recommended");

  // Booking Modal / Active Selection State
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<"idle" | "pending" | "success">("idle");
  const [bookedSessionInfo, setBookedSessionInfo] = useState<{ mentorName: string; slot: string } | null>(null);

  // Faculty Feedback Modal State
  const [feedbackMentor, setFeedbackMentor] = useState<any | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackCategory, setFeedbackCategory] = useState<string>("Teaching Quality");
  const [feedbackSubject, setFeedbackSubject] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [feedbackIsAnonymous, setFeedbackIsAnonymous] = useState<boolean>(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);
  const [expandedReviewsMentorId, setExpandedReviewsMentorId] = useState<string | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);

  // Departments list extracted from mentors
  const departments = ["All Departments", "Computer Science", "Information Technology", "Electronics & Communication", "Mathematics"];

  // Core Subjects list
  const subjects = ["All Subjects", "DBMS", "SQL", "Data Structures", "Web Development", "AI/ML", "Computer Networks", "Discrete Math"];

  // Filter and sort mentors
  const processedMentors = mentors
    .filter((m) => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesDept = m.department?.toLowerCase().includes(q);
        const matchesSpec = m.specialization?.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesDept && !matchesSpec) return false;
      }

      // 2. Department Filter
      if (departmentFilter !== "all" && departmentFilter !== "All Departments") {
        if (m.department?.toLowerCase() !== departmentFilter.toLowerCase()) return false;
      }

      // 3. Subject Filter
      if (subjectFilter !== "all" && subjectFilter !== "All Subjects") {
        const hasSubj = m.specialization?.some(
          (s) => s.toLowerCase() === subjectFilter.toLowerCase()
        );
        if (!hasSubj) return false;
      }

      // 4. Availability Filter
      if (availabilityFilter !== "all" && availabilityFilter !== "All Availability") {
        const hasSlot = m.availability?.some((s) =>
          s.toLowerCase().includes(availabilityFilter.toLowerCase())
        );
        if (!hasSlot) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "recommended") {
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        return (b.rating || 4.5) - (a.rating || 4.5);
      }
      if (sortBy === "rating") {
        return (b.rating || 4.5) - (a.rating || 4.5);
      }
      if (sortBy === "reviews") {
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      }
      return 0;
    });

  // Handle Booking Request
  const handleRequest = (mentorId: string, slot: string, mentorName: string) => {
    if (!currentUser || currentUser.role !== "student") return;

    setRequestStatus("pending");
    setTimeout(() => {
      const parts = slot.split(" ");
      const day = parts[0] || "Monday";
      const time = parts.slice(1).join(" ") || "4:30 PM";

      addMentorRequest({
        studentId: currentUser.id,
        mentorId,
        subject: searchQuery.trim() || "General Mentoring & Doubt Clarification",
        date: day,
        time,
      });

      if (typeof awardXP === "function") {
        awardXP(120, "Mentor Session Booked", "mentor");
      }

      setBookedSessionInfo({ mentorName, slot });
      setRequestStatus("success");
      setSelectedMentor(null);
    }, 700);
  };

  // Open Faculty Feedback Modal
  const handleOpenFeedback = (mentor: any) => {
    setFeedbackMentor(mentor);
    setFeedbackRating(5);
    setHoverRating(null);
    setFeedbackCategory("Teaching Quality");
    setFeedbackSubject(mentor.specialization?.[0] || "");
    setFeedbackText("");
    setFeedbackIsAnonymous(false);
  };

  // Submit Faculty Feedback
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMentor || !feedbackText.trim() || isSubmittingFeedback) return;

    setIsSubmittingFeedback(true);
    try {
      await addFeedback({
        facultyId: feedbackMentor.id,
        facultyName: feedbackMentor.name,
        studentId: currentUser?.id || "s1",
        studentName: feedbackIsAnonymous ? "Anonymous Student" : (currentUser?.name || "Student"),
        rating: feedbackRating,
        category: feedbackCategory,
        subject: feedbackSubject.trim() || feedbackMentor.specialization?.[0] || "Mentoring",
        text: feedbackText.trim(),
        isAnonymous: feedbackIsAnonymous
      });

      if (typeof awardXP === "function") {
        awardXP(50, "Faculty Feedback Submitted", "mentor");
      }

      setFeedbackSuccessMsg(`Thank you! Your feedback for Professor ${feedbackMentor.name} was successfully submitted and shared with administration (+50 XP).`);
      setFeedbackMentor(null);
      setFeedbackText("");
      setTimeout(() => setFeedbackSuccessMsg(null), 6000);
    } catch (err) {
      console.error("Feedback submission error:", err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Avatar Initial Colors
  const getAvatarColors = (name: string) => {
    if (name.includes("Rahul")) return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300";
    if (name.includes("Priya")) return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
    if (name.includes("Amit")) return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300";
    if (name.includes("Neha")) return "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300";
    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.2s_ease-out]">
        
        {/* ─── 1. TOP HERO BANNER CARD ─── */}
        <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          
          {/* Left Text & Feature Tags */}
          <div className="flex-1 z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 text-xs font-bold">
              <span>➔</span>
              <span>Smart Match</span>
            </div>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Find a Mentor
              </h1>
              <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
              Get 1:1 help from available faculty and experienced mentors
            </p>

            {/* Feature Pills Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-slate-600 dark:text-slate-300 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                <UserCheck className="w-3.5 h-3.5 text-sky-500" />
                Expert Guidance
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                Subject Support
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                Career Advice
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                Flexible Scheduling
              </span>
            </div>
          </div>

          {/* Right Vector Illustration */}
          <MentorHeroIllustration />
        </div>

        {/* ─── 2. SEARCH BAR ─── */}
        <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-2.5 px-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <Search className="w-5 h-5 text-sky-500 shrink-0" />
          <input
            type="text"
            placeholder="What subject do you need help with? (e.g. DBMS, SQL)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setRequestStatus("idle");
            }}
            className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            aria-label="Search mentors by subject"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ─── 3. FILTER DROPDOWNS BAR ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Department Dropdown */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 transition cursor-pointer"
            >
              <option value="all">All Departments ⌵</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mathematics">Mathematics</option>
            </select>

            {/* Subject Dropdown */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 transition cursor-pointer"
            >
              <option value="all">All Subjects ⌵</option>
              <option value="DBMS">DBMS</option>
              <option value="SQL">SQL</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Web Development">Web Development</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="Discrete Math">Discrete Math</option>
            </select>

            {/* Availability Dropdown */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 transition cursor-pointer"
            >
              <option value="all">All Availability ⌵</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 transition cursor-pointer"
            >
              <option value="recommended">⇅ Sort by: Recommended ⌵</option>
              <option value="rating">⇅ Sort by: Highest Rating ⌵</option>
              <option value="reviews">⇅ Sort by: Most Reviews ⌵</option>
            </select>
          </div>
        </div>

        {/* Booking Success Alert */}
        {requestStatus === "success" && bookedSessionInfo && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-800 dark:text-emerald-200 text-xs font-semibold animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Session booked with <strong>{bookedSessionInfo.mentorName}</strong> ({bookedSessionInfo.slot})! You earned <strong>+120 XP</strong>.
              </span>
            </div>
            <button
              onClick={() => setRequestStatus("idle")}
              className="text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Feedback Success Alert */}
        {feedbackSuccessMsg && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-amber-900 dark:text-amber-200 text-xs font-semibold animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center gap-2.5">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500 shrink-0" />
              <span>{feedbackSuccessMsg}</span>
            </div>
            <button
              onClick={() => setFeedbackSuccessMsg(null)}
              className="text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ─── 4. MAIN TWO-COLUMN CONTENT AREA ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── LEFT COLUMN (8 cols): MENTOR CARDS LIST ── */}
          <div className="lg:col-span-8 space-y-4">
            {processedMentors.map((mentor) => {
              const primarySlot = mentor.availability?.[0] || "Monday 4:30 PM";
              const location = mentor.currentLocation || "Faculty Block / Room 204";
              const rating = mentor.rating || 4.8;
              const reviews = mentor.reviewsCount || 32;
              const isSelected = selectedMentor === mentor.id;

              // Display up to 4 tags, then show +N
              const maxTags = 4;
              const displayedTags = mentor.specialization?.slice(0, maxTags) || [];
              const remainingCount = (mentor.specialization?.length || 0) - maxTags;

              return (
                <div
                  key={mentor.id}
                  className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Mentor Info Left */}
                    <div className="flex items-start gap-4">
                      {/* Avatar Round Circle */}
                      <div
                        className={`w-12 h-12 rounded-full ${getAvatarColors(
                          mentor.name
                        )} flex items-center justify-center font-black text-sm shrink-0 shadow-2xs border border-white/50`}
                      >
                        {getInitials(mentor.name)}
                      </div>

                      <div className="space-y-1">
                        {/* Name & Recommended Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                            {mentor.name}
                          </h3>
                          {mentor.isRecommended && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-300 text-[10px] font-extrabold">
                              <ShieldCheck className="w-3 h-3 text-sky-500" />
                              Recommended
                            </span>
                          )}
                        </div>

                        {/* Department & Direct Feedback Button Below Faculty Name */}
                        <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {mentor.department}
                          </p>
                          <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenFeedback(mentor);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800 text-[11px] font-bold transition shadow-2xs cursor-pointer group"
                            title={`Give student feedback for ${mentor.name}`}
                          >
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
                            <span>Give Feedback</span>
                          </button>
                        </div>

                        {/* Schedule & Location */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300 pt-0.5">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{primarySlot}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span>{location}</span>
                          </div>
                        </div>

                        {/* Skills / Specialization Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                          {displayedTags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-750"
                            >
                              {tag}
                            </span>
                          ))}
                          {remainingCount > 0 && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                              +{remainingCount}
                            </span>
                          )}
                        </div>

                        {/* Recent Student Feedback Accordion Snippet */}
                        {(() => {
                          const mentorFeedbacks = feedbacks.filter(
                            (f) => f.facultyId === mentor.id || f.facultyName === mentor.name
                          );
                          if (mentorFeedbacks.length === 0) return null;
                          const isExpanded = expandedReviewsMentorId === mentor.id;

                          return (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedReviewsMentorId(isExpanded ? null : mentor.id);
                                }}
                                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>
                                  {mentorFeedbacks.length} Student {mentorFeedbacks.length === 1 ? "Review" : "Reviews"} • View Feedback {isExpanded ? "▴" : "▾"}
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="mt-2.5 space-y-2 animate-[fadeIn_0.2s_ease-out]">
                                  {mentorFeedbacks.map((fb) => (
                                    <div
                                      key={fb.id}
                                      className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 text-xs space-y-1"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                                          <span>{fb.isAnonymous ? "Anonymous Student" : fb.studentName || "Student"}</span>
                                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">
                                            {fb.category}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-0.5 text-amber-400">
                                          {Array.from({ length: fb.rating || 5 }).map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                                          ))}
                                          <span className="text-[10px] font-black ml-1 text-slate-700 dark:text-slate-300">
                                            {fb.rating}.0
                                          </span>
                                        </div>
                                      </div>
                                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed italic">
                                        "{fb.text}"
                                      </p>
                                      <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono pt-0.5">
                                        <span>Subject: {fb.subject || "Mentoring"}</span>
                                        <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Right Side: Rating & Request Button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-black text-slate-900 dark:text-white">{rating}</span>
                        <span className="text-slate-400">({reviews} reviews)</span>
                      </div>

                      <button
                        onClick={() => setSelectedMentor(isSelected ? null : mentor.id)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Request Session</span>
                      </button>
                    </div>
                  </div>

                  {/* Expandable Booking Slot Panel */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-[fadeIn_0.2s_ease-out]">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          Choose an available slot for 1:1 mentorship:
                        </p>
                        <button
                          onClick={() => setSelectedMentor(null)}
                          className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(mentor.availability || [primarySlot]).map((slot) => (
                          <button
                            key={slot}
                            onClick={() => handleRequest(mentor.id, slot, mentor.name)}
                            disabled={requestStatus === "pending"}
                            className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-sky-800 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{slot}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {processedMentors.length === 0 && (
              <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 space-y-3">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  No mentors found matching your selected filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setDepartmentFilter("all");
                    setSubjectFilter("all");
                    setAvailabilityFilter("all");
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN (4 cols): 3 WIDGET CARDS ── */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 1. WHY CONNECT WITH A MENTOR? */}
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <span>Why Connect with a Mentor?</span>
              </h3>

              <ul className="space-y-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Get personalized academic guidance</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Clarify doubts and complex topics</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Learn from real-world experience</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Career and placement advice</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Build a strong academic network</span>
                </li>
              </ul>
            </div>

            {/* 2. YOUR MENTOR ACTIVITY */}
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <span>Your Mentor Activity</span>
                </h3>
                <button
                  onClick={() => {}}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-1.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">3</div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Sessions Attended
                  </div>
                </div>

                <div>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-1.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">1</div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Upcoming Session
                  </div>
                </div>

                <div>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-1.5">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">4.8</div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                    Average Rating
                  </div>
                </div>
              </div>
            </div>

            {/* 3. NEED HELP FINDING SOMEONE? */}
            <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Need Help Finding Someone?
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                Tell us what you're looking for and we'll suggest the best mentors for you.
              </p>
              <button
                onClick={() => {
                  setSortBy("recommended");
                  const recommendedMentor = mentors.find((m) => m.isRecommended) || mentors[0];
                  if (recommendedMentor) setSelectedMentor(recommendedMentor.id);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200 dark:border-indigo-800 shadow-2xs active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Suggestions</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ─── MODAL: GIVE FACULTY FEEDBACK ─── */}
      {feedbackMentor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5 animate-[fadeIn_0.2s_ease-out] max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  Faculty Evaluation & Feedback
                </span>
                <h3 className="font-black text-lg text-slate-900 dark:text-white mt-1">
                  Feedback for {feedbackMentor.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {feedbackMentor.department} • Submissions are shared directly with the Academic Administration
                </p>
              </div>
              <button
                onClick={() => setFeedbackMentor(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs font-semibold">
              
              {/* Star Rating Selector */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Overall Rating <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating !== null ? hoverRating : feedbackRating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 rounded-lg text-slate-300 hover:scale-110 transition cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              isFilled ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200 ml-2">
                    {feedbackRating === 5
                      ? "5/5 — Excellent & Highly Recommended"
                      : feedbackRating === 4
                      ? "4/5 — Very Good & Supportive"
                      : feedbackRating === 3
                      ? "3/5 — Good & Satisfactory"
                      : feedbackRating === 2
                      ? "2/5 — Needs Minor Improvement"
                      : "1/5 — Requires Attention"}
                  </span>
                </div>
              </div>

              {/* Feedback Category */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Feedback Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "Teaching Quality",
                    "Mentorship & Guidance",
                    "Doubt Resolution",
                    "Practical Support",
                    "Course Pacing",
                    "Accessibility"
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFeedbackCategory(cat)}
                      className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition text-center cursor-pointer ${
                        feedbackCategory === cat
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject / Course Tag */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Course or Subject Topic
                </label>
                <input
                  type="text"
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                  placeholder="e.g. Data Structures, Algorithms, DBMS..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Feedback Comment Textarea */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Your Detailed Feedback & Suggestions <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Describe your learning experience with this professor. What aspects helped you most? Are there areas for improvement?"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonymous-feedback"
                  checked={feedbackIsAnonymous}
                  onChange={(e) => setFeedbackIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="anonymous-feedback" className="text-slate-600 dark:text-slate-400 text-xs cursor-pointer select-none">
                  Submit feedback anonymously (your name and registration will remain confidential)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setFeedbackMentor(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!feedbackText.trim() || isSubmittingFeedback}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-600/25 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span>{isSubmittingFeedback ? "Submitting Feedback..." : "Submit Faculty Feedback (+50 XP)"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
