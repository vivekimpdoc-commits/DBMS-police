import { AlertOctagon, MessageSquare, Video, ShieldAlert, CheckCircle2 } from 'lucide-react';

const incidents = [
  { id: 'INC-992', type: 'Route Obstruction', location: 'Zone 4, Sector 2', reportedBy: 'Insp. R. Kumar', time: '10 mins ago', status: 'Active', severity: 'High' },
  { id: 'INC-991', type: 'Suspicious Vehicle', location: 'Parking P3', reportedBy: 'Const. Amit', time: '45 mins ago', status: 'Resolved', severity: 'Medium' },
];

export default function Incidents() {
  return (
    <div className="p-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-red-500" size={28}/> Incident & Comm Center
          </h2>
          <p className="text-slate-500 text-sm mt-1">Monitor live incidents, SOS alerts, and broadcast messages.</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <MessageSquare size={18} /> Emergency Broadcast
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Incidents List */}
        <div className="lg:col-span-2 bg-slate-50/50 backdrop-blur-md border border-slate-200 rounded-2xl p-6 flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Live Incident Feed</h3>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {incidents.map(inc => (
              <div key={inc.id} className="bg-white/80 border border-slate-200 rounded-xl p-4 flex gap-4 hover:border-slate-500 transition-colors cursor-pointer group">
                <div className={`mt-1 ${inc.severity === 'High' ? 'text-red-500' : 'text-orange-500'}`}>
                  <AlertOctagon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-slate-800 font-bold text-lg group-hover:text-blue-400 transition-colors">{inc.type}</h4>
                    <span className="text-xs text-slate-500">{inc.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">Location: <span className="text-slate-100">{inc.location}</span> | Reporter: <span className="text-slate-100">{inc.reportedBy}</span></p>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded border ${inc.status === 'Active' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                      {inc.status}
                    </span>
                    <button className="text-xs px-2 py-1 bg-slate-700 text-slate-600 rounded border border-slate-600 hover:bg-slate-600 flex items-center gap-1">
                      <Video size={12} /> View Media
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - SOS & Comms */}
        <div className="flex flex-col gap-6">
          {/* Active SOS */}
          <div className="bg-gradient-to-br from-red-900/40 to-white border border-red-500/30 rounded-2xl p-6 shadow-lg">
            <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Active SOS Alerts
            </h3>
            
            <div className="bg-red-950/50 border border-red-800 rounded-xl p-4">
              <p className="text-slate-800 font-bold mb-1">Const. Vikram Singh</p>
              <p className="text-slate-600 text-sm mb-3">Zone 2, Checkpost 4 (Medical Emergency)</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg">Dispatch QRT</button>
                <button className="flex-1 bg-slate-50 text-slate-600 text-xs font-bold py-2 rounded-lg border border-slate-200 hover:bg-slate-700">Acknowledge</button>
              </div>
            </div>
          </div>

          {/* Secure Chat */}
          <div className="bg-slate-50/50 backdrop-blur-md border border-slate-200 rounded-2xl p-6 flex-1 flex flex-col">
            <h3 className="text-slate-800 font-bold mb-4">Command Comm Link</h3>
            <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-col justify-end space-y-3">
              <div className="text-center text-xs text-slate-500">Secure connection established</div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-200">Z1</div>
                <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-sm text-sm text-slate-700">Zone 1 clear, convoy passing CP-3.</div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-xs font-bold text-emerald-200">HQ</div>
                <div className="bg-emerald-800/20 border border-emerald-500/20 p-3 rounded-2xl rounded-tr-sm text-sm text-slate-700">Copy that Z1. Maintain perimeter.</div>
              </div>
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Type message..." className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg"><MessageSquare size={16}/></button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
