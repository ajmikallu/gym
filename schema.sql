-- Create the Profiles table
CREATE TABLE profiles (
  -- Link to Supabase Auth ID
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- User details
  full_name TEXT,
  age INTEGER,
  height DECIMAL(5,2), -- e.g., 180.50
  weight DECIMAL(5,2), -- e.g., 85.00
  
  -- Allergies as an array of text
  allergies TEXT[] DEFAULT '{}',
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- ==========================================
-- ADVANCED GYM MANAGEMENT SCHEMA
-- Translated from ER Diagram
-- ==========================================

-- COUNTRIES
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    default_tax_rate DECIMAL(5,2) NOT NULL
);

-- BRANCHES
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    address VARCHAR(255) NOT NULL,
    timezone VARCHAR(50) NOT NULL
);

-- ACTIVITIES
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    requires_slot BOOLEAN NOT NULL DEFAULT false,
    allows_pt BOOLEAN NOT NULL DEFAULT false,
    description TEXT
);

-- ACTIVITY_PRICING
CREATE TABLE activity_pricing (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    duration_days INTEGER NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    pt_addon_price DECIMAL(10,2) NOT NULL
);

-- OFFERS
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_clubbed_items INTEGER NOT NULL DEFAULT 1,
    valid_days_of_week VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    max_uses INTEGER NOT NULL
);

-- TRAINERS
CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    specialization VARCHAR(150) NOT NULL
);

-- TRAINER_ACTIVITIES
CREATE TABLE trainer_activities (
    trainer_id INTEGER NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    PRIMARY KEY (trainer_id, activity_id)
);

-- SLOTS
CREATE TABLE slots (
    id SERIAL PRIMARY KEY,
    trainer_id INTEGER REFERENCES trainers(id) ON DELETE SET NULL,
    activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    max_capacity INTEGER NOT NULL,
    current_bookings INTEGER NOT NULL DEFAULT 0
);

-- MEMBERSHIPS
-- Note: 'user_id' references the existing 'profiles' table which is tied to Supabase Auth UUIDs.
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE memberships (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    duration_days INTEGER NOT NULL,
    has_pt BOOLEAN NOT NULL DEFAULT false,
    trainer_id INTEGER REFERENCES trainers(id) ON DELETE SET NULL,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    price DECIMAL(10,2) NOT NULL,
    CONSTRAINT prevent_overlapping_memberships EXCLUDE USING gist (
      user_id WITH =,
      activity_id WITH =,
      daterange(start_date, expiry_date, '[]') WITH &&
    )
);


-- BOOKINGS
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    slot_id INTEGER NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
    membership_id INTEGER NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
    booking_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED'
);

-- ==========================================
-- ADVANCED RBAC SCHEMA (Custom Claims)
-- ==========================================

-- 1. Custom Types
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'trainer', 'customer');
CREATE TYPE public.app_permission AS ENUM (
    'system.manage',
    'countries.create', 'countries.read', 'countries.update', 'countries.delete',
    'branches.create', 'branches.read', 'branches.update', 'branches.delete',
    'activities.create', 'activities.read', 'activities.update', 'activities.delete',
    'offers.create', 'offers.read', 'offers.update', 'offers.delete',
    'trainers.create', 'trainers.read', 'trainers.update', 'trainers.delete',
    'slots.create', 'slots.read', 'slots.update', 'slots.delete',
    'memberships.create', 'memberships.read', 'memberships.update', 'memberships.delete',
    'bookings.create', 'bookings.read', 'bookings.update', 'bookings.delete'
);

-- 2. User Roles (REMOVED)
-- In the Metadata-Only architecture, roles are stored securely in auth.users app_metadata.

-- 3. Role Permissions Table
CREATE TABLE public.role_permissions (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    role public.app_role NOT NULL,
    permission public.app_permission NOT NULL,
    UNIQUE (role, permission)
);
COMMENT ON TABLE public.role_permissions IS 'Application permissions for each role.';

-- 4. Initial Permissions Setup (Example Mapping)
INSERT INTO public.role_permissions (role, permission) VALUES
    ('superadmin', 'system.manage'),
    ('superadmin', 'branches.create'), ('superadmin', 'branches.read'), ('superadmin', 'branches.update'), ('superadmin', 'branches.delete'),
    ('superadmin', 'activities.create'), ('superadmin', 'activities.read'), ('superadmin', 'activities.update'), ('superadmin', 'activities.delete'),
    ('superadmin', 'offers.create'), ('superadmin', 'offers.read'), ('superadmin', 'offers.update'), ('superadmin', 'offers.delete'),
    ('superadmin', 'trainers.create'), ('superadmin', 'trainers.read'), ('superadmin', 'trainers.update'), ('superadmin', 'trainers.delete'),
    ('superadmin', 'slots.create'), ('superadmin', 'slots.read'), ('superadmin', 'slots.update'), ('superadmin', 'slots.delete'),
    ('superadmin', 'memberships.create'), ('superadmin', 'memberships.read'), ('superadmin', 'memberships.update'), ('superadmin', 'memberships.delete'),
    ('superadmin', 'bookings.create'), ('superadmin', 'bookings.read'), ('superadmin', 'bookings.update'), ('superadmin', 'bookings.delete'),
    ('admin', 'branches.read'),
    ('admin', 'trainers.create'), ('admin', 'trainers.read'), ('admin', 'trainers.update'), ('admin', 'trainers.delete'),
    ('admin', 'slots.create'), ('admin', 'slots.read'), ('admin', 'slots.update'), ('admin', 'slots.delete'),
    ('admin', 'memberships.create'), ('admin', 'memberships.read'), ('admin', 'memberships.update'), ('admin', 'memberships.delete'),
    ('admin', 'bookings.create'), ('admin', 'bookings.read'), ('admin', 'bookings.update'), ('admin', 'bookings.delete'),
    ('admin', 'activities.read'), ('admin', 'offers.read'),
    ('trainer', 'slots.read'), ('trainer', 'slots.update'),
    ('trainer', 'bookings.read'), ('trainer', 'bookings.update'),
    ('trainer', 'memberships.read'), ('trainer', 'activities.read'), ('trainer', 'branches.read'),
    ('customer', 'bookings.create'), ('customer', 'bookings.read'), ('customer', 'bookings.delete'),
    ('customer', 'memberships.read'), ('customer', 'slots.read'), ('customer', 'activities.read'), ('customer', 'offers.read'), ('customer', 'branches.read');

-- 5. Auth Hook for Custom Claims (REMOVED)
-- Not needed because RLS now natively reads app_metadata directly from the JWT.

-- 5.5 Role Hierarchy & Secure User Creation
CREATE TABLE public.role_hierarchy (
    id SERIAL PRIMARY KEY,
    creator_role public.app_role NOT NULL,
    creatable_role public.app_role NOT NULL,
    UNIQUE (creator_role, creatable_role)
);

INSERT INTO public.role_hierarchy (creator_role, creatable_role) VALUES
    ('superadmin', 'superadmin'), ('superadmin', 'admin'), ('superadmin', 'trainer'), ('superadmin', 'customer'),
    ('admin', 'admin'), ('admin', 'trainer'), ('admin', 'customer'),
    ('trainer', 'customer');

CREATE OR REPLACE FUNCTION public.can_create_role(caller public.app_role, target public.app_role)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.role_hierarchy WHERE creator_role = caller AND creatable_role = target);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. Populate the Profile Table securely from public user_metadata
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'New User'))
  ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;
  
  -- Note: We no longer manually manage roles here. They are natively managed in app_metadata.

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE OF raw_app_meta_data, raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Authorize Function for RLS
CREATE OR REPLACE FUNCTION public.authorize(
  requested_permission public.app_permission
)
RETURNS boolean AS $$
DECLARE
  user_role public.app_role;
BEGIN
  -- Fetch user role directly from secure app_metadata within the JWT
  SELECT NULLIF(auth.jwt() -> 'app_metadata' ->> 'assigned_role', 'null')::public.app_role INTO user_role;

  -- If no valid role is found, deny access
  IF user_role IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.role_permissions
    WHERE role_permissions.permission = requested_permission
      AND role_permissions.role = user_role
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '';

-- ==========================================
-- Example RLS Policies using RBAC
-- ==========================================
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authorized read access on branches" ON public.branches FOR SELECT TO authenticated USING ( authorize('branches.read') );
CREATE POLICY "Allow authorized insert access on branches" ON public.branches FOR INSERT TO authenticated WITH CHECK ( authorize('branches.create') );
CREATE POLICY "Allow authorized update access on branches" ON public.branches FOR UPDATE TO authenticated USING ( authorize('branches.update') );
CREATE POLICY "Allow authorized delete access on branches" ON public.branches FOR DELETE TO authenticated USING ( authorize('branches.delete') );

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- SELECT
CREATE POLICY "Users can read own bookings" ON public.bookings FOR SELECT TO authenticated USING ( auth.uid() = user_id );
CREATE POLICY "Trainers can read bookings for their slots" ON public.bookings FOR SELECT TO authenticated 
USING ( 
  authorize('bookings.read') AND EXISTS (
    SELECT 1 FROM slots 
    JOIN trainers ON trainers.id = slots.trainer_id
    WHERE slots.id = bookings.slot_id AND trainers.user_id = auth.uid()
  )
);

-- INSERT
CREATE POLICY "Allow authorized insert access on bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK ( authorize('bookings.create') AND (auth.uid() = user_id OR auth.jwt()->>'user_role' IN ('admin', 'superadmin')) );

-- UPDATE
CREATE POLICY "Allow authorized update access on bookings" ON public.bookings FOR UPDATE TO authenticated USING ( authorize('bookings.update') );

-- DELETE
CREATE POLICY "Allow authorized delete access on bookings" ON public.bookings FOR DELETE TO authenticated USING ( authorize('bookings.delete') AND (auth.uid() = user_id OR auth.jwt()->>'user_role' IN ('admin', 'superadmin')) );

-- ==========================================
-- AUDIT LOGGING
-- ==========================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger AS $$
DECLARE
  old_data jsonb := null;
  new_data jsonb := null;
  rec_id int := null;
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    old_data := to_jsonb(OLD);
    rec_id := OLD.id;
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    new_data := to_jsonb(NEW);
    rec_id := NEW.id;
  END IF;

  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data, new_data)
  VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, rec_id, old_data, new_data);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER audit_memberships_changes
  AFTER INSERT OR UPDATE OR DELETE ON memberships
  FOR EACH ROW EXECUTE PROCEDURE public.audit_trigger_function();

CREATE TRIGGER audit_bookings_changes
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE PROCEDURE public.audit_trigger_function();

CREATE TRIGGER audit_slots_changes
  AFTER INSERT OR UPDATE OR DELETE ON slots
  FOR EACH ROW EXECUTE PROCEDURE public.audit_trigger_function();

-- ==========================================
-- SLOTS CONCURRENCY TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION public.check_slot_capacity()
RETURNS trigger AS $$
DECLARE
  v_old_occupies boolean := false;
  v_new_occupies boolean := false;
BEGIN
  -- Determine if the old row occupied a slot
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    v_old_occupies := (OLD.status != 'CANCELLED');
  END IF;

  -- Determine if the new row occupies a slot
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    v_new_occupies := (NEW.status != 'CANCELLED');
  END IF;

  -- Decrement old slot if it was occupied and is being freed, migrated, or deleted
  IF v_old_occupies AND (TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND (NOT v_new_occupies OR OLD.slot_id != NEW.slot_id))) THEN
    UPDATE public.slots SET current_bookings = current_bookings - 1 WHERE id = OLD.slot_id AND current_bookings > 0;
  END IF;

  -- Increment new slot if it is occupying a slot and is newly inserted, recovered, or migrated
  IF v_new_occupies AND (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (NOT v_old_occupies OR OLD.slot_id != NEW.slot_id))) THEN
    UPDATE public.slots SET current_bookings = current_bookings + 1 WHERE id = NEW.slot_id AND current_bookings < max_capacity;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Slot % is already fully booked', NEW.slot_id;
    END IF;
  END IF;

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER enforce_slot_capacity
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE PROCEDURE public.check_slot_capacity();

CREATE TRIGGER decrement_slot_capacity
  AFTER DELETE ON bookings
  FOR EACH ROW EXECUTE PROCEDURE public.check_slot_capacity();
