export type UserRole = 'resident' | 'staff' | 'warden' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  hostel_id: string;
  hostel_name: string;
  block_name: string;
  floor_number: number;
  room_number: string;
  preferences?: {
    notifications_email: boolean;
    notifications_inapp: boolean;
    quiet_hours: boolean;
    theme: 'dark' | 'light' | 'system';
  };
  created_at: string;
}

export interface Hostel {
  id: string;
  name: string;
  campus: string;
  address: string;
  total_capacity: number;
  occupied_count: number;
  created_at: string;
}

export interface Block {
  id: string;
  hostel_id: string;
  name: string;
  description: string;
  floors_count: number;
  rooms_count: number;
  health_score: number;
}

export interface Floor {
  id: string;
  block_id: string;
  floor_number: number;
  label: string;
}

export type RoomStatus = 'normal' | 'issue_reported' | 'maintenance' | 'unavailable';

export interface Room {
  id: string;
  floor_id: string;
  block_id: string;
  block_name: string;
  floor_number: number;
  room_number: string;
  room_type: 'single' | 'double' | 'triple';
  capacity: number;
  occupied: number;
  status: RoomStatus;
  active_issues_count: number;
  residents_count: number;
  amenities: string[];
}

export type MaintenanceCategory =
  | 'plumbing'
  | 'electrical'
  | 'wifi'
  | 'furniture'
  | 'appliances'
  | 'cleaning'
  | 'washroom'
  | 'structural'
  | 'other';

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

export type MaintenanceStatus =
  | 'submitted'
  | 'acknowledged'
  | 'assigned'
  | 'in_progress'
  | 'waiting_for_parts'
  | 'resolved'
  | 'reopened'
  | 'rejected';

export interface MaintenanceRequest {
  id: string;
  resident_id: string;
  resident_name: string;
  room_id?: string;
  room_number: string;
  block_name: string;
  floor_number: number;
  facility_id?: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assigned_staff_id?: string;
  assigned_staff_name?: string;
  preferred_time?: string;
  image_url?: string;
  materials_used?: string[];
  resolution_notes?: string;
  resolution_evidence_url?: string;
  resolution_rating?: number;
  resolution_feedback?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface MaintenanceUpdate {
  id: string;
  request_id: string;
  updated_by: string;
  author_name: string;
  author_role: UserRole;
  previous_status?: MaintenanceStatus;
  new_status: MaintenanceStatus;
  notes?: string;
  created_at: string;
}

export type FacilityCategory =
  | 'laundry'
  | 'gym'
  | 'study'
  | 'common'
  | 'dining'
  | 'water'
  | 'washroom'
  | 'medical'
  | 'recreation';

export type FacilityStatus = 'operational' | 'degraded' | 'maintenance' | 'closed';

export interface FacilityEquipment {
  id: string;
  name: string;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_order';
  type: string;
  last_serviced?: string;
}

export interface Facility {
  id: string;
  hostel_id: string;
  name: string;
  category: FacilityCategory;
  block_name: string;
  floor_label: string;
  operating_hours: string;
  status: FacilityStatus;
  capacity: number;
  active_occupancy: number;
  accessibility_details: string;
  amenities: string[];
  image_url?: string;
  equipment?: FacilityEquipment[];
  updated_at: string;
}

export interface FacilityBooking {
  id: string;
  facility_id: string;
  facility_name: string;
  facility_category: FacilityCategory;
  resident_id: string;
  resident_name: string;
  room_number: string;
  date: string; // YYYY-MM-DD
  slot: string; // "14:00 - 15:00"
  start_time: string;
  end_time: string;
  resource_label?: string; // e.g. "Washer 02 (Block A)"
  status: 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

export type UtilityType = 'electricity' | 'water' | 'wifi' | 'elevators';

export interface UtilityReading {
  id: string;
  hostel_id: string;
  block_id: string;
  block_name: string;
  utility_type: UtilityType;
  reading_value: number;
  unit: string;
  source_type: 'meter_simulated' | 'staff_entry' | 'resident_report';
  recorded_at: string;
}

export interface Announcement {
  id: string;
  hostel_id: string;
  title: string;
  content: string;
  category: 'general' | 'maintenance' | 'water' | 'electricity' | 'wifi' | 'events' | 'safety' | 'critical';
  is_critical: boolean;
  created_by: string;
  author_name: string;
  author_role: string;
  published_at: string;
  expires_at?: string;
  read_by: string[];
}

export interface CommunityPost {
  id: string;
  resident_id: string;
  author_name: string;
  author_room: string;
  title: string;
  content: string;
  category: 'general' | 'facilities' | 'suggestions' | 'maintenance' | 'events';
  likes: string[];
  comments_count: number;
  created_at: string;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  resident_id: string;
  author_name: string;
  author_role: UserRole;
  content: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  category: 'maintenance' | 'utility' | 'announcement' | 'facility' | 'system';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface SmartInsight {
  id: string;
  title: string;
  category: 'infrastructure' | 'maintenance' | 'utility' | 'facility' | 'preventive';
  severity: 'info' | 'warning' | 'critical';
  supporting_data: string;
  explanation: string;
  suggested_action: string;
  timestamp: string;
}

export interface HostelHealthBreakdown {
  overall_score: number;
  utility_score: number;
  maintenance_score: number;
  facility_score: number;
  calculated_at: string;
  contributing_factors: Array<{
    name: string;
    score: number;
    weight: number;
    status: 'optimal' | 'moderate' | 'degraded';
    note: string;
  }>;
}

