import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Users,
  Building2,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  Search,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { useHostelStore } from '../store/hostelStore';
import { useAuthStore } from '../store/authStore';
import { initialProfiles } from '../lib/demoData';

export const AdminDashboard: React.FC = () => {
  const { hostel, blocks, rooms, requests, facilities } = useHostelStore();
  const { currentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'staff'>('overview');
  const [roomFilter, setRoomFilter] = useState('');

  const activeRequests = requests.filter((r) => r.status !== 'resolved' && r.status !== 'rejected');
  const resolvedCount = requests.filter((r) => r.status === 'resolved').length;

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Room,Block,Category,Priority,Status,Reported_By\n' +
      requests.map((r) => `${r.id},${r.room_number},${r.block_name},${r.category},${r.priority},${r.status},${r.resident_name}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DormIQ_Hostel_Operations_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRooms = rooms.filter((r) => {
    if (!roomFilter) return true;
    return r.room_number.toLowerCase().includes(roomFilter.toLowerCase()) || r.block_name.toLowerCase().includes(roomFilter.toLowerCase());
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-graphite-border">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-lime bg-forest/40 border border-forest px-2.5 py-1 rounded-full">
            Campus Operations Deck
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ivory mt-2">
            Hostel Operations Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-mutedGrey mt-0.5">
            Administrative governance, asset health indexing, and resource attribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-graphite hover:bg-graphite-light border border-graphite-border px-3.5 py-2 rounded-xl text-xs font-mono text-ivory transition-all hover:border-lime"
          >
            <Download className="w-4 h-4 text-lime" />
            <span>Export Audit Report</span>
          </button>
          <Link
            to="/app"
            className="flex items-center gap-1.5 bg-lime hover:bg-lime-glow text-obsidian px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-lime/20"
          >
            <span>Resident App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Top 4 Macro KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Occupancy Load</span>
            <Users className="w-4 h-4 text-lime" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory">
            {hostel.occupied_count} <span className="text-xs text-mutedGrey">/ {hostel.total_capacity}</span>
          </p>
          <p className="text-[11px] font-mono text-lime mt-1">284 Beds Allocated</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Open Backlog</span>
            <Wrench className="w-4 h-4 text-warningAmber" />
          </div>
          <p className="text-2xl font-display font-bold text-warningAmber font-mono">
            {activeRequests.length}
          </p>
          <p className="text-[11px] text-mutedGrey mt-1">Active tickets</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Facility Availability</span>
            <Sparkles className="w-4 h-4 text-coolBlue" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory font-mono">
            {Math.round((facilities.filter((f) => f.status === 'operational').length / facilities.length) * 100)}%
          </p>
          <p className="text-[11px] text-lime mt-1">100% Upgraded</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Lifetime Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-lime" />
          </div>
          <p className="text-2xl font-display font-bold text-lime font-mono">
            {resolvedCount}
          </p>
          <p className="text-[11px] text-lime mt-1">Avg turnaround 2.4h</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-graphite-border">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'overview'
              ? 'border-lime text-lime font-bold'
              : 'border-transparent text-mutedGrey hover:text-ivory'
          }`}
        >
          Operations Overview
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'rooms'
              ? 'border-lime text-lime font-bold'
              : 'border-transparent text-mutedGrey hover:text-ivory'
          }`}
        >
          Room Inventory ({rooms.length})
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'staff'
              ? 'border-lime text-lime font-bold'
              : 'border-transparent text-mutedGrey hover:text-ivory'
          }`}
        >
          Staff & Dispatch Directory
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wings Overview */}
          <div className="lg:col-span-2 bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey">
              Wing Infrastructure Health Diagnostics
            </h3>
            <div className="space-y-3">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className="p-4 rounded-xl bg-obsidian-light border border-graphite-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-ivory">{block.name}</h4>
                    <p className="text-xs text-mutedGrey mt-0.5">{block.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-mutedGrey">{block.rooms_count} Rooms</span>
                    <span className="text-lime font-bold px-2 py-0.5 rounded bg-forest/40 border border-forest">
                      {block.health_score}% Health
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey">
              Recent System Audit Log
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-obsidian-light border border-graphite-border space-y-1">
                <p className="font-semibold text-ivory">Technician Assignment #REQ-101</p>
                <p className="text-[10px] text-mutedGrey">Assigned to Ramesh Kumar by Warden Office</p>
              </div>
              <div className="p-3 rounded-xl bg-obsidian-light border border-graphite-border space-y-1">
                <p className="font-semibold text-ivory">Water Booster Telemetry Shift</p>
                <p className="text-[10px] text-mutedGrey">Auxiliary pump engaged in Block B</p>
              </div>
              <div className="p-3 rounded-xl bg-obsidian-light border border-graphite-border space-y-1">
                <p className="font-semibold text-ivory">Wi-Fi Patch v4.8 Applied</p>
                <p className="text-[10px] text-mutedGrey">100% Core backbone routers synced</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Rooms Inventory */}
      {activeTab === 'rooms' && (
        <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-mutedGrey absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                placeholder="Filter by room (e.g. A-204)..."
                className="w-full bg-obsidian border border-graphite-border rounded-xl pl-9 pr-4 py-2 text-xs text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime"
              />
            </div>
            <span className="text-xs font-mono text-mutedGrey">{filteredRooms.length} units listed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-obsidian-light text-mutedGrey font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Room</th>
                  <th className="p-3">Block</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Occupancy</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-border">
                {filteredRooms.map((rm) => (
                  <tr key={rm.id} className="hover:bg-obsidian-light/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-ivory">{rm.room_number}</td>
                    <td className="p-3 text-mutedGrey">{rm.block_name}</td>
                    <td className="p-3 font-mono">{rm.floor_number}</td>
                    <td className="p-3 capitalize">{rm.room_type}</td>
                    <td className="p-3 font-mono">{rm.occupied} / {rm.capacity}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          rm.status === 'normal'
                            ? 'bg-lime/10 text-lime'
                            : rm.status === 'issue_reported'
                            ? 'bg-warningAmber/10 text-warningAmber'
                            : 'bg-alertCoral/10 text-alertCoral'
                        }`}
                      >
                        {rm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Staff Directory */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialProfiles.filter((p) => p.role === 'staff' || p.role === 'warden' || p.role === 'admin').map((st) => (
            <div
              key={st.id}
              className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={st.avatar_url}
                  alt={st.full_name}
                  className="w-12 h-12 rounded-xl object-cover border border-forest"
                />
                <div>
                  <h4 className="text-sm font-bold text-ivory">{st.full_name}</h4>
                  <p className="text-xs text-mutedGrey font-mono capitalize">{st.role} • {st.phone}</p>
                  <p className="text-[11px] text-lime mt-0.5">{st.email}</p>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-forest/40 text-lime border border-forest">
                ACTIVE
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

