import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Zap,
  Droplets,
  Wifi,
  Layers,
  AlertTriangle,
  Info,
  TrendingUp,
  Activity,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { weeklyUtilitySeries, initialUtilityReadings } from '../../lib/demoData';

export const UtilitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'electricity' | 'water' | 'wifi'>('electricity');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-obsidian border border-graphite-border p-3 rounded-xl shadow-xl text-xs font-mono space-y-1">
          <p className="font-bold text-lime">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold text-ivory">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-graphite-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-lime uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
            Telemetry Grid Analysis
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ivory">
            Utility Intelligence & Consumption
          </h1>
          <p className="text-xs sm:text-sm text-mutedGrey mt-0.5">
            Real-time energy dissipation, water distribution monitoring, and rule-based anomaly detection.
          </p>
        </div>

        {/* Mandatory Transparency Badge */}
        <div className="p-2.5 px-3 rounded-xl bg-forest/30 border border-forest text-[11px] font-mono text-sage flex items-center gap-2">
          <Info className="w-4 h-4 text-lime flex-shrink-0" />
          <span>Simulated Baseline Model (Demo Engine)</span>
        </div>
      </div>

      {/* Top 4 Real-time Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Grid Power Draw</span>
            <Zap className="w-4 h-4 text-lime" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory">
            1,285 <span className="text-xs font-mono text-mutedGrey font-normal">kWh/day</span>
          </p>
          <p className="text-[11px] font-mono text-lime mt-1">-3.2% vs Campus Avg</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Water Distribution</span>
            <Droplets className="w-4 h-4 text-coolBlue" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory">
            12,470 <span className="text-xs font-mono text-mutedGrey font-normal">Liters/day</span>
          </p>
          <p className="text-[11px] font-mono text-warningAmber mt-1">+18.4% Surge in Block A</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Wi-Fi Gateway Ping</span>
            <Wifi className="w-4 h-4 text-lime" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory">
            16.2 <span className="text-xs font-mono text-mutedGrey font-normal">ms latency</span>
          </p>
          <p className="text-[11px] font-mono text-lime mt-1">99.8% Core Uptime</p>
        </div>

        <div className="bg-graphite border border-graphite-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-mutedGrey mb-2">
            <span className="text-xs font-mono uppercase">Elevator Vertical Tripmeter</span>
            <Layers className="w-4 h-4 text-sage" />
          </div>
          <p className="text-2xl font-display font-bold text-ivory">
            412 <span className="text-xs font-mono text-mutedGrey font-normal">cycles today</span>
          </p>
          <p className="text-[11px] font-mono text-lime mt-1">Shaft A & B Optimal</p>
        </div>
      </div>

      {/* Rule-Based Anomaly Detection Flag */}
      <div className="bg-warningAmber/10 border border-warningAmber/40 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warningAmber flex-shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-warningAmber font-bold uppercase tracking-wider">
                RULE-BASED ANOMALY DETECTED
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-warningAmber/20 text-warningAmber">
                Heuristic #WAT-404
              </span>
            </div>
            <h4 className="text-sm font-bold text-ivory mt-0.5">
              Unusual Night-time Water Consumption Surge in Block A (+18.4%)
            </h4>
            <p className="text-xs text-ivory/80 mt-1 leading-relaxed">
              <strong>Observation:</strong> Recorded 4,820 L vs 7-day baseline of 4,070 L. Unusually high continuous flow detected between 02:00 and 05:00 AM.
              <br />
              <strong>Probable Root Cause:</strong> Ground riser leakage, slow flush valve failure in Level 1 washroom, or unattended outdoor tap.
            </p>
          </div>
        </div>
        <div className="text-left md:text-right flex-shrink-0">
          <span className="text-xs font-mono text-lime font-bold block">Status: Staff Investigating</span>
          <span className="text-[10px] font-mono text-mutedGrey">Assigned to Ramesh K.</span>
        </div>
      </div>

      {/* Charts Navigation */}
      <div className="flex border-b border-graphite-border">
        <button
          onClick={() => setActiveTab('electricity')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'electricity'
              ? 'border-lime text-lime font-bold'
              : 'border-transparent text-mutedGrey hover:text-ivory'
          }`}
        >
          <Zap className="w-4 h-4" /> Electricity (kWh)
        </button>
        <button
          onClick={() => setActiveTab('water')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'water'
              ? 'border-lime text-lime font-bold'
              : 'border-transparent text-mutedGrey hover:text-ivory'
          }`}
        >
          <Droplets className="w-4 h-4" /> Water Distribution (Liters)
        </button>
        <button
          onClick={() => setActiveTab('wifi')}
          className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'wifi'
              ? 'border-lime text-lime font-bold'
              : 'border-transparent text-mutedGrey hover:text-ivory'
          }`}
        >
          <Wifi className="w-4 h-4" /> Wi-Fi Mesh Latency (ms)
        </button>
      </div>

      {/* Main Chart Section */}
      <div className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey">
            7-Day Historical Trends by Residential Block
          </h3>
          <span className="text-[10px] font-mono text-mutedGrey">Daily Aggregation</span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'electricity' ? (
              <BarChart data={weeklyUtilitySeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222825" />
                <XAxis dataKey="day" stroke="#929B94" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#929B94" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Bar dataKey="electricityA" name="Block A (Alpha)" fill="#C8FF62" radius={[4, 4, 0, 0]} />
                <Bar dataKey="electricityB" name="Block B (Beta)" fill="#8BAEFF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="electricityC" name="Block C (Gamma)" fill="#A4B99E" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : activeTab === 'water' ? (
              <LineChart data={weeklyUtilitySeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222825" />
                <XAxis dataKey="day" stroke="#929B94" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#929B94" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Line type="monotone" dataKey="waterA" name="Block A (Surge Area)" stroke="#FF756E" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="waterB" name="Block B" stroke="#8BAEFF" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="waterC" name="Block C" stroke="#C8FF62" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            ) : (
              <LineChart data={weeklyUtilitySeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222825" />
                <XAxis dataKey="day" stroke="#929B94" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#929B94" fontSize={11} fontFamily="JetBrains Mono" unit="ms" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Line type="monotone" dataKey="wifiPing" name="Average Gateway Ping (ms)" stroke="#C8FF62" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Smart Energy Saving Heuristics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-graphite border border-graphite-border space-y-1.5">
          <span className="text-[10px] font-mono text-lime uppercase font-bold">Heuristic 01</span>
          <h4 className="text-xs font-bold text-ivory">Peak Load Window (19:00 - 22:00)</h4>
          <p className="text-[11px] text-mutedGrey leading-relaxed">
            Electrical consumption surges 64% during evening hours as residents return. Study lounge HVAC operates on modulated eco-cycle.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-graphite border border-graphite-border space-y-1.5">
          <span className="text-[10px] font-mono text-coolBlue uppercase font-bold">Heuristic 02</span>
          <h4 className="text-xs font-bold text-ivory">Gravity Booster Pressure Drop</h4>
          <p className="text-[11px] text-mutedGrey leading-relaxed">
            Block B second-floor pressure drops below 2.2 bar during simultaneous morning showers (07:30 - 08:30). Auxiliary pump engages automatically.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-graphite border border-graphite-border space-y-1.5">
          <span className="text-[10px] font-mono text-sage uppercase font-bold">Heuristic 03</span>
          <h4 className="text-xs font-bold text-ivory">Mesh Roaming Efficiency</h4>
          <p className="text-[11px] text-mutedGrey leading-relaxed">
            Access point AP-A-201 carries 42 active dual-band clients. Load balancing steers 5GHz capable laptops to corridor AP-A-203.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UtilitiesPage;

