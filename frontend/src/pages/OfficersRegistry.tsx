import { useState, useEffect } from 'react';
import { UserPlus, Badge, Search, Phone, MapPin, Shield, Edit2, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '../components/Toast';

interface Officer {
  id: string;
  badgeNo: string;
  name: string;
  rank: string;
  unit: string;
  district: string;
  phone: string;
  availability: string;
  speciality: string;
}

const rankColors: Record<string, string> = {
  DGP: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  ADG: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  IG:  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  DSP: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Inspector: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  'Sub-Inspector': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Head Constable': 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  Constable: 'bg-slate-600/10 text-slate-400 border-slate-600/20',
};

const availColors: Record<string, string> = {
  Available: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Deployed:  'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'On Leave': 'text-red-400 bg-red-500/10 border-red-500/20',
};

const RANKS = ['DGP', 'ADG', 'IG', 'DIG', 'SSP', 'SP', 'ASP', 'DSP', 'Inspector', 'Sub-Inspector', 'Head Constable', 'Constable'];
const SPECIALITIES = ['General', 'Traffic', 'QRT', 'BDS', 'IB', 'Women Police', 'Cyber'];
const DISTRICTS = ['Lucknow', 'Varanasi', 'Agra', 'Kanpur', 'Allahabad', 'Ghaziabad', 'Noida', 'Meerut', 'Mathura', 'Bareilly'];

function AddOfficerModal({ onClose, onSave }: { onClose: () => void; onSave: (o: Officer) => void }) {
  const [form, setForm] = useState({ badgeNo: '', name: '', rank: 'Constable', unit: '', district: 'Lucknow', phone: '', speciality: 'General' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('http://localhost:3000/api/officers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      onSave(data);
      showToast('success', 'Officer Added!', `${form.name} has been registered in the system.`);
      onClose();
    } catch {
      showToast('error', 'Failed', 'Could not add officer. Please try again.');
    } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 24 }}
        onClick={e => e.stopPropagation()}
        className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
            <UserPlus className="text-emerald-400" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">नया अधिकारी जोड़ें</h3>
            <p className="text-slate-400 text-xs">Add New Officer to Registry</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {[
            { label: 'Badge Number', key: 'badgeNo', placeholder: 'UPP-XXXX', col: 1 },
            { label: 'Full Name / पूरा नाम', key: 'name', placeholder: 'Insp. Ram Kumar', col: 1 },
            { label: 'Unit / बटालियन', key: 'unit', placeholder: '18th Bn PAC', col: 1 },
            { label: 'Phone', key: 'phone', placeholder: '9876543210', col: 1 },
          ].map(f => (
            <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{f.label}</label>
              <input type="text" required placeholder={f.placeholder}
                value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
              />
            </div>
          ))}

          {[
            { label: 'Rank / पद', key: 'rank', options: RANKS },
            { label: 'District', key: 'district', options: DISTRICTS },
            { label: 'Speciality', key: 'speciality', options: SPECIALITIES },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{f.label}</label>
              <select value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all text-sm appearance-none">
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}

          <div className="col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-sm transition-colors">Cancel</button>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-900/40 disabled:opacity-60">
              {saving ? 'Saving...' : '+ Register Officer'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function OfficersRegistry() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAvail, setFilterAvail] = useState('All');
  const [filterRank, setFilterRank] = useState('All');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/officers')
      .then(r => r.json()).then(d => { setOfficers(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = officers.filter(o =>
    (filterAvail === 'All' || o.availability === filterAvail) &&
    (filterRank === 'All' || o.rank === filterRank) &&
    (o.name.toLowerCase().includes(search.toLowerCase()) ||
     o.badgeNo.toLowerCase().includes(search.toLowerCase()) ||
     o.unit.toLowerCase().includes(search.toLowerCase()))
  );

  const deleteOfficer = async (id: string, name: string) => {
    if (!confirm(`Remove ${name}?`)) return;
    await fetch(`http://localhost:3000/api/officers/${id}`, { method: 'DELETE' });
    setOfficers(prev => prev.filter(o => o.id !== id));
    showToast('info', 'Officer Removed', `${name} removed from registry.`);
  };

  const stats = [
    { label: 'Total Officers', value: officers.length, color: 'text-white', border: 'border-slate-700/50', bg: 'from-slate-800/60 to-slate-900/60' },
    { label: 'Available', value: officers.filter(o => o.availability === 'Available').length, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'from-emerald-900/20 to-slate-900/60' },
    { label: 'Deployed', value: officers.filter(o => o.availability === 'Deployed').length, color: 'text-orange-400', border: 'border-orange-500/20', bg: 'from-orange-900/20 to-slate-900/60' },
    { label: 'On Leave', value: officers.filter(o => o.availability === 'On Leave').length, color: 'text-red-400', border: 'border-red-500/20', bg: 'from-red-900/20 to-slate-900/60' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 h-[calc(100vh-80px)] overflow-y-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Officers Registry</h2>
          <p className="text-slate-400 text-sm mt-1">अधिकारियों का पूरा डेटाबेस, उपलब्धता और विशेषज्ञता।</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40">
          <UserPlus size={18} /> नया अधिकारी जोड़ें
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} whileHover={{ y: -3 }}
            className={`p-4 rounded-2xl border bg-gradient-to-br ${s.bg} ${s.border} backdrop-blur-md`}>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{loading ? '—' : s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters + Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/8 rounded-3xl overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-700/50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, badge, unit..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-700/40 rounded-2xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', 'Available', 'Deployed', 'On Leave'].map(a => (
              <button key={a} onClick={() => setFilterAvail(a)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${filterAvail === a ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600'}`}>
                {a}
              </button>
            ))}
            <select value={filterRank} onChange={e => setFilterRank(e.target.value)}
              className="px-3 py-2 bg-slate-800/50 text-slate-400 border border-slate-700/50 rounded-xl text-xs font-bold focus:outline-none hover:border-slate-600 transition-all appearance-none">
              <option value="All">All Ranks</option>
              {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-700/50 text-slate-400 text-[11px] uppercase tracking-widest">
                <th className="p-4">Badge No.</th>
                <th className="p-4">Officer Name</th>
                <th className="p-4">Rank / पद</th>
                <th className="p-4">Unit</th>
                <th className="p-4 hidden lg:table-cell">District</th>
                <th className="p-4 hidden lg:table-cell">Speciality</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-700/30">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-700/30">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="p-4"><div className="h-4 bg-slate-700/50 rounded-full animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="p-12 text-center text-slate-500">No officers found.</td></tr>
              ) : filtered.map((officer, i) => (
                <motion.tr key={officer.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-slate-800/30 transition-colors group cursor-pointer">
                  <td className="p-4 font-mono text-blue-400 text-[12px] font-bold">{officer.badgeNo}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600/50">
                        {officer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <p className="text-white font-bold">{officer.name}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${rankColors[officer.rank] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                      {officer.rank}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 text-sm">{officer.unit}</td>
                  <td className="p-4 text-slate-400 text-sm hidden lg:table-cell">
                    <span className="flex items-center gap-1"><MapPin size={12} />{officer.district}</span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg text-xs border border-slate-700/50">{officer.speciality}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1 w-fit ${availColors[officer.availability]}`}>
                      {officer.availability === 'Available' ? <CheckCircle2 size={11} /> : officer.availability === 'Deployed' ? <Shield size={11} /> : <XCircle size={11} />}
                      {officer.availability}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => deleteOfficer(officer.id, officer.name)}
                        className="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-700/50 text-xs text-slate-500 font-medium">
          Showing <span className="text-slate-300 font-bold">{filtered.length}</span> of <span className="text-slate-300 font-bold">{officers.length}</span> officers
        </div>
      </div>

      <AnimatePresence>
        {showModal && <AddOfficerModal onClose={() => setShowModal(false)} onSave={o => setOfficers(prev => [o, ...prev])} />}
      </AnimatePresence>
    </motion.div>
  );
}
