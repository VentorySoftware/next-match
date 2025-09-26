-- Confirmar el email del usuario admin
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmation_token = null,
    email_change_confirm_status = 0
WHERE email = 'admin@padeltorneos.com';