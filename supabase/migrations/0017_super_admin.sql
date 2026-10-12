-- Assign super admin / tenant admin role to createwithvikash@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    CASE
      WHEN lower(NEW.email) = 'createwithvikash@gmail.com' THEN 'admin'::user_role
      ELSE 'demo_user'::user_role
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET role = CASE
    WHEN lower(NEW.email) = 'createwithvikash@gmail.com' THEN 'admin'::user_role
    ELSE profiles.role
  END;
  RETURN NEW;
END;
$$;

-- Update existing profile if present
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE lower(email) = 'createwithvikash@gmail.com'
);
