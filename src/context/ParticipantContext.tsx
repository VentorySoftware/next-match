import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Participant, ParticipantPair } from '@/types/participant';

interface ParticipantContextType {
  participants: Participant[];
  pairs: ParticipantPair[];
  registerParticipant: (participant: Omit<Participant, 'id' | 'registrationDate' | 'status'>) => void;
  cancelRegistration: (participantId: string) => void;
  getParticipantsByTournament: (tournamentId: string) => Participant[];
  getPairsByTournament: (tournamentId: string) => ParticipantPair[];
  createPair: (tournamentId: string, player1Id: string, player2Id: string) => void;
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

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedParticipants = localStorage.getItem('tournament-participants');
    const savedPairs = localStorage.getItem('tournament-pairs');
    
    if (savedParticipants) {
      setParticipants(JSON.parse(savedParticipants));
    }
    if (savedPairs) {
      setPairs(JSON.parse(savedPairs));
    }
  }, []);

  // Guardar participantes en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('tournament-participants', JSON.stringify(participants));
  }, [participants]);

  // Guardar parejas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('tournament-pairs', JSON.stringify(pairs));
  }, [pairs]);

  const registerParticipant = (newParticipant: Omit<Participant, 'id' | 'registrationDate' | 'status'>) => {
    const participant: Participant = {
      ...newParticipant,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString(),
      status: 'registered'
    };
    setParticipants(prev => [...prev, participant]);
  };

  const cancelRegistration = (participantId: string) => {
    setParticipants(prev => 
      prev.map(p => 
        p.id === participantId 
          ? { ...p, status: 'cancelled' as const }
          : p
      )
    );
  };

  const getParticipantsByTournament = (tournamentId: string) => {
    return participants.filter(p => p.tournamentId === tournamentId && p.status === 'registered');
  };

  const getPairsByTournament = (tournamentId: string) => {
    return pairs.filter(pair => pair.tournamentId === tournamentId);
  };

  const createPair = (tournamentId: string, player1Id: string, player2Id: string) => {
    const player1 = participants.find(p => p.id === player1Id);
    const player2 = participants.find(p => p.id === player2Id);
    
    if (player1 && player2) {
      const pair: ParticipantPair = {
        id: Date.now().toString(),
        tournamentId,
        player1,
        player2,
        category: player1.category, // Usar la categoría del jugador 1
        registrationDate: new Date().toISOString()
      };
      setPairs(prev => [...prev, pair]);
    }
  };

  return (
    <ParticipantContext.Provider value={{
      participants,
      pairs,
      registerParticipant,
      cancelRegistration,
      getParticipantsByTournament,
      getPairsByTournament,
      createPair
    }}>
      {children}
    </ParticipantContext.Provider>
  );
};