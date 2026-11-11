import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Wrench,
  Sparkles,
  BarChart2,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useHostelStore } from '../store/hostelStore';
import { useAuthStore } from '../store/authStore';
import { generateSmartInsights } from '../lib/smartInsights';

export const WardenDashboard: React.FC = () => {
  const { hostel, blocks, requests, facilities, utilityReadings, assignStaff } = useHostelStore();
  const { currentUser } = useAuthStore();

  const insights = generateSmartInsights(requests, facilities, utilityReadings);

  const activeRequests = requests.filter((r) => r.status !== 'resolved' && r.status !== 'rejected');
  const criticalRequests = activeRequests.filter((r) => r.priority === 'urgent' || r.priority === 'high');
  const unassignedRequests = activeRequests.filter((r) => !r.assigned_staff_id || r.status === 'submitted');
  const resolvedRequests = requests.filter((r) => r.status === 'resolved');

  // Category counts for Recharts
  const categoryCounts = [
    { category: 'Plumbing', count: requests.filter((r) => r.category === 'plumbing').length },
    { category: 'Electrical', count: requests.filter((r) => r.category === 'electrical').length },
    { category: 'Wi-Fi', count: requests.filter((r) => r.category === 'wifi').length },
    { category: 'Appliances', count: requests.filter((r) => r.category === 'appliances').length },
    { category: 'Furniture', count: requests.filter((r) => r.category === 'furniture').length },
    { category: 'Washroom', count: requests.filter((r) => r.category === 'washroom').length },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-graphite-border">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-coolBlue bg-coolBlue/10 border border-coolBlue/30 px-2.5 py-1 rounded-full">
            Chief Warden Command Deck
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ivory mt-2">
            Hostel Operations & Governance
          </h1>
          <p className="text-xs sm:text-sm text-mutedGrey mt-0.5">
            Bird's-eye oversight of resident safety, triage backlogs, and operational compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/announcements"
            className="flex items-center gap-1.5 bg-graphite hover:bg-graphite-light border border-graphite-border px-3.5 py-2 rounded-xl text-xs font-mono text-ivory transition-all"
          >
            <span>Broadcast Notice</span>
          </Link>
          <Link
            to="/app"
            className="flex items-center gap-1.5 bg-lime hover:bg-lime-glow text-obsidian px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-lime/20"
          >
            <span>Resident Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary Warden Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Occupancy</span>
            <Users className="w-4 h-4 text-lime" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory">
            {hostel.occupied_count} <span className="text-xs text-mutedGrey">/ {hostel.total_capacity}</span>
          </p>
          <p className="text-[11px] text-lime font-mono mt-1">88.7% Allotted</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Open Backlog</span>
            <Clock className="w-4 h-4 text-warningAmber" />
          </div>
          <p className="text-2xl font-display font-bold text-warningAmber font-mono">
            {activeRequests.length}
          </p>
          <p className="text-[11px] text-mutedGrey mt-1">Pending resolution</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">High / Urgent</span>
            <AlertTriangle className="w-4 h-4 text-alertCoral" />
          </div>
          <p className="text-2xl font-display font-bold text-alertCoral font-mono">
            {criticalRequests.length}
          </p>
          <p className="text-[11px] text-alertCoral font-mono mt-1">Priority Attention</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Unassigned</span>
            <Wrench className="w-4 h-4 text-coolBlue" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory font-mono">
            {unassignedRequests.length}
          </p>
          <p className="text-[11px] text-mutedGrey mt-1">Require triage</p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-lime" />
          </div>
          <p className="text-2xl font-display font-bold text-lime font-mono">
            {resolvedRequests.length}
          </p>
          <p className="text-[11px] text-lime font-mono mt-1">Turnaround avg 2.4h</p>
        </div>
      </div>

      {/* Middle Row: Unassigned Triage Board + Complaints Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Work Queue Triage */}
        <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey flex items-center gap-2">
              <Wrench className="w-4 h-4 text-lime" />
              Direct Staff Allocation Board ({unassignedRequests.length})
            </h3>
            <span className="text-[10px] font-mono text-lime">Warden Authority</span>
          </div>

          {unassignedRequests.length === 0 ? (
            <div className="p-8 text-center text-xs text-mutedGrey">
              All incoming tickets have been assigned to technicians.
            </div>
          ) : (
            <div className="space-y-3">
              {unassignedRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-obsidian-light border border-graphite-border space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-ivory">{req.title}</p>
                      <p className="text-[11px] text-mutedGrey mt-0.5">
                        {req.room_number} • {req.block_name} • <span className="capitalize">{req.priority}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-warningAmber/10 text-warningAmber uppercase font-bold">
                      {req.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-graphite-border/70 text-xs">
                    <span className="text-mutedGrey text-[11px]">Assign Technician:</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => assignStaff(req.id, 'staff-1', 'Ramesh Kumar')}
                        className="px-2.5 py-1 rounded bg-forest/40 border border-forest hover:border-lime text-lime font-mono text-[10px]"
                      >
                        + Ramesh K.
                      </button>
                      <button
                        onClick={() => assignStaff(req.id, 'staff-2', 'Arvind Singh')}
                        className="px-2.5 py-1 rounded bg-forest/40 border border-forest hover:border-lime text-lime font-mono text-[10px]"
                      >
                        + Arvind S.
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complaints Distribution by Category Chart */}
        <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey">
              Tickets Volume by Infrastructure Domain
            </h3>
            <span className="text-[10px] font-mono text-mutedGrey">All Active & Resolved</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryCounts} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222825" />
                <XAxis dataKey="category" stroke="#929B94" fontSize={10} fontFamily="JetBrains Mono" />
                <YAxis stroke="#929B94" fontSize={10} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0C0E0D', borderColor: '#2A322E', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                />
                <Bar dataKey="count" name="Tickets" fill="#C8FF62" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Smart Insights Feed for Warden */}
      <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lime" />
            Operational Intelligence & Hotspot Diagnostics
          </h3>
          <span className="text-[10px] font-mono text-lime">Rule Engine v2.4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className={`p-4 rounded-xl border space-y-2 ${
                ins.severity === 'critical'
                  ? 'bg-alertCoral/10 border-alertCoral/40'
                  : ins.severity === 'warning'
                  ? 'bg-warningAmber/10 border-warningAmber/40'
                  : 'bg-obsidian-light border-graphite-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-obsidian text-lime border border-graphite-border">
                  {ins.category}
                </span>
                <span className="text-[10px] font-mono text-mutedGrey">{ins.timestamp}</span>
              </div>
              <h4 className="text-xs font-bold text-ivory">{ins.title}</h4>
              <p className="text-[11px] text-ivory/80 leading-relaxed">{ins.supporting_data}</p>
              <div className="pt-2 border-t border-graphite-border/60 text-[11px]">
                <strong className="text-lime">Action: </strong>
                <span className="text-mutedGrey">{ins.suggested_action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WardenDashboard;

