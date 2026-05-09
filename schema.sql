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

-- TRIGGER: Automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

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
    price DECIMAL(10,2) NOT NULL
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
