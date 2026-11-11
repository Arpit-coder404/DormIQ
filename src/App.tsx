import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import { AppLayout } from './layouts/AppLayout';

// Common
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DemoNoticeBanner } from './components/common/DemoNoticeBanner';

// Pages - Public
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';

// Pages - Resident App
import Dashboard from './pages/app/Dashboard';
import HostelOverview from './pages/app/HostelOverview';
import FloorPlan from './pages/app/FloorPlan';
import MaintenancePage from './pages/app/MaintenancePage';
import MaintenanceDetail from './pages/app/MaintenanceDetail';
import FacilitiesPage from './pages/app/FacilitiesPage';
import UtilitiesPage from './pages/app/UtilitiesPage';
import AnnouncementsPage from './pages/app/AnnouncementsPage';
import CommunityPage from './pages/app/CommunityPage';
import ProfilePage from './pages/app/ProfilePage';

// Pages - Staff / Warden / Admin
import StaffDashboard from './pages/StaffDashboard';
import WardenDashboard from './pages/WardenDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Store
import { useAuthStore } from './store/authStore';

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

// Landing wrapper with Navbar + Footer
const LandingWrapper: React.FC = () => (
  <>
    <Navbar />
    <LandingPage />
    <Footer />
  </>
);

// Staff dashboard wrapper
const StaffWrapper: React.FC = () => (
  <div className="min-h-screen bg-obsidian">
    <DemoNoticeBanner />
    <StaffDashboard />
  </div>
);

// Warden dashboard wrapper
const WardenWrapper: React.FC = () => (
  <div className="min-h-screen bg-obsidian">
    <DemoNoticeBanner />
    <WardenDashboard />
  </div>
);

// Admin dashboard wrapper
const AdminWrapper: React.FC = () => (
  <div className="min-h-screen bg-obsidian">
    <DemoNoticeBanner />
    <AdminDashboard />
  </div>
);

const App: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1]}>
        {/* Public */}
        <Route path="/" element={<LandingWrapper />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* App - Protected */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="hostel" element={<HostelOverview />} />
          <Route path="floorplan" element={<FloorPlan />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="maintenance/:id" element={<MaintenanceDetail />} />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route path="utilities" element={<UtilitiesPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Role Dashboards */}
        <Route path="/staff" element={<StaffWrapper />} />
        <Route path="/warden" element={<WardenWrapper />} />
        <Route path="/admin" element={<AdminWrapper />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
