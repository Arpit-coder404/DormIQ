import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useHostelStore } from '../../store/hostelStore';
import { Bell, Plus, CheckCircle2, AlertTriangle, Shield, Check, ExternalLink, Menu, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RoleBadge } from './RoleBadge';

interface HeaderProps {
  onOpenReportModal?: () => void;
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReportModal, onToggleMobileNav }) => {
  const { currentUser } = useAuthStore();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHostelStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) return null;

  const userNotifications = notifications.filter(
    (n) => n.user_id === currentUser.id || n.user_id === 'all'
  );
  const unreadCount = userNotifications.filter((n) => !n.is_read).length;

  const handleNotificationClick = (id: string, link?: string) => {
    markNotificationRead(id);
    setShowNotifications(false);
    if (link) navigate(link);
  };

  return (
    <header className="h-16 bg-obsidian border-b border-graphite-border px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Mobile hamburger & Location details */}
      <div className="flex items-center gap-3">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 rounded-lg bg-graphite border border-graphite-border text-ivory"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-graphite/60 border border-graphite-border font-mono text-mutedGrey">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
            <span className="text-ivory font-medium">Nexus Residences</span>
            <span>•</span>
            <span className="text-lime">{currentUser.block_name.split(' ')[0]}</span>
            <span>•</span>
            <span>Room {currentUser.room_number || 'Central'}</span>
          </div>
        </div>

        <div className="sm:hidden text-xs font-display font-medium text-ivory">
          DormIQ <span className="text-lime">OS</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Role Badge Indicator */}
        <div className="hidden lg:block">
          <RoleBadge role={currentUser.role} size="sm" />
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-graphite hover:bg-graphite-light border border-graphite-border text-ivory transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-lime text-obsidian text-[10px] font-bold font-mono flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-graphite border border-graphite-border rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 bg-obsidian-light border-b border-graphite-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ivory">Notifications</span>
                  <span className="text-[10px] font-mono bg-forest px-1.5 py-0.5 rounded text-lime">
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead(currentUser.id)}
                    className="text-[11px] text-mutedGrey hover:text-lime transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-graphite-border/60">
                {userNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-mutedGrey">
                    No active notifications. All systems quiet.
                  </div>
                ) : (
                  userNotifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id, notif.link)}
                      className={`p-3 text-xs cursor-pointer hover:bg-forest/20 transition-colors flex gap-3 ${
                        !notif.is_read ? 'bg-forest/10' : ''
                      }`}
                    >
                      <div className="pt-0.5">
                        {notif.category === 'maintenance' ? (
                          <div className="w-6 h-6 rounded-full bg-warningAmber/10 border border-warningAmber/30 flex items-center justify-center text-warningAmber">
                            !
                          </div>
                        ) : notif.category === 'utility' ? (
                          <div className="w-6 h-6 rounded-full bg-coolBlue/10 border border-coolBlue/30 flex items-center justify-center text-coolBlue">
                            ⚡
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-lime">
                            ✓
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold text-ivory truncate">{notif.title}</p>
                          <span className="text-[10px] font-mono text-mutedGrey whitespace-nowrap">
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-mutedGrey line-clamp-2 mt-0.5">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action: Report an Issue */}
        {onOpenReportModal && (
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 bg-lime hover:bg-lime-glow text-obsidian px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-md shadow-lime/10 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Report Issue</span>
            <span className="sm:hidden">Report</span>
          </button>
        )}
      </div>
    </header>
  );
};

