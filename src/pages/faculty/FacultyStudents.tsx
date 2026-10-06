import { useState } from "react";
import { useCampus } from "../../context/CampusContext";
import PageHeader from "../../components/PageHeader";
import MobileHeader from "../../components/MobileHeader";
import GlassCard from "../../components/GlassCard";
import { Search, Filter, AlertTriangle, TrendingUp, ChevronRight } from "lucide-react";

export default function FacultyStudents() {
  const { students } = useCampus();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState(false);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isAtRisk = s.quizAverage < 60 || s.attendancePercent < 75;
    
    if (filterRisk && !isAtRisk) return false;
    return matchesSearch;
  });

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-6xl mx-auto">
        <PageHeader title="My Students" subtitle="Monitor performance and identify at-risk students" />

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            />
          </div>
          <button 
            onClick={() => setFilterRisk(!filterRisk)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${filterRisk ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800' : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}
          >
            <Filter className="w-4 h-4" />
            At Risk Only
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map(student => {
            const isAtRisk = student.quizAverage < 60 || student.attendancePercent < 75;
            
            return (
              <GlassCard key={student.id} className={`p-5 transition-transform hover:-translate-y-1 hover:shadow-lg ${isAtRisk ? 'border-l-4 border-l-rose-500' : 'border-l-4 border-l-emerald-500'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{student.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ID: {student.id} • {student.year}</p>
                  </div>
                  {isAtRisk ? (
                    <div className="p-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-lg">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span className="text-slate-500 dark:text-slate-400">Attendance</span>
                      <span className={student.attendancePercent < 75 ? "text-rose-600" : "text-emerald-600"}>{student.attendancePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${student.attendancePercent < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${student.attendancePercent}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span className="text-slate-500 dark:text-slate-400">Quiz Average</span>
                      <span className={student.quizAverage < 60 ? "text-rose-600" : "text-indigo-600"}>{student.quizAverage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${student.quizAverage < 60 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${student.quizAverage}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="text-xs text-slate-500 font-medium">
                    {student.weakTopics.length > 0 ? (
                      <span className="text-rose-500 font-semibold">Weak in: {student.weakTopics[0]}</span>
                    ) : (
                      <span className="text-emerald-500 font-semibold">On Track</span>
                    )}
                  </div>
                  <button className="text-indigo-600 font-semibold text-xs flex items-center hover:text-indigo-700">
                    View Details <ChevronRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-slate-500 font-medium">
            No students found matching the criteria.
          </div>
        )}
      </div>
    </>
  );
}
