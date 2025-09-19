-- Create functions to increment/decrement tournament participants
CREATE OR REPLACE FUNCTION public.increment_tournament_participants(tournament_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.tournaments 
  SET participants = participants + 1 
  WHERE id = tournament_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.decrement_tournament_participants(tournament_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.tournaments 
  SET participants = GREATEST(participants - 1, 0)
  WHERE id = tournament_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;