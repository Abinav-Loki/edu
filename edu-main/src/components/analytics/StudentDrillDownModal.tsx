import { useState } from "react";
import {
  X,
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  BookOpen,
} from "lucide-react";
import {
  calculateStudentSuccessScoreBreakdown,
  getExplainableRiskFlags,
  getStudentSegmentation,
  simulateWhatIfScenario,
  getStudentAnalyticsExplanation,
  getStudentIntelligence,
} from "../../intelligence/analyticsService";
import { SCORING_DISCLAIMER } from "../../intelligence/scoringConfig";
import GlassCard from "../GlassCard";

interface StudentDrillDownModalProps {
  studentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateIntervention?: (studentId: string) => void;
}

export default function StudentDrillDownModal({
  studentId,
  isOpen,
  onClose,
  onCreateIntervention,
}: StudentDrillDownModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "risks" | "whatif" | "explain">("overview");

  // What-If local state
  const [hypoAttendance, setHypoAttendance] = useState<number>(75);
  const [hypoQuiz, setHypoQuiz] = useState<number>(70);
  const [hypoPlacement, setHypoPlacement] = useState<number>(65);

  // AI Explain local state
  const [selectedQuestion, setSelectedQuestion] = useState<
    "why_academic_support" | "score_factors" | "improve_placement"
  >("score_factors");

  if (!isOpen || !studentId) return null;

  const intel = getStudentIntelligence(studentId);
  const breakdown = calculateStudentSuccessScoreBreakdown(studentId);
  const risks = getExplainableRiskFlags(studentId);
  const seg = getStudentSegmentation(studentId);

  const simulation = simulateWhatIfScenario(studentId, {
    attendance: hypoAttendance,
    quizAverage: hypoQuiz,
    placementScore: hypoPlacement,
  });

  const explanation = getStudentAnalyticsExplanation(studentId, selectedQuestion);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* MODAL HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/60 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
                {intel.profile.name}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${seg.badgeColor}`}
              >
                {seg.primarySegment}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              ID: <span className="font-mono font-semibold">{intel.studentId}</span> • {intel.profile.course} • {intel.profile.year} • {intel.profile.department}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-200/60 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 gap-6 bg-white dark:bg-slate-900 text-sm font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === "overview"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <TrendingUp className="w-4 h-4" /> 360° Score Overview
          </button>
          <button
            onClick={() => setActiveTab("risks")}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === "risks"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Risk Flags ({risks.length})
          </button>
          <button
            onClick={() => setActiveTab("whatif")}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === "whatif"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Sliders className="w-4 h-4" /> What-If Simulator
          </button>
          <button
            onClick={() => setActiveTab("explain")}
            className={`py-3 border-b-2 flex items-center gap-2 transition ${
              activeTab === "explain"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Sparkles className="w-4 h-4" /> AI Explainability
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/30 dark:bg-slate-900/30">
          
          {/* TAB 1: 360° OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Top Banner KPI Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Overall Score */}
                <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 dark:from-indigo-900/30 dark:to-slate-800/50 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Success Score
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
                        {breakdown.overallScore !== null ? `${breakdown.overallScore}%` : "N/A"}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Weighted Index</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                {/* Data Coverage Indicator */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Data Coverage
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      breakdown.dataCoveragePercent === 100
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                    }`}>
                      {breakdown.dataCoveragePercent}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${breakdown.dataCoveragePercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 font-medium truncate">
                      {breakdown.statusLabel}
                    </p>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Evaluated Risk
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xl font-black ${
                          intel.riskLevel === "CRITICAL"
                            ? "text-rose-600 dark:text-rose-400"
                            : intel.riskLevel === "HIGH"
                            ? "text-orange-600 dark:text-orange-400"
                            : intel.riskLevel === "MEDIUM"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {intel.riskLevel}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        ({risks.length} active flag{risks.length === 1 ? "" : "s"})
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                    intel.riskLevel === "CRITICAL" || intel.riskLevel === "HIGH"
                      ? "bg-rose-100 dark:bg-rose-900/40 text-rose-600"
                      : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600"
                  }`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Six Normalized Category Breakdown Bars */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    6-Category Normalized Evaluation
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    Applicable Weights Total: {breakdown.applicableWeightsTotal}%
                  </span>
                </div>

                <div className="space-y-4">
                  {Object.values(breakdown.categoryScores).map((cat) => {
                    const isMissing = !cat.hasValidData;
                    const score = cat.score ?? 0;
                    return (
                      <div key={cat.category} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700 dark:text-slate-200">
                              {cat.label}
                            </span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-full font-medium">
                              Configured: {cat.configuredWeight}% • Effective: {cat.reNormalizedWeight}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            {isMissing ? (
                              <span className="text-slate-400 italic text-[11px]">No data (Excluded)</span>
                            ) : (
                              <span className={`font-bold ${
                                score >= 75 ? "text-emerald-600" : score >= 60 ? "text-indigo-600" : "text-rose-600"
                              }`}>
                                {score}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
                          {isMissing ? (
                            <div className="h-full bg-slate-300 dark:bg-slate-600 w-full opacity-30 border-dashed" />
                          ) : (
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                score >= 75
                                  ? "bg-emerald-500"
                                  : score >= 60
                                  ? "bg-indigo-500"
                                  : "bg-rose-500"
                              }`}
                              style={{ width: `${Math.max(4, score)}%` }}
                            />
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                          {cat.supportingMetric}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanations & Transparent Disclaimers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Positive Score Drivers
                  </h4>
                  {breakdown.explanation.positiveDrivers.length > 0 ? (
                    <ul className="text-xs text-emerald-700 dark:text-emerald-300 space-y-1">
                      {breakdown.explanation.positiveDrivers.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No category &ge; 75% at present.</p>
                  )}
                </div>

                <div className="bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/40">
                  <h4 className="text-xs font-bold text-rose-800 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Attention Areas
                  </h4>
                  {breakdown.explanation.attentionAreas.length > 0 ? (
                    <ul className="text-xs text-rose-700 dark:text-rose-300 space-y-1">
                      {breakdown.explanation.attentionAreas.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-600 font-medium">All recorded categories exceed 60%.</p>
                  )}
                </div>
              </div>

              {/* Disclaimer footer */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Methodology Note: </span>
                {SCORING_DISCLAIMER}
              </div>
            </div>
          )}

          {/* TAB 2: EXPLAINABLE RISKS */}
          {activeTab === "risks" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Rule-Based Risk Warnings ({risks.length})
                </h3>
                <span className="text-xs text-slate-400">
                  Triggered against college policy thresholds
                </span>
              </div>

              {risks.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-500">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 dark:text-slate-200">No active risk flags detected</p>
                  <p className="text-xs text-slate-400 mt-1">Student metrics adhere to academic, attendance, and placement standards.</p>
                </div>
              ) : (
                risks.map((risk) => (
                  <div
                    key={risk.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          risk.severity === "High"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                            : risk.severity === "Medium"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        }`}>
                          {risk.severity} Severity
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {risk.category} Risk
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Rule-Based Warning
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                        {risk.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {risk.reason}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl text-xs space-y-1 border border-slate-100 dark:border-slate-800">
                      <p><span className="font-bold text-slate-500 dark:text-slate-400">Supporting Evidence: </span>{risk.supportingData}</p>
                      <p><span className="font-bold text-slate-500 dark:text-slate-400">Cycle / Dates: </span>{risk.relevantDates}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                        Action: {risk.recommendedAction}
                      </div>
                      {onCreateIntervention && (
                        <button
                          onClick={() => onCreateIntervention(studentId)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
                        >
                          Launch Intervention
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: WHAT-IF SCENARIO SIMULATOR */}
          {activeTab === "whatif" && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
                <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm mb-1 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  Interactive Scenario Projection
                </h3>
                <p className="text-xs text-indigo-700/80 dark:text-indigo-400 leading-relaxed">
                  Adjust hypothetical student performance variables below. The scoring engine recalculates the estimated Student Success Score in real time using the unified formula.
                </p>
              </div>

              {/* Sliders */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-5">
                {/* Attendance Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-700 dark:text-slate-200">Hypothetical Attendance</span>
                    <span className="text-indigo-600 font-mono">{hypoAttendance}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={hypoAttendance}
                    onChange={(e) => setHypoAttendance(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>40% (Debarred)</span>
                    <span>75% (Min Threshold)</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Academic Quiz Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-700 dark:text-slate-200">Hypothetical Quiz & Exam Average</span>
                    <span className="text-indigo-600 font-mono">{hypoQuiz}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={hypoQuiz}
                    onChange={(e) => setHypoQuiz(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>30%</span>
                    <span>60% (Passing)</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Placement Readiness Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-700 dark:text-slate-200">Hypothetical Placement Assessment Index</span>
                    <span className="text-indigo-600 font-mono">{hypoPlacement}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={hypoPlacement}
                    onChange={(e) => setHypoPlacement(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>20%</span>
                    <span>60% (Ready Target)</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Simulation Result Comparison */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Baseline Score</span>
                  <div className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">
                    {simulation.baselineScore}%
                  </div>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                  <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">Simulated Score</span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-300 mt-1">
                    {simulation.simulatedScore}%
                  </div>
                </div>
                <div className={`p-4 rounded-2xl border ${
                  simulation.scoreDelta >= 0
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-600"
                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600"
                }`}>
                  <span className="text-[10px] font-bold uppercase">Estimated Impact</span>
                  <div className="text-2xl font-black mt-1">
                    {simulation.scoreDelta >= 0 ? `+${simulation.scoreDelta}` : simulation.scoreDelta} pts
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                <span className="font-semibold">Notice: </span>
                {simulation.disclaimer}
              </div>
            </div>
          )}

          {/* TAB 4: AI EXPLAINABILITY */}
          {activeTab === "explain" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Select Grounded Analytics Inquiry
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedQuestion("score_factors")}
                    className={`p-3 rounded-xl text-xs font-bold border text-left transition ${
                      selectedQuestion === "score_factors"
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    Score Factor Drivers
                  </button>
                  <button
                    onClick={() => setSelectedQuestion("why_academic_support")}
                    className={`p-3 rounded-xl text-xs font-bold border text-left transition ${
                      selectedQuestion === "why_academic_support"
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    Academic Support Need
                  </button>
                  <button
                    onClick={() => setSelectedQuestion("improve_placement")}
                    className={`p-3 rounded-xl text-xs font-bold border text-left transition ${
                      selectedQuestion === "improve_placement"
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    Placement Enhancement
                  </button>
                </div>
              </div>

              {/* Grounded Explanation Output */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                  <Sparkles className="w-5 h-5" />
                  <span>{explanation.question}</span>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {explanation.summary}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Supporting Analytics Data
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(explanation.groundedMetrics).map(([key, val]) => (
                      <div
                        key={key}
                        className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800"
                      >
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">{key}</span>
                        <span className="text-sm font-black text-slate-800 dark:text-slate-100">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50/70 dark:bg-indigo-950/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                  <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 block mb-1">
                    System-Recommended Action:
                  </span>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400">
                    {explanation.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
          <div className="text-xs text-slate-400 font-medium">
            Student Analytics Profile • CampusOS AI Layer
          </div>
          <div className="flex gap-2">
            {onCreateIntervention && (
              <button
                onClick={() => onCreateIntervention(studentId)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-500/20"
              >
                + Create Intervention Action
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
