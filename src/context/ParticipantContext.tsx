import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Participant, ParticipantPair } from '@/types/participant';
import { useZapier } from './ZapierContext';
import { supabase } from '@/integrations/supabase/client';

interface ParticipantContextType {
  participants: Participant[];
  pairs: ParticipantPair[];
  loading: boolean;
  registerParticipant: (participant: Omit<Participant, 'id' | 'registrationDate' | 'status'>) => Promise<void>;
  cancelRegistration: (participantId: string) => Promise<void>;
  getParticipantsByTournament: (tournamentId: string) => Participant[];
  getPairsByTournament: (tournamentId: string) => ParticipantPair[];
  createPair: (tournamentId: string, player1Id: string, player2Id: string) => Promise<void>;
  loadParticipants: () => Promise<void>;
  loadPairs: () => Promise<void>;
}

const ParticipantContext = createContext<ParticipantContextType | undefined>(undefined);

export const useParticipants = () => {
  const context = useContext(ParticipantContext);
  if (!context) {
    throw new Error('useParticipants must be used within a ParticipantProvider');
  }
  return context;
};

interface ParticipantProviderProps {
  children: ReactNode;
}

export const ParticipantProvider: React.FC<ParticipantProviderProps> = ({ children }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [pairs, setPairs] = useState<ParticipantPair[]>([]);
  const [loading, setLoading] = useState(true);
  const { sendToGoogleSheets } = useZapier();

  // Cargar datos desde Supabase al inicializar
  useEffect(() => {
    loadParticipants();
    loadPairs();
  }, []);

  const loadParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading participants:', error);
        return;
      }

      // Transformar datos de Supabase al formato esperado
      const formattedParticipants: Participant[] = data.map(participant => ({
        id: participant.id,
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        category: participant.category as 'principiante' | 'intermedio' | 'avanzado' | 'profesional',
        tournamentId: participant.tournament_id,
        partnerId: participant.partner_id,
        partnerName: participant.partner_name,
        registrationDate: participant.registration_date,
        status: participant.status as 'registered' | 'confirmed' | 'cancelled'
      }));

      setParticipants(formattedParticipants);
    } catch (error) {
      console.error('Error loading participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPairs = async () => {
    try {
      // Cargar parejas y luego obtener los datos de los participantes por separado
      const { data: pairsData, error: pairsError } = await supabase
        .from('participant_pairs')
        .select('*')
        .order('created_at', { ascending: false });

      if (pairsError) {
        console.error('Error loading pairs:', pairsError);
        return;
      }

      if (!pairsData || pairsData.length === 0) {
        setPairs([]);
        return;
      }

      // Obtener todos los IDs de participantes únicos
      const participantIds = [
        ...new Set([
          ...pairsData.map(pair => pair.player1_id),
          ...pairsData.map(pair => pair.player2_id)
        ])
      ];

      // Cargar datos de participantes
      const { data: participantsData, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .in('id', participantIds);

      if (participantsError) {
        console.error('Error loading participants for pairs:', participantsError);
        return;
      }

      // Crear mapa de participantes para búsqueda rápida
      const participantsMap = new Map(
        participantsData?.map(p => [p.id, {
          id: p.id,
          name: p.name,
          email: p.email,
          phone: p.phone,
          category: p.category as 'principiante' | 'intermedio' | 'avanzado' | 'profesional',
          tournamentId: p.tournament_id,
          partnerId: p.partner_id,
          partnerName: p.partner_name,
          registrationDate: p.registration_date,
          status: p.status as 'registered' | 'confirmed' | 'cancelled'
        }]) || []
      );

      // Transformar datos a formato esperado
      const formattedPairs: ParticipantPair[] = pairsData
        .map(pair => {
          const player1 = participantsMap.get(pair.player1_id);
          const player2 = participantsMap.get(pair.player2_id);
          
          if (!player1 || !player2) return null;
          
          return {
            id: pair.id,
            tournamentId: pair.tournament_id,
            player1,
            player2,
            category: pair.category,
            registrationDate: pair.registration_date
          };
        })
        .filter(Boolean) as ParticipantPair[];

      setPairs(formattedPairs);
    } catch (error) {
      console.error('Error loading pairs:', error);
    }
  };

  const registerParticipant = async (newParticipant: Omit<Participant, 'id' | 'registrationDate' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .insert({
          name: newParticipant.name,
          email: newParticipant.email,
          phone: newParticipant.phone,
          category: newParticipant.category,
          tournament_id: newParticipant.tournamentId,
          partner_id: newParticipant.partnerId,
          partner_name: newParticipant.partnerName,
          status: 'registered'
        })
        .select()
        .single();

      if (error) {
        console.error('Error registering participant:', error);
        return;
      }

      // Transformar datos y actualizar estado local
      const participant: Participant = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        category: data.category as 'principiante' | 'intermedio' | 'avanzado' | 'profesional',
        tournamentId: data.tournament_id,
        partnerId: data.partner_id,
        partnerName: data.partner_name,
        registrationDate: data.registration_date,
        status: data.status as 'registered' | 'confirmed' | 'cancelled'
      };

      setParticipants(prev => [...prev, participant]);
      
      // Actualizar contador de participantes en el torneo
      await supabase.rpc('increment_tournament_participants', { 
        tournament_id: newParticipant.tournamentId 
      });
      
      // Enviar a Google Sheets si está configurado
      sendToGoogleSheets(participant, 'participant').catch(console.error);
    } catch (error) {
      console.error('Error registering participant:', error);
    }
  };

  const cancelRegistration = async (participantId: string) => {
    try {
      const { error } = await supabase
        .from('participants')
        .update({ status: 'cancelled' })
        .eq('id', participantId);

      if (error) {
        console.error('Error cancelling registration:', error);
        return;
      }

      // Actualizar estado local
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { ...p, status: 'cancelled' as const }
            : p
        )
      );

      // Decrementar contador de participantes en el torneo
      const participant = participants.find(p => p.id === participantId);
      if (participant) {
        await supabase.rpc('decrement_tournament_participants', { 
          tournament_id: participant.tournamentId 
        });
      }
    } catch (error) {
      console.error('Error cancelling registration:', error);
    }
  };

  const getParticipantsByTournament = (tournamentId: string) => {
    return participants.filter(p => p.tournamentId === tournamentId && p.status === 'registered');
  };

  const getPairsByTournament = (tournamentId: string) => {
    return pairs.filter(pair => pair.tournamentId === tournamentId);
  };

  const createPair = async (tournamentId: string, player1Id: string, player2Id: string) => {
    const player1 = participants.find(p => p.id === player1Id);
    const player2 = participants.find(p => p.id === player2Id);
    
    if (player1 && player2) {
      try {
        const { data, error } = await supabase
          .from('participant_pairs')
          .insert({
            tournament_id: tournamentId,
            player1_id: player1Id,
            player2_id: player2Id,
            category: player1.category
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating pair:', error);
          return;
        }

        // Crear pareja para el estado local
        const pair: ParticipantPair = {
          id: data.id,
          tournamentId,
          player1,
          player2,
          category: player1.category,
          registrationDate: data.registration_date
        };
        
        setPairs(prev => [...prev, pair]);
      } catch (error) {
        console.error('Error creating pair:', error);
      }
    }
  };

  return (
    <ParticipantContext.Provider value={{
      participants,
      pairs,
      loading,
      registerParticipant,
      cancelRegistration,
      getParticipantsByTournament,
      getPairsByTournament,
      createPair,
      loadParticipants,
      loadPairs
    }}>
      {children}
    </ParticipantContext.Provider>
  );
};