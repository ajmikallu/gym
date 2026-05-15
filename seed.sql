-- Advanced Supabase Seed Script
-- Initializes a Root Superadmin account bypassing normal signup flows

DO $$
DECLARE
    -- Fixed UUID for Idempotency
    superadmin_id UUID := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
    -- Ensure pgcrypto extension is active for secure password hashing
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    -- Idempotency Check: Only run if the user doesn't already exist
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = superadmin_id) THEN
        
        -- 1. Auth Injection
        INSERT INTO auth.users (
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at
        ) VALUES (
            superadmin_id,
            'authenticated',
            'authenticated',
            'superadmin@gym.com',
            -- Password Hashing via pgcrypto compatible with Supabase Auth
            crypt('SuperPassword123!', gen_salt('bf')),
            now(),
            -- Metadata Config
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Root Superadmin"}'::jsonb,
            now(),
            now()
        );
        
        -- 2. Trigger Override (Promotion)
        -- At this exact moment, your `on_auth_user_created` trigger has already fired 
        -- and created a row in `public.profiles` with the default role 'USER'.
        -- We now execute a targeted UPDATE to forcefully promote this specific UUID.
        
        UPDATE public.profiles 
        SET role = 'SUPERADMIN' 
        WHERE id = superadmin_id;
        
        RAISE NOTICE 'Root Superadmin initialized successfully.';
    ELSE
        RAISE NOTICE 'Root Superadmin already exists. Skipping initialization.';
    END IF;
END
$$;
