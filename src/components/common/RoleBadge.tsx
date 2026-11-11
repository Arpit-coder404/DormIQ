import React from 'react';
import { UserRole } from '../../types';
import { Shield, Wrench, User, Award } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const configs = {
    resident: {
      label: 'Resident',
      icon: User,
      classes: 'bg-forest-light/60 text-lime border-forest',
    },
    staff: {
      label: 'Maintenance Staff',
      icon: Wrench,
      classes: 'bg-warningAmber/10 text-warningAmber border-warningAmber/30',
    },
    warden: {
      label: 'Hostel Warden',
      icon: Shield,
      classes: 'bg-coolBlue/10 text-coolBlue border-coolBlue/30',
    },
    admin: {
      label: 'Hostel Admin',
      icon: Award,
      classes: 'bg-lime/10 text-lime border-lime/30 font-semibold',
    },
  };

  const config = configs[role] || configs.resident;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full font-mono uppercase tracking-wider ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${config.classes}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
};

