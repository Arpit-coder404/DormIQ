import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useHostelStore } from '../../store/hostelStore';
import {
  LayoutDashboard,
  Building2,
  Compass,
  Wrench,
  Sparkles,
  Zap,
  Bell,
  Users,
  User,
  Shield,
  Briefcase,
  Sliders,
  LogOut,
  ChevronRight,
  Cpu,
} from 'lucide-react';
import { RoleBadge } from './RoleBadge';

export const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuthStore();
  const { requests, announcements } = useHostelStore();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const activeMaintenanceCount = requests.filter(
    (r) => r.status !== 'resolved' && r.status !== 'rejected' && (currentUser.role !== 'resident' || r.resident_id === currentUser.id)
  ).length;

  const unreadAnnouncementsCount = announcements.filter(
    (a) => !a.read_by.includes(currentUser.id)
  ).length;

  const residentNavItems = [
    { label: 'Control Room', path: '/app', icon: LayoutDashboard },
    { label: 'Hostel Overview', path: '/app/hostel', icon: Building2 },
    { label: 'Interactive Floor Plan', path: '/app/floorplan', icon: Compass, badge: 'Live Map' },
    { label: 'Maintenance Hub', path: '/app/maintenance', icon: Wrench, count: activeMaintenanceCount },
    { label: 'Amenities & Bookings', path: '/app/facilities', icon: Sparkles },
    { label: 'Utility Telemetry', path: '/app/utilities', icon: Zap },
    { label: 'Announcements', path: '/app/announcements', icon: Bell, count: unreadAnnouncementsCount },
    { label: 'Community Quad', path: '/app/community', icon: Users },
    { label: 'My Profile & Room', path: '/app/profile', icon: User },
  ];

  const operationsNavItems = [
    { label: 'Staff Work Orders', path: '/staff', icon: Briefcase, requiredRoles: ['staff', 'warden', 'admin'] },
    { label: 'Warden Control', path: '/warden', icon: Shield, requiredRoles: ['warden', 'admin'] },
    { label: 'Admin Intelligence', path: '/admin', icon: Sliders, requiredRoles: ['admin'] },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <aside className="w-64 bg-obsidian-light border-r border-graphite-border flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-graphite-border flex items-center justify-between">
        <NavLink to="/app" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-graphite border border-forest flex items-center justify-center">
            <Cpu className="w-4 h-4 text-lime" />
          </div>
          <span className="font-display font-bold text-lg text-ivory tracking-tight">
            Dorm<span className="text-lime">IQ</span>
          </span>
        </NavLink>
        <span className="font-mono text-[10px] text-mutedGrey border border-graphite-border px-1.5 py-0.5 rounded">
          v2.4
        </span>
      </div>

      {/* User Room Bar */}
      <div className="px-4 py-3 bg-graphite/40 border-b border-graphite-border">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={currentUser.full_name}
            className="w-9 h-9 rounded-full object-cover border border-forest"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-ivory truncate">{currentUser.full_name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-mono text-lime truncate">
                {currentUser.room_number ? `${currentUser.room_number}` : 'Staff Command'}
              </span>
              <span className="text-mutedGrey text-[10px]">•</span>
              <span className="text-[10px] text-mutedGrey truncate">{currentUser.block_name.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Resident Section */}
        <div>
          <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-mutedGrey mb-2">
            Resident Experience
          </p>
          <div className="space-y-1">
            {residentNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/app'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-forest/60 text-lime border border-forest shadow-sm'
                        : 'text-mutedGrey hover:text-ivory hover:bg-graphite/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-lime/10 text-lime border border-lime/30 text-[9px] font-mono px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="bg-graphite text-ivory border border-graphite-border text-[10px] font-mono px-1.5 py-0.2 rounded-full">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Operations Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-mutedGrey">
              Operations Portals
            </p>
            <RoleBadge role={currentUser.role} size="sm" />
          </div>
          <div className="space-y-1">
            {operationsNavItems.map((item) => {
              const Icon = item.icon;
              const hasAccess = item.requiredRoles.includes(currentUser.role);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-forest/60 text-lime border border-forest shadow-sm'
                        : hasAccess
                        ? 'text-mutedGrey hover:text-ivory hover:bg-graphite/50'
                        : 'text-mutedGrey/40 hover:text-mutedGrey hover:bg-graphite/20'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {!hasAccess && (
                    <span className="text-[9px] font-mono text-mutedGrey/60 uppercase">
                      Admin/Staff
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info & Logout */}
      <div className="p-3 border-t border-graphite-border space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3 py-2 text-xs text-mutedGrey hover:text-alertCoral hover:bg-alertCoral/10 rounded-lg transition-colors border border-transparent hover:border-alertCoral/20"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

