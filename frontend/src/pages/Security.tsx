import { ShieldCheck, Car, FileCheck, Search } from 'lucide-react';

export default function Security() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={28}/> Security & ASL
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage Advance Security Liaison (ASL) reports and escort vehicles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* ASL Checklist */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><FileCheck size={20} className="text-blue-400"/> Anti-Sabotage Check (ASL)</h3>
            <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">New Report</button>
          </div>
          
          <div className="space-y-4">
            {[
              { venue: 'Kashi Vishwanath Temple', time: '06:00 AM', by: 'BDS Team Alpha', status: 'Cleared' },
              { venue: 'Helipad Area', time: '07:30 AM', by: 'BDS Team Bravo', status: 'In Progress' },
              { venue: 'Route A Bridges', time: 'Pending', by: 'Local PS', status: 'Pending' }
            ].map((asl, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-white font-bold text-sm">{asl.venue}</h4>
                  <p className="text-xs text-slate-400">By: {asl.by} | Time: {asl.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded font-bold ${
                  asl.status === 'Cleared' ? 'bg-emerald-500/10 text-emerald-400' :
                  asl.status === 'In Progress' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {asl.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Management */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Car size={20} className="text-blue-400"/> Vehicle & Fleet</h3>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input type="text" placeholder="Search vehicle..." className="pl-8 pr-3 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white w-40" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="pb-3 font-medium">Vehicle No.</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Driver / Contact</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 font-mono text-blue-400">UP32 POL 001</td>
                  <td className="py-3 text-slate-300">Pilot 1 (Gypsy)</td>
                  <td className="py-3 text-white">HC Ramesh (98765...)</td>
                  <td className="py-3"><span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">Active</span></td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 font-mono text-blue-400">UP32 POL 002</td>
                  <td className="py-3 text-slate-300">Escort 1 (Innova)</td>
                  <td className="py-3 text-white">SI Suresh (98765...)</td>
                  <td className="py-3"><span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">Active</span></td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 font-mono text-blue-400">UP32 POL 005</td>
                  <td className="py-3 text-slate-300">Jammer Vehicle</td>
                  <td className="py-3 text-white">Insp. Technical</td>
                  <td className="py-3"><span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-1 rounded">Testing</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
