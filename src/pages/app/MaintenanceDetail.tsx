import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Star,
  Package,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useHostelStore } from '../../store/hostelStore';
import { useAuthStore } from '../../store/authStore';
import { MaintenanceStatus } from '../../types';

export const MaintenanceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requests, updates, updateRequestStatus, rateResolution, assignStaff } = useHostelStore();
  const { currentUser } = useAuthStore();

  const [notes, setNotes] = useState('');
  const [materials, setMaterials] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const request = requests.find((r) => r.id === id);

  if (!request || !currentUser) {
    return (
      <div className="p-8 text-center text-ivory">
        <h2 className="text-xl font-bold mb-2">Request Not Found</h2>
        <p className="text-mutedGrey text-sm mb-4">The ticket ID #{id} does not exist in the active records.</p>
        <Link to="/app/maintenance" className="text-lime underline text-xs font-mono">
          Return to Maintenance Hub
        </Link>
      </div>
    );
  }

  const isStaffOrAdmin = currentUser.role === 'staff' || currentUser.role === 'warden' || currentUser.role === 'admin';
  const isAuthor = request.resident_id === currentUser.id;

  const statuses: MaintenanceStatus[] = [
    'submitted',
    'acknowledged',
    'assigned',
    'in_progress',
    'waiting_for_parts',
    'resolved',
  ];

  const currentStatusIndex = statuses.indexOf(request.status as MaintenanceStatus);

  const handleStatusChange = (newStatus: MaintenanceStatus) => {
    updateRequestStatus(
      request.id,
      newStatus,
      currentUser.id,
      currentUser.full_name,
      currentUser.role,
      notes || undefined,
      materials ? materials.split(',').map((s) => s.trim()) : undefined
    );
    setNotes('');
    setMaterials('');
  };

  const handleRate = (e: React.FormEvent) => {
    e.preventDefault();
    rateResolution(request.id, rating, feedback);
    setRatingSubmitted(true);
  };

  const requestUpdates = updates.filter((u) => u.request_id === request.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-graphite-border">
        <button
          onClick={() => navigate('/app/maintenance')}
          className="inline-flex items-center gap-1.5 text-xs text-mutedGrey hover:text-ivory font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ticket Index</span>
        </button>

        <span className="font-mono text-xs text-lime bg-forest/40 border border-forest px-3 py-1 rounded-full">
          Ticket #{request.id.toUpperCase()}
        </span>
      </div>

      {/* Title & Priority Header */}
      <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded bg-forest/40 text-lime border border-forest">
                {request.category}
              </span>
              <span
                className={`text-xs font-mono uppercase px-2.5 py-0.5 rounded border ${
                  request.priority === 'urgent'
                    ? 'bg-alertCoral/10 text-alertCoral border-alertCoral/30 font-bold'
                    : request.priority === 'high'
                    ? 'bg-warningAmber/10 text-warningAmber border-warningAmber/30 font-bold'
                    : 'bg-coolBlue/10 text-coolBlue border-coolBlue/30'
                }`}
              >
                {request.priority} Priority
              </span>
            </div>
            <h1 className="text-2xl font-display font-bold text-ivory">{request.title}</h1>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-mutedGrey">
            <p>Room: <span className="text-ivory font-bold">{request.room_number}</span> ({request.block_name})</p>
            <p className="mt-0.5">Reported: {new Date(request.created_at).toLocaleString()}</p>
          </div>
        </div>

        <p className="text-sm text-ivory/90 leading-relaxed bg-obsidian-light p-4 rounded-xl border border-graphite-border">
          {request.description}
        </p>

        {request.preferred_time && (
          <div className="text-xs text-mutedGrey flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-lime" />
            <span>Preferred Inspection Window: <strong className="text-ivory">{request.preferred_time}</strong></span>
          </div>
        )}
      </div>

      {/* Status Lifecycle Progress Bar */}
      <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey">
          Request Lifecycle Tracker
        </h3>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-2">
          {statuses.map((st, i) => {
            const isCompleted = currentStatusIndex >= i;
            const isCurrent = request.status === st;

            return (
              <div key={st} className="flex md:flex-col items-center gap-2.5 z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition-all ${
                    isCurrent
                      ? 'bg-lime text-obsidian font-bold shadow-lg shadow-lime/30 ring-2 ring-lime/50'
                      : isCompleted
                      ? 'bg-forest text-lime border border-forest'
                      : 'bg-obsidian border border-graphite-border text-mutedGrey'
                  }`}
                >
                  {isCompleted && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`text-xs font-mono capitalize whitespace-nowrap ${
                    isCurrent ? 'text-lime font-bold' : isCompleted ? 'text-ivory' : 'text-mutedGrey'
                  }`}
                >
                  {st.replace('_', ' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff Assignment & Actions Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment & Technician Card */}
        <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey flex items-center gap-2">
            <User className="w-4 h-4 text-lime" />
            Assigned Maintenance Specialist
          </h3>

          <div className="p-4 rounded-xl bg-obsidian-light border border-graphite-border flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-ivory">
                {request.assigned_staff_name || 'No Technician Assigned Yet'}
              </p>
              <p className="text-xs text-mutedGrey mt-0.5">
                {request.assigned_staff_name ? 'Certified Electrical & Facilities Specialist' : 'Queued for dispatcher triage'}
              </p>
            </div>
            <span className="text-xs font-mono text-lime bg-forest/40 px-2.5 py-1 rounded border border-forest">
              {request.assigned_staff_name ? 'ACTIVE' : 'PENDING'}
            </span>
          </div>

          {/* Quick Staff Reassign for Warden / Admin */}
          {(currentUser.role === 'warden' || currentUser.role === 'admin') && (
            <div className="pt-2 border-t border-graphite-border/70 space-y-2">
              <span className="text-[11px] font-mono text-mutedGrey">Assign to Specialist:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => assignStaff(request.id, 'staff-1', 'Ramesh Kumar')}
                  className="px-3 py-1.5 rounded-lg bg-obsidian border border-graphite-border text-xs text-ivory hover:border-lime"
                >
                  Ramesh Kumar
                </button>
                <button
                  onClick={() => assignStaff(request.id, 'staff-2', 'Arvind Singh')}
                  className="px-3 py-1.5 rounded-lg bg-obsidian border border-graphite-border text-xs text-ivory hover:border-lime"
                >
                  Arvind Singh
                </button>
              </div>
            </div>
          )}

          {/* Materials Used */}
          {request.materials_used && request.materials_used.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-mono uppercase text-mutedGrey mb-2 block flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-lime" />
                Materials & Replacement Hardware Logged:
              </span>
              <ul className="space-y-1 text-xs text-ivory font-mono">
                {request.materials_used.map((mat, idx) => (
                  <li key={idx} className="p-2 rounded bg-obsidian border border-graphite-border/60">
                    • {mat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {request.resolution_notes && (
            <div className="p-3 rounded-xl bg-forest/20 border border-forest text-xs space-y-1">
              <span className="font-bold text-lime">Technician Resolution Report:</span>
              <p className="text-ivory leading-relaxed">{request.resolution_notes}</p>
            </div>
          )}
        </div>

        {/* Action Panel for Staff OR Resident Rating */}
        <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl space-y-4">
          {/* Staff Workflow Actions */}
          {isStaffOrAdmin ? (
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey flex items-center gap-2">
                <Wrench className="w-4 h-4 text-lime" />
                Specialist Status Dispatch
              </h3>

              <div className="space-y-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record diagnostic observations or repair actions taken..."
                  className="w-full bg-obsidian border border-graphite-border rounded-xl p-3 text-xs text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime resize-none h-20"
                />

                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="Materials used (comma-separated, e.g. Ceramic cartridge, Teflon tape)"
                  className="w-full bg-obsidian border border-graphite-border rounded-xl px-3 py-2 text-xs text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime"
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    className="py-2.5 px-3 rounded-lg bg-warningAmber/15 border border-warningAmber/40 text-warningAmber font-bold text-xs hover:bg-warningAmber/25 transition-all"
                  >
                    Set: In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange('waiting_for_parts')}
                    className="py-2.5 px-3 rounded-lg bg-coolBlue/15 border border-coolBlue/40 text-coolBlue font-bold text-xs hover:bg-coolBlue/25 transition-all"
                  >
                    Awaiting Parts
                  </button>
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    className="col-span-2 py-3 px-3 rounded-lg bg-lime hover:bg-lime-glow text-obsidian font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-lime/20"
                  >
                    ✓ Mark Ticket Resolved
                  </button>
                </div>
              </div>
            </div>
          ) : request.status === 'resolved' ? (
            /* Resident Rating & Experience Form */
            <div className="space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey flex items-center gap-2">
                <Star className="w-4 h-4 text-warningAmber" />
                Rate Resolution Quality
              </h3>

              {ratingSubmitted || request.resolution_rating ? (
                <div className="p-4 rounded-xl bg-forest/30 border border-forest text-center space-y-2">
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-5 h-5 ${
                          s <= (request.resolution_rating || rating)
                            ? 'text-warningAmber fill-warningAmber'
                            : 'text-mutedGrey'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-lime">Resolution Feedback Recorded</p>
                  <p className="text-[11px] text-mutedGrey">{request.resolution_feedback || feedback || 'Thank you for helping keep Nexus Residences maintained.'}</p>
                </div>
              ) : (
                <form onSubmit={handleRate} className="space-y-3">
                  <div className="flex items-center gap-2 justify-center py-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= rating ? 'text-warningAmber fill-warningAmber' : 'text-mutedGrey'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Was the problem fixed to your satisfaction? Any notes for the team..."
                    className="w-full bg-obsidian border border-graphite-border rounded-xl p-3 text-xs text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime resize-none h-20"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-lime hover:bg-lime-glow text-obsidian font-bold rounded-lg text-xs transition-all"
                  >
                    Submit Rating & Close Feedback
                  </button>
                </form>
              )}

              {/* Reopen option if problem reappeared */}
              <div className="pt-3 border-t border-graphite-border text-center">
                <button
                  onClick={() => handleStatusChange('reopened')}
                  className="text-xs text-alertCoral hover:underline font-mono inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Issue not solved? Reopen ticket
                </button>
              </div>
            </div>
          ) : (
            /* Resident waiting view */
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-forest/40 border border-forest flex items-center justify-center mx-auto text-lime">
                <Clock className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="text-sm font-bold text-ivory">Maintenance Under Process</h4>
              <p className="text-xs text-mutedGrey leading-relaxed">
                Our facilities team has received your ticket and is coordinating tools and access. You will receive an alert as soon as work begins.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetail;

