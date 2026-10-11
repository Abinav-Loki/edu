import { useState, useEffect } from "react";
import { X, Calendar, AlertTriangle, CheckCircle, TrendingUp, HelpCircle, MessageSquare, Send, Check, Activity } from "lucide-react";
import { getStudentIntelligence, calculateStudentSuccessScoreBreakdown, getExplainableRiskFlags } from "../../intelligence/analyticsService";
import { getStoredInterventions } from "../../intelligence/analyticsService";

interface StudentDetailDrawerProps {
  studentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSupport: (studentId: string) => void;
  onOpen360: (studentId: string) => void;
  defaultTab?: 'overview' | 'message';
}

export default function StudentDetailDrawer({
  studentId,
  isOpen,
  onClose,
  onSupport,
  onOpen360,
  defaultTab = 'overview'
}: StudentDetailDrawerProps) {
  if (!isOpen || !studentId) return null;

  const intel = getStudentIntelligence(studentId);
  const breakdown = calculateStudentSuccessScoreBreakdown(studentId);
  const risks = getExplainableRiskFlags(studentId);
  const interventions = getStoredInterventions().filter(i => i.studentId === studentId);

  const acad = intel.academicMetrics;
  
  const [activeTab, setActiveTab] = useState<'overview' | 'message'>(defaultTab);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Update tab when defaultTab changes (e.g. opened from 3-dot menu)
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, isOpen]);
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setIsSending(true);
    // Simulate sending message
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      setMessageText("");
      setTimeout(() => {
        setSendSuccess(false);
        setActiveTab('overview');
      }, 2000);
    }, 800);
  };
  
  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:max-w-4xl lg:max-w-5xl bg-white dark:bg-slate-900 shadow-2xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{intel.profile.name}</h2>
            <p className="text-sm text-slate-500">{intel.studentId} • {intel.profile.course} • {intel.profile.year}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {activeTab === 'overview' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-6">
                {/* Overview */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Student Overview</h3>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Success Score</p>
                      <p className="text-lg font-bold text-indigo-600">{breakdown.overallScore !== null ? `${breakdown.overallScore}%` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Current Status</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate" title={breakdown.statusLabel}>{breakdown.statusLabel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Department</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{intel.profile.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Data Coverage</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{breakdown.dataCoveragePercent}%</p>
                    </div>
                  </div>
                </div>

                {/* Academic Performance */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Academic Performance</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-300">Attendance</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{acad?.attendancePercent ?? 'N/A'}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${(acad?.attendancePercent || 0) < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${acad?.attendancePercent || 0}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-300">Quiz Average</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{acad?.quizAverage ?? 'N/A'}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${(acad?.quizAverage || 0) < 60 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${acad?.quizAverage || 0}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-300">Internal Assignment Avg</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{acad?.assignmentAverage ?? 'N/A'}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${(acad?.assignmentAverage || 0) < 60 ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${acad?.assignmentAverage || 0}%` }} />
                      </div>
                    </div>
                    {intel.trends?.overallDirection && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-500">Historical Trend: <span className="font-semibold capitalize">{intel.trends.overallDirection}</span></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Academic Risk */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Academic Risk & Flags</h3>
                  {risks.length > 0 ? (
                    <div className="space-y-3">
                      {risks.map((risk, i) => (
                        <div key={i} className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 p-3 rounded-xl">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400">{risk.title}</h4>
                              <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{risk.reason}</p>
                              <p className="text-[11px] font-semibold text-rose-500 mt-2">Action: {risk.recommendedAction}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-semibold">No active risk flags</span>
                    </div>
                  )}
                  {breakdown.dataCoveragePercent < 100 && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
                      <HelpCircle className="w-4 h-4" />
                      <span>Missing data for {breakdown.totalCategoriesCount - breakdown.validCategoriesCount} categories.</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Support and Mentoring */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Support & Interventions</h3>
                  {interventions.length > 0 ? (
                    <div className="space-y-3">
                      {interventions.map((inv) => (
                        <div key={inv.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{inv.category}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              inv.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                              inv.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>{inv.status}</span>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{inv.recommendation}</p>
                          <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>Due: {inv.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No active support tickets or interventions.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                Message {intel.profile.name.split(' ')[0]}
              </h3>
              
              <div className="flex-1">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Write your message to ${intel.profile.name.split(' ')[0]} here...`}
                  className="w-full h-48 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none text-sm text-slate-700 dark:text-slate-200"
                  disabled={isSending || sendSuccess}
                />
              </div>

              {sendSuccess ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-bold text-sm">Message sent successfully!</span>
                </div>
              ) : (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    disabled={isSending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || isSending}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-bold text-sm rounded-lg transition"
                  >
                    {isSending ? (
                      <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Sending...</span>
                    ) : (
                      <><Send className="w-4 h-4" /> Send</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        {activeTab === 'overview' && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-end gap-3">
            <button 
              onClick={() => onOpen360(studentId)}
              className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4 text-indigo-500" /> Student 360° Profile
            </button>
            <button 
              onClick={() => setActiveTab('message')}
              className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-indigo-500" /> Send Message
            </button>
            <button 
              onClick={() => onSupport(studentId)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition flex items-center justify-center"
            >
              View Intervention List
            </button>
          </div>
        )}
      </div>
    </>
  );
}
