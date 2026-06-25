import { useState, useEffect } from 'react';
import { Users, UserPlus, CheckCircle2, Search, Filter, MapPin, Trash2, RefreshCw, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { showToast } from '../components/Toast';

interface DutyAssignment {
  id: string; assignId: string; zone: string; sector: string; role: string; shift: string;
  status: string; aiGenerated: boolean;
  officer: { id: string; badgeNo: string; name: string; rank: string; unit: string; district: string; };
  event: { id: string; name: string; eventId: string; threat: string; };
}

const statusStyles: Record<string, string> = {
  Assigned:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'On Duty': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Completed: 'bg-slate-600/10 text-slate-400 border-slate-600/20',
};

const zoneColors = ['bg-red-500', 'bg-orange-500', 'bg-blue-500', 'bg-emerald-500'];

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-700/30">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="p-4"><div className="h-4 bg-slate-700/40 rounded-full animate-pulse" style={{ width: `${55 + (i * 11) % 35}%` }} /></td>
      ))}
    </tr>
  );
}

export default function ForceDeployment() {
  const [duties, setDuties] = useState<DutyAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterZone, setFilterZone] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchDuties = () => {
    setLoading(true);
    fetch('http://localhost:3000/api/duties')
      .then(r => r.json())
      .then(d => { setDuties(d); setLoading(false); })
      .catch(() => { setLoading(false); showToast('error', 'Connection Error', 'Could not fetch deployment data.'); });
  };

  useEffect(() => { fetchDuties(); }, []);

  const zones = ['All', ...Array.from(new Set(duties.map(d => d.zone)))];

  const filtered = duties.filter(d =>
    (filterZone === 'All' || d.zone === filterZone) &&
    (filterStatus === 'All' || d.status === filterStatus) &&
    (d.officer.name.toLowerCase().includes(search.toLowerCase()) ||
     d.officer.badgeNo.toLowerCase().includes(search.toLowerCase()) ||
     d.zone.toLowerCase().includes(search.toLowerCase()) ||
     d.role.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:3000/api/duties/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setDuties(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    showToast('success', 'Status Updated', `Duty status changed to ${status}.`);
  };

  const deleteDuty = async (id: string, name: string) => {
    await fetch(`http://localhost:3000/api/duties/${id}`, { method: 'DELETE' });
    setDuties(prev => prev.filter(d => d.id !== id));
    showToast('info', 'Duty Removed', `${name}'s duty has been cleared.`);
  };

  // Zone breakdown for sidebar
  const uniqueZones = Array.from(new Set(duties.map(d => d.zone)));
  const maxInZone = Math.max(...uniqueZones.map(z => duties.filter(d => d.zone === z).length), 1);

  const stats = [
    { label: 'Total Deployed', value: duties.length, color: 'text-white', border: 'border-slate-700/40', bg: 'from-slate-800/60 to-slate-900/60' },
    { label: 'On Duty', value: duties.filter(d => d.status === 'On Duty').length, color: 'text-orange-400', border: 'border-orange-500/20', bg: 'from-orange-900/20 to-slate-900/60' },
    { label: 'Confirmed', value: duties.filter(d => d.status === 'Confirmed').length, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'from-emerald-900/20 to-slate-900/60' },
    { label: 'AI Assigned', value: duties.filter(d => d.aiGenerated).length, color: 'text-purple-400', border: 'border-purple-500/20', bg: 'from-purple-900/20 to-slate-900/60' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 h-[calc(100vh-56px)] overflow-y-auto flex flex-col gap-5">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Force Deployment</h2>
          <p className="text-slate-400 text-sm mt-1">सभी तैनात अधिकारियों की Live स्थिति, Zone और Shift के अनुसार।</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={fetchDuties}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold flex items-center gap-2 text-sm border border-slate-700 transition-all">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} whileHover={{ y: -3 }}
            className={`p-4 rounded-2xl border bg-gradient-to-br ${s.bg} ${s.border}`}>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{loading ? '—' : s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 flex-1">
        {/* Zone Sidebar */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/8 rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2"><MapPin size={16} className="text-blue-400" /> Zone-wise Strength</h3>
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="h-10 bg-slate-700/40 rounded-xl animate-pulse" />)
          ) : uniqueZones.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <Shield size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-xs">No deployments yet.<br/>Use Duty Assignment to assign duties.</p>
            </div>
          ) : (
            uniqueZones.map((zone, i) => {
              const count = duties.filter(d => d.zone === zone).length;
              const pct = Math.round((count / maxInZone) * 100);
              return (
                <div key={zone}>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <button onClick={() => setFilterZone(filterZone === zone ? 'All' : zone)}
                      className={`font-bold hover:text-white transition-colors ${filterZone === zone ? 'text-white' : 'text-slate-400'}`}>
                      {zone.replace('Zone ', 'Z')}
                    </button>
                    <span className="text-slate-400">{count} officers</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.12, duration: 0.6 }}
                      className={`h-full rounded-full ${zoneColors[i % 4]}`} />
                  </div>
                </div>
              );
            })
          )}

          {/* Summary */}
          {!loading && duties.length > 0 && (
            <div className="mt-auto pt-4 border-t border-slate-700/50 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Officers</span>
                <span className="text-white font-bold">{duties.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Events Covered</span>
                <span className="text-white font-bold">{new Set(duties.map(d => d.event.eventId)).size}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Zones Active</span>
                <span className="text-white font-bold">{uniqueZones.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Table */}
        <div className="lg:col-span-3 bg-slate-900/60 backdrop-blur-xl border border-white/8 rounded-3xl overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-700/50 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search officer, badge, zone, role..."
                className="w-full pl-10 pr-4 py-2 bg-slate-950/50 border border-slate-700/40 rounded-2xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'Assigned', 'On Duty', 'Confirmed'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${filterStatus === s ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800/50 text-slate-400 border-slate-700/50'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-700/40 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-5 py-3">Assign ID</th>
                  <th className="px-5 py-3">Officer Name</th>
                  <th className="px-5 py-3">Rank / Badge</th>
                  <th className="px-5 py-3">Zone</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Shift</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-700/20">
                {loading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="p-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <Users size={40} className="opacity-20" />
                      <p className="font-medium">No deployments found</p>
                      <p className="text-xs">Go to <strong className="text-blue-400">Duty Assignment</strong> to assign duties</p>
                    </div>
                  </td></tr>
                ) : filtered.map((duty, i) => (
                  <motion.tr key={duty.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-5 py-3 font-mono text-blue-400 text-[11px] font-bold">{duty.assignId}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-[10px] font-bold text-slate-300">
                          {duty.officer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-white font-bold text-[13px]">{duty.officer.name}</p>
                          <p className="text-slate-500 text-[10px]">{duty.event.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-blue-400 font-mono text-[11px]">{duty.officer.badgeNo}</p>
                      <p className="text-slate-500 text-[11px]">{duty.officer.rank}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-300 text-[12px]">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${zoneColors[uniqueZones.indexOf(duty.zone) % 4]}`} />
                        {duty.zone.replace('Zone ', 'Z').split('–')[0].trim()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-300 text-[12px]">{duty.role}</td>
                    <td className="px-5 py-3 text-slate-400 text-[11px]">{duty.shift.split('(')[0].trim()}</td>
                    <td className="px-5 py-3">
                      <select value={duty.status}
                        onChange={e => updateStatus(duty.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border appearance-none bg-transparent cursor-pointer focus:outline-none ${statusStyles[duty.status] || 'text-slate-300 border-slate-600'}`}>
                        {['Assigned', 'Confirmed', 'On Duty', 'Completed'].map(s => (
                          <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => deleteDuty(duty.id, duty.officer.name)}
                        className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-700/50 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              Showing <span className="text-slate-300 font-bold">{filtered.length}</span> of <span className="text-slate-300 font-bold">{duties.length}</span> deployments
            </p>
            <p className="text-xs text-slate-600">Tip: Click status dropdown to update officer status</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
