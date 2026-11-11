import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { DemoNoticeBanner } from '../components/common/DemoNoticeBanner';
import { ReportMaintenanceModal } from '../components/maintenance/ReportMaintenanceModal';

export const AppLayout: React.FC = () => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-obsidian flex flex-col">
      <DemoNoticeBanner />

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed sidebar desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="w-64">
            <div className="fixed top-[41px] bottom-0 w-64 overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-64 max-w-xs flex-shrink-0">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            onOpenReportModal={() => setReportModalOpen(true)}
            onToggleMobileNav={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      <ReportMaintenanceModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};

