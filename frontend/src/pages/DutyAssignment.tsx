import { useState, useEffect, useRef } from 'react';
import { Brain, UserPlus, Zap, Printer, X, MapPin, Clock, Users, Trash2, RefreshCw, AlertTriangle, RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '../components/Toast';

interface VIPEvent { id: string; eventId: string; name: string; threat: string; venue: string; date: string; status: string; }
interface Officer  { id: string; badgeNo: string; name: string; rank: string; unit: string; district: string; availability: string; }
interface DutyAssignment {
  id: string; assignId: string; zone: string; sector: string; role: string; shift: string;
  reportingAt: string; reportingTo: string; status: string; aiGenerated: boolean;
  officer: Officer; event: VIPEvent;
}

const ZONES = ['Zone 1 – Inner Cordon', 'Zone 2 – Outer Cordon', 'Zone 3 – Route A', 'Zone 4 – Reserve'];
const ROLES = ['Sector Incharge', 'Close Protection', 'Route Mobile', 'Checkpost', 'Beat Officer', 'Traffic', 'Quick Response Team', 'Armed Guard', 'Perimeter'];
const SHIFTS = ['Morning (6AM–2PM)', 'Afternoon (2PM–10PM)', 'Night (10PM–6AM)'];

function AssignModal({ event, officers, onClose, onSave, onOfficersRefresh }: {
  event: VIPEvent; officers: Officer[]; onClose: () => void;
  onSave: (d: DutyAssignment) => void; onOfficersRefresh: () => void;
}) {
  const available = officers.filter(o => o.availability === 'Available');
  const deployed  = officers.filter(o => o.availability === 'Deployed');
  const allSorted = [...available, ...deployed];

  const [form, setForm] = useState({
    officerId: allSorted[0]?.id || '',
    zone: ZONES[0], sector: 'Sector 1', role: ROLES[0], shift: SHIFTS[0],
    reportingAt: event.venue, reportingTo: 'Sector Commander'
  });
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.officerId) { showToast('error', 'अधिकारी चुनें', 'कृपया एक अधिकारी select करें।'); return; }
    setSaving(true);
    try {
      const res = await fetch('http://localhost:3000/api/duties', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventId: event.id })
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const data = await res.json();
      onSave(data);
      onOfficersRefresh();
      showToast('success', 'ड्यूटी लगाई गई!', `${data.officer.name} को ${form.zone} में तैनात किया गया।`);
      onClose();
    } catch (err: any) { showToast('error', 'Error', err.message || 'Could not assign duty.'); }
    finally { setSaving(false); }
  };

  const handleResetAll = async () => {
    if (!confirm('इस event की सभी duties हटा दें? सभी officers Available हो जाएंगे।')) return;
    setResetting(true);
    try {
      const res = await fetch(`http://localhost:3000/api/duties/event/${event.id}`, { method: 'DELETE' });
      const d = await res.json();
      onOfficersRefresh();
      showToast('info', 'Duties Reset', `${d.cleared} duties हटाई गईं। अब सभी officers Available हैं।`);
      onClose();
    } catch { showToast('error', 'Error', 'Reset failed.'); }
    finally { setResetting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 24 }}
        onClick={e => e.stopPropagation()}
        className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <UserPlus className="text-blue-400" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">नई ड्यूटी लगाएं</h3>
              <p className="text-slate-400 text-xs font-medium">{event.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Availability summary */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
            <p className="text-2xl font-black text-emerald-400">{available.length}</p>
            <p className="text-emerald-500/80 text-[10px] font-bold uppercase tracking-wider">Available</p>
          </div>
          <div className="flex-1 p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-center">
            <p className="text-2xl font-black text-orange-400">{deployed.length}</p>
            <p className="text-orange-500/80 text-[10px] font-bold uppercase tracking-wider">Deployed</p>
          </div>
          <div className="flex-1 p-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-center">
            <p className="text-2xl font-black text-white">{officers.length}</p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total</p>
          </div>
        </div>

        {available.length === 0 && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-amber-300 text-xs">कोई officer available नहीं है। आप deployed officers को भी assign कर सकते हैं, या नीचे Reset बटन से सभी duties clear करें।</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Officer / अधिकारी चुनें
            </label>
            <select value={form.officerId} onChange={e => setForm({ ...form, officerId: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all text-sm appearance-none">
              {allSorted.length === 0 ? (
                <option value="" className="bg-slate-900 text-white">— No officers in system —</option>
              ) : (
                <>
                  {available.length > 0 && <optgroup label="✅ Available Officers">
                    {available.map(o => <option key={o.id} value={o.id} className="bg-slate-900 text-white">{o.rank} {o.name} ({o.badgeNo})</option>)}
                  </optgroup>}
                  {deployed.length > 0 && <optgroup label="🔶 Deployed Officers (can reassign)">
                    {deployed.map(o => <option key={o.id} value={o.id} className="bg-slate-900 text-white">{o.rank} {o.name} ({o.badgeNo}) — Deployed</option>)}
                  </optgroup>}
                </>
              )}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Zone / जोन</label>
              <select value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all text-sm appearance-none">
                {ZONES.map(z => <option key={z} value={z} className="bg-slate-900 text-white">{z}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Role / भूमिका</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all text-sm appearance-none">
                {ROLES.map(r => <option key={r} value={r} className="bg-slate-900 text-white">{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Shift / पाली (Custom or select)</label>
              <input list="shifts-list" value={form.shift} onChange={e => setForm({ ...form, shift: e.target.value })}
                placeholder="e.g. Morning (6AM-2PM) or 8AM-4PM"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all text-sm" />
              <datalist id="shifts-list">
                {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
              </datalist>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sector</label>
              <input type="text" value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reporting Location</label>
            <input type="text" value={form.reportingAt} onChange={e => setForm({ ...form, reportingAt: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all text-sm" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-sm">Cancel</button>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={saving || allSorted.length === 0}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg disabled:opacity-50">
              {saving ? 'Assigning...' : '✓ Assign Duty'}
            </motion.button>
          </div>
        </form>

        {/* Reset all duties for event */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <button type="button" onClick={handleResetAll} disabled={resetting}
            className="w-full py-2.5 flex items-center justify-center gap-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-2xl text-xs font-bold border border-transparent hover:border-red-500/20 transition-all disabled:opacity-50">
            <RotateCcw size={13} />
            {resetting ? 'Resetting...' : 'Reset All Duties for This Event'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DutyAssignment() {
  const [events, setEvents] = useState<VIPEvent[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [duties, setDuties] = useState<DutyAssignment[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/api/events').then(r => r.json()),
      fetch('http://localhost:3000/api/officers').then(r => r.json()),
    ]).then(([evts, offs]) => {
      setEvents(evts);
      setOfficers(offs);
      if (evts.length > 0) setSelectedEventId(evts[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;
    setLoading(true);
    fetch(`http://localhost:3000/api/duties?eventId=${selectedEventId}`)
      .then(r => r.json()).then(d => { setDuties(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedEventId]);

  const handleAIAssign = async () => {
    if (!selectedEventId) return;
    setAiLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/duties/ai-assign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: selectedEventId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDuties(prev => [...data.assignments, ...prev]);
      // Refresh officers to update availability
      const newOfficers = await fetch('http://localhost:3000/api/officers').then(r => r.json());
      setOfficers(newOfficers);
      showToast('success', `🤖 AI Assignment Complete!`, data.message);
    } catch (err: any) {
      showToast('error', 'AI Assignment Failed', err.message || 'Please add more available officers.');
    } finally { setAiLoading(false); }
  };

  const refreshOfficers = () => {
    fetch('http://localhost:3000/api/officers').then(r => r.json()).then(setOfficers);
  };

  const deleteDuty = async (id: string) => {
    await fetch(`http://localhost:3000/api/duties/${id}`, { method: 'DELETE' });
    setDuties(prev => prev.filter(d => d.id !== id));
    refreshOfficers();
    showToast('info', 'Duty Removed', 'Officer is now available again.');
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const groupedByZone = ZONES.map(zone => ({
    zone, duties: duties.filter(d => d.zone === zone)
  })).filter(g => g.duties.length > 0);

  const handlePrint = () => window.print();

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 h-[calc(100vh-80px)] overflow-y-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Duty Assignment</h2>
          <p className="text-slate-400 text-sm mt-1">ड्यूटी लगाएं — Manual या AI से। Zone-wise ड्यूटी चार्ट देखें।</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 text-sm transition-all shadow-lg shadow-blue-900/30">
            <UserPlus size={16} /> Manual Assign
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={handleAIAssign} disabled={aiLoading}
            className="bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600 text-white px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 text-sm transition-all shadow-lg shadow-purple-900/40 disabled:opacity-60">
            {aiLoading ? <RefreshCw size={16} className="animate-spin" /> : <Brain size={16} />}
            {aiLoading ? 'AI Working...' : 'AI से ड्यूटी लगाएं'}
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={handlePrint}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 text-sm border border-slate-700 transition-all">
            <Printer size={16} /> Print Chart
          </motion.button>
        </div>
      </div>

      {/* Event Selector */}
      <div className="flex gap-3 flex-wrap">
        {events.map(event => (
          <button key={event.id} onClick={() => setSelectedEventId(event.id)}
            className={`px-4 py-3 rounded-2xl text-sm font-bold border transition-all flex items-center gap-2 ${selectedEventId === event.id
              ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-lg shadow-blue-900/20'
              : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
            }`}>
            <span className={`w-2 h-2 rounded-full ${event.threat === 'High' ? 'bg-red-500' : 'bg-orange-500'}`} />
            <span>{event.name}</span>
            {event.threat === 'High' && <span className="text-[10px] text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20">HIGH</span>}
          </button>
        ))}
      </div>

      {/* Stats Row */}
      {selectedEvent && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Assigned', value: duties.length, icon: Users, color: 'text-white', border: 'border-slate-700/50', bg: 'from-slate-800/60 to-slate-900' },
            { label: 'AI Generated', value: duties.filter(d => d.aiGenerated).length, icon: Brain, color: 'text-purple-400', border: 'border-purple-500/20', bg: 'from-purple-900/20 to-slate-900' },
            { label: 'Available Officers', value: officers.filter(o => o.availability === 'Available').length, icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'from-emerald-900/20 to-slate-900' },
            { label: 'Zones Covered', value: groupedByZone.length, icon: MapPin, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'from-blue-900/20 to-slate-900' },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -3 }}
              className={`p-4 rounded-2xl border bg-gradient-to-br ${s.bg} ${s.border} flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl bg-slate-900 border ${s.border} flex items-center justify-center ${s.color}`}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{loading ? '—' : s.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Duty Chart — Zone-wise */}
      <div ref={printRef} className="flex flex-col gap-4" id="duty-chart">
        {loading ? (
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 text-center text-slate-500">
            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
            Loading duty chart...
          </div>
        ) : duties.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-slate-900/60 border border-dashed border-slate-700/50 rounded-3xl p-16 text-center">
            <Brain className="mx-auto mb-4 text-purple-400/50" size={48} />
            <h3 className="text-white font-bold text-xl mb-2">कोई ड्यूटी नहीं लगी है</h3>
            <p className="text-slate-400 mb-6">Click <strong className="text-purple-400">"AI से ड्यूटी लगाएं"</strong> to auto-assign, or use <strong className="text-blue-400">"Manual Assign"</strong></p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">Manual Assign</button>
              <button onClick={handleAIAssign} disabled={aiLoading} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold flex items-center gap-2">
                <Brain size={14} /> AI से ड्यूटी लगाएं
              </button>
            </div>
          </motion.div>
        ) : groupedByZone.map((group, gi) => (
          <motion.div key={group.zone}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }}
            className="bg-slate-900/60 backdrop-blur-xl border border-white/8 rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${gi === 0 ? 'bg-red-500' : gi === 1 ? 'bg-orange-500' : gi === 2 ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                <h3 className="text-white font-black text-base">{group.zone}</h3>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">{group.duties.length} officers</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-700/30">
                    <th className="px-6 py-3 text-left">Officer Name</th>
                    <th className="px-6 py-3 text-left">Badge / Rank</th>
                    <th className="px-6 py-3 text-left">Role / भूमिका</th>
                    <th className="px-6 py-3 text-left">Shift / पाली</th>
                    <th className="px-6 py-3 text-left">Sector</th>
                    <th className="px-6 py-3 text-left">Source</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/20">
                  {group.duties.map((duty, i) => (
                    <tr key={duty.id} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center text-[10px] font-bold text-slate-300">
                            {duty.officer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <p className="text-white font-bold">{duty.officer.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-blue-400 font-mono text-[11px] font-bold">{duty.officer.badgeNo}</p>
                        <p className="text-slate-500 text-[11px]">{duty.officer.rank}</p>
                      </td>
                      <td className="px-6 py-3 text-slate-300 font-medium">{duty.role}</td>
                      <td className="px-6 py-3">
                        <span className="text-slate-400 text-xs flex items-center gap-1"><Clock size={11} />{duty.shift}</span>
                      </td>
                      <td className="px-6 py-3 text-slate-400 text-xs">{duty.sector}</td>
                      <td className="px-6 py-3">
                        {duty.aiGenerated ? (
                          <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold border border-purple-500/20 flex items-center gap-1 w-fit">
                            <Zap size={9} /> AI
                          </span>
                        ) : (
                          <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-500/20 flex items-center gap-1 w-fit">
                            <Users size={9} /> Manual
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => deleteDuty(duty.id)}
                          className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && selectedEvent && (
          <AssignModal
            event={selectedEvent}
            officers={officers}
            onClose={() => setShowModal(false)}
            onSave={d => setDuties(prev => [d, ...prev])}
            onOfficersRefresh={() => {
              refreshOfficers();
              // Reload duties for current event after reset
              if (selectedEventId) {
                fetch(`http://localhost:3000/api/duties?eventId=${selectedEventId}`)
                  .then(r => r.json()).then(setDuties);
              }
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
