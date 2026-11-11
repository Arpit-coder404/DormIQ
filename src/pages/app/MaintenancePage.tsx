import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench, Plus, Filter, ChevronRight, Clock, User,
  AlertTriangle, CheckCircle2, Loader2, Package, XCircle, RotateCcw
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useHostelStore } from '../../store/hostelStore';
import { ReportMaintenanceModal } from '../../components/maintenance/ReportMaintenanceModal';
import { MaintenanceStatus, MaintenancePriority, MaintenanceCategory } from '../../types';

const statusConfig: Record<MaintenanceStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  submitted: { label: 'Submitted', color: 'text-mutedGrey', bg: 'bg-mutedGrey/20', icon: Clock },
  acknowledged: { label: 'Acknowledged', color: 'text-coolBlue', bg: 'bg-coolBlue/20', icon: CheckCircle2 },
  assigned: { label: 'Assigned', color: 'text-coolBlue', bg: 'bg-coolBlue/20', icon: User },
  in_progress: { label: 'In Progress', color: 'text-warningAmber', bg: 'bg-warningAmber/20', icon: Loader2 },
  waiting_for_parts: { label: 'Waiting Parts', color: 'text-orange-400', bg: 'bg-orange-400/20', icon: Package },
  resolved: { label: 'Resolved', color: 'text-lime', bg: 'bg-lime/20', icon: CheckCircle2 },
  reopened: { label: 'Reopened', color: 'text-alertCoral', bg: 'bg-alertCoral/20', icon: RotateCcw },
  rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-400/20', icon: XCircle },
};

const priorityConfig: Record<MaintenancePriority, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: 'text-sage', bg: 'bg-sage/20' },
  medium: { label: 'Medium', color: 'text-coolBlue', bg: 'bg-coolBlue/20' },
  high: { label: 'High', color: 'text-warningAmber', bg: 'bg-warningAmber/20' },
  urgent: { label: 'URGENT', color: 'text-alertCoral', bg: 'bg-alertCoral/20' },
};

const categoryIcons: Record<MaintenanceCategory, React.ElementType> = {
  plumbing: Wrench,
  electrical: Wrench,
  wifi: Wrench,
  furniture: Wrench,
  appliances: Wrench,
  cleaning: Wrench,
  washroom: Wrench,
  structural: Wrench,
  other: Wrench,
};

export const MaintenancePage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { requests } = useHostelStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<MaintenancePriority | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<MaintenanceCategory | 'all'>('all');

  const isStaff = currentUser?.role === 'staff' || currentUser?.role === 'warden' || currentUser?.role === 'admin';

  const baseRequests = activeTab === 'my'
    ? requests.filter(r => r.resident_id === currentUser?.id)
    : requests;

  const filtered = baseRequests.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterPriority !== 'all' && r.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-ivory flex items-center gap-2">
            <Wrench className="w-6 h-6 text-lime" />
            Maintenance Requests
          </h1>
          <p className="text-sm text-mutedGrey mt-1">
            {filtered.length} request{filtered.length !== 1 ? 's' : ''} shown
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-lime hover:bg-lime-glow text-obsidian font-semibold px-4 py-2.5 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-lime/20 text-sm"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </motion.div>

      {/* Tabs */}
      {isStaff && (
        <div className="flex gap-1 p-1 bg-graphite rounded-lg mb-4 w-fit border border-graphite-border">
          {(['my', 'all'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-forest text-lime'
                  : 'text-mutedGrey hover:text-ivory'
              }`}
            >
              {tab === 'my' ? 'My Requests' : 'All Requests'}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-mutedGrey" />
          <span className="text-xs text-mutedGrey uppercase font-mono tracking-wider">Filters:</span>
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as MaintenanceStatus | 'all')}
          className="bg-graphite border border-graphite-border text-ivory text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-lime"
        >
          <option value="all">All Status</option>
          {Object.entries(statusConfig).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value as MaintenancePriority | 'all')}
          className="bg-graphite border border-graphite-border text-ivory text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-lime"
        >
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value as MaintenanceCategory | 'all')}
          className="bg-graphite border border-graphite-border text-ivory text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-lime"
        >
          <option value="all">All Categories</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="wifi">Wi-Fi</option>
          <option value="furniture">Furniture</option>
          <option value="appliances">Appliances</option>
          <option value="cleaning">Cleaning</option>
          <option value="washroom">Washroom</option>
          <option value="structural">Structural</option>
          <option value="other">Other</option>
        </select>
        {(filterStatus !== 'all' || filterPriority !== 'all' || filterCategory !== 'all') && (
          <button
            onClick={() => { setFilterStatus('all'); setFilterPriority('all'); setFilterCategory('all'); }}
            className="text-xs text-alertCoral hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </motion.div>

      {/* Request Cards */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-graphite border border-graphite-border flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-lime" />
          </div>
          <h3 className="text-xl font-semibold text-ivory mb-2">All Clear!</h3>
          <p className="text-mutedGrey text-sm max-w-xs">
            No maintenance requests match the current filters.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 bg-forest border border-lime/30 text-lime px-4 py-2 rounded-lg text-sm hover:bg-forest-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            Submit New Request
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {filtered.map(req => {
            const status = statusConfig[req.status];
            const priority = priorityConfig[req.priority];
            const StatusIcon = status.icon;
            return (
              <motion.div key={req.id} variants={itemVariants}>
                <Link
                  to={`/app/maintenance/${req.id}`}
                  className="block bg-graphite border border-graphite-border hover:border-lime/40 rounded-xl p-4 transition-all hover:bg-graphite-light group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priority.bg} ${priority.color}`}>
                          {priority.label}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs bg-graphite-border text-mutedGrey capitalize">
                          {req.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-ivory text-sm truncate group-hover:text-lime transition-colors">
                        {req.title}
                      </h3>
                      <p className="text-mutedGrey text-xs mt-1 line-clamp-1">{req.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-mutedGrey">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {req.resident_name}
                        </span>
                        <span>{req.room_number} · {req.block_name}</span>
                        {req.assigned_staff_name && (
                          <span className="text-coolBlue">→ {req.assigned_staff_name}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-mutedGrey group-hover:text-lime transition-colors flex-shrink-0 mt-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <ReportMaintenanceModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default MaintenancePage;
