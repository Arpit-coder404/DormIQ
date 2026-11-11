import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, Cpu, Zap, Droplets, Wifi, ArrowUp, Wrench, Map, Calendar,
  Users, Brain, Home, Shield, BarChart2, Frown, Clock, Eye, CheckCircle,
  Star, TrendingUp, Activity, Bell, MessageSquare, Building2,
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string; id?: string }> = ({
  children, className = '', id,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      id={id}
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-obsidian text-ivory overflow-x-hidden">
      {/* ───── HERO ───── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(rgba(200,255,98,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-forest/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-forest bg-forest/30 text-lime font-mono text-xs tracking-widest uppercase mb-8"
          >
            <Activity className="w-3 h-3 animate-pulse" />
            Nexus Residences Operating System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-6"
          >
            The{' '}
            <span className="text-lime relative">
              Operating System
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-lime/40 rounded-full" />
            </span>
            {' '}for Modern<br />Hostel Living
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-mutedGrey text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Real-time infrastructure telemetry, intelligent maintenance tracking, interactive spatial floor plans,
            and transparent facility governance — all in one unified control surface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <button
              onClick={() => navigate('/app')}
              className="inline-flex items-center gap-2 bg-lime hover:bg-lime-glow text-obsidian font-bold px-8 py-3.5 rounded-xl text-base transition-all shadow-xl shadow-lime/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Launch DormIQ
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 border border-graphite-border hover:border-sage text-ivory px-8 py-3.5 rounded-xl text-base transition-all hover:bg-graphite-light"
            >
              View Demo
            </Link>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10"
          >
            {[
              { value: '284', label: 'Active Residents', icon: Users },
              { value: '94.2%', label: 'Health Index', icon: TrendingUp },
              { value: '48', label: 'Issues Resolved This Week', icon: CheckCircle },
            ].map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-graphite/80 backdrop-blur border border-graphite-border rounded-xl px-5 py-3"
              >
                <Icon className="w-5 h-5 text-lime" />
                <div className="text-left">
                  <div className="font-display font-bold text-xl text-ivory">{value}</div>
                  <div className="text-xs text-mutedGrey">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-mutedGrey"
        >
          <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-mutedGrey to-transparent" />
        </motion.div>
      </section>

      {/* ───── PROBLEM ───── */}
      <SectionWrapper id="platform" className="py-24 px-6 bg-graphite">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <span className="font-mono text-xs tracking-widest text-lime uppercase">The Problem</span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl mt-3 mb-4">
              Life in a hostel shouldn't{' '}
              <span className="text-alertCoral">feel like a black box</span>
            </h2>
            <p className="text-mutedGrey max-w-xl mx-auto">
              Students deal with broken systems, invisible processes, and zero feedback loops. We built DormIQ to fix that.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Frown,
                title: 'Manual Complaint Books',
                description: 'Paper forms, lost requests, no tracking. Issues sit unacknowledged for days with no way to follow up.',
                color: 'text-alertCoral',
              },
              {
                icon: Clock,
                title: 'Zero Visibility into Progress',
                description: 'Once you report a problem, it disappears into a void. No status updates, no timeline, no accountability.',
                color: 'text-warningAmber',
              },
              {
                icon: Eye,
                title: 'Infrastructure Blind Spots',
                description: 'Power outages, water failures, Wi-Fi degradation — residents discover them only when it\'s too late.',
                color: 'text-coolBlue',
              },
            ].map(({ icon: Icon, title, description, color }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="bg-obsidian border border-graphite-border rounded-2xl p-6 hover:border-lime/40 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl bg-graphite-light border border-graphite-border flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-mutedGrey text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ───── FEATURES ───── */}
      <SectionWrapper id="features" className="py-24 px-6 bg-obsidian">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <span className="font-mono text-xs tracking-widest text-lime uppercase">Platform Capabilities</span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl mt-3 mb-4">
              Every System.{' '}
              <span className="text-lime">Fully Transparent.</span>
            </h2>
            <p className="text-mutedGrey max-w-xl mx-auto">
              Six intelligent modules designed around the actual needs of hostel residents, staff, and administrators.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Wrench, title: 'Maintenance Tracking', description: 'Report issues, track status in real-time, get notified at every step. Full audit trail from submission to resolution.', link: '/app/maintenance' },
              { icon: Map, title: 'Interactive Floor Plan', description: 'Live SVG floor maps per block and floor. Click any room to see its status, issues, and residents count instantly.', link: '/app/floorplan' },
              { icon: Zap, title: 'Utility Intelligence', description: 'Simulated telemetry for electricity, water, and Wi-Fi across all blocks. Anomaly flags and usage trend charts.', link: '/app/utilities' },
              { icon: Calendar, title: 'Facility Booking', description: 'Reserve laundry machines, study pods, and gym slots with real-time conflict detection. Cancel anytime.', link: '/app/facilities' },
              { icon: Users, title: 'Community Hub', description: 'Post announcements, lost & found, suggestions. Like and comment. Build a connected hostel community.', link: '/app/community' },
              { icon: Brain, title: 'Smart Insights Engine', description: 'Rule-based AI analyzes maintenance patterns, flags recurring faults, and suggests preventive actions to wardens.', link: '/warden' },
            ].map(({ icon: Icon, title, description, link }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="group bg-graphite border border-graphite-border rounded-2xl p-6 hover:border-lime/60 transition-all cursor-pointer"
                onClick={() => navigate(link)}
              >
                <div className="w-12 h-12 rounded-xl bg-forest/40 border border-forest flex items-center justify-center mb-4 group-hover:bg-lime/10 group-hover:border-lime/40 transition-all">
                  <Icon className="w-6 h-6 text-lime" />
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-lime transition-colors">{title}</h3>
                <p className="text-mutedGrey text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ───── HOW IT WORKS ───── */}
      <SectionWrapper id="floorplan" className="py-24 px-6 bg-graphite">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-14">
            <span className="font-mono text-xs tracking-widest text-lime uppercase">Role-Based Access</span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl mt-3 mb-4">
              One Platform.{' '}
              <span className="text-lime">Four Roles.</span>
            </h2>
            <p className="text-mutedGrey max-w-xl mx-auto">
              Every user gets a tailored control surface with exactly the information and actions they need.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Home, role: 'Resident', color: 'text-lime', border: 'border-lime/40', bg: 'bg-forest/20',
                link: '/app',
                items: ['Report & track issues', 'Book laundry & study rooms', 'View floor plan', 'Read announcements', 'Join community forum'],
              },
              {
                icon: Wrench, role: 'Staff', color: 'text-warningAmber', border: 'border-warningAmber/40', bg: 'bg-warningAmber/5',
                link: '/staff',
                items: ['Accept work orders', 'Update job status', 'Log materials used', 'Mark jobs resolved', 'View daily job queue'],
              },
              {
                icon: Shield, role: 'Warden', color: 'text-coolBlue', border: 'border-coolBlue/40', bg: 'bg-coolBlue/5',
                link: '/warden',
                items: ['Assign staff to tickets', 'Publish announcements', 'View smart insights', 'Monitor block health', 'Override escalations'],
              },
              {
                icon: BarChart2, role: 'Admin', color: 'text-alertCoral', border: 'border-alertCoral/40', bg: 'bg-alertCoral/5',
                link: '/admin',
                items: ['Full system overview', 'Manage residents & staff', 'Block health analytics', 'Audit activity feed', 'Infrastructure telemetry'],
              },
            ].map(({ icon: Icon, role, color, border, bg, link, items }) => (
              <motion.div
                key={role}
                variants={fadeInUp}
                className={`bg-obsidian border ${border} rounded-2xl p-6 cursor-pointer hover:scale-[1.02] transition-transform`}
                onClick={() => navigate(link)}
              >
                <div className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div className={`font-mono text-xs uppercase tracking-widest ${color} mb-1`}>Role</div>
                <h3 className="font-display font-bold text-xl mb-4">{role}</h3>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-mutedGrey">
                      <CheckCircle className="w-3.5 h-3.5 text-lime mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ───── INFRASTRUCTURE ───── */}
      <SectionWrapper id="infrastructure" className="py-24 px-6 bg-obsidian">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-4">
            <span className="font-mono text-xs tracking-widest text-lime uppercase">Infrastructure Dashboard</span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl mt-3 mb-4">
              Real-Time Infrastructure{' '}
              <span className="text-lime">At a Glance</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-warningAmber/50 bg-warningAmber/10 text-warningAmber font-mono text-xs">
              ⚠ SIMULATED DATA — Not real sensor readings
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Zap, label: 'Electricity', value: '99.4%', sub: 'Grid Uptime', status: 'Stable', color: 'text-lime', dot: 'bg-lime' },
              { icon: Droplets, label: 'Water Supply', value: '96.0%', sub: 'Distribution Stability', status: 'Stable', color: 'text-coolBlue', dot: 'bg-coolBlue' },
              { icon: Wifi, label: 'Wi-Fi Mesh', value: '14ms', sub: 'Average Latency', status: 'Fast', color: 'text-lime', dot: 'bg-lime' },
              { icon: ArrowUp, label: 'Elevators', value: '98.0%', sub: 'Vertical Transport', status: 'Active', color: 'text-lime', dot: 'bg-lime' },
            ].map(({ icon: Icon, label, value, sub, status, color, dot }) => (
              <motion.div
                key={label}
                variants={fadeInUp}
                className="bg-graphite border border-graphite-border rounded-2xl p-5 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-forest/30 border border-forest mx-auto flex items-center justify-center mb-4">
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div className="font-mono text-xs text-mutedGrey uppercase tracking-wider mb-1">{label}</div>
                <div className={`font-display font-bold text-3xl ${color} mb-1`}>{value}</div>
                <div className="text-xs text-mutedGrey mb-3">{sub}</div>
                <div className="inline-flex items-center gap-1.5 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
                  <span className="text-mutedGrey">{status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ───── CTA ───── */}
      <SectionWrapper className="py-24 px-6 bg-graphite">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeInUp}>
            <div className="w-16 h-16 rounded-2xl bg-forest/40 border border-lime/30 flex items-center justify-center mx-auto mb-6">
              <Cpu className="w-8 h-8 text-lime" />
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-5">
              Ready to Move In?
            </h2>
            <p className="text-mutedGrey text-lg mb-10 leading-relaxed">
              Experience DormIQ with pre-loaded demo data. No signup required. Switch between all four roles and explore every feature of the platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 bg-lime hover:bg-lime-glow text-obsidian font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-xl shadow-lime/25 hover:scale-[1.02]"
              >
                Enter Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 border border-graphite-border hover:border-lime/40 text-ivory px-10 py-4 rounded-xl text-lg transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default LandingPage;
