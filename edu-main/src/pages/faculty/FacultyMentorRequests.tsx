import { useState } from "react";
import { useCampus } from "../../context/CampusContext";
import PageHeader from "../../components/PageHeader";
import MobileHeader from "../../components/MobileHeader";
import GlassCard from "../../components/GlassCard";
import { Clock, CheckCircle2, XCircle, Calendar, User } from "lucide-react";

export default function FacultyMentorRequests() {
  const { currentUser, mentorRequests, updateMentorRequest, students } = useCampus();
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const myRequests = mentorRequests.filter(req => req.mentorId === currentUser?.id);
  const pendingRequests = myRequests.filter(r => r.status === "pending" || r.status === "suggest_alternate");
  const historyRequests = myRequests.filter(r => r.status === "confirmed" || r.status === "rejected" || r.status === "completed" || r.status === "cancelled");

  const displayRequests = activeTab === "pending" ? pendingRequests : historyRequests;

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-5xl mx-auto">
        <PageHeader title="Mentor Requests" subtitle="Manage incoming mentoring session requests from students" />

        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-px">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'pending' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Action Needed ({pendingRequests.length})
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'history' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            History
          </button>
        </div>

        <div className="space-y-4">
          {displayRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No {activeTab} mentor requests found.
            </div>
          ) : (
            displayRequests.map(req => {
              const student = students.find(s => s.id === req.studentId);
              return (
                <GlassCard key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                          {student?.name || "Unknown Student"}
                        </h3>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          {student?.course} • ID: {student?.id}
                        </p>
                        
                        <div className="mt-3 space-y-1">
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            <span className="font-semibold text-slate-500">Subject:</span> {req.subject}
                          </p>
                          <div className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 font-bold">
                            <Calendar className="w-4 h-4" /> 
                            {req.date} at {req.time}
                          </div>
                        </div>

                        {req.status === "suggest_alternate" && req.proposedTime && (
                          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm border border-amber-200 dark:border-amber-900/50">
                            <span className="font-bold">You suggested an alternate time:</span> {req.proposedDate} at {req.proposedTime}. Waiting for student confirmation.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
                    {activeTab === "pending" && req.status !== "suggest_alternate" && (
                      <>
                        <button 
                          onClick={() => updateMentorRequest(req.id, "confirmed")}
                          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Accept
                        </button>
                        <button 
                          onClick={() => {
                            const newTime = prompt("Suggest a new time (e.g. 10:00 AM):", req.time);
                            if (newTime) {
                              updateMentorRequest(req.id, "suggest_alternate", newTime, req.date);
                            }
                          }}
                          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                        >
                          <Clock className="w-4 h-4" /> Suggest Alternate
                        </button>
                        <button 
                          onClick={() => updateMentorRequest(req.id, "rejected")}
                          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                        >
                          <XCircle className="w-4 h-4" /> Decline
                        </button>
                      </>
                    )}

                    {activeTab === "history" && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold capitalize">
                        {req.status === 'confirmed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {req.status === 'rejected' && <XCircle className="w-4 h-4 text-rose-500" />}
                        {req.status}
                      </div>
                    )}
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
