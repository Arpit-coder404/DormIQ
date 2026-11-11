import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Shield, KeyRound, User, Wrench, Award, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import { initialProfiles } from '../lib/demoData';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('resident');
  const [error, setError] = useState('');
  const { login, switchRole } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid campus email');
      return;
    }
    setError('');
    login(email, role);
    if (mode === 'signup') {
      navigate('/onboarding');
    } else {
      if (role === 'staff') navigate('/staff');
      else if (role === 'warden') navigate('/warden');
      else if (role === 'admin') navigate('/admin');
      else navigate('/app');
    }
  };

  const handleQuickDemoSelect = (pRole: UserRole) => {
    switchRole(pRole);
    if (pRole === 'staff') navigate('/staff');
    else if (pRole === 'warden') navigate('/warden');
    else if (pRole === 'admin') navigate('/admin');
    else navigate('/app');
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-control-grid">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-forest/20 blur-3xl pointer-events-none rounded-full"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="w-12 h-12 rounded-xl bg-graphite border border-forest group-hover:border-lime flex items-center justify-center transition-all shadow-lg">
            <Cpu className="w-6 h-6 text-lime" />
          </div>
          <span className="font-display font-bold text-2xl text-ivory tracking-tight">
            Dorm<span className="text-lime">IQ</span>
          </span>
        </Link>
        <h2 className="font-display text-2xl font-bold tracking-tight text-ivory">
          {mode === 'signin' ? 'Sign in to your control center' : 'Create resident access'}
        </h2>
        <p className="mt-1 text-xs text-mutedGrey">
          Hostel Infrastructure & Operations Platform
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-graphite border border-graphite-border rounded-2xl shadow-2xl p-6 sm:p-8 relative">
          {/* Quick Demo Access Bar */}
          <div className="mb-6 pb-6 border-b border-graphite-border">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] text-lime uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
                Quick Demo Switcher
              </span>
              <span className="text-[10px] text-mutedGrey font-mono">1-Click Sign In</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {initialProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleQuickDemoSelect(p.role)}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg border border-graphite-border hover:border-lime/60 bg-obsidian-light/60 hover:bg-forest/20 text-left transition-all group"
                >
                  <div className="w-7 h-7 rounded-full bg-graphite flex items-center justify-center border border-graphite-border text-xs">
                    {p.role === 'resident' && <User className="w-3.5 h-3.5 text-lime" />}
                    {p.role === 'staff' && <Wrench className="w-3.5 h-3.5 text-warningAmber" />}
                    {p.role === 'warden' && <Shield className="w-3.5 h-3.5 text-coolBlue" />}
                    {p.role === 'admin' && <Award className="w-3.5 h-3.5 text-lime" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-ivory group-hover:text-lime truncate">
                      {p.full_name}
                    </p>
                    <p className="text-[10px] text-mutedGrey capitalize truncate">
                      {p.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex border-b border-graphite-border mb-6">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 pb-3 text-xs font-mono uppercase tracking-wider text-center border-b-2 transition-all ${
                mode === 'signin'
                  ? 'border-lime text-lime font-bold'
                  : 'border-transparent text-mutedGrey hover:text-ivory'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 pb-3 text-xs font-mono uppercase tracking-wider text-center border-b-2 transition-all ${
                mode === 'signup'
                  ? 'border-lime text-lime font-bold'
                  : 'border-transparent text-mutedGrey hover:text-ivory'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-alertCoral/10 border border-alertCoral/30 text-alertCoral text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono uppercase text-mutedGrey mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-obsidian border border-graphite-border rounded-lg px-3.5 py-2.5 text-sm text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime/60 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-mutedGrey mb-1.5">
                Campus Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@nexus.campus.edu"
                className="w-full bg-obsidian border border-graphite-border rounded-lg px-3.5 py-2.5 text-sm text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-mutedGrey mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-obsidian border border-graphite-border rounded-lg px-3.5 py-2.5 text-sm text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime/60 transition-colors"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono uppercase text-mutedGrey mb-1.5">
                  Designated Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-obsidian border border-graphite-border rounded-lg px-3.5 py-2.5 text-sm text-ivory focus:outline-none focus:border-lime/60 transition-colors"
                >
                  <option value="resident">Resident Student</option>
                  <option value="staff">Maintenance Staff</option>
                  <option value="warden">Hostel Warden</option>
                  <option value="admin">Hostel Administrator</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-lime hover:bg-lime-glow text-obsidian rounded-lg font-bold text-sm tracking-wide transition-all shadow-lg shadow-lime/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>{mode === 'signin' ? 'Access Control System' : 'Complete Setup & Onboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-graphite-border text-center text-xs text-mutedGrey">
            <span>Protected by DormIQ Identity Guard. Sample data initialized.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

