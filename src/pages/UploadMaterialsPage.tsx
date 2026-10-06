import { useState } from "react";
import { useCampus } from "../context/CampusContext";
import { useLearning } from "../context/LearningContext";
import PageHeader from "../components/PageHeader";
import MobileHeader from "../components/MobileHeader";
import { UploadCloud, File, Trash2, CheckCircle2 } from "lucide-react";

export default function UploadMaterialsPage() {
  const { currentUser, materials, addMaterial, deleteMaterial } = useCampus();
  const { awardXP } = useLearning();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success">("idle");

  if (!currentUser || currentUser.role !== "student") return null;

  const myMaterials = materials.filter(m => m.studentId === currentUser.id);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  }

  function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile || !subject) return;

    setUploadStatus("uploading");
    
    // Simulate upload delay
    setTimeout(() => {
      addMaterial({
        fileName: selectedFile.name,
        fileType: selectedFile.type || "application/octet-stream",
        fileSize: selectedFile.size,
        subject,
        description,
        uploadedBy: currentUser.name,
        studentId: currentUser.id
      });
      
      // Award XP for uploading material
      if (typeof awardXP === "function") {
        awardXP(30, "Knowledge Contributor", "upload_material");
      }
      
      setUploadStatus("success");
      setSelectedFile(null);
      setSubject("");
      setDescription("");
      
      setTimeout(() => setUploadStatus("idle"), 3000);
    }, 1000);
  }

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-5xl mx-auto">
        <PageHeader
          title="Upload Materials"
          subtitle="Store and manage your study materials"
          badge="Study Hub"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-500" />
                New Material
              </h2>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select File</label>
                  <input 
                    type="file" 
                    required
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
                    className="w-full p-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                {selectedFile && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || "Unknown Type"}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. DBMS"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description (Optional)</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Brief description of the contents..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white min-h-[80px]"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={uploadStatus === "uploading" || !selectedFile || !subject}
                  className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploadStatus === "uploading" ? "Uploading..." : "Upload Material"}
                </button>
                
                {uploadStatus === "success" && (
                  <div className="p-3 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-200 flex justify-center items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Upload successful!
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Materials List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-slate-800">My Uploaded Materials</h2>
            
            {myMaterials.length === 0 ? (
              <div className="glass-card p-10 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-300">
                <File className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-slate-800 font-bold mb-1">No materials yet</h3>
                <p className="text-sm text-slate-500">Upload your study materials to access them anywhere.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myMaterials.map(mat => (
                  <div key={mat.id} className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-l-4 border-indigo-400 group">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <File className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          {mat.fileName}
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase">
                            {mat.fileType}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">{mat.subject} • {mat.description}</p>
                        <p className="text-[10px] text-slate-400 mt-2">
                          ID: {mat.id} • Uploaded {new Date(mat.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => deleteMaterial(mat.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Delete material"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
