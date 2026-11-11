import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Clock,
  User,
  Shield,
  X,
  Droplets,
  Zap,
  Wifi,
  Sparkles,
} from 'lucide-react';
import { useHostelStore } from '../../store/hostelStore';
import { useAuthStore } from '../../store/authStore';

export const AnnouncementsPage: React.FC = () => {
  const { announcements, addAnnouncement, markAnnouncementRead } = useHostelStore();
  const { currentUser } = useAuthStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states for creating announcement
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<any>('general');
  const [isCritical, setIsCritical] = useState(false);

  const isStaffOrAdmin =
    currentUser?.role === 'warden' || currentUser?.role === 'admin' || currentUser?.role === 'staff';

  const categories = [
    { label: 'All Notices', value: 'all' },
    { label: 'Water Supply', value: 'water' },
    { label: 'Electricity & Grid', value: 'electricity' },
    { label: 'Wi-Fi & Network', value: 'wifi' },
    { label: 'Safety & Curfew', value: 'safety' },
    { label: 'Events & Meetings', value: 'events' },
  ];

  const filtered = announcements.filter((a) => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    addAnnouncement({
      hostel_id: currentUser.hostel_id,
      title,
      content,
      category,
      is_critical: isCritical,
      created_by: currentUser.id,
      author_name: currentUser.full_name,
      author_role: currentUser.role === 'warden' ? 'Chief Warden' : currentUser.role === 'admin' ? 'Operations Admin' : 'Facilities Staff',
    });

    setTitle('');
    setContent('');
    setIsCritical(false);
    setCreateModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-graphite-border">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-lime bg-forest/40 border border-forest px-2.5 py-1 rounded-full">
            Campus Bulletin Broadcast
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ivory mt-2">
            Hostel Announcements & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-mutedGrey mt-0.5">
            Verified updates from hostel wardens, facilities maintenance, and administrative directors.
          </p>
        </div>

        {isStaffOrAdmin && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-lime hover:bg-lime-glow text-obsidian px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-lime/20"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast New Notice</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setSelectedCategory(c.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
              selectedCategory === c.value
                ? 'bg-lime text-obsidian font-bold shadow-sm'
                : 'bg-graphite text-mutedGrey hover:text-ivory border border-graphite-border'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filtered.map((ann) => {
          const isRead = currentUser ? ann.read_by.includes(currentUser.id) : false;

          return (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-6 transition-all shadow-lg ${
                ann.is_critical
                  ? 'bg-alertCoral/10 border-alertCoral/50 shadow-alertCoral/5'
                  : 'bg-graphite border-graphite-border'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {ann.is_critical ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-alertCoral text-obsidian">
                      <AlertTriangle className="w-3 h-3" /> Critical Notice
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-forest/40 text-lime border border-forest">
                      {ann.category}
                    </span>
                  )}
                  <span className="text-xs text-mutedGrey font-mono">
                    {new Date(ann.published_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-mutedGrey font-mono">
                  <span>Issued by: <strong className="text-ivory">{ann.author_name}</strong> ({ann.author_role})</span>
                  {currentUser && !isRead && (
                    <button
                      onClick={() => markAnnouncementRead(ann.id, currentUser.id)}
                      className="text-lime hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Read
                    </button>
                  )}
                  {currentUser && isRead && (
                    <span className="text-mutedGrey/60 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime" /> Read
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-lg font-display font-bold text-ivory mb-2">
                {ann.title}
              </h2>

              <p className="text-xs sm:text-sm text-ivory/90 leading-relaxed bg-obsidian-light/60 p-4 rounded-xl border border-graphite-border/70">
                {ann.content}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Broadcast Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm px-4">
          <div className="bg-graphite border border-graphite-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-graphite-border pb-3">
              <h3 className="font-display font-bold text-lg text-ivory">Publish Campus Announcement</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-mutedGrey hover:text-ivory text-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-mutedGrey mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scheduled Water Pipeline Maintenance..."
                  className="w-full bg-obsidian border border-graphite-border rounded-xl px-3.5 py-2.5 text-xs text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-mutedGrey mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-obsidian border border-graphite-border rounded-xl px-3.5 py-2.5 text-xs text-ivory focus:outline-none focus:border-lime"
                  >
                    <option value="general">General</option>
                    <option value="water">Water Supply</option>
                    <option value="electricity">Electricity</option>
                    <option value="wifi">Wi-Fi & Network</option>
                    <option value="safety">Safety</option>
                    <option value="events">Events</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs text-ivory cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCritical}
                      onChange={(e) => setIsCritical(e.target.checked)}
                      className="w-4 h-4 rounded text-alertCoral focus:ring-alertCoral accent-alertCoral"
                    />
                    <span className="font-bold text-alertCoral">Flag as Critical Notice</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-mutedGrey mb-1">Announcement Body</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Details of the announcement, affected blocks, timelines..."
                  className="w-full bg-obsidian border border-graphite-border rounded-xl p-3 text-xs text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-lime hover:bg-lime-glow text-obsidian font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Broadcast to Nexus Residents
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;

