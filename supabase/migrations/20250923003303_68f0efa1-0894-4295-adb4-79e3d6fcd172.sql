-- Create a function to automatically assign admin role to the super admin email
CREATE OR REPLACE FUNCTION public.handle_super_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if this is the super admin email
  IF NEW.email = 'admin@padeltorneos.com' THEN
    -- Insert profile
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
      NEW.id, 
      NEW.email,
      'Super Administrador'
    );
    
    -- Assign admin role instead of participant
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
    
    RETURN NEW;
  END IF;
  
  -- For all other users, use the default behavior
  RETURN NEW;
END;
$$;

-- Update the existing trigger to use the new function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.email = 'admin@padeltorneos.com')
  EXECUTE FUNCTION public.handle_super_admin();

-- Keep the original trigger for other users
CREATE TRIGGER on_auth_user_created_default
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.email != 'admin@padeltorneos.com')
  EXECUTE FUNCTION public.handle_new_user();