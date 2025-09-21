-- Insert sample tournaments
INSERT INTO public.tournaments (name, image, location, start_date, end_date, participants, max_participants, prize, status, registration_fee) VALUES
('Copa Primavera 2024', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', 'Club Deportivo Central', '15 Mar', '17 Mar', 24, 32, '$50,000', 'active', '$1,200'),
('Torneo Empresarial', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop', 'Padel Arena Norte', '22 Mar', '24 Mar', 16, 24, '$25,000', 'pending', '$800'),
('Championship Masters', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop', 'Centro Deportivo Elite', '8 Mar', '10 Mar', 32, 32, '$100,000', 'finished', '$2,000'),
('Liga Juvenil 2024', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 'Club La Cancha', '1 Abr', '3 Abr', 12, 20, '$15,000', 'pending', '$500');