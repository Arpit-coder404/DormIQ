import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Home,
  Building2,
  Bell,
  Moon,
  RotateCcw,
  CheckCircle2,
  Shield,
  Calendar,
  Wrench,
  Award,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useHostelStore } from '../../store/hostelStore';
import { RoleBadge } from '../../components/common/RoleBadge';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile, resetDemoUser } = useAuthStore();
  const { requests, bookings, resetToDemoData } = useHostelStore();

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [roomNumber, setRoomNumber] = useState(currentUser?.room_number || '');
  const [blockName, setBlockName] = useState(currentUser?.block_name || '');
  const [quietHours, setQuietHours] = useState(currentUser?.preferences?.quiet_hours ?? true);
  const [emailNotifs, setEmailNotifs] = useState(currentUser?.preferences?.notifications_email ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!currentUser) return null;

  const myResolvedCount = requests.filter(
    (r) => r.resident_id === currentUser.id && r.status === 'resolved'
  ).length;

  const myBookingsCount = bookings.filter(
    (b) => b.resident_id === currentUser.id && b.status === 'confirmed'
  ).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      phone,
      room_number: roomNumber,
      block_name: blockName,
      preferences: {
        notifications_email: emailNotifs,
        notifications_inapp: true,
        quiet_hours: quietHours,
        theme: 'dark',
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFullReset = () => {
    resetDemoUser();
    resetToDemoData();
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-graphite-border">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-lime bg-forest/40 border border-forest px-2.5 py-1 rounded-full">
            Resident Identity & Settings
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ivory mt-2">
            Resident Profile & Space
          </h1>
          <p className="text-xs sm:text-sm text-mutedGrey mt-0.5">
            Manage your room credentials, notification preferences, and workspace sandbox.
          </p>
        </div>

        <RoleBadge role={currentUser.role} size="md" />
      </div>

      {/* Main Profile Identity Card */}
      <div className="bg-graphite border border-graphite-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-graphite-border">
          <img
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={currentUser.full_name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-forest shadow-lg"
          />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-display font-bold text-ivory">{currentUser.full_name}</h2>
            <p className="text-xs text-mutedGrey font-mono">{currentUser.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 font-mono text-xs">
              <span className="text-lime bg-forest/40 px-2.5 py-0.5 rounded border border-forest">
                {currentUser.room_number || 'A-204'}
              </span>
              <span className="text-mutedGrey">•</span>
              <span className="text-ivory">{currentUser.block_name}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-obsidian-light border border-graphite-border text-center">
            <span className="text-2xl font-display font-bold text-lime">{myResolvedCount}</span>
            <p className="text-[10px] font-mono text-mutedGrey uppercase mt-0.5">Resolved Issues</p>
          </div>
          <div className="p-4 rounded-xl bg-obsidian-light border border-graphite-border text-center">
            <span className="text-2xl font-display font-bold text-coolBlue">{myBookingsCount}</span>
            <p className="text-[10px] font-mono text-mutedGrey uppercase mt-0.5">Active Bookings</p>
          </div>
          <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-obsidian-light border border-graphite-border text-center">
            <span className="text-2xl font-display font-bold text-ivory font-mono">100%</span>
            <p className="text-[10px] font-mono text-mutedGrey uppercase mt-0.5">Identity Verification</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-graphite border border-graphite-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey">
          Update Personal Contact & Space Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-mutedGrey mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-lime" />
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-obsidian border border-graphite-border rounded-xl px-4 py-2.5 text-sm text-ivory focus:outline-none focus:border-lime"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-mutedGrey mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-lime" />
              Emergency Phone Contact
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-obsidian border border-graphite-border rounded-xl px-4 py-2.5 text-sm text-ivory font-mono focus:outline-none focus:border-lime"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-mutedGrey mb-1.5 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-lime" />
              Room Number
            </label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full bg-obsidian border border-graphite-border rounded-xl px-4 py-2.5 text-sm text-ivory font-mono focus:outline-none focus:border-lime"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-mutedGrey mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-lime" />
              Assigned Block
            </label>
            <input
              type="text"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              className="w-full bg-obsidian border border-graphite-border rounded-xl px-4 py-2.5 text-sm text-ivory focus:outline-none focus:border-lime"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="pt-4 border-t border-graphite-border space-y-3">
          <span className="block text-xs font-mono uppercase text-mutedGrey mb-1">
            Notification System Settings
          </span>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-obsidian-light border border-graphite-border cursor-pointer">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-coolBlue" />
              <div>
                <p className="text-xs font-bold text-ivory">Exam Quiet Hours Suppression</p>
                <p className="text-[11px] text-mutedGrey">Silences non-emergency audio broadcasts between 23:00 - 07:00</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={quietHours}
              onChange={(e) => setQuietHours(e.target.checked)}
              className="w-4 h-4 rounded text-lime focus:ring-lime accent-lime"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-obsidian-light border border-graphite-border cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-warningAmber" />
              <div>
                <p className="text-xs font-bold text-ivory">Email Notifications for Work Orders</p>
                <p className="text-[11px] text-mutedGrey">Receive emails when staff accepts or resolves your maintenance requests</p>
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

        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs text-lime font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved!
            </span>
          )}
          {!savedSuccess && <span></span>}

          <button
            type="submit"
            className="py-2.5 px-6 bg-lime hover:bg-lime-glow text-obsidian font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-lime/20"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Danger / Demo Reset Zone */}
      <div className="bg-obsidian border border-alertCoral/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-alertCoral flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Demo Workspace
          </h4>
          <p className="text-xs text-mutedGrey mt-0.5">
            Restore all tickets, room statuses, bookings, and announcements back to pristine sample data.
          </p>
        </div>

        <button
          onClick={handleFullReset}
          className="px-4 py-2.5 rounded-xl bg-alertCoral/10 border border-alertCoral/40 text-alertCoral hover:bg-alertCoral/20 text-xs font-mono font-bold transition-all whitespace-nowrap"
        >
          {resetSuccess ? 'Resetting...' : 'Reset Entire Demo State'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

