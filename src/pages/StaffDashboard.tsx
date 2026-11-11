import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  ArrowRight,
  Filter,
  User,
  Shield,
  FileText,
  Activity,
} from 'lucide-react';
import { useHostelStore } from '../store/hostelStore';
import { useAuthStore } from '../store/authStore';
import { MaintenanceStatus } from '../types';

export const StaffDashboard: React.FC = () => {
  const { requests, updateRequestStatus } = useHostelStore();
  const { currentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'completed'>('in_progress');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [techNotes, setTechNotes] = useState('');
  const [materialsInput, setMaterialsInput] = useState('');

  // Filter requests assigned or relevant to staff
  const assignedRequests = requests.filter(
    (r) => !r.assigned_staff_id || r.assigned_staff_id === currentUser?.id || currentUser?.role !== 'staff'
  );

  const pendingRequests = assignedRequests.filter(
    (r) => r.status === 'submitted' || r.status === 'acknowledged' || r.status === 'assigned'
  );
  const inProgressRequests = assignedRequests.filter(
    (r) => r.status === 'in_progress' || r.status === 'waiting_for_parts' || r.status === 'reopened'
  );
  const completedRequests = assignedRequests.filter((r) => r.status === 'resolved');

  const displayedRequests =
    activeTab === 'pending'
      ? pendingRequests
      : activeTab === 'in_progress'
      ? inProgressRequests
      : completedRequests;

  const handleUpdate = (status: MaintenanceStatus) => {
    if (!selectedRequest || !currentUser) return;

    updateRequestStatus(
      selectedRequest.id,
      status,
      currentUser.id,
      currentUser.full_name,
      'staff',
      techNotes || undefined,
      materialsInput ? materialsInput.split(',').map((s) => s.trim()) : undefined
    );

    setSelectedRequest(null);
    setTechNotes('');
    setMaterialsInput('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-graphite-border">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-warningAmber bg-warningAmber/10 border border-warningAmber/30 px-2.5 py-1 rounded-full">
            Specialist Dispatch Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ivory mt-2">
            Maintenance Staff Work Orders
          </h1>
          <p className="text-xs sm:text-sm text-mutedGrey mt-0.5">
            Active technician workbench: triage, dispatch, log parts, and certify repairs.
          </p>
        </div>

        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 text-xs text-lime font-mono hover:underline self-start sm:self-auto"
        >
          <span>Resident Portal View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">In Progress</span>
            <Activity className="w-4 h-4 text-warningAmber" />
          </div>
          <p className="text-2xl font-display font-bold text-warningAmber font-mono">
            {inProgressRequests.length}
          </p>
          <p className="text-[11px] text-mutedGrey mt-1">Active repair sessions</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Awaiting Triage</span>
            <Clock className="w-4 h-4 text-coolBlue" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory font-mono">
            {pendingRequests.length}
          </p>
          <p className="text-[11px] text-mutedGrey mt-1">Ready for specialist pickup</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Resolved Today</span>
            <CheckCircle2 className="w-4 h-4 text-lime" />
          </div>
          <p className="text-2xl font-display font-bold text-lime font-mono">
            {completedRequests.length}
          </p>
          <p className="text-[11px] text-lime mt-1">100% Verified turnaround</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Avg Resolution</span>
            <Clock className="w-4 h-4 text-sage" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory font-mono">2.1h</p>
          <p className="text-[11px] text-lime mt-1">Target benchmark: &lt; 4.0h</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-graphite-border">
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'in_progress'
              ? 'border-warningAmber text-warningAmber font-bold'
              : 'border-transparent text-mutedGrey hover:text-ivory'
          }`}
        >
          <span>In Progress ({inProgressRequests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'pending'
              ? 'border-lime text-lime font-bold'
              : 'border-transparent text-mutedGrey hover:text-ivory'
          }`}
        >
          <span>Awaiting Triage ({pendingRequests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'completed'
              ? 'border-lime text-lime font-bold'
              : 'border-transparent text-mutedGrey hover:text-ivory'
          }`}
        >
          <span>Resolved History ({completedRequests.length})</span>
        </button>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedRequests.map((req) => (
          <div
            key={req.id}
            className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-forest transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-forest/40 text-lime border border-forest">
                      {req.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        req.priority === 'urgent'
                          ? 'bg-alertCoral/10 text-alertCoral border-alertCoral/30 font-bold'
                          : req.priority === 'high'
                          ? 'bg-warningAmber/10 text-warningAmber border-warningAmber/30 font-bold'
                          : 'bg-coolBlue/10 text-coolBlue border-coolBlue/30'
                      }`}
                    >
                      {req.priority}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-ivory leading-tight">
                    {req.title}
                  </h3>
                </div>

                <span className="text-xs font-mono text-mutedGrey font-bold whitespace-nowrap">
                  #{req.id.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-ivory/80 leading-relaxed bg-obsidian-light/60 p-3 rounded-xl border border-graphite-border/70">
                {req.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-mutedGrey">
                <div>
                  <span>Location: </span>
                  <strong className="text-ivory">{req.room_number}</strong> ({req.block_name})
                </div>
                <div>
                  <span>Resident: </span>
                  <strong className="text-ivory">{req.resident_name}</strong>
                </div>
                {req.preferred_time && (
                  <div className="col-span-2 text-[11px] text-lime">
                    Preferred Window: {req.preferred_time}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-graphite-border flex items-center justify-between gap-2">
              <Link
                to={`/app/maintenance/${req.id}`}
                className="text-xs text-mutedGrey hover:text-ivory font-mono"
              >
                Full Audit Trail →
              </Link>

              {req.status !== 'resolved' ? (
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="py-2 px-4 rounded-xl bg-lime hover:bg-lime-glow text-obsidian font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-lime/10"
                >
                  Manage Work Order
                </button>
              ) : (
                <span className="text-xs font-mono text-lime font-bold">✓ Closed & Certified</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Staff Update Work Order Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm px-4">
          <div className="bg-graphite border border-graphite-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-graphite-border pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-ivory">Update Work Order</h3>
                <p className="text-xs text-mutedGrey font-mono">#{selectedRequest.id} • {selectedRequest.room_number}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-mutedGrey hover:text-ivory text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-mutedGrey mb-1">Diagnostic Report / Actions</label>
                <textarea
                  rows={3}
                  value={techNotes}
                  onChange={(e) => setTechNotes(e.target.value)}
                  placeholder="e.g. Disassembled spindle, replaced damaged O-ring seal, verified flow..."
                  className="w-full bg-obsidian border border-graphite-border rounded-xl p-3 text-xs text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-mutedGrey mb-1">Materials / Hardware Used</label>
                <input
                  type="text"
                  value={materialsInput}
                  onChange={(e) => setMaterialsInput(e.target.value)}
                  placeholder="e.g. 1/2 inch ceramic cartridge, PTFE thread tape"
                  className="w-full bg-obsidian border border-graphite-border rounded-xl px-3.5 py-2 text-xs text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleUpdate('in_progress')}
                  className="py-2.5 rounded-xl bg-warningAmber/15 border border-warningAmber/40 text-warningAmber font-bold text-xs hover:bg-warningAmber/25"
                >
                  Set: In Progress
                </button>
                <button
                  onClick={() => handleUpdate('waiting_for_parts')}
                  className="py-2.5 rounded-xl bg-coolBlue/15 border border-coolBlue/40 text-coolBlue font-bold text-xs hover:bg-coolBlue/25"
                >
                  Waiting for Parts
                </button>
                <button
                  onClick={() => handleUpdate('resolved')}
                  className="col-span-2 py-3 rounded-xl bg-lime hover:bg-lime-glow text-obsidian font-bold text-xs uppercase tracking-wider shadow-lg shadow-lime/20"
                >
                  ✓ Mark Repaired & Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;

