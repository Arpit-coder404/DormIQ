import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Search,
  Filter,
  Clock,
  Users,
  CheckCircle2,
  Calendar,
  X,
  Building,
  Info,
  ChevronRight,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { useHostelStore } from '../../store/hostelStore';
import { useAuthStore } from '../../store/authStore';
import { Facility, FacilityCategory } from '../../types';
import { BookingModal } from '../../components/facilities/BookingModal';

export const FacilitiesPage: React.FC = () => {
  const { facilities, bookings, cancelBooking } = useHostelStore();
  const { currentUser } = useAuthStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBlock, setSelectedBlock] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBookingFacility, setActiveBookingFacility] = useState<Facility | null>(null);

  const categories: { label: string; value: string }[] = [
    { label: 'All Amenities', value: 'all' },
    { label: 'Laundry', value: 'laundry' },
    { label: 'Study & Pods', value: 'study' },
    { label: 'Gym & Fitness', value: 'gym' },
    { label: 'Common Lounges', value: 'common' },
    { label: 'Dining', value: 'dining' },
    { label: 'Water Stations', value: 'water' },
  ];

  const filteredFacilities = facilities.filter((fac) => {
    if (selectedCategory !== 'all' && fac.category !== selectedCategory) return false;
    if (selectedBlock !== 'all' && !fac.block_name.includes(selectedBlock)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        fac.name.toLowerCase().includes(q) ||
        fac.block_name.toLowerCase().includes(q) ||
        fac.amenities.some((a) => a.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const myBookings = currentUser
    ? bookings.filter((b) => b.resident_id === currentUser.id && b.status === 'confirmed')
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-graphite-border">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-lime bg-forest/40 border border-forest px-2.5 py-1 rounded-full">
            Campus Amenities Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ivory mt-2">
            Hostel Facilities & Bookings
          </h1>
          <p className="text-xs sm:text-sm text-mutedGrey mt-0.5">
            Discover shared infrastructure, check operating capacity, and reserve tokenless slots.
          </p>
        </div>
      </div>

      {/* Resident Active Bookings Bar */}
      {myBookings.length > 0 && (
        <div className="bg-graphite border border-forest/50 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-mono text-xs uppercase tracking-wider text-lime flex items-center gap-2">
              <Calendar className="w-4 h-4 text-lime" />
              Your Confirmed Reservations ({myBookings.length})
            </h3>
            <span className="text-[11px] font-mono text-mutedGrey">Synced with Smart Lock Grid</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myBookings.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl bg-obsidian-light border border-graphite-border flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-ivory">{b.facility_name}</p>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime/10 text-lime uppercase font-bold">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-lime mt-1">{b.resource_label || 'Allocated Desk'}</p>
                  <p className="text-[11px] text-mutedGrey">
                    Date: <strong className="text-ivory">{b.date}</strong> • Slot: <strong className="text-ivory">{b.slot}</strong>
                  </p>
                </div>

                <div className="pt-2 border-t border-graphite-border/70 flex justify-end">
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="text-[11px] text-alertCoral hover:underline font-mono"
                  >
                    Cancel Reservation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-graphite p-3 rounded-2xl border border-graphite-border">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-mutedGrey absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gym, study, washer, water..."
            className="w-full bg-obsidian border border-graphite-border rounded-xl pl-10 pr-4 py-2 text-xs text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === c.value
                  ? 'bg-lime text-obsidian font-bold shadow-sm'
                  : 'text-mutedGrey hover:text-ivory hover:bg-obsidian-light'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((fac) => {
          const occupancyRate = Math.round((fac.active_occupancy / fac.capacity) * 100);

          return (
            <div
              key={fac.id}
              className="bg-graphite border border-graphite-border rounded-2xl overflow-hidden flex flex-col justify-between hover:border-forest transition-all shadow-xl group"
            >
              <div>
                {/* Image */}
                {fac.image_url && (
                  <div className="h-44 w-full relative overflow-hidden bg-obsidian">
                    <img
                      src={fac.image_url}
                      alt={fac.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-transparent"></div>
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-mono px-2.5 py-1 rounded-full uppercase font-bold border backdrop-blur-md ${
                        fac.status === 'operational'
                          ? 'bg-forest/80 text-lime border-forest'
                          : fac.status === 'degraded'
                          ? 'bg-warningAmber/20 text-warningAmber border-warningAmber/40'
                          : 'bg-alertCoral/20 text-alertCoral border-alertCoral/40'
                      }`}
                    >
                      {fac.status}
                    </span>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-ivory group-hover:text-lime transition-colors">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-mutedGrey mt-0.5">
                      {fac.block_name} • {fac.floor_label}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-mutedGrey">
                      <Clock className="w-3.5 h-3.5 text-lime" />
                      <span>{fac.operating_hours}</span>
                    </div>

                    {/* Occupancy Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-mutedGrey">Live Occupancy:</span>
                        <span className="text-ivory font-bold">{fac.active_occupancy} / {fac.capacity} ({occupancyRate}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-obsidian overflow-hidden border border-graphite-border">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            occupancyRate > 80 ? 'bg-alertCoral' : occupancyRate > 50 ? 'bg-warningAmber' : 'bg-lime'
                          }`}
                          style={{ width: `${occupancyRate}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Amenities Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {fac.amenities.slice(0, 3).map((a) => (
                      <span
                        key={a}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-obsidian-light border border-graphite-border/70 text-mutedGrey"
                      >
                        {a}
                      </span>
                    ))}
                    {fac.amenities.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-mutedGrey">
                        +{fac.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                {(fac.category === 'laundry' || fac.category === 'study') ? (
                  <button
                    onClick={() => setActiveBookingFacility(fac)}
                    className="w-full py-2.5 bg-lime hover:bg-lime-glow text-obsidian font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-lime/10 flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Reserve Time Slot</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 bg-obsidian-light border border-graphite-border text-mutedGrey text-xs font-mono text-center rounded-xl">
                    Walk-in Access (Card Tap)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={Boolean(activeBookingFacility)}
        onClose={() => setActiveBookingFacility(null)}
        facility={activeBookingFacility}
      />
    </div>
  );
};

export default FacilitiesPage;

