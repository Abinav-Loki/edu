import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCampus } from "../context/CampusContext";
import { Role } from "../data/centralData";
import { GraduationCap, Users, ShieldAlert, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useCampus();

  const isSignup = location.pathname.includes("signup");
  const isStudent = location.pathname.includes("student");
  const isFaculty = location.pathname.includes("faculty");
  
  // Role inference
  const role: Role = isStudent ? "student" : isFaculty ? "faculty" : "admin";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Signup extra fields
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const roleDisplay = {
    student: { 
      portalName: "Student Portal",
      loginTitle: "Welcome back",
      loginSub: "Sign in to continue your campus journey.",
      signupTitle: "Student Registration",
      signupSub: "Join CampusOS AI and manage your academic and campus journey.",
      icon: GraduationCap, 
      img: "/student_auth_bg.jpg"
    },
    faculty: { 
      portalName: "Faculty Portal",
      loginTitle: "Welcome back",
      loginSub: "Sign in to manage mentoring, students, and your campus schedule.",
      signupTitle: "Faculty Registration",
      signupSub: "Connect with students, manage your availability, and support student success.",
      icon: Users, 
      img: "/faculty_auth_bg.jpg"
    },
    admin: { 
      portalName: "Campus Administration",
      loginTitle: "Admin Sign In",
      loginSub: "Access the Campus Control Room and campus intelligence platform.",
      signupTitle: "",
      signupSub: "",
      icon: ShieldAlert, 
      img: "/admin_auth_bg.jpg"
    }
  }[role];

  const Icon = roleDisplay.icon;

  async function handleQuickTestLogin(testRole: Role, userId: string, targetPath: string) {
    setLoading(true);
    try {
      await login(testRole, userId);
      navigate(targetPath);
    } catch {
      navigate(targetPath);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isSignup) {
        await signup(
          role,
          {
            name: fullName || (role === "student" ? "Arun Kumar" : role === "faculty" ? "Rahul Kumar" : "Admin User"),
            department: department || "Computer Science",
            email: identifier || (role === "student" ? "arun.k@student.edu" : "rahul.k@faculty.edu")
          },
          password
        );
      } else {
        await login(
          role,
          identifier || (role === "student" ? "s1" : role === "faculty" ? "f1" : "admin1"),
          password
        );
      }
      
      if (role === "student") navigate("/dashboard");
      else if (role === "faculty") navigate("/faculty");
      else navigate("/admin");
    } catch (err: any) {
      console.warn("Auth bypass active:", err);
      if (role === "student") navigate("/dashboard");
      else if (role === "faculty") navigate("/faculty");
      else navigate("/admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-[#0F1226]">
      {/* Left side: Glass Auth Card */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle background glow for left side */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3B2FBF]/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#14B8A6]/20 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Glass Card */}
        <div className="w-full max-w-md p-8 sm:p-10 rounded-[2rem] z-10 border border-white/20 shadow-2xl backdrop-blur-xl bg-[rgba(255,255,255,0.12)] relative overflow-hidden">
          
          <div className="flex flex-col mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-sm">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-white font-bold tracking-tight">CampusOS AI</h2>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">{roleDisplay.portalName}</p>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">
              {isSignup ? roleDisplay.signupTitle : roleDisplay.loginTitle}
            </h1>
            <p className="text-[#E6E8F5] text-xs sm:text-sm opacity-80 leading-relaxed">
              {isSignup ? roleDisplay.signupSub : roleDisplay.loginSub}
            </p>
          </div>

          {/* Quick Instant Test Selector */}
          <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-teal-500/20 border border-indigo-400/30 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>⚡ Instant 1-Click Test Access</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Auth Bypassed
              </span>
            </div>
            <p className="text-[11px] text-white/70 mb-2.5">
              Click any profile below to instantly explore that user's view & progress:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickTestLogin("student", "s1", "/dashboard")}
                className="p-2 rounded-xl bg-white/10 hover:bg-indigo-600/40 border border-white/15 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-200">👨‍🎓 Arun Kumar</div>
                <div className="text-[10px] text-white/60">Student (s1)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickTestLogin("student", "s2", "/dashboard")}
                className="p-2 rounded-xl bg-white/10 hover:bg-indigo-600/40 border border-white/15 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-200">👩‍🎓 Ananya Roy</div>
                <div className="text-[10px] text-white/60">Student (s2)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickTestLogin("faculty", "f1", "/faculty")}
                className="p-2 rounded-xl bg-white/10 hover:bg-indigo-600/40 border border-white/15 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-200">👨‍🏫 Dr. Rahul Kumar</div>
                <div className="text-[10px] text-white/60">Faculty Portal</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickTestLogin("admin", "admin1", "/admin")}
                className="p-2 rounded-xl bg-white/10 hover:bg-indigo-600/40 border border-white/15 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-200">🛡️ Campus Admin</div>
                <div className="text-[10px] text-white/60">Admin Panel</div>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignup && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#E6E8F5] uppercase tracking-wider mb-1 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Arun Kumar"
                    className="w-full p-3 rounded-xl border border-white/20 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#6D62F0] focus:border-transparent outline-none bg-white/5 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#E6E8F5] uppercase tracking-wider mb-1 ml-1">Department</label>
                  <input 
                    type="text" 
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full p-3 rounded-xl border border-white/20 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#6D62F0] focus:border-transparent outline-none bg-white/5 transition-all"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#E6E8F5] uppercase tracking-wider mb-1 ml-1">
                {role === 'student' ? 'Student ID / Email' : role === 'faculty' ? 'Faculty ID / Email' : 'Admin ID / Email'}
                <span className="text-[10px] text-white/50 font-normal lowercase ml-1.5">(optional)</span>
              </label>
              <input 
                type="text" 
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder={role === 'student' ? "e.g. arun.k@student.edu (or any name / blank)" : "e.g. rahul.k@faculty.edu (or blank)"}
                className="w-full p-3 rounded-xl border border-white/20 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#6D62F0] focus:border-transparent outline-none bg-white/5 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E6E8F5] uppercase tracking-wider mb-1 ml-1">
                Password
                <span className="text-[10px] text-emerald-400 font-normal lowercase ml-1.5">(bypassed for testing)</span>
              </label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Optional — any password or leave blank"
                className="w-full p-3 rounded-xl border border-white/20 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#6D62F0] focus:border-transparent outline-none bg-white/5 transition-all"
              />
            </div>

            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-[#E6E8F5] uppercase tracking-wider mb-1 ml-1">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Optional"
                  className="w-full p-3 rounded-xl border border-white/20 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#6D62F0] focus:border-transparent outline-none bg-white/5 transition-all"
                />
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#3B2FBF] hover:bg-[#6D62F0] text-white font-semibold rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 transition-all shadow-lg shadow-black/10 group disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Entering Portal..." : (isSignup ? "Create Account & Test" : "Sign In & Test Website")}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-5 flex flex-col items-center gap-2.5">
            {!isSignup ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate(role === "student" ? "/dashboard" : role === "faculty" ? "/faculty" : "/admin")}
                  className="text-xs text-[#14B8A6] hover:underline font-semibold"
                >
                  🚀 Skip Directly to Portal
                </button>
                {role !== 'admin' && (
                  <Link to={`/${role}/signup`} className="text-xs text-white/80 hover:text-white font-medium transition-colors">
                    Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
                  </Link>
                )}
              </>
            ) : (
              <Link to={`/${role}/login`} className="text-xs text-white/80 hover:text-white font-medium transition-colors">
                Already have an account? Sign in
              </Link>
            )}
          </div>
        </div>
        
        {/* Quick Demo Switcher - for testing purposes so user can quickly switch roles in demo */}
        <div className="mt-4 flex gap-3 opacity-60 hover:opacity-100 transition-opacity z-10">
          <Link to="/student/login" className="text-[10px] text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">Student Login</Link>
          <Link to="/faculty/login" className="text-[10px] text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">Faculty Login</Link>
          <Link to="/admin/login" className="text-[10px] text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">Admin Login</Link>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#161A33]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1226] to-transparent z-10 w-32" />
        <img 
          src={roleDisplay.img} 
          alt={`${role} background`}
          className="w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-[#3B2FBF]/20 mix-blend-color z-0 pointer-events-none" />
      </div>
    </div>
  );
}
