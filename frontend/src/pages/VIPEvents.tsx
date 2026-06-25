import { useState, useEffect } from 'react';
import { Plus, Search, Filter, AlertTriangle, Eye, Edit2, Trash2, X, Shield, MapPin, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '../components/Toast';

interface VIPEvent {
  id: string;
  eventId: string;
  name: string;
  date: string;
  venue: string;
  threat: string;
  status: string;
}

const threatColors: Record<string, string> = {
  High:   'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-orange-50 text-orange-700 border-orange-200',
  Low:    'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const statusColors: Record<string, string> = {
  Planning:      'bg-blue-50 text-blue-700 border-blue-200',
  Deployed:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  'ASL Pending': 'bg-orange-50 text-orange-700 border-orange-200',
  Completed:     'bg-slate-100 text-slate-600 border-slate-200',
};

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-slate-200 rounded-full animate-pulse" style={{ width: `${60 + (i * 10) % 30}%` }}></div>
        </td>
      ))}
    </tr>
  );
}

function AddEventModal({ onClose, onSave }: { onClose: () => void; onSave: (event: VIPEvent) => void }) {
  const [form, setForm] = useState({ name: '', date: '', venue: '', threat: 'High', status: 'Planning' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const eventId = `EV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`;
    try {
      const res = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventId }),
      });
      const data = await res.json();
      onSave(data);
      showToast('success', 'Event Added!', `${form.name} has been scheduled successfully.`);
      onClose();
    } catch {
      showToast('error', 'Failed to Add', 'Could not connect to server. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        onClick={e => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-3xl p-8 w-full max-w-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)]"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Shield className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">New VIP Event</h3>
              <p className="text-slate-500 text-xs">नया VIP कार्यक्रम जोड़ें</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">VIP / Event Name</label>
            <input
              type="text" required
              placeholder="e.g. Hon. PM Visit to Varanasi"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Calendar size={12}/> Date</label>
              <input
                type="date" required
                value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><AlertTriangle size={12}/> Threat Level</label>
              <select
                value={form.threat} onChange={e => setForm({ ...form, threat: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-blue-500 transition-all appearance-none shadow-sm"
              >
                <option value="High">🔴 High</option>
                <option value="Medium">🟠 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><MapPin size={12}/> Venue</label>
            <input
              type="text" required
              placeholder="e.g. Kashi Vishwanath Temple, Varanasi"
              value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Clock size={12}/> Status</label>
            <select
              value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:border-blue-500 transition-all appearance-none shadow-sm"
            >
              <option value="Planning">Planning</option>
              <option value="ASL Pending">ASL Pending</option>
              <option value="Deployed">Deployed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-colors">Cancel</button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit" disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
            >
              {saving ? 'Saving...' : '+ Add Event'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function VIPEvents() {
  const [events, setEvents] = useState<VIPEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterThreat, setFilterThreat] = useState('All');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/events')
      .then(res => res.json())
      .then(data => { setEvents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = events.filter(e =>
    (filterThreat === 'All' || e.threat === filterThreat) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) ||
     e.eventId.toLowerCase().includes(search.toLowerCase()) ||
     e.venue.toLowerCase().includes(search.toLowerCase()))
  );

  const highCount = events.filter(e => e.threat === 'High').length;
  const deployedCount = events.filter(e => e.status === 'Deployed').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 h-[calc(100vh-80px)] overflow-y-auto flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">VIP Events</h2>
          <p className="text-slate-500 text-sm mt-1">VIP / VVIP कार्यक्रमों की योजना, खतरा मूल्यांकन और तैनाती।</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/40 transition-all"
        >
          <Plus size={18} /> New Event
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: events.length, color: 'text-slate-800', bg: 'from-white to-slate-50', border: 'border-slate-200' },
          { label: 'High Threat', value: highCount, color: 'text-red-600', bg: 'from-red-50 to-white', border: 'border-red-200' },
          { label: 'Currently Deployed', value: deployedCount, color: 'text-emerald-600', bg: 'from-emerald-50 to-white', border: 'border-emerald-200' },
          { label: 'Planning Phase', value: events.filter(e => e.status === 'Planning').length, color: 'text-orange-600', bg: 'from-orange-50 to-white', border: 'border-orange-200' },
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -3 }}
            className={`p-4 rounded-3xl border bg-gradient-to-br ${s.bg} ${s.border} shadow-sm`}
          >
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{loading ? '—' : s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center bg-slate-50/50">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search events, ID, venue..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'High', 'Medium', 'Low'].map(t => (
              <button key={t}
                onClick={() => setFilterThreat(t)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${filterThreat === t ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
              >
                {t === 'All' ? <Filter size={12} className="inline mr-1" /> : null}{t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                <th className="p-4">Event ID</th>
                <th className="p-4">VIP / Event Name</th>
                <th className="p-4">Date</th>
                <th className="p-4">Venue</th>
                <th className="p-4">Threat Level</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <Shield size={40} className="opacity-20" />
                      <p className="font-medium">No events found</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((event, i) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                >
                  <td className="p-4 text-blue-600 font-mono text-[13px] font-bold">{event.eventId}</td>
                  <td className="p-4">
                    <p className="text-slate-800 font-bold">{event.name}</p>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{event.date}</td>
                  <td className="p-4 text-slate-500">{event.venue}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit border ${threatColors[event.threat] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {event.threat === 'High' && <AlertTriangle size={11} />}
                      {event.threat}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${statusColors[event.status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"><Eye size={15} /></button>
                      <button className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"><Edit2 size={15} /></button>
                      <button 
                        onClick={() => {
                          setEvents(prev => prev.filter(e => e.id !== event.id));
                          showToast('info', 'Event Removed', `${event.name} has been removed.`);
                        }}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      ><Trash2 size={15} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 flex justify-between items-center">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-300 font-bold">{filtered.length}</span> of <span className="text-slate-300 font-bold">{events.length}</span> events
          </p>
          <div className="flex gap-1.5">
            {['Prev', '1', 'Next'].map((b) => (
              <button key={b} className={`px-3 py-1.5 text-xs rounded-xl font-bold border transition-colors ${b === '1' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700'}`}>{b}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AddEventModal
            onClose={() => setShowModal(false)}
            onSave={(newEvent) => setEvents(prev => [newEvent, ...prev])}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
