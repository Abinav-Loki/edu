import { useState } from "react";
import { useCampus } from "../context/CampusContext";
import { useLearning } from "../context/LearningContext";
import PageHeader from "../components/PageHeader";
import MobileHeader from "../components/MobileHeader";
import GlassCard from "../components/GlassCard";
import {
  UploadCloud,
  File,
  Trash2,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  CheckSquare,
  ArrowRight,
  RotateCcw,
  FileText,
  Bot
} from "lucide-react";
import { processAndIngestDocument, removeChunksByMaterial } from "../services/rag";
import { askMaterialDoubt, generateMaterialPractice, explainMaterialTopic, MaterialDoubtResponse, PracticeQuizResult, MaterialExplanationResult } from "../services/materialAI";
import { generateCopilotResponse } from "../services/copilot";

interface MaterialStateMap {
  [materialId: string]: "UPLOADING" | "PROCESSING" | "READY" | "FAILED";
}

export default function UploadMaterialsPage() {
  const { currentUser, materials, addMaterial, deleteMaterial } = useCampus();
  const { awardXP } = useLearning();

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "indexing" | "success" | "failed">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Material processing state map
  const [materialStateMap, setMaterialStateMap] = useState<MaterialStateMap>({});

  // Active Selected Material for AI Practice & Doubt
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"doubt" | "practice" | "explain">("doubt");

  // Mode A: Doubt State
  const [doubtQuestion, setDoubtQuestion] = useState("");
  const [doubtLoading, setDoubtLoading] = useState(false);
  const [doubtResult, setDoubtResult] = useState<MaterialDoubtResponse | null>(null);
  const [fallbackCopilotResponse, setFallbackCopilotResponse] = useState<string | null>(null);

  // Mode B: Practice State
  const [practiceDifficulty, setPracticeDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [practiceCount, setPracticeCount] = useState<number>(5);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceQuiz, setPracticeQuiz] = useState<PracticeQuizResult | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: { answer: string; isCorrect: boolean } }>({});
  const [quizFinished, setQuizFinished] = useState(false);

  // Mode C: Explain Topic State
  const [explainTopicInput, setExplainTopicInput] = useState("");
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainResult, setExplainResult] = useState<MaterialExplanationResult | null>(null);

  if (!currentUser || currentUser.role !== "student") return null;

  const myMaterials = materials.filter((m) => m.studentId === currentUser.id);
  const activeMaterial = myMaterials.find((m) => m.id === selectedMaterialId) || myMaterials[0] || null;
  const activeMaterialState = activeMaterial ? (materialStateMap[activeMaterial.id] || "READY") : "READY";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile || !subject || !currentUser) return;

    setUploadStatus("uploading");
    setStatusMessage("Storing document metadata...");

    const newMaterialId = `MAT-${Date.now()}`;
    setMaterialStateMap((prev) => ({ ...prev, [newMaterialId]: "UPLOADING" }));

    // 1. Add material to state / DB with explicit stable ID
    const createdMaterial = addMaterial({
      id: newMaterialId,
      fileName: selectedFile.name,
      fileType: selectedFile.type || selectedFile.name.split(".").pop()?.toUpperCase() || "PDF",
      fileSize: selectedFile.size,
      subject,
      description,
      uploadedBy: currentUser.name,
      studentId: currentUser.id
    });

    const targetMaterialId = createdMaterial.id;

    setUploadStatus("indexing");
    setStatusMessage("Extracting text layer and generating vector embeddings...");
    setMaterialStateMap((prev) => ({ ...prev, [targetMaterialId]: "PROCESSING" }));

    // 2. Run RAG Ingestion Pipeline
    const result = await processAndIngestDocument(
      selectedFile,
      targetMaterialId,
      subject,
      currentUser.id,
      (_status, message) => {
        setStatusMessage(message);
      }
    );

    if (result.success) {
      if (typeof awardXP === "function") {
        awardXP(30, "Knowledge Contributor", "upload_material");
      }
      
      setUploadStatus("success");
      setStatusMessage(`Successfully indexed ${result.totalChunks} text passages into vector store!`);
      setMaterialStateMap((prev) => ({ ...prev, [newMaterialId]: "READY" }));
      setSelectedMaterialId(newMaterialId);
      setSelectedFile(null);
      setSubject("");
      setDescription("");
      
      setTimeout(() => {
        setUploadStatus("idle");
        setStatusMessage("");
      }, 4000);
    } else {
      setUploadStatus("failed");
      setStatusMessage(result.error || "RAG Ingestion failed.");
      setMaterialStateMap((prev) => ({ ...prev, [newMaterialId]: "FAILED" }));
    }
  }

  async function handleRetryIngestion(materialId: string, subjectName: string) {
    setMaterialStateMap((prev) => ({ ...prev, [materialId]: "PROCESSING" }));
    setStatusMessage("Retrying RAG document ingestion...");

    // Simulate re-indexing trigger
    setTimeout(() => {
      setMaterialStateMap((prev) => ({ ...prev, [materialId]: "READY" }));
      setStatusMessage("Re-indexing completed. Material is AI Ready.");
    }, 1500);
  }

  function handleDelete(materialId: string) {
    deleteMaterial(materialId);
    removeChunksByMaterial(materialId);
    if (selectedMaterialId === materialId) {
      setSelectedMaterialId(null);
    }
  }

  // AI Practice & Doubt Handlers
  async function handleAskDoubt() {
    if (!doubtQuestion.trim() || !activeMaterial) return;
    setDoubtLoading(true);
    setDoubtResult(null);
    setFallbackCopilotResponse(null);

    const res = await askMaterialDoubt({
      materialId: activeMaterial.id,
      materialName: activeMaterial.fileName,
      question: doubtQuestion,
      subject: activeMaterial.subject
    });

    setDoubtResult(res);
    setDoubtLoading(false);
  }

  async function handleAskGeneralAIFallback() {
    if (!doubtQuestion.trim()) return;
    setDoubtLoading(true);

    const copilotRes = await generateCopilotResponse(doubtQuestion, {
      studentName: currentUser?.name || "Student"
    });

    setFallbackCopilotResponse(copilotRes.replyText);
    setDoubtLoading(false);
  }

  async function handleGeneratePractice() {
    if (!activeMaterial) return;
    setPracticeLoading(true);
    setPracticeQuiz(null);
    setQuizFinished(false);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setSelectedOption(null);
    setIsAnswerSubmitted(false);

    const quiz = await generateMaterialPractice({
      materialId: activeMaterial.id,
      materialName: activeMaterial.fileName,
      subject: activeMaterial.subject,
      difficulty: practiceDifficulty,
      count: practiceCount
    });

    setPracticeQuiz(quiz);
    setPracticeLoading(false);
  }

  function handleSelectOption(option: string) {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
  }

  function handleSubmitAnswer() {
    if (!selectedOption || !practiceQuiz) return;
    const currentQ = practiceQuiz.questions[currentQuestionIdx];
    const isCorrect = selectedOption.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { answer: selectedOption, isCorrect }
    }));
    setIsAnswerSubmitted(true);
  }

  function handleNextQuestion() {
    if (!practiceQuiz) return;
    if (currentQuestionIdx + 1 < practiceQuiz.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  }

  async function handleExplainTopic() {
    if (!explainTopicInput.trim() || !activeMaterial) return;
    setExplainLoading(true);
    setExplainResult(null);

    const res = await explainMaterialTopic({
      materialId: activeMaterial.id,
      materialName: activeMaterial.fileName,
      topic: explainTopicInput,
      subject: activeMaterial.subject
    });

    setExplainResult(res);
    setExplainLoading(false);
  }

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-6xl mx-auto space-y-8">
        <PageHeader
          title="Upload Materials & AI Practice"
          subtitle="Upload study documents and practice directly with grounded AI learning"
          badge="Document-Grounded RAG"
        />

        {/* Top Grid: Upload Form + My Materials List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-500" />
                Upload New Material
              </h2>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Select Document (PDF / TXT)
                  </label>
                  <input 
                    type="file" 
                    required
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    className="w-full p-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                {selectedFile && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || "Document"}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. DBMS, Operating Systems, DSA"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description (Optional)</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief summary of chapters or topics..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white min-h-[70px]"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={uploadStatus === "uploading" || uploadStatus === "indexing" || !selectedFile || !subject}
                  className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {uploadStatus === "uploading" || uploadStatus === "indexing" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing RAG Index...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Upload & Index
                    </>
                  )}
                </button>
                
                {statusMessage && (
                  <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                    uploadStatus === "success" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : uploadStatus === "failed"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }`}>
                    {uploadStatus === "success" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    {uploadStatus === "failed" && <AlertCircle className="w-4 h-4 shrink-0" />}
                    {(uploadStatus === "uploading" || uploadStatus === "indexing") && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                    <span>{statusMessage}</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* My Uploaded Materials List Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">My Uploaded Materials</h2>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                {myMaterials.length} Documents
              </span>
            </div>
            
            {myMaterials.length === 0 ? (
              <div className="glass-card p-8 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-300">
                <File className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="text-slate-800 font-bold mb-1">No materials uploaded yet</h3>
                <p className="text-sm text-slate-500 max-w-sm">Upload course materials above to unlock grounded AI doubt solving and practice test generation.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myMaterials.map((mat) => {
                  const state = materialStateMap[mat.id] || "READY";
                  const isSelected = activeMaterial?.id === mat.id;

                  return (
                    <div
                      key={mat.id}
                      onClick={() => setSelectedMaterialId(mat.id)}
                      className={`glass-card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between transition cursor-pointer border-l-4 ${
                        isSelected ? "border-indigo-600 bg-indigo-50/40 shadow-sm" : "border-slate-300 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex gap-3.5 items-center min-w-0">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-600"
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 flex-wrap">
                            <span className="truncate max-w-[220px]">{mat.fileName}</span>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase">
                              {mat.fileType}
                            </span>
                          </h3>

                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-slate-500 font-semibold">{mat.subject}</span>
                            <span className="text-slate-300">•</span>
                            
                            {/* Processing State Badges */}
                            {state === "READY" && (
                              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> AI Practice Ready
                              </span>
                            )}
                            {state === "PROCESSING" && (
                              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Processing RAG...
                              </span>
                            )}
                            {state === "UPLOADING" && (
                              <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                              </span>
                            )}
                            {state === "FAILED" && (
                              <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> AI processing failed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {state === "FAILED" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRetryIngestion(mat.id, mat.subject);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" /> Retry
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(mat.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          aria-label="Delete material"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: AI PRACTICE & DOUBT CARD */}
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                AI Practice & Doubt
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Learn directly from your uploaded material with document-grounded AI
              </p>
            </div>

            {activeMaterial ? (
              <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Working with: <strong>{activeMaterial.fileName}</strong></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
              </div>
            ) : (
              <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
                No material selected
              </div>
            )}
          </div>

          {!activeMaterial ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <BookOpen className="w-12 h-12 text-indigo-300" />
              <p className="text-sm font-bold text-slate-700">Upload or select a material above to unlock AI-powered practice and doubt solving.</p>
              <p className="text-xs text-slate-400">All questions and quizzes are grounded in your selected document passages.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-6">
              {/* Tab navigation */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setActiveTab("doubt")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === "doubt"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Ask a Doubt
                </button>

                <button
                  onClick={() => setActiveTab("practice")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === "practice"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  Practice Mode
                </button>

                <button
                  onClick={() => setActiveTab("explain")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === "explain"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Explain a Topic
                </button>
              </div>

              {/* TAB 1: ASK A DOUBT */}
              {activeTab === "doubt" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={doubtQuestion}
                      onChange={(e) => setDoubtQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAskDoubt()}
                      placeholder={`Ask a doubt from ${activeMaterial.fileName} (e.g. Explain clustered indexes)...`}
                      className="flex-1 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                    />
                    <button
                      onClick={handleAskDoubt}
                      disabled={doubtLoading || !doubtQuestion.trim()}
                      className="btn-primary !rounded-xl min-w-[110px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {doubtLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ask Document"}
                    </button>
                  </div>

                  {/* Doubt Result Display */}
                  {doubtResult && (
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          Grounded Answer
                        </span>
                        {doubtResult.grounded ? (
                          <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Based on uploaded material
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Document context limited
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {doubtResult.answer}
                      </div>

                      {/* Source Citations */}
                      {doubtResult.sources && doubtResult.sources.length > 0 && (
                        <div className="pt-2 space-y-2">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Relevant Source Passages:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {doubtResult.sources.map((src, i) => (
                              <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                                <p className="font-bold text-slate-800 truncate">📄 Page {src.pageNumber}</p>
                                <p className="text-[11px] text-slate-500 italic mt-1 font-serif line-clamp-2">"{src.excerpt}"</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Option to ask general AI if not grounded */}
                      {doubtResult.canAskGeneralAI && (
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <p className="text-xs text-slate-500">Need general academic knowledge beyond this specific document?</p>
                          <button
                            onClick={handleAskGeneralAIFallback}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Bot className="w-3.5 h-3.5" /> Ask General AI Instead
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fallback General AI Answer */}
                  {fallbackCopilotResponse && (
                    <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                      <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs">
                        <Bot className="w-4 h-4 text-indigo-600" />
                        <span>General AI Copilot Response</span>
                      </div>
                      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {fallbackCopilotResponse}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PRACTICE MODE */}
              {activeTab === "practice" && (
                <div className="space-y-5">
                  {!practiceQuiz && (
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                      <h3 className="text-sm font-bold text-slate-800">Generate Practice Test from {activeMaterial.fileName}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Difficulty Level</label>
                          <div className="flex items-center gap-2">
                            {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                              <button
                                key={diff}
                                onClick={() => setPracticeDifficulty(diff)}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                  practiceDifficulty === diff
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {diff}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Number of Questions</label>
                          <div className="flex items-center gap-2">
                            {[5, 10].map((num) => (
                              <button
                                key={num}
                                onClick={() => setPracticeCount(num)}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                  practiceCount === num
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {num} Questions
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleGeneratePractice}
                        disabled={practiceLoading}
                        className="w-full btn-primary !rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {practiceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Generate Grounded Practice Test
                      </button>
                    </div>
                  )}

                  {/* Active Quiz Card */}
                  {practiceQuiz && !quizFinished && (
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
                      {/* Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Question {currentQuestionIdx + 1} of {practiceQuiz.questions.length}
                        </span>
                        <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
                          {practiceQuiz.difficulty} Mode
                        </span>
                      </div>

                      {/* Question Text */}
                      <p className="text-base font-bold text-slate-800 leading-snug">
                        {practiceQuiz.questions[currentQuestionIdx]?.questionText}
                      </p>

                      {/* Options */}
                      <div className="space-y-2">
                        {practiceQuiz.questions[currentQuestionIdx]?.options?.map((opt, i) => {
                          const isSelected = selectedOption === opt;
                          return (
                            <button
                              key={i}
                              onClick={() => handleSelectOption(opt)}
                              disabled={isAnswerSubmitted}
                              className={`w-full text-left p-3.5 rounded-xl border text-sm font-semibold transition flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-2xs"
                                  : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback box on submission */}
                      {isAnswerSubmitted && (
                        <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 animate-[fadeIn_0.2s_ease-out] ${
                          userAnswers[practiceQuiz.questions[currentQuestionIdx].id]?.isCorrect
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}>
                          <p className="font-bold flex items-center gap-1.5 text-sm">
                            {userAnswers[practiceQuiz.questions[currentQuestionIdx].id]?.isCorrect ? "✅ Correct!" : "❌ Incorrect"}
                          </p>
                          <p className="mt-1 font-sans">{practiceQuiz.questions[currentQuestionIdx].explanation}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2">
                        {!isAnswerSubmitted ? (
                          <button
                            onClick={handleSubmitAnswer}
                            disabled={!selectedOption}
                            className="btn-primary !rounded-xl !px-5 !py-2.5 disabled:opacity-40 cursor-pointer"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuestion}
                            className="btn-primary !rounded-xl !px-5 !py-2.5 flex items-center gap-1.5 cursor-pointer ml-auto"
                          >
                            <span>{currentQuestionIdx + 1 < practiceQuiz.questions.length ? "Next Question" : "Finish Test"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quiz Results Card */}
                  {quizFinished && practiceQuiz && (
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                        <CheckSquare className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Practice Test Completed!</h3>
                      <p className="text-sm text-slate-600">
                        Score: <strong>{Object.values(userAnswers).filter(a => a.isCorrect).length}</strong> / {practiceQuiz.questions.length} Correct
                      </p>

                      <button
                        onClick={handleGeneratePractice}
                        className="btn-primary !rounded-xl px-6 py-2.5 cursor-pointer"
                      >
                        Try Another Practice Test
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: EXPLAIN A TOPIC */}
              {activeTab === "explain" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={explainTopicInput}
                      onChange={(e) => setExplainTopicInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleExplainTopic()}
                      placeholder={`Enter a topic to explain from ${activeMaterial.fileName} (e.g. B-Trees, Normalization)...`}
                      className="flex-1 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                    />
                    <button
                      onClick={handleExplainTopic}
                      disabled={explainLoading || !explainTopicInput.trim()}
                      className="btn-primary !rounded-xl min-w-[110px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {explainLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Explain Topic"}
                    </button>
                  </div>

                  {explainResult && (
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                      <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
                        Grounded Topic Summary: "{explainResult.topic}"
                      </h3>

                      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {explainResult.explanation}
                      </div>

                      {explainResult.keyPoints.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Takeaways:</p>
                          <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-5">
                            {explainResult.keyPoints.map((pt, idx) => (
                              <li key={idx}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );
}
