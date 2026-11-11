-- ==============================================================================
-- DORMIQ - THE INTELLIGENCE LAYER FOR MODERN HOSTEL LIVING
-- SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text not null,
  avatar_url text,
  role text not null check (role in ('resident', 'staff', 'warden', 'admin')) default 'resident',
  phone text,
  hostel_id uuid,
  block_name text,
  room_number text,
  created_at timestamptz default now()
);

-- 2. HOSTELS
create table if not exists public.hostels (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  campus text not null,
  address text not null,
  total_capacity integer not null default 0,
  created_at timestamptz default now()
);

-- 3. BLOCKS
create table if not exists public.blocks (
  id uuid primary key default uuid_generate_v4(),
  hostel_id uuid references public.hostels(id) on delete cascade,
  name text not null,
  description text,
  floors_count integer not null default 4
);

-- 4. FLOORS
create table if not exists public.floors (
  id uuid primary key default uuid_generate_v4(),
  block_id uuid references public.blocks(id) on delete cascade,
  floor_number integer not null,
  label text not null
);

-- 5. ROOMS
create table if not exists public.rooms (
  id uuid primary key default uuid_generate_v4(),
  floor_id uuid references public.floors(id) on delete cascade,
  block_id uuid references public.blocks(id) on delete cascade,
  room_number text not null,
  room_type text not null check (room_type in ('single', 'double', 'triple')),
  capacity integer not null default 2,
  status text not null check (status in ('normal', 'issue_reported', 'maintenance', 'unavailable')) default 'normal'
);

-- 6. RESIDENTS
create table if not exists public.residents (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  emergency_contact text,
  joined_at timestamptz default now()
);

-- 7. FACILITIES
create table if not exists public.facilities (
  id uuid primary key default uuid_generate_v4(),
  hostel_id uuid references public.hostels(id) on delete cascade,
  name text not null,
  category text not null check (category in ('laundry', 'gym', 'study', 'common', 'dining', 'water', 'washroom', 'medical', 'recreation')),
  block_name text,
  floor_label text,
  operating_hours text not null,
  status text not null check (status in ('operational', 'degraded', 'maintenance', 'closed')) default 'operational',
  capacity integer default 20,
  active_occupancy integer default 0,
  accessibility_details text,
  amenities text[],
  image_url text,
  updated_at timestamptz default now()
);

-- 8. MAINTENANCE REQUESTS
create table if not exists public.maintenance_requests (
  id uuid primary key default uuid_generate_v4(),
  resident_id uuid references public.profiles(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  facility_id uuid references public.facilities(id) on delete set null,
  title text not null,
  description text not null,
  category text not null check (category in ('plumbing', 'electrical', 'wifi', 'furniture', 'appliances', 'cleaning', 'washroom', 'structural', 'other')),
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  status text not null check (status in ('submitted', 'acknowledged', 'assigned', 'in_progress', 'waiting_for_parts', 'resolved', 'reopened', 'rejected')) default 'submitted',
  assigned_staff_id uuid references public.profiles(id) on delete set null,
  preferred_time text,
  image_url text,
  resolution_notes text,
  resolution_rating integer check (resolution_rating between 1 and 5),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  resolved_at timestamptz
);

-- 9. MAINTENANCE ATTACHMENTS
create table if not exists public.maintenance_attachments (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid references public.maintenance_requests(id) on delete cascade,
  file_url text not null,
  uploaded_by uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

-- 10. MAINTENANCE UPDATES
create table if not exists public.maintenance_updates (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid references public.maintenance_requests(id) on delete cascade,
  updated_by uuid references public.profiles(id) on delete cascade,
  previous_status text,
  new_status text not null,
  notes text,
  created_at timestamptz default now()
);

-- 11. UTILITY READINGS
create table if not exists public.utility_readings (
  id uuid primary key default uuid_generate_v4(),
  hostel_id uuid references public.hostels(id) on delete cascade,
  block_id uuid references public.blocks(id) on delete cascade,
  utility_type text not null check (utility_type in ('electricity', 'water', 'wifi', 'elevators')),
  reading_value numeric not null,
  unit text not null,
  source_type text not null check (source_type in ('meter_simulated', 'staff_entry', 'resident_report')),
  recorded_at timestamptz default now()
);

-- 12. ANNOUNCEMENTS
create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),
  hostel_id uuid references public.hostels(id) on delete cascade,
  title text not null,
  content text not null,
  category text not null check (category in ('general', 'maintenance', 'water', 'electricity', 'wifi', 'events', 'safety', 'critical')),
  is_critical boolean default false,
  created_by uuid references public.profiles(id) on delete cascade,
  published_at timestamptz default now(),
  expires_at timestamptz
);

-- 13. FACILITY BOOKINGS
create table if not exists public.facility_bookings (
  id uuid primary key default uuid_generate_v4(),
  facility_id uuid references public.facilities(id) on delete cascade,
  resident_id uuid references public.profiles(id) on delete cascade,
  date date not null,
  slot text not null,
  start_time text not null,
  end_time text not null,
  machine_or_desk_number text,
  status text not null check (status in ('confirmed', 'cancelled', 'completed')) default 'confirmed',
  created_at timestamptz default now()
);

-- 14. COMMUNITY POSTS & COMMENTS
create table if not exists public.community_posts (
  id uuid primary key default uuid_generate_v4(),
  resident_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  category text not null check (category in ('general', 'facilities', 'suggestions', 'maintenance', 'events')),
  created_at timestamptz default now()
);

create table if not exists public.community_comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references public.community_posts(id) on delete cascade,
  resident_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- 15. NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  category text not null check (category in ('maintenance', 'utility', 'announcement', 'facility', 'system')),
  link text,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- 16. AUDIT LOGS
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.maintenance_requests enable row level security;
alter table public.facility_bookings enable row level security;
alter table public.notifications enable row level security;

-- Profiles: Users can view all hostel profiles, update own
create policy "Profiles viewable by authenticated users" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Maintenance: Residents view own or common, Staff/Warden/Admin view all
create policy "Residents view own requests" on public.maintenance_requests
  for select using (auth.uid() = resident_id or exists (
    select 1 from public.profiles where id = auth.uid() and role in ('staff', 'warden', 'admin')
  ));

create policy "Residents insert requests" on public.maintenance_requests
  for insert with check (auth.uid() = resident_id);

