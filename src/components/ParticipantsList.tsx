import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Users, Mail, Phone } from 'lucide-react';
import { useParticipants } from '@/context/ParticipantContext';
import { useToast } from '@/hooks/use-toast';

interface ParticipantsListProps {
  tournamentId: string;
}

const categoryColors = {
  principiante: 'bg-green-100 text-green-800',
  intermedio: 'bg-blue-100 text-blue-800',
  avanzado: 'bg-orange-100 text-orange-800',
  profesional: 'bg-red-100 text-red-800',
};

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ tournamentId }) => {
  const { getParticipantsByTournament, cancelRegistration } = useParticipants();
  const { toast } = useToast();
  
  const participants = getParticipantsByTournament(tournamentId);

  const handleCancelRegistration = (participantId: string, participantName: string) => {
    cancelRegistration(participantId);
    toast({
      title: "Inscripción cancelada",
      description: `Se ha cancelado la inscripción de ${participantName}`,
    });
  };

  if (participants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participantes Inscritos
          </CardTitle>
          <CardDescription>
            Aún no hay participantes inscritos en este torneo
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Participantes Inscritos ({participants.length})
        </CardTitle>
        <CardDescription>
          Lista de todos los participantes registrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {participants.map((participant) => (
            <div 
              key={participant.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{participant.name}</h3>
                  <Badge className={categoryColors[participant.category]}>
                    {participant.category}
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {participant.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {participant.phone}
                  </div>
                  {participant.partnerName && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Pareja: {participant.partnerName}
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground mt-2">
                  Registrado el {new Date(participant.registrationDate).toLocaleDateString()}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelRegistration(participant.id, participant.name)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};