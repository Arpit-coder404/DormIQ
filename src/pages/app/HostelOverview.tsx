import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Compass, ShieldCheck, Activity, Phone, Sparkles, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { useHostelStore } from '../../store/hostelStore';

export const HostelOverview: React.FC = () => {
  const { hostel, blocks, rooms, facilities } = useHostelStore();

  const totalOccupancyRate = Math.round((hostel.occupied_count / hostel.total_capacity) * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-graphite-border">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-lime bg-forest/40 border border-forest px-2.5 py-1 rounded-full">
            Infrastructure Master Profile
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ivory mt-2">
            {hostel.name}
          </h1>
          <p className="text-xs sm:text-sm text-mutedGrey mt-0.5">
            {hostel.campus} • {hostel.address}
          </p>
        </div>

        <Link
          to="/app/floorplan"
          className="inline-flex items-center gap-2 bg-lime hover:bg-lime-glow text-obsidian px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-lime/20"
        >
          <Compass className="w-4 h-4" />
          <span>Launch Spatial Floor Plan</span>
        </Link>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Occupancy</span>
            <Users className="w-4 h-4 text-lime" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory">
            {hostel.occupied_count} <span className="text-xs font-mono text-mutedGrey font-normal">/ {hostel.total_capacity}</span>
          </p>
          <p className="text-[11px] font-mono text-lime mt-1">{totalOccupancyRate}% Total Capacity Allocated</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Residential Wings</span>
            <Building2 className="w-4 h-4 text-coolBlue" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory">{blocks.length}</p>
          <p className="text-[11px] text-mutedGrey mt-1">Alpha Hall, Beta Tower, Gamma</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Active Facilities</span>
            <Sparkles className="w-4 h-4 text-sage" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory">{facilities.length}</p>
          <p className="text-[11px] text-mutedGrey mt-1">Laundry, Gym, Pods, Quad, Dining</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Security & Response</span>
            <ShieldCheck className="w-4 h-4 text-lime" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory font-mono">24/7</p>
          <p className="text-[11px] text-lime mt-1">Continuous Warden & Patrol</p>
        </div>
      </div>

      {/* Residential Blocks Breakdown */}
      <div>
        <h2 className="font-mono text-xs uppercase tracking-wider text-mutedGrey mb-3">
          Residential Block Architecture & Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="bg-graphite border border-graphite-border rounded-2xl p-6 flex flex-col justify-between hover:border-forest transition-all shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-lg text-ivory">{block.name}</h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-forest/40 border border-forest text-lime font-bold">
                    {block.health_score}% Health
                  </span>
                </div>
                <p className="text-xs text-mutedGrey leading-relaxed mb-4">
                  {block.description}
                </p>

                <div className="space-y-2 text-xs font-mono border-t border-graphite-border/70 pt-3">
                  <div className="flex justify-between text-mutedGrey">
                    <span>Vertical Floors:</span>
                    <span className="text-ivory">{block.floors_count} Levels</span>
                  </div>
                  <div className="flex justify-between text-mutedGrey">
                    <span>Registered Units:</span>
                    <span className="text-ivory">{block.rooms_count} Rooms</span>
                  </div>
                  <div className="flex justify-between text-mutedGrey">
                    <span>Primary Amenities:</span>
                    <span className="text-lime text-[11px]">
                      {block.name.includes('A') ? 'Laundry + Rooftop' : block.name.includes('B') ? 'Study Lounge' : 'Kinetic Gym'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-graphite-border mt-6">
                <Link
                  to="/app/floorplan"
                  className="w-full py-2 px-3 rounded-lg bg-obsidian-light hover:bg-forest/20 border border-graphite-border hover:border-lime/40 text-xs font-medium text-ivory flex items-center justify-between transition-all"
                >
                  <span>View Floor Blueprint</span>
                  <ChevronRight className="w-3.5 h-3.5 text-lime" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency & Administration Contacts */}
      <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl">
        <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4 text-lime" />
          Emergency & Operations Directory
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-obsidian-light border border-graphite-border">
            <p className="text-xs font-bold text-ivory">Hostel Security Control</p>
            <p className="text-xs font-mono text-lime mt-1">+91 98110 99881</p>
            <p className="text-[10px] text-mutedGrey mt-0.5">24/7 Main Gatehouse</p>
          </div>
          <div className="p-3.5 rounded-xl bg-obsidian-light border border-graphite-border">
            <p className="text-xs font-bold text-ivory">Chief Warden Office</p>
            <p className="text-xs font-mono text-ivory mt-1">Dr. Sunita Rao (W-101)</p>
            <p className="text-[10px] text-mutedGrey mt-0.5">+91 98110 99882</p>
          </div>
          <div className="p-3.5 rounded-xl bg-obsidian-light border border-graphite-border">
            <p className="text-xs font-bold text-ivory">Campus Ambulance & Clinic</p>
            <p className="text-xs font-mono text-alertCoral mt-1">108 / +91 98000 11222</p>
            <p className="text-[10px] text-mutedGrey mt-0.5">Medical Center Block D</p>
          </div>
          <div className="p-3.5 rounded-xl bg-obsidian-light border border-graphite-border">
            <p className="text-xs font-bold text-ivory">Rapid Maintenance Dispatch</p>
            <p className="text-xs font-mono text-warningAmber mt-1">Ext 4040</p>
            <p className="text-[10px] text-mutedGrey mt-0.5">Senior Technician Ramesh K.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelOverview;

