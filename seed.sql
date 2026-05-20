    -- Advanced Supabase Seed Script
    -- Initializes a Root Superadmin account bypassing normal signup flows safely
    -- Hardcoded Password: Password123@

    DO $$
    DECLARE
        -- Fixed UUID for Idempotency
        superadmin_id UUID := '550e8400-e29b-41d4-a716-446655440000';
        -- Static password string
        static_password text := 'Password123@';
        -- Standard Bcrypt hash compatible with GoTrue
        hashed_password text;
    BEGIN
        -- Ensure pgcrypto extension is active
        CREATE EXTENSION IF NOT EXISTS pgcrypto;
        
        -- Generate GoTrue-compatible blowfish/bcrypt hash
        hashed_password := crypt(static_password, gen_salt('bf', 10));

        -- Idempotency Check: Only run if the user doesn't already exist
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = superadmin_id) THEN
            
            -- 1. Auth User Injection
            INSERT INTO auth.users (
                id,
                instance_id,
                aud,
                role,
                email,
                encrypted_password,
                email_confirmed_at,
                recovery_sent_at,
                last_sign_in_at,
                raw_app_meta_data,
                raw_user_meta_data,
                created_at,
                updated_at,
                confirmation_token,
                email_change,
                email_change_token_new,
                recovery_token,
                is_super_admin,
                phone,
                phone_confirmed_at,
                phone_change,
                phone_change_token,
                email_change_token_current,
                is_sso_user,
                deleted_at
            ) VALUES (
                superadmin_id,
                '00000000-0000-0000-0000-000000000000', -- Default local/cloud instance ID
                'authenticated',
                'authenticated',
                'superadmin@gym.com',
                hashed_password,
                now(), -- Confirmed immediately
                null, null,
                '{"provider":"email","providers":["email"],"assigned_role":"superadmin"}'::jsonb,
                '{"full_name":"Root Superadmin"}'::jsonb,
                now(), now(),
                '', '', '', '', false, null, null, '', '', '', false, null
            );

            -- 2. Auth Identity Injection (CRITICAL FOR LOGINS)
            INSERT INTO auth.identities (
                id,
                provider_id,
                user_id,
                identity_data,
                provider,
                last_sign_in_at,
                created_at,
                updated_at
            ) VALUES (
                gen_random_uuid(),
                superadmin_id::text, -- For email provider, provider_id is typically the user_id
                superadmin_id,
                json_build_object('sub', superadmin_id, 'email', 'superadmin@gym.com')::jsonb,
                'email',
                now(), now(), now()
            );
            
            -- Trigger automatically assigns the superadmin role via handle_new_user()

            
            RAISE NOTICE 'Root Superadmin initialized successfully.';
            RAISE NOTICE '-----------------------------------------';
            RAISE NOTICE 'EMAIL: superadmin@gym.com';
            RAISE NOTICE 'PASSWORD: Password123@';
            RAISE NOTICE '-----------------------------------------';
        ELSE
            RAISE NOTICE 'Root Superadmin already exists. Skipping initialization.';
        END IF;
    END
    $$;