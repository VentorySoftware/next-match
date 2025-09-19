import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useZapier } from './ZapierContext';
import { supabase } from '@/integrations/supabase/client';

export interface Tournament {
  id: string;
  name: string;
  image: string;
  location: string;
  address?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  participants: number;
  maxParticipants: number;
  prize: string;
  status: 'pending' | 'active' | 'finished';
  registrationFee: string;
  description?: string;
  staff?: string;
  dataSource?: string;
}

interface TournamentContextType {
  tournaments: Tournament[];
  loading: boolean;
  addTournament: (tournament: Omit<Tournament, 'id' | 'participants' | 'status'>) => Promise<void>;
  loadTournaments: () => Promise<void>;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const useTournaments = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournaments must be used within a TournamentProvider');
  }
  return context;
};

interface TournamentProviderProps {
  children: ReactNode;
}

export const TournamentProvider: React.FC<TournamentProviderProps> = ({ children }) => {
  const { sendToGoogleSheets } = useZapier();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar torneos desde Supabase
  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tournaments:', error);
        return;
      }

      // Transformar datos de Supabase al formato esperado
      const formattedTournaments: Tournament[] = data.map(tournament => ({
        id: tournament.id,
        name: tournament.name,
        image: tournament.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
        location: tournament.location,
        address: tournament.address,
        startDate: tournament.start_date,
        endDate: tournament.end_date,
        startTime: tournament.start_time,
        endTime: tournament.end_time,
        participants: tournament.participants,
        maxParticipants: tournament.max_participants,
        prize: tournament.prize,
        status: tournament.status as 'pending' | 'active' | 'finished',
        registrationFee: tournament.registration_fee,
        description: tournament.description,
        staff: tournament.staff,
        dataSource: tournament.data_source
      }));

      setTournaments(formattedTournaments);
    } catch (error) {
      console.error('Error loading tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTournament = async (newTournament: Omit<Tournament, 'id' | 'participants' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .insert({
          name: newTournament.name,
          image: newTournament.image,
          location: newTournament.location,
          address: newTournament.address,
          start_date: newTournament.startDate,
          end_date: newTournament.endDate,
          start_time: newTournament.startTime,
          end_time: newTournament.endTime,
          max_participants: newTournament.maxParticipants,
          prize: newTournament.prize,
          registration_fee: newTournament.registrationFee,
          description: newTournament.description,
          staff: newTournament.staff,
          data_source: newTournament.dataSource,
          participants: 0,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating tournament:', error);
        return;
      }

      // Transformar datos y actualizar estado local
      const tournament: Tournament = {
        id: data.id,
        name: data.name,
        image: data.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
        location: data.location,
        address: data.address,
        startDate: data.start_date,
        endDate: data.end_date,
        startTime: data.start_time,
        endTime: data.end_time,
        participants: data.participants,
        maxParticipants: data.max_participants,
        prize: data.prize,
        status: data.status as 'pending' | 'active' | 'finished',
        registrationFee: data.registration_fee,
        description: data.description,
        staff: data.staff,
        dataSource: data.data_source
      };

      setTournaments(prev => [...prev, tournament]);
      
      // Enviar a Google Sheets si está configurado
      sendToGoogleSheets(tournament, 'tournament').catch(console.error);
    } catch (error) {
      console.error('Error adding tournament:', error);
    }
  };

  return (
    <TournamentContext.Provider value={{ tournaments, loading, addTournament, loadTournaments }}>
      {children}
    </TournamentContext.Provider>
  );
};
