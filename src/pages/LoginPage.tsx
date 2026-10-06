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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSignup) {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      signup(role, { name: fullName, department });
    } else {
      login(role, identifier);
    }
    
    if (role === "student") navigate("/");
    if (role === "faculty") navigate("/faculty");
    if (role === "admin") navigate("/admin");
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
          
          <div className="flex flex-col mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-sm">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-white font-bold tracking-tight">CampusOS AI</h2>
                <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">{roleDisplay.portalName}</p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              {isSignup ? roleDisplay.signupTitle : roleDisplay.loginTitle}
            </h1>
            <p className="text-[#E6E8F5] text-sm opacity-80 leading-relaxed">
              {isSignup ? roleDisplay.signupSub : roleDisplay.loginSub}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#E6E8F5] uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Arun Kumar"
                    className="w-full p-3.5 rounded-xl border border-white/20 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#6D62F0] focus:border-transparent outline-none bg-white/5 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#E6E8F5] uppercase tracking-wider mb-1.5 ml-1">Department</label>
                  <input 
                    type="text" 
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    required
                    placeholder="e.g. Computer Science"
                    className="w-full p-3.5 rounded-xl border border-white/20 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#6D62F0] focus:border-transparent outline-none bg-white/5 transition-all"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#E6E8F5] uppercase tracking-wider mb-1.5 ml-1">
                {role === 'student' ? 'Student ID / Email' : role === 'faculty' ? 'Faculty ID / Email' : 'Admin ID / Email'}
              </label>
              <input 
                type="text" 
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
                placeholder={role === 'student' ? "e.g. s1 or arun@university.edu" : "e.g. m1 or admin1"}
                className="w-full p-3.5 rounded-xl border border-white/20 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#6D62F0] focus:border-transparent outline-none bg-white/5 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E6E8F5] uppercase tracking-wider mb-1.5 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full p-3.5 rounded-xl border border-white/20 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#6D62F0] focus:border-transparent outline-none bg-white/5 transition-all"
              />
            </div>

            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-[#E6E8F5] uppercase tracking-wider mb-1.5 ml-1">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full p-3.5 rounded-xl border border-white/20 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#6D62F0] focus:border-transparent outline-none bg-white/5 transition-all"
                />
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#3B2FBF] hover:bg-[#6D62F0] text-white font-semibold rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 transition-all shadow-lg shadow-black/10 group"
            >
              {isSignup ? "Create Account" : "Sign In"}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3">
            {!isSignup ? (
              <>
                <button className="text-xs text-[#E6E8F5]/70 hover:text-white transition-colors">Forgot Password?</button>
                {role !== 'admin' && (
                  <Link to={`/${role}/signup`} className="text-xs text-white hover:text-[#14B8A6] font-semibold transition-colors">
                    Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
                  </Link>
                )}
              </>
            ) : (
              <Link to={`/${role}/login`} className="text-xs text-white hover:text-[#14B8A6] font-semibold transition-colors">
                Already have an account? Sign in
              </Link>
            )}
          </div>
        </div>
        
        {/* Quick Demo Switcher - for testing purposes so user can quickly switch roles in demo */}
        <div className="absolute bottom-6 flex gap-3 opacity-40 hover:opacity-100 transition-opacity">
          <Link to="/student/login" className="text-[10px] text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">Student</Link>
          <Link to="/faculty/login" className="text-[10px] text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">Faculty</Link>
          <Link to="/admin/login" className="text-[10px] text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">Admin</Link>
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
