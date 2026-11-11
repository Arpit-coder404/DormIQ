import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Home, CheckCircle2, ArrowRight, ShieldCheck, Bell, Moon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { initialBlocks } from '../lib/demoData';

export const OnboardingPage: React.FC = () => {
  const { currentUser, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [selectedBlock, setSelectedBlock] = useState('Block A (Alpha Hall)');
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [roomNumber, setRoomNumber] = useState('A-204');
  const [quietHours, setQuietHours] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      block_name: selectedBlock,
      floor_number: selectedFloor,
      room_number: roomNumber,
      preferences: {
        notifications_email: emailNotifs,
        notifications_inapp: true,
        quiet_hours: quietHours,
        theme: 'dark',
      },
    });
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-control-grid">
      <div className="max-w-xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-lime bg-forest/40 border border-forest px-3 py-1 rounded-full">
            Space Allocation Protocol
          </span>
          <h1 className="font-display text-3xl font-bold text-ivory mt-4">
            Welcome to Nexus Residences
          </h1>
          <p className="text-sm text-mutedGrey mt-2">
            Configure your room identity and notification parameters to initialize your resident control dashboard.
          </p>
        </div>

        {/* Card */}
        <div className="bg-graphite border border-graphite-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleFinish} className="space-y-6">
            {/* Step 1: Select Block */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-mutedGrey mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-lime" />
                Select Residential Block
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {initialBlocks.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBlock(b.name)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedBlock === b.name
                        ? 'bg-forest/50 border-lime text-ivory shadow-sm'
                        : 'bg-obsidian border-graphite-border text-mutedGrey hover:border-sage/40'
                    }`}
                  >
                    <p className="text-xs font-bold text-ivory">{b.name.split(' ')[0]} {b.name.split(' ')[1]}</p>
                    <p className="text-[10px] text-mutedGrey mt-0.5">{b.floors_count} Floors • {b.rooms_count} Rooms</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-lime">Score {b.health_score}%</span>
                      {selectedBlock === b.name && <CheckCircle2 className="w-3.5 h-3.5 text-lime" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Floor & Room Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-mutedGrey mb-2">
                  Floor Level
                </label>
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(Number(e.target.value))}
                  className="w-full bg-obsidian border border-graphite-border rounded-xl px-4 py-3 text-sm text-ivory focus:outline-none focus:border-lime transition-colors"
                >
                  <option value={0}>Ground Floor (Level 0)</option>
                  <option value={1}>1st Floor (Level 1)</option>
                  <option value={2}>2nd Floor (Level 2)</option>
                  <option value={3}>3rd Floor (Level 3)</option>
                  <option value={4}>4th Floor Rooftop (Level 4)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-mutedGrey mb-2 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-lime" />
                  Assigned Room ID
                </label>
                <input
                  type="text"
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. A-204"
                  className="w-full bg-obsidian border border-graphite-border rounded-xl px-4 py-3 text-sm text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime transition-colors font-mono"
                />
              </div>
            </div>

            {/* Step 3: Resident Preferences */}
            <div className="border-t border-graphite-border pt-5 space-y-3">
              <span className="block text-xs font-mono uppercase tracking-wider text-mutedGrey mb-2">
                Environmental & Notification Preferences
              </span>

              <label className="flex items-center justify-between p-3 rounded-xl bg-obsidian/70 border border-graphite-border cursor-pointer hover:border-forest">
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-coolBlue" />
                  <div>
                    <p className="text-xs font-medium text-ivory">Enforce Exam Quiet Hours Protocol</p>
                    <p className="text-[11px] text-mutedGrey">Mutes non-urgent audio broadcast alerts between 23:00 - 07:00</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={quietHours}
                  onChange={(e) => setQuietHours(e.target.checked)}
                  className="w-4 h-4 rounded text-lime focus:ring-lime accent-lime"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-obsidian/70 border border-graphite-border cursor-pointer hover:border-forest">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-warningAmber" />
                  <div>
                    <p className="text-xs font-medium text-ivory">Critical Infrastructure Disruption Alerts</p>
                    <p className="text-[11px] text-mutedGrey">Instant notifications for scheduled water or power interruptions</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="w-4 h-4 rounded text-lime focus:ring-lime accent-lime"
                />
              </label>
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="w-full py-3.5 bg-lime hover:bg-lime-glow text-obsidian rounded-xl font-bold text-sm tracking-wide transition-all shadow-xl shadow-lime/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Initialize My Control Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;

