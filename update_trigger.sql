CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role public.app_role;
BEGIN
  -- 1. Populate the Profile Table securely from public user_metadata
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'New User'))
  ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    updated_at = timezone('utc'::text, now());
  
  -- 2. Extract role from app_metadata (100% immune to public sign-up injection)
  -- Fallback cleanly to 'customer' if no secure app_metadata is found
  v_role := COALESCE(
    (new.raw_app_meta_data->>'assigned_role')::public.app_role,
    'customer'::public.app_role
  );

  -- 3. Atomic entry insertion/update
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, v_role)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE OF raw_app_meta_data, raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
