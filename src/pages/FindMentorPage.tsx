import { useState } from "react";
import { Search, UserCheck, Clock, MapPin, CheckCircle2, Calendar, X, BookOpen } from "lucide-react";
import { useCampus } from "../context/CampusContext";
import { useLearning } from "../context/LearningContext";
import { calculateMentorMatch } from "../engines/mentorMatching";
import PageHeader from "../components/PageHeader";
import MobileHeader from "../components/MobileHeader";

export default function FindMentorPage() {
  const { mentors, addMentorRequest, currentUser, mentorAvailability, facultySchedules } = useCampus();
  const { awardXP } = useLearning();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<"idle" | "pending" | "success">("idle");

  // Filter mentors by name, department, or specialization keyword
  const filteredMentors = mentors.filter((m) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const nameMatch = m.name.toLowerCase().includes(query);
    const deptMatch = m.department?.toLowerCase().includes(query);
    const specMatch = m.specialization?.some((s) => s.toLowerCase().includes(query));
    return nameMatch || deptMatch || specMatch;
  });

  // Calculate smart match scores if query is typed
  const matches = filteredMentors.map((m) => {
    if (searchQuery.trim().length >= 2) {
      const matchResults = calculateMentorMatch([m], searchQuery);
      if (matchResults.length > 0 && matchResults[0].score > 0) {
        return matchResults[0];
      }
    }
    return { mentor: m, score: 0, reason: "Available for mentoring" };
  });

  function handleRequest(mentorId: string, day: string, time: string) {
    if (!currentUser || currentUser.role !== "student") return;
    
    setRequestStatus("pending");
    setTimeout(() => {
      addMentorRequest({
        studentId: currentUser.id,
        mentorId,
        subject: searchQuery.trim() || "General Mentoring",
        date: day,
        time
      });
      if (typeof awardXP === "function") {
        awardXP(120, "Mentor Session Booked", "mentor");
      }
      setRequestStatus("success");
      setSelectedMentor(null);
    }, 1000);
  }

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-4xl mx-auto">
        <PageHeader
          title="Find a Mentor"
          subtitle="Search & book 1:1 sessions with campus faculty"
          badge="Smart Match"
        />

        {/* Mentor Search Bar */}
        <div className="glass-card mb-6 p-2 rounded-2xl border border-indigo-100/80 shadow-sm">
          <div className="flex items-center gap-3 relative">
            <Search className="w-5 h-5 text-indigo-500 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search mentors by name, department, or subject (e.g. Rahul, DBMS, Algorithms)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setRequestStatus("idle");
              }}
              className="w-full pl-12 pr-10 py-3 bg-white/80 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
              aria-label="Search mentors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {requestStatus === "success" && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold">Mentor request sent successfully! Faculty will review it shortly.</span>
          </div>
        )}

        <div className="space-y-4">
          {matches.map(({ mentor, score, reason }) => {
            const mAvailability = mentorAvailability.filter(a => a.facultyId === mentor.id);
            const mSchedules = facultySchedules.filter(s => s.facultyId === mentor.id);
            const derivedLocation = mSchedules.length > 0 ? `${mSchedules[0].building} / ${mSchedules[0].room}` : mentor.currentLocation;

            return (
              <div key={mentor.id} className="glass-card p-5 border border-white/80 hover:shadow-md transition">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{mentor.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{mentor.department}</p>
                    
                    {/* Specialization tags */}
                    {mentor.specialization && mentor.specialization.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0 mr-0.5" />
                        {mentor.specialization.map((spec, i) => (
                          <span 
                            key={i} 
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                              searchQuery && spec.toLowerCase().includes(searchQuery.toLowerCase().trim())
                                ? "bg-indigo-100 text-indigo-800 border-indigo-300 font-bold"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    {score > 0 && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <span>{score}% Match</span>
                        <span className="text-emerald-300">•</span>
                        <span className="font-medium">{reason}</span>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <span>{mAvailability.length > 0 ? `${mAvailability.length} slots available` : "Contact to schedule"}</span>
                      </div>
                      {derivedLocation && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-rose-400" />
                          <span>{derivedLocation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <button
                      onClick={() => setSelectedMentor(mentor.id)}
                      className="btn-primary whitespace-nowrap"
                    >
                      <UserCheck className="w-4 h-4" />
                      Request Session
                    </button>
                  </div>
                </div>

                {/* Booking panel */}
                {selectedMentor === mentor.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-[fadeIn_0.2s_ease-out]">
                    <p className="text-sm font-bold text-slate-700 mb-2">Select a time for {searchQuery || "General Mentoring"}:</p>
                    {mAvailability.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {mAvailability.map(slot => (
                          <button
                            key={slot.id}
                            onClick={() => handleRequest(mentor.id, slot.day, slot.startTime)}
                            disabled={requestStatus === "pending"}
                            className="px-4 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-sm font-semibold hover:bg-indigo-50 hover:border-indigo-300 transition-all disabled:opacity-50 flex items-center gap-2"
                          >
                            <Calendar className="w-4 h-4" />
                            {slot.day}, {slot.startTime}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">No pre-defined availability. Request a custom time instead.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {matches.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No mentors found for this subject.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
