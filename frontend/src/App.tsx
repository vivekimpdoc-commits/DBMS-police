import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Users, MapPin, Activity, LayoutDashboard, Menu, Search, Bell, Smartphone, ShieldCheck, Brain, BarChart2, LogOut, Languages, ClipboardList, UserSquare2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './i18n';
import { useState, useEffect } from 'react';

import VIPEvents from './pages/VIPEvents';
import ForceDeployment from './pages/ForceDeployment';
import GISMap from './pages/Map';
import OfficerMobileView from './pages/OfficerMobileView';
import Incidents from './pages/Incidents';
import Security from './pages/Security';
import ReportsAnalytics from './pages/ReportsAnalytics';
import AIDashboard from './pages/AIDashboard';
import Login from './pages/Login';
import OfficersRegistry from './pages/OfficersRegistry';
import DutyAssignment from './pages/DutyAssignment';

interface Stats {
  totalOfficers: number; availableOfficers: number; deployedOfficers: number;
  totalEvents: number; highThreatEvents: number; activeEvents: number;
  totalDuties: number; aiDuties: number;
}

function StatCard({ title, value, sub, icon: Icon, color, border, bg, loading }:
  { title: string; value: string | number; sub: string; icon: any; color: string; border: string; bg: string; loading?: boolean }) {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -4 }}
      className={`bg-slate-800/40 backdrop-blur-xl p-6 rounded-3xl border ${border} shadow-xl relative overflow-hidden group`}>
      <div className={`absolute -right-6 -top-6 opacity-10 group-hover:scale-125 transition-transform duration-500 ${color}`}>
        <Icon size={120} />
      </div>
      <div className="relative z-10">
        <p className="text-slate-400 font-bold mb-2 uppercase tracking-wider text-[10px]">{title}</p>
        {loading ? (
          <div className="h-10 w-24 bg-slate-700/50 rounded-xl animate-pulse mb-2" />
        ) : (
          <h3 className="text-4xl font-black text-white mb-2 tracking-tight">{value}</h3>
        )}
        <span className={`${color} text-[11px] font-bold ${bg} px-3 py-1 rounded-full border border-current/20`}>{sub}</span>
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/stats')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cards = [
    { title: t('totalForce'), value: stats ? stats.totalOfficers : 0, sub: `${stats?.availableOfficers || 0} available`, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-500/15' },
    { title: t('activeVipEvents'), value: stats ? stats.activeEvents : 0, sub: `${stats?.highThreatEvents || 0} High Threat`, icon: Shield, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-500/15' },
    { title: 'Duties Assigned', value: stats ? stats.totalDuties : 0, sub: `${stats?.aiDuties || 0} AI generated`, icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-500/15' },
    { title: t('criticalAlerts'), value: '02', sub: t('immediateAction'), icon: Activity, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-500/15' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="p-6 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">{t('commandCenter')}</h2>
          <p className="text-slate-500 text-xs mt-1 font-medium uppercase tracking-widest">Real-time Overview — UP Police VIP Duty System</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-slate-500 font-medium">Last updated</p>
          <p className="text-slate-300 text-sm font-bold">{new Date().toLocaleTimeString('hi-IN')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c, i) => (
          <StatCard key={i} {...c} loading={loading} />
        ))}
      </div>

      {/* Force Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/30 p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-blue-400" /> Force Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Deployed', value: stats?.deployedOfficers || 0, total: stats?.totalOfficers || 1, color: 'bg-emerald-500' },
              { label: 'Available', value: stats?.availableOfficers || 0, total: stats?.totalOfficers || 1, color: 'bg-blue-500' },
              { label: 'On Leave / Other', value: (stats?.totalOfficers || 0) - (stats?.deployedOfficers || 0) - (stats?.availableOfficers || 0), total: stats?.totalOfficers || 1, color: 'bg-red-500' },
            ].map((item, i) => {
              const pct = stats ? Math.round((item.value / item.total) * 100) : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-slate-400">{item.value} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.15, duration: 0.7 }}
                      className={`h-full rounded-full ${item.color}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <motion.div whileHover={{ boxShadow: "0 20px 40px -15px rgba(59,130,246,0.12)" }}
          className="lg:col-span-2 bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/30 p-5">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2"><MapPin className="text-blue-400" size={16} /> {t('liveDeployment')}</h3>
          <Link to="/map" className="flex flex-col items-center justify-center h-[200px] bg-slate-950/50 rounded-2xl border border-dashed border-slate-700/50 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
               <MapPin className="text-blue-400" size={22} />
            </div>
            <p className="text-slate-400 font-medium text-sm">{t('goToMap')}</p>
            <p className="text-blue-400 text-xs mt-1 font-bold">Click to Open GIS Map →</p>
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <h3 className="col-span-full text-sm font-bold text-slate-500 uppercase tracking-widest">Quick Actions</h3>
        {[
          { to: '/vip', label: 'Add VIP Event', icon: Shield, color: 'from-blue-600/20 to-slate-900', border: 'border-blue-500/20', text: 'text-blue-400' },
          { to: '/duty', label: 'Assign Duties', icon: ClipboardList, color: 'from-purple-600/20 to-slate-900', border: 'border-purple-500/20', text: 'text-purple-400' },
          { to: '/officers', label: 'View Officers', icon: UserSquare2, color: 'from-emerald-600/20 to-slate-900', border: 'border-emerald-500/20', text: 'text-emerald-400' },
          { to: '/incidents', label: 'Report Incident', icon: Activity, color: 'from-red-600/20 to-slate-900', border: 'border-red-500/20', text: 'text-red-400' },
        ].map((qa, i) => (
          <Link to={qa.to} key={i}>
            <motion.div whileHover={{ y: -3, scale: 1.02 }}
              className={`p-4 rounded-2xl border bg-gradient-to-br ${qa.color} ${qa.border} flex items-center gap-3 cursor-pointer transition-all`}>
              <div className={`w-9 h-9 rounded-xl ${qa.color} border ${qa.border} flex items-center justify-center ${qa.text}`}>
                <qa.icon size={18} />
              </div>
              <span className={`font-bold text-sm ${qa.text}`}>{qa.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

function NavLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl font-medium transition-all relative text-sm ${
        isActive ? 'text-white bg-blue-600/10 border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
      }`}>
      {isActive && <motion.div layoutId="activeNav" className="absolute inset-0 bg-blue-500/5 rounded-2xl" />}
      <Icon size={16} className={`relative z-10 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
      <span className="relative z-10 leading-none">{label}</span>
    </Link>
  );
}

function Sidebar() {
  const { t, lang, toggleLanguage } = useLanguage();
  return (
    <div className="w-[260px] bg-slate-950/90 backdrop-blur-2xl border-r border-slate-800/50 h-screen sticky top-0 flex-col hidden md:flex z-50 shrink-0">
      <div className="p-5 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 border border-white/10">
          <Shield className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">VDMS</h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">UP Police Control</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto py-2">
        <NavLink to="/" icon={LayoutDashboard} label={t('dashboard')} />
        <NavLink to="/vip" icon={Shield} label={t('vipEvents')} />

        <div className="pt-3 pb-1 px-4">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Duty Management</p>
        </div>
        <NavLink to="/officers" icon={UserSquare2} label="Officers Registry" />
        <NavLink to="/duty" icon={ClipboardList} label="Duty Assignment" />
        <NavLink to="/deployment" icon={Users} label={t('forceDeployment')} />

        <div className="pt-3 pb-1 px-4">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Operations</p>
        </div>
        <NavLink to="/map" icon={MapPin} label={t('gisMap')} />
        <NavLink to="/incidents" icon={Activity} label={t('incidents')} />
        <NavLink to="/security" icon={ShieldCheck} label={t('security')} />

        <div className="pt-3 pb-1 px-4">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{t('analyticsHeading')}</p>
        </div>
        <NavLink to="/reports" icon={BarChart2} label={t('reports')} />
        <NavLink to="/ai" icon={Brain} label={t('aiFeed')} />

        <div className="pt-3 pb-1 px-4">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Field</p>
        </div>
        <Link to="/mobile" target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/5 rounded-2xl font-medium border border-emerald-500/15 bg-emerald-500/5 text-sm transition-all">
          <Smartphone size={16} /> {t('officerApp')}
        </Link>
      </nav>

      <div className="p-3 shrink-0 space-y-2 border-t border-slate-800/50">
        <button onClick={toggleLanguage}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-900/50 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors">
          <div className="flex items-center gap-2">
            <Languages size={14} className="text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Language</span>
          </div>
          <span className="text-[11px] font-black px-2 py-0.5 bg-slate-800 rounded-lg text-white uppercase">{lang === 'en' ? 'EN' : 'HI'}</span>
        </button>

        <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-[11px]">DGP</div>
            <div>
              <p className="text-sm font-bold text-white">Prashant K.</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{t('stateControl')}</p>
            </div>
          </div>
          <Link to="/login" className="w-full py-1.5 bg-slate-950 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-red-500/20">
            <LogOut size={12}/> {t('logout')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const { t } = useLanguage();
  return (
    <header className="h-14 border-b border-slate-800/50 bg-slate-950/70 backdrop-blur-2xl sticky top-0 z-40 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-400 hover:text-white"><Menu size={20} /></button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 w-3.5 h-3.5" />
          <input type="text" placeholder={t('searchPlaceholder')}
            className="pl-9 pr-4 py-1.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500/40 w-[300px] transition-all" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-1.5 text-slate-500 hover:text-white transition-colors hover:bg-slate-800/50 rounded-lg">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <div className="h-5 w-px bg-slate-800" />
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-white">{t('commandCenter')}</p>
          <p className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-1">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-emerald-400 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
            {t('online')}
          </p>
        </div>
      </div>
    </header>
  );
}

function MainLayout() {
  const location = useLocation();
  if (location.pathname === '/mobile') return <OfficerMobileView />;
  if (location.pathname === '/login') return <Login />;
  return (
    <div className="flex min-h-screen bg-[#020817] font-sans">
      <div className="fixed top-[-15%] left-[-8%] w-[45%] h-[45%] bg-blue-900/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-8%] w-[40%] h-[40%] bg-indigo-900/10 blur-[130px] rounded-full pointer-events-none" />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-hidden">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vip" element={<VIPEvents />} />
              <Route path="/officers" element={<OfficersRegistry />} />
              <Route path="/duty" element={<DutyAssignment />} />
              <Route path="/deployment" element={<ForceDeployment />} />
              <Route path="/map" element={<GISMap />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/security" element={<Security />} />
              <Route path="/reports" element={<ReportsAnalytics />} />
              <Route path="/ai" element={<AIDashboard />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <Router><MainLayout /></Router>;
}
