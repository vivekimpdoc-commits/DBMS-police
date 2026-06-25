import { FileText, Download, BarChart2, PieChart, Users, Printer } from 'lucide-react';

export default function ReportsAnalytics() {
  return (
    <div className="p-6 h-[calc(100vh-80px)] flex flex-col overflow-y-auto">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="text-orange-400" size={28}/> Reports & Analytics
          </h2>
          <p className="text-slate-400 text-sm mt-1">Generate Duty Charts, Attendance reports and view historical data.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-slate-700 transition-colors">
            <Printer size={18} /> Print
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FileText size={20} className="text-blue-400"/> Generated Duty Charts</h3>
          <ul className="space-y-3">
            {[
               {name: 'Zone 1 - CM Rally', date: '28 Jun 2026', size: '2.4 MB'},
               {name: 'Outer Cordon - Kashi', date: '15 Jul 2026', size: '1.1 MB'},
               {name: 'QRT Reserve Roster', date: '10 Jun 2026', size: '0.8 MB'},
            ].map((doc, idx) => (
              <li key={idx} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                <div>
                  <p className="text-slate-200 text-sm font-medium">{doc.name}.pdf</p>
                  <p className="text-slate-500 text-xs">{doc.date} • {doc.size}</p>
                </div>
                <button className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-md"><Download size={14}/></button>
              </li>
            ))}
          </ul>
          <button className="w-full mt-4 text-sm text-blue-400 hover:text-blue-300 font-medium">View All Reports</button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Users size={20} className="text-emerald-400"/> Attendance Summary</h3>
          <div className="flex flex-col items-center justify-center h-48 relative">
             {/* Mock Pie Chart CSS using conic-gradient */}
             <div className="w-32 h-32 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border-4 border-slate-800"
                  style={{ background: 'conic-gradient(#10b981 0% 85%, #ef4444 85% 95%, #f59e0b 95% 100%)' }}>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
               <span className="text-xl font-bold text-white">85%</span>
             </div>
          </div>
          <div className="flex justify-center gap-4 text-xs font-medium mt-4">
             <div className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Present</div>
             <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Absent</div>
             <div className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Leave</div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><PieChart size={20} className="text-purple-400"/> Force Utilization</h3>
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Civil Police</span>
                <span>65%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[65%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>PAC (Provincial Armed Constabulary)</span>
                <span>25%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-[25%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Traffic Police</span>
                <span>10%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden"><div className="h-full bg-orange-400 w-[10%]"></div></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4">Detailed Attendance Log (Today)</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="pb-3">Officer Name</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Check In Time</th>
              <th className="pb-3">Method</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-700/50">
              <td className="py-3 text-white">Const. Amit Kumar</td>
              <td className="py-3 text-slate-400">QRT</td>
              <td className="py-3 text-slate-300">08:45 AM</td>
              <td className="py-3 text-slate-400">Face ID + GPS</td>
              <td className="py-3"><span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs">On Time</span></td>
            </tr>
            <tr className="border-b border-slate-700/50">
              <td className="py-3 text-white">SI Ramesh Singh</td>
              <td className="py-3 text-slate-400">Sector Mobile</td>
              <td className="py-3 text-slate-300">09:12 AM</td>
              <td className="py-3 text-slate-400">GPS</td>
              <td className="py-3"><span className="text-orange-400 bg-orange-500/10 px-2 py-1 rounded text-xs">Late</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
