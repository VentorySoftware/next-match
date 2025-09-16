import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useZapier } from './ZapierContext';

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
  addTournament: (tournament: Omit<Tournament, 'id' | 'participants' | 'status'>) => void;
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
  
  // Mock data inicial
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: "1",
      name: "Copa Primavera 2024",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      location: "Club Deportivo Central",
      startDate: "15 Mar",
      endDate: "17 Mar",
      participants: 24,
      maxParticipants: 32,
      prize: "$50,000",
      status: "active",
      registrationFee: "$1,200"
    },
    {
      id: "2",
      name: "Torneo Empresarial",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop",
      location: "Padel Arena Norte",
      startDate: "22 Mar",
      endDate: "24 Mar",
      participants: 16,
      maxParticipants: 24,
      prize: "$25,000",
      status: "pending",
      registrationFee: "$800"
    },
    {
      id: "3",
      name: "Championship Masters",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
      location: "Centro Deportivo Elite",
      startDate: "8 Mar",
      endDate: "10 Mar",
      participants: 32,
      maxParticipants: 32,
      prize: "$100,000",
      status: "finished",
      registrationFee: "$2,000"
    },
    {
      id: "4",
      name: "Liga Juvenil 2024",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      location: "Club La Cancha",
      startDate: "1 Abr",
      endDate: "3 Abr",
      participants: 12,
      maxParticipants: 20,
      prize: "$15,000",
      status: "pending",
      registrationFee: "$500"
    }
  ]);

  const addTournament = (newTournament: Omit<Tournament, 'id' | 'participants' | 'status'>) => {
    const tournament: Tournament = {
      ...newTournament,
      id: Date.now().toString(), // Generar ID único
      participants: 0, // Inicialmente sin participantes
      status: 'pending' // Estado inicial
    };
    setTournaments(prev => [...prev, tournament]);
    
    // Enviar a Google Sheets si está configurado
    sendToGoogleSheets(tournament, 'tournament').catch(console.error);
  };

  return (
    <TournamentContext.Provider value={{ tournaments, addTournament }}>
      {children}
    </TournamentContext.Provider>
  );
};
