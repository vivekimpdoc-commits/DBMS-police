import { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, Camera, QrCode, Clock, Navigation, CheckCircle2 } from 'lucide-react';

export default function OfficerMobileView() {
  const [attendance, setAttendance] = useState<'pending' | 'checked_in'>('pending');
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = () => {
    setAttendance('checked_in');
  };

  return (
    <div className="bg-[#020817] min-h-screen text-slate-300 pb-20 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="glass-card border-b border-slate-700 rounded-b-3xl relative z-10 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Constable Amit Kumar</h1>
            <p className="text-slate-400 text-sm">UPP-120485 • Quick Response Team</p>
          </div>
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold text-lg border-2 border-slate-700">AK</div>
        </div>
        <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium">GPS Active</span>
          </div>
          <p className="text-xl font-bold font-mono text-white tracking-wider">{time}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4 relative z-0">
        
        {/* Attendance Card */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><QrCode size={100} /></div>
          <h3 className="text-lg font-bold text-white mb-1">Digital Attendance</h3>
          <p className="text-xs text-slate-400 mb-4">Verify location & facial ID to check in</p>
          
          {attendance === 'pending' ? (
            <button 
              onClick={handleCheckIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50 transition-all active:scale-95"
            >
              <Camera size={18} /> Face ID Check-In
            </button>
          ) : (
            <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> Checked In (08:45 AM)
            </div>
          )}
        </div>

        {/* Duty Card */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><MapPin size={18} className="text-accent" /> Active Duty Assignment</h3>
          
          <div className="space-y-3">
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Event</p>
              <p className="font-medium text-slate-300">Hon. PM Visit to Varanasi</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Zone/Sector</p>
                <p className="font-medium text-slate-300 text-sm">Zone 1 / Sec 4</p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Reporting</p>
                <p className="font-medium text-slate-300 text-sm">Gate No. 2</p>
              </div>
            </div>

            <button className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700">
              <Navigation size={18} /> Navigate to Post
            </button>
          </div>
        </div>

        {/* SOS Action */}
        <button className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-red-900/50 active:scale-95 transition-all mt-4 border border-red-500/30">
          <ShieldAlert size={24} />
          <span className="text-lg uppercase tracking-widest">Emergency SOS</span>
        </button>

      </div>
      
      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-6 py-3 flex justify-between items-center max-w-md mx-auto pb-safe">
        <div className="flex flex-col items-center text-blue-500">
          <Clock size={20} />
          <span className="text-[10px] mt-1 font-medium">Duty</span>
        </div>
        <div className="flex flex-col items-center text-slate-500 hover:text-slate-300">
          <Camera size={20} />
          <span className="text-[10px] mt-1 font-medium">Incident</span>
        </div>
        <div className="flex flex-col items-center text-slate-500 hover:text-slate-300">
          <MapPin size={20} />
          <span className="text-[10px] mt-1 font-medium">Map</span>
        </div>
      </div>
    </div>
  )
}
