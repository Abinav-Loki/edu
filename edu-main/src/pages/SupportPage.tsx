import { useState, useRef, useEffect } from "react";
import { useCampus } from "../context/CampusContext";
import PageHeader from "../components/PageHeader";
import MobileHeader from "../components/MobileHeader";
import { Ticket, Paperclip, Camera, X, FileText, Image as ImageIcon, CheckCircle2, Eye, RefreshCw, AlertCircle } from "lucide-react";
import type { TicketAttachment } from "../data/centralData";

export default function SupportPage() {
  const { supportTickets, addSupportTicket, activeRole, currentUser } = useCampus();
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<any>("Academic");
  const [status, setStatus] = useState("idle");
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  
  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const myTickets = activeRole === "student" 
    ? supportTickets.filter(t => t.creatorId === (currentUser?.id || "s1"))
    : supportTickets;

  // Cleanup camera stream on unmount or when camera modal closes
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  function stopCameraStream() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  }

  async function openCameraModal() {
    setCameraError(null);
    setCapturedPhoto(null);
    setIsCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      // Fallback try with basic video constraints
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (fallbackErr: any) {
        setCameraError("Camera unavailable or permission denied. You can still upload photos from your device.");
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
      name: `Photo_${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/[: ]/g, '_')}.jpg`,
      type: "image",
      dataUrl: capturedPhoto,
      size: "Captured Image"
    };
    setAttachments(prev => [...prev, newAttachment]);
    closeCameraModal();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith("image/");
      const sizeFormatted = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      if (isImg) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const dataUrl = evt.target?.result as string;
          setAttachments(prev => [
            ...prev,
            {
              name: file.name,
              type: "image",
              dataUrl,
              size: sizeFormatted
            }
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments(prev => [
          ...prev,
          {
            name: file.name,
            type: "file",
            size: sizeFormatted
          }
        ]);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeAttachment(index: number) {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!desc.trim()) return;
    addSupportTicket({
      creatorId: currentUser?.id || "s1",
      category,
      description: desc.trim(),
      attachments: attachments.length > 0 ? attachments : undefined
    });
    setDesc("");
    setAttachments([]);
    setStatus("success");
    setTimeout(() => setStatus("idle"), 3500);
  }

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-5xl mx-auto">
        <PageHeader
          title="Campus Support"
          subtitle="Universal support ticket system with document attach & camera proof"
          badge="AI Classified"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-indigo-600" />
                Support Tickets
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {myTickets.length} {myTickets.length === 1 ? 'ticket' : 'tickets'}
              </span>
            </div>

            {myTickets.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-500 rounded-2xl">
                <p className="font-semibold text-slate-700 mb-1">No active tickets</p>
                <p className="text-xs text-slate-400">Need help? Submit a ticket using the form on the right.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myTickets.map(ticket => (
                  <div key={ticket.id} className="glass-card p-5 border-l-4 border-indigo-500 rounded-2xl hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex gap-2 items-center flex-wrap">
                            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                              {ticket.category}
                            </span>
                            <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
                              ticket.status === 'resolved' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : ticket.status === 'in_progress'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-slate-800 mt-2 font-medium leading-relaxed">{ticket.description}</p>
                          
                          {/* Attached files preview in list */}
                          {ticket.attachments && ticket.attachments.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
                                <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                                Attachments ({ticket.attachments.length}):
                              </span>
                              {ticket.attachments.map((att, idx) => (
                                <div 
                                  key={idx} 
                                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs transition cursor-pointer"
                                  onClick={() => att.dataUrl && setPreviewImage(att.dataUrl)}
                                >
                                  {att.type === "image" && att.dataUrl ? (
                                    <img src={att.dataUrl} alt={att.name} className="w-4 h-4 object-cover rounded" />
                                  ) : (
                                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                                  )}
                                  <span className="truncate max-w-[130px] font-medium text-slate-700">{att.name}</span>
                                  {att.dataUrl && <Eye className="w-3 h-3 text-indigo-500 ml-0.5" />}
                                </div>
                              ))}
                            </div>
                          )}

                          <p className="text-[11px] text-slate-400 mt-2 font-mono">
                            ID: {ticket.id} • {new Date(ticket.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ticket Creation Form */}
          <div className="space-y-6">
            <div className="glass-card p-5 sm:p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                Create Ticket
              </h2>

              <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none mb-4 bg-white font-medium"
              >
                <option>Academic</option>
                <option>Mentor</option>
                <option>Technical</option>
                <option>Facilities</option>
                <option>Other</option>
              </select>

              <label className="block text-xs font-bold text-slate-600 mb-1">Issue Description</label>
              <textarea 
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Describe your issue in detail..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm min-h-[110px] focus:ring-2 focus:ring-indigo-400 outline-none mb-3 resize-y"
              />

              {/* Upload & Camera Buttons */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-2">Attach Files or Photo Proof</label>
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
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 text-indigo-700 text-xs font-semibold transition cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4 text-indigo-600" />
                    Upload File
                  </button>

                  <button
                    type="button"
                    onClick={openCameraModal}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-700 text-xs font-semibold transition cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                    Take Photo
                  </button>
                </div>
              </div>

              {/* Attachments Preview List */}
              {attachments.length > 0 && (
                <div className="mb-4 space-y-2 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Attached ({attachments.length})
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {attachments.map((att, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs shadow-2xs">
                        <div className="flex items-center gap-2 truncate pr-2">
                          {att.type === "image" && att.dataUrl ? (
                            <img src={att.dataUrl} alt={att.name} className="w-6 h-6 object-cover rounded border" />
                          ) : (
                            <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                          )}
                          <div className="truncate">
                            <p className="font-semibold text-slate-700 truncate text-xs">{att.name}</p>
                            {att.size && <p className="text-[10px] text-slate-400 font-mono">{att.size}</p>}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
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
                disabled={!desc.trim()}
                className="w-full btn-primary disabled:opacity-50 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Ticket
              </button>

              {status === "success" && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Support ticket created successfully!
                </div>
              )}
            </div>
          </div>
        </div>
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
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-64 object-cover" 
                  />
                  {/* Camera reticle overlay */}
                  <div className="absolute inset-0 border-2 border-white/20 pointer-events-none rounded-xl flex items-center justify-center">
                    <div className="w-12 h-12 border border-emerald-400/50 rounded-full animate-ping" />
                  </div>
                </div>
              )}

              {/* Hidden canvas for taking snapshot */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Camera Actions */}
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
            <img src={previewImage} alt="Attachment Preview" className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain" />
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
