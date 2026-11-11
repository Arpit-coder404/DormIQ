import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useHostelStore } from '../../store/hostelStore';
import { UserRole } from '../../types';
import { Sparkles, RotateCcw, ChevronDown, Check, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoNoticeBanner: React.FC = () => {
  const { currentUser, switchRole, resetDemoUser } = useAuthStore();
  const { resetToDemoData } = useHostelStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setDropdownOpen(false);
    if (role === 'staff') navigate('/staff');
    else if (role === 'warden') navigate('/warden');
    else if (role === 'admin') navigate('/admin');
    else navigate('/app');
  };

  const handleReset = () => {
    resetDemoUser();
    resetToDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  if (!currentUser) return null;

  return (
    <div className="bg-obsidian-light border-b border-graphite-border/80 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-mutedGrey z-40">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-lime"></span>
        </span>
        <span className="font-mono text-ivory font-medium tracking-wide">
          DEMO WORKSPACE:
        </span>
        <span className="text-mutedGrey hidden sm:inline">
          Nexus Residences (All telemetry & sensor signals simulated for demonstration)
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 bg-graphite hover:bg-graphite-light text-ivory px-2.5 py-1 rounded border border-graphite-border transition-all"
            title="Switch user role instantly"
          >
            <span className="text-[11px] text-mutedGrey">Simulating Role:</span>
            <span className="font-mono font-medium text-lime capitalize">{currentUser.role}</span>
            <ChevronDown className="w-3.5 h-3.5 text-mutedGrey" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-graphite border border-graphite-border rounded-lg shadow-2xl py-1.5 z-50">
              <div className="px-3 py-1 text-[10px] uppercase font-mono text-mutedGrey border-b border-graphite-border/60">
                Switch Role Sandbox
              </div>
              {(['resident', 'staff', 'warden', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-forest/30 transition-colors ${
                    currentUser.role === r ? 'text-lime font-medium bg-forest/20' : 'text-ivory'
                  }`}
                >
                  <span className="capitalize">{r === 'resident' ? 'Resident (Aarav)' : r === 'staff' ? 'Maintenance (Ramesh)' : r === 'warden' ? 'Warden (Dr. Rao)' : 'Admin (Vikram)'}</span>
                  {currentUser.role === r && <Check className="w-3.5 h-3.5 text-lime" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset State Button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-[11px] text-mutedGrey hover:text-ivory px-2 py-1 rounded hover:bg-graphite transition-colors"
          title="Reset tickets, bookings and state to pristine demo initial"
        >
          <RotateCcw className={`w-3 h-3 ${resetSuccess ? 'text-lime animate-spin' : ''}`} />
          <span>{resetSuccess ? 'Reset Done!' : 'Reset Demo'}</span>
        </button>
      </div>
    </div>
  );
};

