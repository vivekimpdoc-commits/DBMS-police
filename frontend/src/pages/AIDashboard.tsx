import { Brain, Camera, Bot, ScanFace, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AIDashboard() {
  return (
    <div className="p-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Brain className="text-purple-500" size={28}/> AI & Advanced Tech
          </h2>
          <p className="text-slate-400 text-sm mt-1">Predictive analytics, Drone feeds, and Facial Recognition.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Bot size={18} /> Run AI Analysis
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - AI Analytics */}
        <div className="flex flex-col gap-6">
          {/* Predictive Manpower */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-blue-400"/> AI Manpower Prediction</h3>
            <div className="space-y-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <p className="text-slate-400 text-xs uppercase mb-1">Upcoming Event: CM Rally</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-white">4,250</p>
                    <p className="text-xs text-slate-400">Suggested Deployment</p>
                  </div>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs border border-emerald-500/20">98% Accuracy</span>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-purple-500 pl-3">
                Based on past rallies at Ramabai Ground and current sentiment analysis, crowd density is expected to peak between 11:00 AM and 01:00 PM. Recommend +2 Reserve Companies in Zone 2.
              </p>
            </div>
          </div>

          {/* Facial Recognition Hits */}
          <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><ScanFace size={20} className="text-emerald-400"/> Face Recognition Alerts</h3>
            <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
               <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex gap-3 items-center">
                 <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden border border-red-500">
                    <img src="https://ui-avatars.com/api/?name=Suspect&background=0D8ABC&color=fff" alt="Suspect" />
                 </div>
                 <div>
                   <p className="text-red-400 font-bold text-sm flex items-center gap-1"><AlertTriangle size={14}/> Match Found (92%)</p>
                   <p className="text-slate-300 text-xs">Camera: Gate 2 CCTV</p>
                   <p className="text-slate-400 text-[10px]">Time: 10:14 AM</p>
                 </div>
               </div>
               <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex gap-3 items-center opacity-70">
                 <div className="w-12 h-12 bg-slate-700 rounded-lg overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Cleared&background=random" alt="Cleared" />
                 </div>
                 <div>
                   <p className="text-emerald-400 font-bold text-sm">VIP Staff Verified</p>
                   <p className="text-slate-400 text-xs">Camera: Entry A</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Col - Drone & CCTV Feed */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Camera size={20} className="text-blue-400"/> Live Drone & CCTV Feed</h3>
            <div className="flex gap-2">
              <span className="bg-red-500 px-2 py-1 rounded text-[10px] text-white font-bold animate-pulse">LIVE</span>
              <select className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded px-2 focus:outline-none">
                <option>Drone Alpha (Sector 1)</option>
                <option>Drone Bravo (Perimeter)</option>
                <option>CCTV Grid 4</option>
              </select>
            </div>
          </div>
          
          <div className="flex-1 bg-black rounded-xl border border-slate-700 relative overflow-hidden group">
            {/* Mock Video Feed Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
            
            {/* UI Overlay on Video */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
              <div className="flex justify-between">
                <div className="text-emerald-400 font-mono text-xs font-bold drop-shadow-md">
                  ALT: 124m<br/>SPD: 12km/h
                </div>
                <div className="text-slate-300 font-mono text-xs drop-shadow-md text-right">
                  REC 00:14:22<br/>BAT 78%
                </div>
              </div>
              
              {/* Drone Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 border border-emerald-500/50 rounded-full relative">
                  <div className="absolute top-0 left-1/2 w-px h-4 bg-emerald-500/50"></div>
                  <div className="absolute bottom-0 left-1/2 w-px h-4 bg-emerald-500/50"></div>
                  <div className="absolute left-0 top-1/2 h-px w-4 bg-emerald-500/50"></div>
                  <div className="absolute right-0 top-1/2 h-px w-4 bg-emerald-500/50"></div>
                  <div className="absolute inset-0 m-auto w-1 h-1 bg-emerald-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-yellow-400 font-bold text-xs bg-black/50 inline-block px-2 py-1 rounded backdrop-blur">
                  Warning: Crowd Density High (Sector 1 North)
                </p>
              </div>
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            {[1,2,3,4].map(i => (
              <div key={i} className={`h-20 bg-slate-800 rounded-lg border cursor-pointer hover:border-blue-500 transition-colors ${i === 1 ? 'border-blue-500' : 'border-slate-700'}`}>
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center opacity-50 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
