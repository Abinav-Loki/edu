import { useState } from "react";
import {
  X,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  Save,
  Trash2,
  Filter,
} from "lucide-react";
import { StudentInterventionItem } from "../../intelligence/types";
import {
  getStoredInterventions,
  saveStoredInterventions,
  getStudentList,
} from "../../intelligence/analyticsService";
import {
  saveInterventionToDB,
  updateInterventionInDB,
  deleteInterventionInDB,
} from "../../services/supabaseService";

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStudentId?: string | null;
  onInterventionsChanged?: () => void;
}

const CATEGORIES = [
  "Academic Mentoring",
  "Attendance Counselling",
  "Assignment Completion Support",
  "Aptitude Practice",
  "Coding Practice",
  "Mock Interview Prep",
] as const;

export default function InterventionModal({
  isOpen,
  onClose,
  preselectedStudentId,
  onInterventionsChanged,
}: InterventionModalProps) {
  const [interventions, setInterventions] = useState<StudentInterventionItem[]>(() =>
    getStoredInterventions()
  );
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const students = getStudentList();

  // Create Form State
  const [formStudentId, setFormStudentId] = useState<string>(preselectedStudentId || students[0]?.id || "s1");
  const [formCategory, setFormCategory] = useState<typeof CATEGORIES[number]>("Academic Mentoring");
  const [formSubject, setFormSubject] = useState<string>("");
  const [formPriority, setFormPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [formRecommendation, setFormRecommendation] = useState<string>("");
  const [formNotes, setFormNotes] = useState<string>("");
  const [formFaculty, setFormFaculty] = useState<string>("Prof. Rahul Kumar");
  const [formDueDate, setFormDueDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  // Edit / Outcome state
  const [editingOutcomeId, setEditingOutcomeId] = useState<string | null>(null);
  const [outcomeNotesInput, setOutcomeNotesInput] = useState<string>("");

  if (!isOpen) return null;

  const filteredInterventions = interventions.filter((item) => {
    if (preselectedStudentId && item.studentId !== preselectedStudentId) return false;
    if (statusFilter === "all") return true;
    return item.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const handleCreateIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudent = students.find((s) => s.id === formStudentId);
    const newId = `int_${Date.now()}`;

    const newItem: StudentInterventionItem = {
      id: newId,
      studentId: formStudentId,
      studentName: targetStudent?.name || "Student",
      category: formCategory,
      subject: formSubject || `${formCategory} Request`,
      priority: formPriority,
      recommendation: formRecommendation || `${formCategory} session scheduled`,
      notes: formNotes || "Scheduled via Faculty Analytics Hub",
      assignedFaculty: formFaculty,
      dueDate: formDueDate,
      status: "Open",
      createdAt: new Date().toISOString(),
    };

    const updated = [newItem, ...interventions];
    setInterventions(updated);
    saveStoredInterventions(updated);

    // Persist to Supabase if available
    saveInterventionToDB({
      ...newItem,
      createdAt: newItem.createdAt,
    }).catch(console.error);

    setSaveSuccessMsg("Intervention successfully created and persisted!");
    setTimeout(() => setSaveSuccessMsg(null), 3000);

    setIsCreating(false);
    setFormSubject("");
    setFormPriority("Medium");
    setFormRecommendation("");
    setFormNotes("");
    if (onInterventionsChanged) onInterventionsChanged();
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "Open" | "In Progress" | "Completed" | "Dismissed"
  ) => {
    const updated = interventions.map((item) =>
      item.id === id ? { ...item, status: newStatus, updatedAt: new Date().toISOString() } : item
    );
    setInterventions(updated);
    saveStoredInterventions(updated);

    updateInterventionInDB(id, { status: newStatus }).catch(console.error);
    if (onInterventionsChanged) onInterventionsChanged();
  };

  const handleSaveOutcome = async (id: string) => {
    const updated = interventions.map((item) =>
      item.id === id
        ? {
            ...item,
            outcomeNotes: outcomeNotesInput,
            status: "Completed" as const,
            updatedAt: new Date().toISOString(),
          }
        : item
    );
    setInterventions(updated);
    saveStoredInterventions(updated);

    updateInterventionInDB(id, {
      status: "Completed",
      outcomeNotes: outcomeNotesInput,
    }).catch(console.error);

    setEditingOutcomeId(null);
    setOutcomeNotesInput("");
    setSaveSuccessMsg("Intervention outcome recorded successfully!");
    setTimeout(() => setSaveSuccessMsg(null), 3000);
    if (onInterventionsChanged) onInterventionsChanged();
  };

  const handleDelete = async (id: string) => {
    const updated = interventions.filter((i) => i.id !== id);
    setInterventions(updated);
    saveStoredInterventions(updated);
    deleteInterventionInDB(id).catch(console.error);
    if (onInterventionsChanged) onInterventionsChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Student Intervention & Support Workflow
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Create, assign, track, and record outcomes for academic, attendance, and placement interventions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-200/60 dark:bg-slate-700/60 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FEEDBACK BANNER */}
        {saveSuccessMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* CONTROLS BAR */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses ({interventions.length})</option>
              <option value="open">Open Only</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            {isCreating ? "View Intervention List" : "New Support Action"}
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/30 dark:bg-slate-900/30">
          {isCreating ? (
            /* CREATE INTERVENTION FORM */
            <form onSubmit={handleCreateIntervention} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Create Student Support Intervention
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Select Student */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Select Target Student
                  </label>
                  <select
                    value={formStudentId}
                    onChange={(e) => setFormStudentId(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.id} — {s.course})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Intervention Category */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Intervention Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
                
                {/* Subject / Title */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Subject / Title
                  </label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    placeholder="Brief subject of the support action"
                    required
                  />
                </div>

                {/* Assigned Faculty */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Assigned Faculty / Mentor
                  </label>
                  <input
                    type="text"
                    value={formFaculty}
                    onChange={(e) => setFormFaculty(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    placeholder="e.g. Prof. Rahul Kumar"
                    required
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
              </div>

              {/* Recommendation */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Prescribed Support Recommendation
                </label>
                <input
                  type="text"
                  value={formRecommendation}
                  onChange={(e) => setFormRecommendation(e.target.value)}
                  placeholder="e.g. 1-on-1 DBMS Query decomposition & remedial problem set"
                  className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  Context & Action Notes
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Add specific observations, discussion points, or triggers..."
                  rows={3}
                  className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-500/20"
                >
                  Save & Assign Support Action
                </button>
              </div>
            </form>
          ) : (
            /* LIST OF INTERVENTIONS */
            <div className="space-y-4">
              {filteredInterventions.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    No interventions found for selected filter
                  </p>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    Create First Action
                  </button>
                </div>
              ) : (
                filteredInterventions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          item.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : item.status === "In Progress"
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
                            : item.status === "Dismissed"
                            ? "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400"
                            : "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                        }`}>
                          {item.status}
                        </span>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                          {item.studentName}
                        </h4>
                        <span className="text-xs text-slate-400 font-mono">({item.studentId})</span>
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Update:</span>
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                          className="text-xs font-bold p-1 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Dismissed">Dismissed</option>
                        </select>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition"
                          title="Delete intervention"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                          {item.category}
                        </div>
                        <h5 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-2">
                          {item.subject || `${item.category} Request`}
                        </h5>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                          <span className="font-bold">Recommendation:</span> {item.recommendation}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 text-xs">
                        {item.priority && (
                          <span className={`px-2 py-0.5 rounded-md font-bold ${
                            item.priority === "High" ? "bg-rose-100 text-rose-700" :
                            item.priority === "Medium" ? "bg-amber-100 text-amber-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {item.priority} Priority
                          </span>
                        )}
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-600 dark:text-slate-300">Notes: </span>{item.notes}
                      </p>
                    )}

                    {/* Metadata & Outcome */}
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
                      <div className="flex items-center gap-4">
                        <span>Assigned: <strong className="text-slate-600 dark:text-slate-300">{item.assignedFaculty}</strong></span>
                        <span>Due: <strong className="text-slate-600 dark:text-slate-300">{item.dueDate}</strong></span>
                      </div>

                      {item.outcomeNotes ? (
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Outcome: {item.outcomeNotes}
                        </div>
                      ) : (
                        editingOutcomeId !== item.id && (
                          <button
                            onClick={() => {
                              setEditingOutcomeId(item.id);
                              setOutcomeNotesInput("");
                            }}
                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            + Record Outcome Notes
                          </button>
                        )
                      )}
                    </div>

                    {/* Inline Outcome Input Form */}
                    {editingOutcomeId === item.id && (
                      <div className="mt-2 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                          Record Intervention Outcome & Student Progress
                        </label>
                        <input
                          type="text"
                          value={outcomeNotesInput}
                          onChange={(e) => setOutcomeNotesInput(e.target.value)}
                          placeholder="e.g. Attended catch-up tutorial, quiz score improved from 49% to 70%"
                          className="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingOutcomeId(null)}
                            className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveOutcome(item.id)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                          >
                            Save Outcome & Mark Completed
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center">
          <div className="text-xs text-slate-400">
            Persistent Store: Supabase Connected (fallback to local session)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
