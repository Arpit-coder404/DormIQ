import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Activity, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-obsidian border-t border-graphite-border text-mutedGrey py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-control-grid opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-graphite border border-forest flex items-center justify-center">
                <Cpu className="w-5 h-5 text-lime" />
              </div>
              <span className="font-display font-bold text-xl text-ivory tracking-tight">
                Dorm<span className="text-lime">IQ</span>
              </span>
            </Link>
            <p className="text-sm max-w-sm text-mutedGrey leading-relaxed">
              The intelligence layer for modern hostel living. High-resolution telemetry, automated maintenance tracking, interactive spatial floor plans, and transparent facility governance.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-forest/40 border border-forest text-lime font-mono text-[11px]">
                <Activity className="w-3 h-3 animate-pulse" />
                SYSTEM STATUS: 100% OPERATIONAL
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-ivory mb-4">Resident Hub</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/app" className="hover:text-lime transition-colors">Resident Dashboard</Link>
              </li>
              <li>
                <Link to="/app/floorplan" className="hover:text-lime transition-colors">Interactive Floor Plan</Link>
              </li>
              <li>
                <Link to="/app/maintenance" className="hover:text-lime transition-colors">Report & Track Issue</Link>
              </li>
              <li>
                <Link to="/app/facilities" className="hover:text-lime transition-colors">Amenities & Bookings</Link>
              </li>
              <li>
                <Link to="/app/community" className="hover:text-lime transition-colors">Resident Community</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-ivory mb-4">Operations</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/staff" className="hover:text-lime transition-colors">Maintenance Staff Portal</Link>
              </li>
              <li>
                <Link to="/warden" className="hover:text-lime transition-colors">Warden Control Center</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-lime transition-colors">Hostel Operations Intelligence</Link>
              </li>
              <li>
                <Link to="/app/utilities" className="hover:text-lime transition-colors">Utility Telemetry Grid</Link>
              </li>
              <li>
                <Link to="/app/announcements" className="hover:text-lime transition-colors">Emergency Announcements</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-ivory mb-4">Infrastructure</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime"></span>
                <span>Power Grid: 99.4%</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime"></span>
                <span>Water Distribution: Stable</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-lime"></span>
                <span>Wi-Fi Backbone: 10 Gbps</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-coolBlue"></span>
                <span>Elevator Diagnostics: Active</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-graphite-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} DormIQ Technologies Inc. Smarter spaces. Better living. All rights reserved.</p>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>NEXUS RESIDENCES SPEC v2.4</span>
            <span className="text-lime">ZERO DOWNTIME PROMISE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

