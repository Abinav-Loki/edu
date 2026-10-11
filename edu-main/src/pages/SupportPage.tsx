import { useState, useRef, useEffect } from "react";
import { useCampus } from "../context/CampusContext";
import PageHeader from "../components/PageHeader";
import MobileHeader from "../components/MobileHeader";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Filter,
  MessageSquare,
  Paperclip,
  RefreshCw,
  Search,
  ShieldCheck,
  X
} from "lucide-react";
import type { SupportTicket, TicketAttachment } from "../data/centralData";

export default function SupportPage() {
  const { supportTickets, addSupportTicket, updateSupportTicket, activeRole, currentUser } = useCampus();
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<SupportTicket["category"]>("Academic");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);

  // Admin filter and response state
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>("all");
  const [adminSearch, setAdminSearch] = useState<string>("all");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [adminResponseText, setAdminResponseText] = useState<string>("");
  const [adminSaving, setAdminSaving] = useState<boolean>(false);

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Filter complaints based on user role
  const isStudent = activeRole === "student";
  const isAdmin = activeRole === "admin";

  const visibleTickets = isStudent
    ? supportTickets.filter((t) => t.creatorId === (currentUser?.id || "s1"))
    : isAdmin
    ? supportTickets.filter((t) => {
        const matchesStatus = adminStatusFilter === "all" || t.status === adminStatusFilter;
        const matchesSearch =
          adminSearch === "all" ||
          adminSearch === "" ||
          t.description.toLowerCase().includes(adminSearch.toLowerCase()) ||
          t.subject?.toLowerCase().includes(adminSearch.toLowerCase()) ||
          t.id.toLowerCase().includes(adminSearch.toLowerCase()) ||
          t.category.toLowerCase().includes(adminSearch.toLowerCase());
        return matchesStatus && matchesSearch;
      })
    : supportTickets.filter((t) => t.category === "Academic" || t.creatorId === currentUser?.id);

  const selectedTicket = supportTickets.find((t) => t.id === selectedTicketId);

  // Sync selected ticket's response text when opening
  useEffect(() => {
    if (selectedTicket) {
      setAdminResponseText(selectedTicket.adminResponse || "");
    }
  }, [selectedTicketId]);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  function stopCameraStream() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }

  async function openCameraModal() {
    setCameraError(null);
    setCapturedPhoto(null);
    setIsCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (fallbackErr: any) {
        setCameraError("Camera unavailable or permission denied. You can still upload files directly.");
      }
    }
  }

  function closeCameraModal() {
    stopCameraStream();
    setIsCameraOpen(false);
    setCapturedPhoto(null);
    setCameraError(null);
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedPhoto(dataUrl);
    }
  }

  function confirmCameraPhoto() {
    if (!capturedPhoto) return;
    const newAttachment: TicketAttachment = {
      name: `PhotoProof_${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).replace(/[: ]/g, "_")}.jpg`,
      type: "image",
      dataUrl: capturedPhoto,
      size: "Captured Proof",
    };
    setAttachments((prev) => [...prev, newAttachment]);
    closeCameraModal();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith("image/");
      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      if (isImg) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const dataUrl = evt.target?.result as string;
          setAttachments((prev) => [
            ...prev,
            {
              name: file.name,
              type: "image",
              dataUrl,
              size: sizeFormatted,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments((prev) => [
          ...prev,
          {
            name: file.name,
            type: "file",
            size: sizeFormatted,
          },
        ]);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (!desc.trim()) return;
    setStatus("submitting");

    try {
      addSupportTicket({
        creatorId: currentUser?.id || "s1",
        creatorName: currentUser?.name || "Student User",
        subject: subject.trim() || undefined,
        category,
        description: desc.trim(),
        status: "submitted",
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      setSubject("");
      setDesc("");
      setAttachments([]);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("Failed to raise complaint:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  async function handleAdminStatusChange(ticketId: string, newStatus: SupportTicket["status"]) {
    setAdminSaving(true);
    try {
      await updateSupportTicket(ticketId, { status: newStatus });
    } finally {
      setAdminSaving(false);
    }
  }

  async function handleAdminSaveResponse(ticketId: string) {
    if (!adminResponseText.trim()) return;
    setAdminSaving(true);
    try {
      await updateSupportTicket(ticketId, {
        adminResponse: adminResponseText.trim(),
        status: selectedTicket?.status === "submitted" ? "under_review" : selectedTicket?.status,
      });
      setSelectedTicketId(null);
    } finally {
      setAdminSaving(false);
    }
  }

  const getStatusBadge = (tStatus: string) => {
    switch (tStatus) {
      case "resolved":
        return { label: "Resolved", bg: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800" };
      case "in_progress":
        return { label: "In Progress", bg: "bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800" };
      case "under_review":
        return { label: "Under Review", bg: "bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800" };
      case "submitted":
      case "pending":
      default:
        return { label: "Submitted", bg: "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800" };
    }
  };

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-6xl mx-auto space-y-6">
        <PageHeader
          title={isAdmin ? "Complaint Management" : "Raise Complaint"}
          subtitle={
            isAdmin
              ? "ARIVON AI Student Grievance Command • Review, investigate & resolve verified student complaints"
              : "Students Analytics Grievance Redressal • Submit academic, mentor, technical or facility issues with proof"
          }
          badge={isAdmin ? "Administrative Control" : "Official Redressal"}
        />

        {/* ADMIN MANAGEMENT VIEW */}
        {isAdmin && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Filter Status:</span>
                <select
                  value={adminStatusFilter}
                  onChange={(e) => setAdminStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="all">All Complaints ({supportTickets.length})</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {visibleTickets.length} Complaints Displayed
                </span>
              </div>
            </div>

            {/* Complaints Table/Cards for Admin */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                {visibleTickets.length === 0 ? (
                  <div className="glass-card p-8 text-center text-slate-500 dark:text-slate-400 rounded-2xl">
                    <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No complaints found</p>
                    <p className="text-xs">No student complaints match the selected filter criteria.</p>
                  </div>
                ) : (
                  visibleTickets.map((ticket) => {
                    const badge = getStatusBadge(ticket.status);
                    const isSelected = selectedTicketId === ticket.id;
                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`glass-card p-5 rounded-2xl transition cursor-pointer border ${
                          isSelected
                            ? "border-indigo-500 ring-2 ring-indigo-400/40 dark:border-indigo-400"
                            : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                                {ticket.category}
                              </span>
                              <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md border ${badge.bg}`}>
                                {badge.label}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                                #{ticket.id}
                              </span>
                            </div>
                            {ticket.subject && (
                              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2">
                                {ticket.subject}
                              </h3>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                          {ticket.description}
                        </p>

                        {ticket.attachments && ticket.attachments.length > 0 && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{ticket.attachments.length} proof file(s) attached</span>
                          </div>
                        )}

                        {ticket.adminResponse && (
                          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300">
                            <span className="font-bold block text-[10px] uppercase text-emerald-600 dark:text-emerald-400">
                              Resolution Response:
                            </span>
                            {ticket.adminResponse}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Admin Action / Detail Panel */}
              <div className="space-y-4">
                <div className="glass-card p-5 rounded-2xl sticky top-20 border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    Complaint Resolution Console
                  </h3>

                  {selectedTicket ? (
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Selected Complaint ID
                        </span>
                        <p className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          {selectedTicket.id}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Student Subject & Detail
                        </span>
                        <p className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">
                          {selectedTicket.subject || "No subject provided"}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed max-h-36 overflow-y-auto">
                          {selectedTicket.description}
                        </p>
                      </div>

                      {/* Attachments if any */}
                      {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                            Attached Proofs
                          </span>
                          <div className="space-y-1.5">
                            {selectedTicket.attachments.map((att, idx) => (
                              <div
                                key={idx}
                                onClick={() => att.dataUrl && setPreviewImage(att.dataUrl)}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                              >
                                <span className="truncate max-w-[170px] font-medium text-slate-700 dark:text-slate-300">
                                  {att.name}
                                </span>
                                {att.dataUrl && <Eye className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Status Update Dropdown */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                          Change Status
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(["submitted", "under_review", "in_progress", "resolved"] as const).map((st) => (
                            <button
                              key={st}
                              disabled={adminSaving}
                              onClick={() => handleAdminStatusChange(selectedTicket.id, st)}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                                selectedTicket.status === st
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                              }`}
                            >
                              {st === "under_review"
                                ? "Under Review"
                                : st === "in_progress"
                                ? "In Progress"
                                : st.charAt(0).toUpperCase() + st.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Official Admin Response */}
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                          Official Resolution Response / Notes
                        </label>
                        <textarea
                          value={adminResponseText}
                          onChange={(e) => setAdminResponseText(e.target.value)}
                          placeholder="Provide official resolution note or investigation update for the student..."
                          rows={3}
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-400 outline-none resize-y"
                        />
                      </div>

                      <button
                        onClick={() => handleAdminSaveResponse(selectedTicket.id)}
                        disabled={adminSaving || !adminResponseText.trim()}
                        className="w-full btn-primary disabled:opacity-50 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {adminSaving ? "Saving..." : "Save Resolution & Update Student"}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Select any complaint on the left to review details, update status, and add resolution notes.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT & FACULTY VIEW */}
        {!isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Complaints List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  My Complaints
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {visibleTickets.length} {visibleTickets.length === 1 ? "complaint" : "complaints"}
                </span>
              </div>

              {visibleTickets.length === 0 ? (
                <div className="glass-card p-8 text-center text-slate-500 dark:text-slate-400 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <ShieldCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">No active complaints</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Need redressal? Fill out the "Raise Complaint" form on the right.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleTickets.map((ticket) => {
                    const badge = getStatusBadge(ticket.status);
                    return (
                      <div
                        key={ticket.id}
                        className="glass-card p-5 border-l-4 border-indigo-500 rounded-2xl hover:shadow-md transition border border-slate-200/80 dark:border-slate-800"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-full">
                            <div className="flex gap-2 items-center flex-wrap mb-2">
                              <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                                {ticket.category}
                              </span>
                              <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md border ${badge.bg}`}>
                                {badge.label}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 ml-auto">
                                ID: {ticket.id}
                              </span>
                            </div>

                            {ticket.subject && (
                              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
                                {ticket.subject}
                              </h3>
                            )}

                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                              {ticket.description}
                            </p>

                            {/* Attached files preview */}
                            {ticket.attachments && ticket.attachments.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
                                  <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                                  Proof ({ticket.attachments.length}):
                                </span>
                                {ticket.attachments.map((att, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs transition cursor-pointer"
                                    onClick={() => att.dataUrl && setPreviewImage(att.dataUrl)}
                                  >
                                    {att.type === "image" && att.dataUrl ? (
                                      <img src={att.dataUrl} alt={att.name} className="w-4 h-4 object-cover rounded" />
                                    ) : (
                                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                                    )}
                                    <span className="truncate max-w-[130px] font-medium text-slate-700 dark:text-slate-300">
                                      {att.name}
                                    </span>
                                    {att.dataUrl && <Eye className="w-3 h-3 text-indigo-500 ml-0.5" />}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Official Admin Response */}
                            {ticket.adminResponse && (
                              <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                                  Official Admin Resolution Response:
                                </span>
                                <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                                  {ticket.adminResponse}
                                </p>
                              </div>
                            )}

                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
                              Logged: {new Date(ticket.createdAt).toLocaleString()}
                              {ticket.updatedAt && ` • Updated: ${new Date(ticket.updatedAt).toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Raise Complaint Form */}
            <div className="space-y-6">
              <div className="glass-card p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Raise Complaint
                </h2>

                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Complaint Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Lab PC monitor issue / Attendance miscalculation"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-400 outline-none mb-3"
                />

                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-400 outline-none mb-3 bg-white dark:bg-slate-800 font-medium text-slate-800 dark:text-slate-100"
                >
                  <option value="Academic">Academic (Grades, Syllabus, Lectures)</option>
                  <option value="Mentor">Mentor (Advisory, Guidance, Scheduling)</option>
                  <option value="Technical">Technical (Portal, LMS, Wifi, Login)</option>
                  <option value="Facilities">Facilities (Labs, Classrooms, Library)</option>
                  <option value="Other">Other Grievance</option>
                </select>

                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Detailed Grievance Description
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe your issue with exact dates, locations, or course details..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 min-h-[110px] focus:ring-2 focus:ring-indigo-400 outline-none mb-3 resize-y"
                />

                {/* Upload & Camera Buttons */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                    Attach Image or Document Proof
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100/70 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition cursor-pointer"
                    >
                      <Paperclip className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Upload File
                    </button>

                    <button
                      type="button"
                      onClick={openCameraModal}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100/70 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Take Photo
                    </button>
                  </div>
                </div>

                {/* Attachments Preview List */}
                {attachments.length > 0 && (
                  <div className="mb-4 space-y-2 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Attached Proof ({attachments.length})
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {attachments.map((att, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs shadow-2xs"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            {att.type === "image" && att.dataUrl ? (
                              <img
                                src={att.dataUrl}
                                alt={att.name}
                                className="w-6 h-6 object-cover rounded border border-slate-200 dark:border-slate-700"
                              />
                            ) : (
                              <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                            )}
                            <div className="truncate">
                              <p className="font-semibold text-slate-700 dark:text-slate-200 truncate text-xs">
                                {att.name}
                              </p>
                              {att.size && <p className="text-[10px] text-slate-400 font-mono">{att.size}</p>}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            aria-label="Remove attachment"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!desc.trim() || status === "submitting"}
                  className="w-full btn-primary disabled:opacity-50 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {status === "submitting" ? "Submitting Complaint..." : "Submit Complaint"}
                </button>

                {status === "success" && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Complaint raised successfully! Persisted and routed for admin review.
                  </div>
                )}

                {status === "error" && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    Failed to submit complaint. Please check your network and try again.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CAMERA MODAL */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl text-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Capture Photo Proof</h3>
              </div>
              <button
                onClick={closeCameraModal}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex flex-col items-center">
              {cameraError ? (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-300 text-xs text-center my-4 space-y-2">
                  <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
                  <p>{cameraError}</p>
                  <button
                    onClick={() => {
                      closeCameraModal();
                      fileInputRef.current?.click();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-200 font-semibold hover:bg-red-500/30 transition text-xs mt-2"
                  >
                    Use File Upload Instead
                  </button>
                </div>
              ) : capturedPhoto ? (
                <div className="relative w-full rounded-xl overflow-hidden bg-black border border-slate-700">
                  <img src={capturedPhoto} alt="Captured snapshot" className="w-full h-64 object-contain" />
                </div>
              ) : (
                <div className="relative w-full rounded-xl overflow-hidden bg-black border border-slate-700 flex justify-center items-center">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 border-2 border-white/20 pointer-events-none rounded-xl flex items-center justify-center">
                    <div className="w-12 h-12 border border-emerald-400/50 rounded-full animate-ping" />
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />

              {!cameraError && (
                <div className="flex items-center justify-center gap-3 mt-5 w-full">
                  {capturedPhoto ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setCapturedPhoto(null)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Retake
                      </button>
                      <button
                        type="button"
                        onClick={confirmCameraPhoto}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/40"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Use Photo
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl primary-gradient text-white text-sm font-bold transition shadow-lg shadow-indigo-950/40"
                    >
                      <Camera className="w-4 h-4" />
                      Take Snapshot
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW LIGHTBOX */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <img
              src={previewImage}
              alt="Attachment Preview"
              className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-4 -right-4 p-2 rounded-full bg-white text-slate-900 shadow-lg font-bold hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
