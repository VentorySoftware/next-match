export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: 'principiante' | 'intermedio' | 'avanzado' | 'profesional';
  tournamentId: string;
  partnerId?: string;
  partnerName?: string;
  registrationDate: string;
  status: 'registered' | 'confirmed' | 'cancelled';
}

export interface ParticipantPair {
  id: string;
  tournamentId: string;
  player1: Participant;
  player2: Participant;
  category: string;
  registrationDate: string;
}