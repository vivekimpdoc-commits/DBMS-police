import { useState } from 'react';
import { Shield, Lock, User, Languages, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n';
import { showToast } from '../components/Toast';

const roles = [
  { id: 'DGP', icon: '🎖️', label: 'DGP / ADG', sub: 'State Level — Full Access' },
  { id: 'SP',  icon: '🪖', label: 'SSP / SP',  sub: 'District Level — Command View' },
  { id: 'CO',  icon: '🏢', label: 'CO / DSP',  sub: 'Sector Level — Management' },
  { id: 'Officer', icon: '👮', label: 'Officer / Constable', sub: 'Mobile Duty App' },
];

export default function Login() {
  const navigate = useNavigate();
  const { t, lang, toggleLanguage } = useLanguage();
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      showToast('error', 'Authentication Failed', 'Please enter your passcode.');
      return;
    }
    setLoading(true);
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    if (selectedRole.id === 'Officer') {
      showToast('success', 'Welcome!', 'Redirecting to Officer Mobile App...');
      setTimeout(() => navigate('/mobile'), 800);
    } else {
      showToast('success', `Welcome, ${selectedRole.label}`, 'Access Granted. Loading Command Center...');
      setTimeout(() => navigate('/'), 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-[-10%] w-[70%] h-[70%] bg-blue-900/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/15 rounded-full blur-[120px]" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-900/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-indigo-900/15 rounded-full"
        />
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Lang switcher */}
      <div className="absolute top-6 right-6 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-300 backdrop-blur-xl transition-all"
        >
          <Languages size={15} className="text-blue-400" />
          <span className="text-sm font-bold tracking-wider">{lang === 'en' ? 'हिन्दी' : 'ENGLISH'}</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glow card */}
        <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-[40px] -z-10 scale-95" />
        <div className="glass-card p-10 rounded-[36px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
          
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 15 }}
              className="relative mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-[28px] flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.4)] border border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl scale-75" />
                <Shield className="text-white w-12 h-12 relative z-10 drop-shadow-lg" />
              </div>
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-[28px] border-2 border-blue-400/30 animate-ping" />
            </motion.div>
            
            <h1 className="text-[2.5rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-slate-400 tracking-tight leading-none">
              VDMS
            </h1>
            <p className="text-slate-400 text-sm font-semibold tracking-[0.25em] uppercase mt-2">
              {lang === 'en' ? 'UP Police Command Center' : 'यूपी पुलिस कमांड सेंटर'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role selector */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase px-1">
                {t('selectRole')}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-800/60 border border-slate-700 hover:border-slate-500 rounded-2xl text-left focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all group"
                >
                  <span className="text-xl">{selectedRole.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">{selectedRole.label}</p>
                    <p className="text-slate-400 text-[11px]">{selectedRole.sub}</p>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl z-10"
                    >
                      {roles.map(role => (
                        <button
                          key={role.id} type="button"
                          onClick={() => { setSelectedRole(role); setDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors text-left ${selectedRole.id === role.id ? 'bg-blue-600/10 border-l-2 border-blue-500' : ''}`}
                        >
                          <span className="text-xl">{role.icon}</span>
                          <div>
                            <p className="text-white font-bold text-sm">{role.label}</p>
                            <p className="text-slate-400 text-[11px]">{role.sub}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase px-1">
                {t('passcode')}
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border border-slate-700 hover:border-slate-500 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all font-mono tracking-widest text-lg"
                />
              </div>
            </div>

            {/* Login button */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full relative py-4 rounded-2xl font-black text-white overflow-hidden mt-2 transition-all disabled:opacity-70"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[size:200%] animate-[shimmer_3s_linear_infinite]" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  t('authenticate')
                )}
              </span>
            </motion.button>
          </form>

          <p className="text-center text-[11px] font-bold text-slate-400 mt-8 uppercase tracking-[0.2em]">
            {t('restricted')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
