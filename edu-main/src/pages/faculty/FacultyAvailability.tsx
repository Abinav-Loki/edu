import { useState } from "react";
import { useCampus } from "../../context/CampusContext";
import PageHeader from "../../components/PageHeader";
import MobileHeader from "../../components/MobileHeader";
import GlassCard from "../../components/GlassCard";
import { Clock, Plus, Trash2 } from "lucide-react";
import { AvailabilitySlot } from "../../data/centralData";

export default function FacultyAvailability() {
  const { currentUser, mentorAvailability } = useCampus();
  const [localSlots, setLocalSlots] = useState<AvailabilitySlot[]>(
    mentorAvailability.filter(a => a.facultyId === currentUser?.id)
  );

  const [newDay, setNewDay] = useState("Monday");
  const [newStart, setNewStart] = useState("10:00");
  const [newEnd, setNewEnd] = useState("11:00");

  function handleAddSlot() {
    const slot: AvailabilitySlot = {
      id: `avail_${Date.now()}`,
      facultyId: currentUser?.id || "",
      day: newDay,
      startTime: newStart,
      endTime: newEnd
    };
    setLocalSlots([...localSlots, slot]);
    // Note: In a real app we would call a context update method here.
  }

  function handleRemoveSlot(id: string) {
    setLocalSlots(localSlots.filter(s => s.id !== id));
  }

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-4xl mx-auto">
        <PageHeader title="Mentoring Availability" subtitle="Set your weekly available slots for students to book" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <GlassCard className="p-5">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4">Current Slots</h3>
              
              {localSlots.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  You have no mentoring slots available. Add one below.
                </div>
              ) : (
                <div className="space-y-3">
                  {localSlots.map(slot => (
                    <div key={slot.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{slot.day}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{slot.startTime} - {slot.endTime}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveSlot(slot.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-5">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Add New Slot</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Day of Week</label>
                  <select 
                    value={newDay} 
                    onChange={e => setNewDay(e.target.value)}
                    className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors text-slate-800 dark:text-slate-200"
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Start Time</label>
                    <input 
                      type="time" 
                      value={newStart}
                      onChange={e => setNewStart(e.target.value)}
                      className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">End Time</label>
                    <input 
                      type="time" 
                      value={newEnd}
                      onChange={e => setNewEnd(e.target.value)}
                      className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleAddSlot}
                  className="w-full flex items-center justify-center gap-2 btn-primary mt-2"
                >
                  <Plus className="w-4 h-4" /> Add Slot
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </>
  );
}
