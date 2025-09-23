-- Drop all existing triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_default ON auth.users;

-- Create a single comprehensive function to handle all new users
CREATE OR REPLACE FUNCTION public.handle_new_user_with_admin_check()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert profile for all users
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@padeltorneos.com' THEN 'Super Administrador'
      ELSE COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    END
  );
  
  -- Assign role based on email
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id, 
    CASE 
      WHEN NEW.email = 'admin@padeltorneos.com' THEN 'admin'
      ELSE 'participant'
    END
  );
  
  RETURN NEW;
END;
$$;

-- Create the single trigger for all users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_with_admin_check();