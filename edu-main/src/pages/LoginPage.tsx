import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCampus } from "../context/CampusContext";
import { Role } from "../data/centralData";
import { 
  GraduationCap, 
  Users, 
  ShieldAlert, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Building, 
  Briefcase, 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  BookOpen
} from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, login, signup, logout } = useCampus();

  // Mode & Role inference from URL
  const isSignupPath = location.pathname.includes("signup");
  const [isSignup, setIsSignup] = useState(isSignupPath);

  // Sync state if URL changes
  useEffect(() => {
    setIsSignup(location.pathname.includes("signup"));
  }, [location.pathname]);

  // Selected Role tab
  const initialRole: Role = location.pathname.includes("faculty")
    ? "faculty"
    : location.pathname.includes("admin")
    ? "admin"
    : "student";

  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Signup Profile State
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [course, setCourse] = useState("B.Tech Computer Science");
  const [year, setYear] = useState("1st Year");
  const [designation, setDesignation] = useState("Assistant Professor");
  const [institution, setInstitution] = useState("Campus Institute of Technology");
  const [authToken, setAuthToken] = useState("");

  // Feedback State
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingApprovalMsg, setPendingApprovalMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const roleMeta = {
    student: {
      title: "Student Portal",
      subTitle: "Access your personalized learning paths, AI Copilot, and academic performance.",
      icon: GraduationCap,
      accentColor: "from-sky-500 to-indigo-600",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      bgImage: "/student_auth_bg.jpg"
    },
    faculty: {
      title: "Faculty Control Center",
      subTitle: "Review student risk indicators, manage timetables, and assign targeted interventions.",
      icon: Users,
      accentColor: "from-purple-500 to-indigo-600",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      bgImage: "/faculty_auth_bg.jpg"
    },
    admin: {
      title: "Campus Administration",
      subTitle: "Monitor institution-level KPIs, asset health, and multi-cohort analytics.",
      icon: ShieldAlert,
      accentColor: "from-emerald-500 to-teal-600",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      bgImage: "/admin_auth_bg.jpg"
    }
  }[selectedRole];

  const Icon = roleMeta.icon;

  // 1-Click Quick Demo Login (Preserves all mock demo accounts)
  async function handleQuickDemoLogin(demoRole: Role, demoId: string, targetPath: string) {
    setLoading(true);
    setErrorMsg("");
    setPendingApprovalMsg("");
    try {
      const res = await login(demoRole, demoId);
      if (res.success) {
        navigate(targetPath);
      } else {
        setErrorMsg(res.error || "Demo login failed.");
      }
    } catch (e: any) {
      navigate(targetPath);
    } finally {
      setLoading(false);
    }
  }

  // Handle Real Form Submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setPendingApprovalMsg("");

    // Form Validation
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Please enter your academic or personal email address.");
      return;
    }
    if (!cleanEmail.includes("@")) {
      setErrorMsg("Please enter a valid email format (e.g. yourname@campus.edu).");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters in length.");
      return;
    }

    if (isSignup) {
      if (!fullName.trim()) {
        setErrorMsg("Please provide your full legal name.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match. Please re-enter.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignup) {
        const res = await signup(
          selectedRole,
          {
            name: fullName.trim(),
            email: cleanEmail,
            department,
            course: selectedRole === "student" ? course : undefined,
            year: selectedRole === "student" ? year : undefined,
            registrationNumber: selectedRole === "student" ? registrationNumber.trim() : undefined,
            designation: selectedRole === "faculty" ? designation : undefined,
            institution: selectedRole === "admin" ? institution : undefined,
            authToken: authToken.trim()
          },
          password
        );

        if (res.pendingApproval) {
          setPendingApprovalMsg(res.message || "Account registered. Pending administrative verification.");
          setIsSignup(false);
          setPassword("");
          setConfirmPassword("");
          return;
        }

        if (!res.success) {
          setErrorMsg(res.error || "Signup failed. Please verify your details.");
          return;
        }

        // Active Student Redirect
        navigate("/dashboard");
      } else {
        // Authenticated Supabase Login
        const res = await login(selectedRole, cleanEmail, password);
        if (!res.success) {
          setErrorMsg(res.error || "Invalid email or password.");
          return;
        }

        // Redirect based on role
        if (selectedRole === "faculty") navigate("/faculty");
        else if (selectedRole === "admin") navigate("/admin");
        else navigate("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full bg-[#0B0E1F] text-slate-100">
      {/* Left Column: Hero Visual Graphic */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#121630] items-center justify-center overflow-hidden border-r border-white/10">
        <div className="absolute inset-0 bg-gradient-to-l from-[#0B0E1F] to-transparent z-10 w-28 ml-auto" />
        <img
          src={roleMeta.bgImage}
          alt={`${selectedRole} background`}
          className="w-full h-full object-cover object-center opacity-70 scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E1F] via-transparent to-transparent z-10" />

        {/* Floating Callout Card on Image */}
        <div className="absolute bottom-12 left-12 right-12 z-20 p-6 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/20 shadow-2xl max-w-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
              ARIVON AI Multi-Cohort Architecture
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mb-1">
            Real-Time Personalized Learning & Students Analytics
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Connected to persistent Supabase database with isolated Row-Level Security, zero-trust role provisioning, and explainable AI risk scoring for students, faculty, and administrators.
          </p>
        </div>
      </div>

      {/* Right Column: Interactive Glass Auth Portal */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 relative overflow-y-auto">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-teal-500/15 rounded-full blur-[130px] pointer-events-none" />

        {/* Auth Glass Card */}
        <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl z-10 border border-white/15 shadow-2xl backdrop-blur-2xl bg-white/[0.07] relative my-auto">
          
          {/* Header Brand */}
          <div className="flex items-center justify-between mb-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <div className="w-full h-full bg-[#0F1226] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block leading-tight">ARIVON AI</span>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block">Students Analytics</span>
              </div>
            </Link>

            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${roleMeta.badgeColor}`}>
              {roleMeta.title}
            </span>
          </div>

          {/* Active Session Status Banner */}
          {currentUser && (
            <div className="mb-5 p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Active session: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser.role === "faculty") navigate("/faculty");
                    else if (currentUser.role === "admin") navigate("/admin");
                    else navigate("/dashboard");
                  }}
                  className="font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                >
                  Go to Portal &rarr;
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                  }}
                  className="font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Heading */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isSignup ? "Create Academic Account" : "Welcome Back"}
            </h1>
            <p className="text-slate-300/80 text-xs sm:text-sm mt-1 leading-relaxed">
              {isSignup ? "Register to access your personal dashboard and learning records." : roleMeta.subTitle}
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10 mb-5">
            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === "student"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("faculty")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === "faculty"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("admin")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === "admin"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Quick Demo Accounts Hub (PRESERVES EXISTING DEMO WORKFLOWS) */}
          <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/60 border border-indigo-400/25">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>ByteXL Hackathon — Instant Demo Accounts</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                1-Click Access
              </span>
            </div>
            <p className="text-[11px] text-slate-300/80 mb-2.5">
              Explore established demo scenarios without entering credentials:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("student", "s1", "/dashboard")}
                className="p-2 rounded-xl bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-400/50 text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-200 flex items-center justify-between">
                  <span>👨‍🎓 Arun Kumar</span>
                  <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1 rounded">At-Risk</span>
                </div>
                <div className="text-[10px] text-slate-400">s1 • 7-Day Recovery Plan</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("student", "s2", "/dashboard")}
                className="p-2 rounded-xl bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-400/50 text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-200 flex items-center justify-between">
                  <span>👩‍🎓 Ananya Roy</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1 rounded">Top 5%</span>
                </div>
                <div className="text-[10px] text-slate-400">s2 • High XP & Quests</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("faculty", "f1", "/faculty")}
                className="p-2 rounded-xl bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-400/50 text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-200">👨‍🏫 Dr. Rahul Kumar</div>
                <div className="text-[10px] text-slate-400">f1 • Interventions & Mentoring</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("admin", "admin1", "/admin")}
                className="p-2 rounded-xl bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-400/50 text-left transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-200">🛡️ Campus Admin</div>
                <div className="text-[10px] text-slate-400">admin1 • Assets & Cohorts</div>
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-medium flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {pendingApprovalMsg && (
            <div className="p-3 mb-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-medium flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>{pendingApprovalMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignup && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Dynamic Role-Specific Fields */}
                {selectedRole === "student" && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Registration / Roll No.
                      </label>
                      <input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="e.g. 22IT104"
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-[#161A33] text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics & Communication">Electronics & Comm.</option>
                        <option value="Mechanical Engineering">Mechanical Eng.</option>
                        <option value="Artificial Intelligence">AI & Data Science</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Course / Degree
                      </label>
                      <input
                        type="text"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="e.g. B.Tech IT"
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Year / Semester
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-[#161A33] text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="1st Year">1st Year (Freshman)</option>
                        <option value="2nd Year">2nd Year (Sophomore)</option>
                        <option value="3rd Year">3rd Year (Junior)</option>
                        <option value="4th Year">4th Year (Senior)</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedRole === "faculty" && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Staff / Faculty ID
                      </label>
                      <input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="e.g. FAC-204"
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Designation
                      </label>
                      <select
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-[#161A33] text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Professor">Professor</option>
                        <option value="Head of Department">Head of Department</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Staff Verification Key <span className="text-slate-500 font-normal lowercase">(optional for instant access)</span>
                      </label>
                      <input
                        type="text"
                        value={authToken}
                        onChange={(e) => setAuthToken(e.target.value)}
                        placeholder="CAMPUS_VERIFIED_STAFF_2026 (or leave blank for admin review)"
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === "admin" && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Institution / Campus
                      </label>
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. Campus Institute of Technology"
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Admin Security Key <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={authToken}
                        onChange={(e) => setAuthToken(e.target.value)}
                        placeholder="CAMPUS_ADMIN_SUPERUSER_2026"
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@campus.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Password with Visibility Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Password <span className="text-rose-400">*</span>
                </label>
                {!isSignup && (
                  <span className="text-[10px] text-indigo-400 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/15 bg-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Signup only) */}
            {isSignup && (
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/15 bg-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Zero-Trust Role Security Notice */}
            {isSignup && selectedRole !== "student" && (
              <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                <span>
                  <strong>Zero-Trust Security:</strong> Faculty & Administrator registrations require campus verification or authorization keys before elevated cohorts are accessible.
                </span>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl py-3 mt-2 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 group disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <>
                  <span>{isSignup ? `Create ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account` : `Sign In to ${roleMeta.title}`}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation / Switcher */}
          <div className="mt-5 text-center">
            {isSignup ? (
              <p className="text-xs text-slate-400">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => { setIsSignup(false); setErrorMsg(""); setPendingApprovalMsg(""); }}
                  className="font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                New to ARIVON AI?{" "}
                <button
                  type="button"
                  onClick={() => { setIsSignup(true); setErrorMsg(""); setPendingApprovalMsg(""); }}
                  className="font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                >
                  Register a new account
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Bottom Quick Navigation Links */}
        <div className="mt-4 flex gap-3 text-[11px] text-slate-400 z-10">
          <Link to="/" className="hover:text-white transition">← Return Home</Link>
          <span>•</span>
          <Link to="/learning-arena" className="hover:text-white transition">Learning Arena</Link>
          <span>•</span>
          <Link to="/resources" className="hover:text-white transition">Library</Link>
        </div>
      </div>
    </div>
  );
}
