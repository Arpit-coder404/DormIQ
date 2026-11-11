import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  X,
  Plus,
  ShieldAlert,
  Info,
  Droplets,
  Zap,
  Wifi,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useHostelStore } from '../../store/hostelStore';
import { useAuthStore } from '../../store/authStore';
import { Room, RoomStatus } from '../../types';
import { ReportMaintenanceModal } from '../../components/maintenance/ReportMaintenanceModal';

export const FloorPlan: React.FC = () => {
  const { rooms, requests, blocks } = useHostelStore();
  const { currentUser } = useAuthStore();

  const [selectedBlockId, setSelectedBlockId] = useState('block-a');
  const [selectedFloorNumber, setSelectedFloorNumber] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'issues' | 'plumbing' | 'electrical' | 'wifi'>('all');

  // Filter rooms for active block and floor
  const activeRooms = rooms.filter(
    (r) => r.block_id === selectedBlockId && r.floor_number === selectedFloorNumber
  );

  // If no rooms exist for that floor in demo array, generate standard 8 rooms for that floor
  const displayRooms: Room[] = activeRooms.length > 0 ? activeRooms : Array.from({ length: 8 }, (_, i) => {
    const num = `${selectedBlockId === 'block-a' ? 'A' : selectedBlockId === 'block-b' ? 'B' : 'C'}-${selectedFloorNumber}0${i + 1}`;
    return {
      id: `generated-${num}`,
      floor_id: `floor-${selectedFloorNumber}`,
      block_id: selectedBlockId,
      block_name: selectedBlockId === 'block-a' ? 'Block A' : selectedBlockId === 'block-b' ? 'Block B' : 'Block C',
      floor_number: selectedFloorNumber,
      room_number: num,
      room_type: 'double',
      capacity: 2,
      occupied: 2,
      status: 'normal',
      active_issues_count: 0,
      residents_count: 2,
      amenities: ['En-suite washroom', 'High-Speed Wi-Fi', 'Study Desks'],
    };
  });

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case 'issue_reported':
        return { fill: '#2A2010', stroke: '#F2B84B', text: '#F2B84B', label: 'Issue Reported' };
      case 'maintenance':
        return { fill: '#2A1412', stroke: '#FF756E', text: '#FF756E', label: 'Under Repair' };
      case 'unavailable':
        return { fill: '#171B19', stroke: '#929B94', text: '#929B94', label: 'Unavailable' };
      case 'normal':
      default:
        return { fill: '#0E241D', stroke: '#C8FF62', text: '#C8FF62', label: 'Optimal' };
    }
  };

  const selectedRoomRequests = selectedRoom
    ? requests.filter((r) => r.room_number.toLowerCase() === selectedRoom.room_number.toLowerCase())
    : [];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-obsidian text-ivory overflow-hidden relative">
      {/* Top Floor Plan Control Toolbar */}
      <div className="bg-graphite border-b border-graphite-border px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-lime" />
            <h1 className="font-display font-bold text-base sm:text-lg text-ivory">
              Spatial Floor Plan
            </h1>
          </div>
          <span className="text-[10px] font-mono text-mutedGrey hidden sm:inline">
            Interactive Digital Blueprint
          </span>
        </div>

        {/* Wing Switcher */}
        <div className="flex items-center gap-1 bg-obsidian-light p-1 rounded-xl border border-graphite-border">
          {blocks.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBlockId(b.id);
                setSelectedRoom(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedBlockId === b.id
                  ? 'bg-lime text-obsidian font-bold shadow-sm'
                  : 'text-mutedGrey hover:text-ivory'
              }`}
            >
              {b.name.split(' ')[0]} {b.name.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Floor Level Switcher */}
        <div className="flex items-center gap-1 bg-obsidian-light p-1 rounded-xl border border-graphite-border">
          {[0, 1, 2, 3].map((floor) => (
            <button
              key={floor}
              onClick={() => {
                setSelectedFloorNumber(floor);
                setSelectedRoom(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedFloorNumber === floor
                  ? 'bg-forest border border-lime text-lime font-bold'
                  : 'text-mutedGrey hover:text-ivory'
              }`}
            >
              {floor === 0 ? 'Ground' : `Lvl ${floor}`}
            </button>
          ))}
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
            className="p-2 rounded-lg bg-obsidian-light border border-graphite-border text-mutedGrey hover:text-ivory"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
            className="p-2 rounded-lg bg-obsidian-light border border-graphite-border text-mutedGrey hover:text-ivory"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-2 rounded-lg bg-obsidian-light border border-graphite-border text-mutedGrey hover:text-ivory"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Blueprint Canvas Viewport */}
      <div className="flex-1 relative overflow-auto bg-obsidian bg-control-grid flex items-center justify-center p-6">
        {/* Subtle Blueprint Watermark */}
        <div className="absolute top-4 left-6 pointer-events-none font-mono text-[11px] text-mutedGrey/40 space-y-1">
          <p>NEXUS RESIDENCES • ARCHITECTURAL CAD MODEL</p>
          <p>BLOCK {selectedBlockId.replace('block-', '').toUpperCase()} • LEVEL {selectedFloorNumber} • SCALE 1:100</p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-6 z-10 bg-graphite/90 backdrop-blur-md border border-graphite-border rounded-xl p-3 text-xs space-y-1.5 font-mono shadow-xl hidden md:block">
          <span className="text-[10px] text-mutedGrey uppercase font-bold tracking-wider">Status Index</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-forest border border-lime"></span>
            <span>Normal / Optimal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-warningAmber/30 border border-warningAmber"></span>
            <span>Issue Reported</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-alertCoral/30 border border-alertCoral"></span>
            <span>Maintenance Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-graphite border border-mutedGrey"></span>
            <span>Unavailable / Work</span>
          </div>
        </div>

        {/* SVG Interactive Architecture Map */}
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          className="transition-transform duration-200 select-none cursor-grab active:cursor-grabbing"
        >
          <svg
            width="880"
            height="520"
            viewBox="0 0 880 520"
            className="drop-shadow-2xl rounded-2xl border border-graphite-border/60 bg-graphite/80"
          >
            {/* Outer Building Structural Perimeter */}
            <rect
              x="20"
              y="20"
              width="840"
              height="480"
              rx="12"
              fill="#121614"
              stroke="#2A322E"
              strokeWidth="2"
            />

            {/* Central Main Corridor */}
            <rect
              x="60"
              y="210"
              width="760"
              height="100"
              fill="#0A0C0B"
              stroke="#1C2420"
              strokeDasharray="4 4"
            />
            <text x="440" y="265" fill="#4B5650" fontSize="12" fontFamily="JetBrains Mono" textAnchor="middle" letterSpacing="4">
              CENTRAL ACCESS CORRIDOR • LEVEL {selectedFloorNumber}
            </text>

            {/* Left Utility Core: Elevators & Stairwell 1 */}
            <g transform="translate(60, 215)">
              <rect width="70" height="90" fill="#171B19" stroke="#3A4640" strokeWidth="1.5" rx="4" />
              <text x="35" y="42" fill="#C8FF62" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">ELEVATOR</text>
              <text x="35" y="58" fill="#929B94" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">SHAFT 01</text>
            </g>

            {/* Right Utility Core: Fire Exit & Stairwell 2 */}
            <g transform="translate(750, 215)">
              <rect width="70" height="90" fill="#171B19" stroke="#3A4640" strokeWidth="1.5" rx="4" />
              <text x="35" y="42" fill="#8BAEFF" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">STAIRS</text>
              <text x="35" y="58" fill="#929B94" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">EMERGENCY</text>
            </g>

            {/* Central Water Dispenser Hub */}
            <g transform="translate(415, 225)">
              <circle cx="25" cy="25" r="18" fill="#183D31" stroke="#C8FF62" strokeWidth="1.5" />
              <text x="25" y="29" fill="#C8FF62" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">UV</text>
            </g>

            {/* TOP ROW OF ROOMS (Rooms 1, 2, 3, 4) */}
            {displayRooms.slice(0, 4).map((room, idx) => {
              const xPos = 160 + idx * 145;
              const yPos = 40;
              const styles = getStatusColor(room.status);
              const isSelected = selectedRoom?.room_number === room.room_number;
              const isMyRoom = currentUser?.room_number === room.room_number;

              return (
                <g
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className="cursor-pointer transition-all hover:opacity-90"
                >
                  <rect
                    x={xPos}
                    y={yPos}
                    width="135"
                    height="150"
                    rx="8"
                    fill={styles.fill}
                    stroke={isSelected ? '#FFFFFF' : styles.stroke}
                    strokeWidth={isSelected ? 3 : isMyRoom ? 2.5 : 1.5}
                    className="transition-all"
                  />

                  {/* Room Number */}
                  <text
                    x={xPos + 67}
                    y={yPos + 35}
                    fill="#F4F2E9"
                    fontSize="16"
                    fontFamily="Space Grotesk"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {room.room_number}
                  </text>

                  {/* Room Type */}
                  <text
                    x={xPos + 67}
                    y={yPos + 58}
                    fill="#929B94"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                  >
                    {room.room_type.toUpperCase()} SUITE
                  </text>

                  {/* Status Indicator Pill */}
                  <rect
                    x={xPos + 18}
                    y={yPos + 80}
                    width="100"
                    height="22"
                    rx="4"
                    fill="#0C0E0D"
                    stroke={styles.stroke}
                    strokeWidth="1"
                  />
                  <text
                    x={xPos + 67}
                    y={yPos + 95}
                    fill={styles.text}
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {styles.label.toUpperCase()}
                  </text>

                  {/* My room tag */}
                  {isMyRoom && (
                    <text
                      x={xPos + 67}
                      y={yPos + 128}
                      fill="#C8FF62"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ★ YOUR ROOM
                    </text>
                  )}
                </g>
              );
            })}

            {/* BOTTOM ROW OF ROOMS (Rooms 5, 6, 7, 8) */}
            {displayRooms.slice(4, 8).map((room, idx) => {
              const xPos = 160 + idx * 145;
              const yPos = 330;
              const styles = getStatusColor(room.status);
              const isSelected = selectedRoom?.room_number === room.room_number;
              const isMyRoom = currentUser?.room_number === room.room_number;

              return (
                <g
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className="cursor-pointer transition-all hover:opacity-90"
                >
                  <rect
                    x={xPos}
                    y={yPos}
                    width="135"
                    height="150"
                    rx="8"
                    fill={styles.fill}
                    stroke={isSelected ? '#FFFFFF' : styles.stroke}
                    strokeWidth={isSelected ? 3 : isMyRoom ? 2.5 : 1.5}
                    className="transition-all"
                  />

                  {/* Room Number */}
                  <text
                    x={xPos + 67}
                    y={yPos + 35}
                    fill="#F4F2E9"
                    fontSize="16"
                    fontFamily="Space Grotesk"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {room.room_number}
                  </text>

                  {/* Room Type */}
                  <text
                    x={xPos + 67}
                    y={yPos + 58}
                    fill="#929B94"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                  >
                    {room.room_type.toUpperCase()} SUITE
                  </text>

                  {/* Status Indicator Pill */}
                  <rect
                    x={xPos + 18}
                    y={yPos + 80}
                    width="100"
                    height="22"
                    rx="4"
                    fill="#0C0E0D"
                    stroke={styles.stroke}
                    strokeWidth="1"
                  />
                  <text
                    x={xPos + 67}
                    y={yPos + 95}
                    fill={styles.text}
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {styles.label.toUpperCase()}
                  </text>

                  {isMyRoom && (
                    <text
                      x={xPos + 67}
                      y={yPos + 128}
                      fill="#C8FF62"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ★ YOUR ROOM
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* RIGHT SIDE DETAILS DRAWER */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-graphite border-l border-graphite-border shadow-2xl z-30 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="bg-obsidian-light border-b border-graphite-border p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-display font-bold text-ivory">
                    Room {selectedRoom.room_number}
                  </h2>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-forest/50 text-lime border border-forest">
                    {selectedRoom.block_name}
                  </span>
                </div>
                <p className="text-xs text-mutedGrey mt-0.5">
                  Level {selectedRoom.floor_number} • {selectedRoom.room_type.toUpperCase()} Occupancy
                </p>
              </div>

              <button
                onClick={() => setSelectedRoom(null)}
                className="p-2 rounded-lg bg-graphite border border-graphite-border text-mutedGrey hover:text-ivory"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {/* Status Badge */}
              <div className="p-4 rounded-xl bg-obsidian-light border border-graphite-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-mutedGrey uppercase">Operational Status</span>
                  <p className="text-sm font-bold capitalize text-ivory">
                    {selectedRoom.status.replace('_', ' ')}
                  </p>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full uppercase border ${
                    selectedRoom.status === 'normal'
                      ? 'bg-lime/10 text-lime border-lime/30'
                      : selectedRoom.status === 'issue_reported'
                      ? 'bg-warningAmber/10 text-warningAmber border-warningAmber/30'
                      : 'bg-alertCoral/10 text-alertCoral border-alertCoral/30'
                  }`}
                >
                  {selectedRoom.status}
                </span>
              </div>

              {/* Maintenance Issues */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-lime" />
                    Maintenance Tickets ({selectedRoomRequests.length})
                  </h3>
                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="text-xs text-lime font-mono hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Report Issue
                  </button>
                </div>

                {selectedRoomRequests.length === 0 ? (
                  <div className="p-4 rounded-xl bg-obsidian-light border border-graphite-border text-xs text-mutedGrey text-center">
                    No active maintenance tickets recorded for this unit.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedRoomRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-3.5 rounded-xl bg-obsidian-light border border-graphite-border space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-ivory leading-tight">{req.title}</p>
                          <span className="text-[10px] font-mono text-warningAmber uppercase font-bold whitespace-nowrap">
                            {req.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-mutedGrey line-clamp-2 leading-relaxed">
                          {req.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-mutedGrey pt-1 border-t border-graphite-border/60">
                          <span>Technician: {req.assigned_staff_name || 'Triage in queue'}</span>
                          <span className="text-lime">{req.priority.toUpperCase()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Room Amenities */}
              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-mutedGrey mb-2.5">
                  Room Infrastructure & Amenities
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(selectedRoom.amenities || ['Dual Desks', 'En-suite Washroom', 'High-Speed Wi-Fi', 'Air Cooling']).map((a) => (
                    <div
                      key={a}
                      className="p-2.5 rounded-lg bg-obsidian-light border border-graphite-border text-xs flex items-center gap-2 text-ivory"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-lime flex-shrink-0" />
                      <span className="truncate">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3 rounded-lg bg-forest/20 border border-forest text-[11px] text-sage flex items-start gap-2">
                <Info className="w-4 h-4 text-lime flex-shrink-0 mt-0.5" />
                <p>
                  Resident privacy is protected by campus policy. Personal occupant names and private details are withheld from the public spatial blueprint.
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-5 border-t border-graphite-border bg-obsidian-light">
              <button
                onClick={() => setReportModalOpen(true)}
                className="w-full py-3 bg-lime hover:bg-lime-glow text-obsidian font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-lime/20 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Ticket for Room {selectedRoom.room_number}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for reporting from floor plan */}
      <ReportMaintenanceModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        initialBlockName={selectedBlockId === 'block-a' ? 'Block A' : selectedBlockId === 'block-b' ? 'Block B' : 'Block C'}
        initialRoomNumber={selectedRoom?.room_number}
      />
    </div>
  );
};

export default FloorPlan;

