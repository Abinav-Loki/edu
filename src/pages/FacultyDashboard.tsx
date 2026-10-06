import { useCampus } from "../context/CampusContext";
import PageHeader from "../components/PageHeader";
import MobileHeader from "../components/MobileHeader";
import { CheckCircle2, Clock, AlertTriangle, MessageSquare } from "lucide-react";

export default function FacultyDashboard() {
  const { currentUser, mentorRequests, updateMentorRequest, students } = useCampus();

  // Filter requests for the current faculty
  const myRequests = mentorRequests.filter(req => req.mentorId === currentUser?.id && req.status === "pending");

  // Identify students needing attention (mock logic for demo)
  const studentsAtRisk = students.filter(s => s.quizAverage < 50 || s.attendancePercent < 70);

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-6xl mx-auto">
        <PageHeader
          title="Faculty Dashboard"
          subtitle={`Welcome back, Professor ${currentUser?.name.split(" ")[0] || "User"}`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Col: Requests */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Pending Mentor Requests</h2>
            
            {myRequests.length === 0 ? (
              <div className="glass-card p-6 text-center text-slate-500 dark:text-slate-400 font-medium">
                No pending requests at the moment.
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map(req => {
                  const student = students.find(s => s.id === req.studentId);
                  return (
                    <div key={req.id} className="glass-card p-5 border-l-4 border-l-indigo-400">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-slate-200">{student?.name || "Student"}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{student?.course}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded text-xs font-bold border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-sm mb-4 text-slate-700 dark:text-slate-300">
                        <p><span className="font-semibold text-slate-500 dark:text-slate-400">Subject:</span> {req.subject}</p>
                        <p><span className="font-semibold text-slate-500 dark:text-slate-400">Requested Slot:</span> {req.date} at {req.time}</p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateMentorRequest(req.id, "confirmed")}
                          className="flex-1 bg-indigo-600 text-white rounded-xl py-2 text-sm font-bold hover:bg-indigo-700 transition"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => updateMentorRequest(req.id, "suggest_alternate", "Tomorrow 10:00 AM")}
                          className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl py-2 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                        >
                          Suggest Alternate
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Col: Student Risk */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Students Requiring Attention
            </h2>

            <div className="space-y-4">
              {studentsAtRisk.map(student => (
                <div key={student.id} className="glass-card p-5 border border-rose-100 dark:border-rose-900/50 bg-gradient-to-br from-white/70 dark:from-slate-800/70 to-rose-50/30 dark:to-rose-900/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200">{student.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{student.course} • {student.year}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
                      <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Attendance</p>
                      <p className={`font-bold ${student.attendancePercent < 75 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {student.attendancePercent}%
                      </p>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
                      <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Quiz Avg</p>
                      <p className={`font-bold ${student.quizAverage < 60 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {student.quizAverage}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-xs font-semibold text-rose-700 dark:text-rose-400">
                    Weak Topics: {student.weakTopics.join(", ")}
                  </div>

                  <button className="mt-4 w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl py-2 text-sm font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
                    <MessageSquare className="w-4 h-4" />
                    Message Intervention
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
