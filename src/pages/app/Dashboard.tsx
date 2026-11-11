import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  Zap,
  Droplets,
  Wifi,
  Sparkles,
  Wrench,
  AlertTriangle,
  ArrowRight,
  Clock,
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Info,
  ShieldCheck,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useHostelStore } from '../../store/hostelStore';
import { calculateHostelHealthIndex } from '../../lib/formula';
import { ReportMaintenanceModal } from '../../components/maintenance/ReportMaintenanceModal';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { requests, facilities, announcements, bookings, rooms } = useHostelStore();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) return null;

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  // Calculate Hostel Health Index with formula
  const healthData = calculateHostelHealthIndex(requests, facilities);

  // Resident specific items
  const myRoomRequests = requests.filter(
    (r) => r.room_number.toLowerCase() === currentUser.room_number.toLowerCase()
  );
  const myActiveRequests = myRoomRequests.filter((r) => r.status !== 'resolved' && r.status !== 'rejected');

  const myBookings = bookings.filter(
    (b) => b.resident_id === currentUser.id && b.status === 'confirmed'
  );

  const criticalAnnouncements = announcements.filter((a) => a.is_critical);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Greeting & Space Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-graphite-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-lime tracking-wide uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
            Telemetry Stream Active • System v2.4
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ivory tracking-tight">
            {greeting}, {currentUser.full_name.split(' ')[0]}.
          </h1>
          <p className="text-xs sm:text-sm text-mutedGrey mt-0.5">
            Space: <span className="text-ivory font-medium">{currentUser.hostel_name}</span> •{' '}
            <span className="text-ivory font-medium">{currentUser.block_name}</span> •{' '}
            Room <span className="text-lime font-mono font-medium">{currentUser.room_number || 'A-204'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/floorplan"
            className="flex items-center gap-2 bg-graphite hover:bg-graphite-light border border-graphite-border px-3.5 py-2 rounded-xl text-xs font-medium text-ivory transition-all hover:border-sage/40"
          >
            <Compass className="w-4 h-4 text-lime" />
            <span>Interactive Floor Plan</span>
          </Link>
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-2 bg-lime hover:bg-lime-glow text-obsidian font-bold px-4 py-2 rounded-xl text-xs tracking-wide transition-all shadow-lg shadow-lime/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Wrench className="w-4 h-4" />
            <span>Report an Issue</span>
          </button>
        </div>
      </div>

      {/* Critical Notice Alert (if any) */}
      {criticalAnnouncements.length > 0 && (
        <div className="bg-alertCoral/10 border border-alertCoral/40 rounded-xl p-4 flex items-start justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-alertCoral flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-mono text-alertCoral font-bold uppercase tracking-wider">
                CRITICAL INFRASTRUCTURE ALERT
              </p>
              <h4 className="text-sm font-semibold text-ivory mt-0.5">
                {criticalAnnouncements[0].title}
              </h4>
              <p className="text-xs text-ivory/80 mt-1 line-clamp-2 leading-relaxed">
                {criticalAnnouncements[0].content}
              </p>
            </div>
          </div>
          <Link
            to="/app/announcements"
            className="text-xs font-mono text-alertCoral hover:underline whitespace-nowrap pt-1 flex items-center gap-1"
          >
            Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 2. Top Metric Row: Hostel Health Index + Room Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SIGNATURE WIDGET: HOSTEL HEALTH INDEX */}
        <div className="lg:col-span-2 bg-graphite border border-graphite-border rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-forest/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-lime" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey">
                Hostel Health Index (HHI)
              </h3>
            </div>
            <button
              onClick={() => setShowFormulaModal(true)}
              className="flex items-center gap-1 text-[11px] text-mutedGrey hover:text-lime font-mono transition-colors"
            >
              <Info className="w-3 h-3" />
              <span>Formula Specs</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Big Score Gauge */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-obsidian-light border border-graphite-border text-center">
              <div className="relative flex items-center justify-center">
                <span className="text-5xl font-display font-extrabold text-lime tracking-tight">
                  {healthData.overall_score}
                </span>
                <span className="text-xs font-mono text-mutedGrey ml-1 self-end pb-2">/100</span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-lime mt-1 px-2 py-0.5 rounded bg-forest/40 border border-forest">
                {healthData.overall_score >= 85 ? 'Optimal State' : healthData.overall_score >= 70 ? 'Moderate Alert' : 'Degraded'}
              </span>
              <p className="text-[10px] text-mutedGrey mt-2">
                Calculated {healthData.calculated_at}
              </p>
            </div>

            {/* Contributing Pillars */}
            <div className="md:col-span-3 space-y-3">
              {healthData.contributing_factors.map((factor) => (
                <div key={factor.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ivory font-medium">{factor.name}</span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-mutedGrey">Weight: {factor.weight}%</span>
                      <span className="text-lime font-semibold">{factor.score} / 100</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-obsidian overflow-hidden border border-graphite-border">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        factor.score >= 80 ? 'bg-lime' : factor.score >= 60 ? 'bg-warningAmber' : 'bg-alertCoral'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-mutedGrey">{factor.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MY ROOM SNAPSHOT */}
        <div className="bg-graphite border border-graphite-border rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-mutedGrey">
                My Room Status
              </span>
              <span className="text-xs font-mono text-lime bg-forest/40 px-2 py-0.5 rounded border border-forest">
                {currentUser.room_number || 'A-204'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-obsidian-light border border-graphite-border flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-ivory">Active Issues Reported</p>
                  <p className="text-[11px] text-mutedGrey">
                    {myActiveRequests.length === 0 ? 'No open complaints' : `${myActiveRequests.length} ticket active`}
                  </p>
                </div>
                <span
                  className={`text-xs font-mono px-2 py-1 rounded font-semibold ${
                    myActiveRequests.length === 0
                      ? 'bg-lime/10 text-lime border border-lime/30'
                      : 'bg-warningAmber/10 text-warningAmber border border-warningAmber/30'
                  }`}
                >
                  {myActiveRequests.length === 0 ? 'CLEAR' : 'ATTENTION'}
                </span>
              </div>

              {myActiveRequests.length > 0 && (
                <div className="p-3 rounded-xl bg-forest/15 border border-forest text-xs space-y-1">
                  <p className="font-semibold text-lime truncate">{myActiveRequests[0].title}</p>
                  <p className="text-[11px] text-mutedGrey capitalize">
                    Status: <span className="text-ivory font-medium">{myActiveRequests[0].status.replace('_', ' ')}</span>
                  </p>
                  <Link
                    to={`/app/maintenance/${myActiveRequests[0].id}`}
                    className="text-[11px] text-lime hover:underline font-mono inline-flex items-center gap-1 pt-1"
                  >
                    View Status Timeline <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              <div className="p-3 rounded-xl bg-obsidian-light border border-graphite-border text-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-ivory">Upcoming Bookings</p>
                  <p className="text-[11px] text-mutedGrey">
                    {myBookings.length > 0 ? `${myBookings[0].facility_name.split(' ')[0]} at ${myBookings[0].slot}` : 'No reservations'}
                  </p>
                </div>
                <Link to="/app/facilities" className="text-mutedGrey hover:text-lime">
                  <Calendar className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-graphite-border mt-4">
            <Link
              to="/app/maintenance"
              className="w-full py-2 px-3 rounded-lg border border-graphite-border text-xs font-medium text-ivory hover:bg-graphite-light flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Manage My Room Tickets</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Infrastructure Grid Status */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-lime" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey">
              Campus Infrastructure Grid (Live Telemetry)
            </h3>
          </div>
          <Link to="/app/utilities" className="text-xs text-lime hover:underline font-mono">
            Full Telemetry Dashboard →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Electricity Grid', value: '230V • 49.9Hz', status: 'Operational', icon: Zap, color: 'text-lime', badge: 'bg-lime/10 text-lime' },
            { label: 'Water Distribution', value: 'Booster 3.8 Bar', status: 'Operational', icon: Droplets, color: 'text-coolBlue', badge: 'bg-coolBlue/10 text-coolBlue' },
            { label: 'Wi-Fi Mesh Backbone', value: '14ms • 99.8%', status: 'Operational', icon: Wifi, color: 'text-lime', badge: 'bg-lime/10 text-lime' },
            { label: 'Smart Laundry', value: '1 Unit Degraded', status: 'Degraded', icon: Sparkles, color: 'text-warningAmber', badge: 'bg-warningAmber/10 text-warningAmber' },
            { label: 'Vertical Elevators', value: 'Shafts A1/B1 OK', status: 'Operational', icon: Layers, color: 'text-lime', badge: 'bg-lime/10 text-lime' },
            { label: 'PureHydrate UV', value: 'TDS: 82 ppm', status: 'Operational', icon: ShieldCheck, color: 'text-lime', badge: 'bg-lime/10 text-lime' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-graphite border border-graphite-border rounded-xl p-3.5 flex flex-col justify-between hover:border-forest transition-colors shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${item.badge}`}>
                    {item.status}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-ivory font-bold">{item.value}</p>
                  <p className="text-[10px] text-mutedGrey mt-0.5">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Quick Actions + Recent Community & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Action Matrix */}
        <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl">
          <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey mb-4">
            Resident Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setReportModalOpen(true)}
              className="p-3.5 rounded-xl bg-obsidian-light border border-graphite-border hover:border-lime hover:bg-forest/20 text-left transition-all group"
            >
              <Wrench className="w-5 h-5 text-lime mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-ivory">Report Issue</p>
              <p className="text-[10px] text-mutedGrey mt-0.5">Automated triage</p>
            </button>

            <Link
              to="/app/floorplan"
              className="p-3.5 rounded-xl bg-obsidian-light border border-graphite-border hover:border-lime hover:bg-forest/20 text-left transition-all group"
            >
              <Compass className="w-5 h-5 text-coolBlue mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-ivory">Floor Plan</p>
              <p className="text-[10px] text-mutedGrey mt-0.5">Explore blueprint</p>
            </Link>

            <Link
              to="/app/facilities"
              className="p-3.5 rounded-xl bg-obsidian-light border border-graphite-border hover:border-lime hover:bg-forest/20 text-left transition-all group"
            >
              <Calendar className="w-5 h-5 text-lime mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-ivory">Book Washer / Pod</p>
              <p className="text-[10px] text-mutedGrey mt-0.5">Zero collision</p>
            </Link>

            <Link
              to="/app/community"
              className="p-3.5 rounded-xl bg-obsidian-light border border-graphite-border hover:border-lime hover:bg-forest/20 text-left transition-all group"
            >
              <Sparkles className="w-5 h-5 text-sage mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-ivory">Resident Quad</p>
              <p className="text-[10px] text-mutedGrey mt-0.5">Questions & tips</p>
            </Link>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey">
                Hostel Announcements
              </h3>
              <Link to="/app/announcements" className="text-xs text-lime hover:underline font-mono">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                    a.is_critical
                      ? 'bg-alertCoral/10 border-alertCoral/40'
                      : 'bg-obsidian-light border-graphite-border'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-ivory truncate">{a.title}</span>
                    <span className="text-[10px] font-mono text-mutedGrey whitespace-nowrap">
                      {new Date(a.published_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-mutedGrey line-clamp-2 leading-relaxed">
                    {a.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-graphite-border mt-3 text-right">
            <span className="text-[10px] font-mono text-mutedGrey">
              Published by Hostel Warden & Administrative Office
            </span>
          </div>
        </div>

        {/* Recent Maintenance Feed */}
        <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey">
                Recent Resolution Activity
              </h3>
              <Link to="/app/maintenance" className="text-xs text-lime hover:underline font-mono">
                Tickets ({requests.length})
              </Link>
            </div>

            <div className="space-y-3">
              {requests.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl bg-obsidian-light border border-graphite-border text-xs flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-ivory truncate">{r.title}</p>
                    <p className="text-[10px] text-mutedGrey mt-0.5">
                      {r.room_number} • {r.category} • <span className="font-mono">{r.id}</span>
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium whitespace-nowrap ${
                      r.status === 'resolved'
                        ? 'bg-lime/15 text-lime'
                        : r.status === 'in_progress'
                        ? 'bg-warningAmber/15 text-warningAmber'
                        : 'bg-coolBlue/15 text-coolBlue'
                    }`}
                  >
                    {r.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-graphite-border mt-3 flex items-center justify-between text-xs text-mutedGrey">
            <span>Average Resolution Time</span>
            <span className="font-mono text-lime font-bold">2.4 Hours</span>
          </div>
        </div>
      </div>

      {/* Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm px-4">
          <div className="bg-graphite border border-graphite-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-graphite-border pb-3">
              <h3 className="font-display font-bold text-lg text-ivory">Hostel Health Index (HHI) Formula</h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-mutedGrey hover:text-ivory text-sm"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-ivory/90 space-y-3 font-mono leading-relaxed bg-obsidian p-4 rounded-xl border border-graphite-border">
              <p className="text-lime font-bold">
                Overall HHI = (0.40 × Maintenance) + (0.35 × Utility) + (0.25 × Facility)
              </p>
              <div className="text-[11px] text-mutedGrey space-y-1">
                <p>• <span className="text-ivory font-bold">Maintenance (40%):</span> 100 base score minus active penalties: Urgent (-15 pts), High (-8 pts), Medium (-3 pts), Low (-1 pt).</p>
                <p>• <span className="text-ivory font-bold">Utility Telemetry (35%):</span> Normalized composite of Grid Voltage, Water Line pressure stability, Wi-Fi mesh latency, and elevator run diagnostics.</p>
                <p>• <span className="text-ivory font-bold">Facility Availability (25%):</span> Percentage of physical hostel amenities fully operational without active maintenance downtime.</p>
              </div>
            </div>
            <p className="text-[11px] text-mutedGrey italic">
              Notice: The Health Index summarizes operational telemetry and ticket velocity for transparent hostel governance. It is not an external regulatory certification.
            </p>
            <button
              onClick={() => setShowFormulaModal(false)}
              className="w-full py-2.5 bg-lime text-obsidian font-bold rounded-lg text-xs"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportMaintenanceModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;

