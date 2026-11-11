import React, { useState } from 'react';
import { X, Calendar, Clock, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useHostelStore } from '../../store/hostelStore';
import { Facility, FacilityEquipment } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: Facility | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, facility }) => {
  const { currentUser } = useAuthStore();
  const { bookFacility, bookings } = useHostelStore();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slot, setSlot] = useState('14:00 — 15:00');
  const [selectedResource, setSelectedResource] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !facility || !currentUser) return null;

  const timeSlots = [
    '08:00 — 09:00',
    '10:00 — 11:00',
    '14:00 — 15:00',
    '16:00 — 17:00',
    '17:00 — 18:00',
    '19:00 — 20:00',
    '20:00 — 21:00',
  ];

  // Equipment options
  const resources: FacilityEquipment[] = facility.equipment || [
    { id: 'res-1', name: 'Standard Seat 01', status: 'available', type: 'seat' },
    { id: 'res-2', name: 'Standard Seat 02', status: 'available', type: 'seat' },
  ];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const chosenResource = selectedResource || resources[0]?.name || 'Standard Slot';

    const [start, end] = slot.split('—').map((s) => s.trim());

    const result = bookFacility({
      facility_id: facility.id,
      facility_name: facility.name,
      facility_category: facility.category,
      resident_id: currentUser.id,
      resident_name: currentUser.full_name,
      room_number: currentUser.room_number || 'A-204',
      date,
      slot,
      start_time: start,
      end_time: end,
      resource_label: chosenResource,
    });

    if (!result.success) {
      setError(result.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm px-4">
      <div className="bg-graphite border border-graphite-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-graphite-border pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-lime bg-forest/40 px-2 py-0.5 rounded border border-forest">
              Reservation System
            </span>
            <h2 className="text-xl font-display font-bold text-ivory mt-1">
              Book {facility.name}
            </h2>
            <p className="text-xs text-mutedGrey mt-0.5">{facility.block_name} • {facility.floor_label}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-obsidian border border-graphite-border text-mutedGrey hover:text-ivory"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-alertCoral/10 border border-alertCoral/40 text-alertCoral text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center mx-auto text-lime">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-ivory">Reservation Confirmed!</h3>
            <p className="text-xs text-mutedGrey">
              Slot saved. Real-time calendar synchronized.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBook} className="space-y-4">
            {/* Choose Date */}
            <div>
              <label className="block text-xs font-mono uppercase text-mutedGrey mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-lime" />
                Select Date
              </label>
              <input
                type="date"
                required
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-obsidian border border-graphite-border rounded-xl px-4 py-2.5 text-sm text-ivory font-mono focus:outline-none focus:border-lime"
              />
            </div>

            {/* Choose Machine or Specific Desk */}
            <div>
              <label className="block text-xs font-mono uppercase text-mutedGrey mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-lime" />
                Select Specific Equipment / Pod
              </label>
              <select
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                className="w-full bg-obsidian border border-graphite-border rounded-xl px-4 py-2.5 text-sm text-ivory focus:outline-none focus:border-lime"
              >
                {resources.map((res) => (
                  <option key={res.id} value={res.name} disabled={res.status === 'maintenance'}>
                    {res.name} {res.status === 'maintenance' ? '(Out of Service)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-xs font-mono uppercase text-mutedGrey mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-lime" />
                Available Time Window
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((ts) => {
                  const isSelected = slot === ts;
                  return (
                    <button
                      key={ts}
                      type="button"
                      onClick={() => setSlot(ts)}
                      className={`p-2.5 rounded-lg border text-xs font-mono text-center transition-all ${
                        isSelected
                          ? 'bg-forest/50 border-lime text-lime font-bold shadow-sm'
                          : 'bg-obsidian border-graphite-border text-mutedGrey hover:text-ivory'
                      }`}
                    >
                      {ts}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conflict Prevention Guarantee Note */}
            <div className="p-3 rounded-lg bg-obsidian border border-graphite-border text-[11px] text-mutedGrey">
              Zero collision policy: DormIQ verifies conflicting bookings in memory and will reject overlapping reservations automatically.
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-lime hover:bg-lime-glow text-obsidian font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-lime/20 hover:scale-[1.01]"
              >
                Confirm Slot Reservation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

