import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Shield, LayoutGrid, Terminal, ArrowRight, Menu, X, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLaunch = () => {
    if (!isAuthenticated || !currentUser) {
      navigate('/auth');
      return;
    }
    if (currentUser.role === 'staff') navigate('/staff');
    else if (currentUser.role === 'warden') navigate('/warden');
    else if (currentUser.role === 'admin') navigate('/admin');
    else navigate('/app');
  };

  return (
    <nav className="sticky top-0 z-50 bg-obsidian/90 backdrop-blur-md border-b border-graphite-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-graphite border border-forest flex items-center justify-center relative overflow-hidden group-hover:border-lime transition-all">
              <div className="absolute inset-0 bg-lime/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Cpu className="w-5 h-5 text-lime" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-ivory flex items-center gap-1.5">
                Dorm<span className="text-lime">IQ</span>
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-mutedGrey uppercase">
                Hostel OS v2.4
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#platform" className="text-mutedGrey hover:text-ivory transition-colors">
              Platform
            </a>
            <a href="#features" className="text-mutedGrey hover:text-ivory transition-colors">
              Features
            </a>
            <a href="#floorplan" className="text-mutedGrey hover:text-ivory transition-colors">
              Floor Plan
            </a>
            <a href="#infrastructure" className="text-mutedGrey hover:text-ivory transition-colors">
              Infrastructure
            </a>
            <Link to="/app/hostel" className="text-mutedGrey hover:text-ivory transition-colors">
              Hostel Overview
            </Link>
          </div>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/auth"
              className="text-sm font-medium text-mutedGrey hover:text-ivory transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <button
              onClick={handleLaunch}
              className="inline-flex items-center gap-2 bg-lime hover:bg-lime-glow text-obsidian px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-lg shadow-lime/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch DormIQ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-graphite border border-graphite-border text-ivory"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-graphite-border bg-obsidian-light px-4 pt-3 pb-6 space-y-3">
          <a
            href="#platform"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base text-ivory hover:bg-graphite rounded-md"
          >
            Platform
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base text-ivory hover:bg-graphite rounded-md"
          >
            Features
          </a>
          <a
            href="#floorplan"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base text-ivory hover:bg-graphite rounded-md"
          >
            Floor Plan
          </a>
          <a
            href="#infrastructure"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base text-ivory hover:bg-graphite rounded-md"
          >
            Infrastructure
          </a>
          <div className="pt-4 border-t border-graphite-border flex flex-col gap-2">
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-graphite-border text-ivory"
            >
              Sign In
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLaunch();
              }}
              className="w-full py-2.5 rounded-lg bg-lime text-obsidian font-medium flex items-center justify-center gap-2"
            >
              <span>Launch DormIQ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

