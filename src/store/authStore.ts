import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserRole } from '../types';
import { initialProfiles } from '../lib/demoData';

interface AuthState {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, role?: UserRole) => boolean;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  resetDemoUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: initialProfiles[0], // Defaults to Aarav Sharma (Resident)
      isAuthenticated: true,
      isDemoMode: true,

      login: (email: string, targetRole?: UserRole) => {
        const found = initialProfiles.find(p => p.email.toLowerCase() === email.toLowerCase()) 
          || (targetRole ? initialProfiles.find(p => p.role === targetRole) : null);
        
        if (found) {
          set({ currentUser: found, isAuthenticated: true });
          return true;
        }

        // Create new demo profile if email not in default
        const newProfile: UserProfile = {
          id: `user-${Date.now()}`,
          email,
          full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          role: targetRole || 'resident',
          hostel_id: 'hostel-nexus-1',
          hostel_name: 'Nexus Residences',
          block_name: 'Block A (Alpha Hall)',
          floor_number: 2,
          room_number: 'A-204',
          created_at: new Date().toISOString(),
        };
        set({ currentUser: newProfile, isAuthenticated: true });
        return true;
      },

      switchRole: (role: UserRole) => {
        const profile = initialProfiles.find(p => p.role === role);
        if (profile) {
          set({ currentUser: profile, isAuthenticated: true });
        }
      },

      updateProfile: (updates) => {
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
        }));
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      resetDemoUser: () => {
        set({ currentUser: initialProfiles[0], isAuthenticated: true });
      },
    }),
    {
      name: 'dormiq-auth-storage',
    }
  )
);

