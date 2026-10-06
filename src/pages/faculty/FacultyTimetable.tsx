import { useState } from "react";
import { useCampus } from "../../context/CampusContext";
import PageHeader from "../../components/PageHeader";
import MobileHeader from "../../components/MobileHeader";
import GlassCard from "../../components/GlassCard";
import { Upload, FileText, CheckCircle2, Clock } from "lucide-react";

export default function FacultyTimetable() {
  const { currentUser, facultySchedules } = useCampus();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const mySchedules = facultySchedules.filter(s => s.facultyId === currentUser?.id);

  // Group by day for simple display
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      // Simulate file parsing and saving
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }, 1500);
    }
  }

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-5xl mx-auto">
        <PageHeader title="My Timetable" subtitle="Manage your weekly class and lab schedule" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {days.map(day => {
              const daySchedules = mySchedules.filter(s => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
              if (daySchedules.length === 0) return null;

              return (
                <GlassCard key={day} className="p-5">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">{day}</h3>
                  <div className="space-y-3">
                    {daySchedules.map(sched => (
                      <div key={sched.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 transition-colors">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold shrink-0 w-32">
                          <Clock className="w-4 h-4" />
                          <span>{sched.startTime} - {sched.endTime}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 dark:text-slate-200">{sched.subject}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {sched.room} • {sched.building} 
                            <span className="ml-2 inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {sched.activityType}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              );
            })}
          </div>

          <div className="space-y-6">
            <GlassCard className="p-5">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Upload Timetable</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Upload your official timetable (PDF/Excel) to automatically populate your schedule and availability.
              </p>
              
              <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${uploadSuccess ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 bg-white dark:bg-slate-800'}`}>
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <span className="text-sm font-bold text-indigo-600">Parsing...</span>
                  </div>
                ) : uploadSuccess ? (
                  <div className="flex flex-col items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-8 h-8" />
                    <span className="text-sm font-bold">Timetable Updated!</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-indigo-400 mb-2" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to upload</span>
                    <span className="text-xs text-slate-400 mt-1">.pdf, .xlsx, .csv</span>
                    <input type="file" className="hidden" accept=".pdf,.xlsx,.csv" onChange={handleUpload} />
                  </>
                )}
              </label>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}
