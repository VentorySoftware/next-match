import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, RefreshCw, Users, Calendar } from 'lucide-react';
import { useParticipants } from '@/context/ParticipantContext';
import { supabase } from '@/integrations/supabase/client';

interface BracketMatch {
  round: string;
  player1: string;
  player2: string;
  winner: string;
  status: string;
}

interface TournamentBracketsProps {
  tournamentId: string;
  spreadsheetId?: string;
  bracketsRange?: string;
}

const TournamentBrackets: React.FC<TournamentBracketsProps> = ({ 
  tournamentId, 
  spreadsheetId, 
  bracketsRange = 'Llaves!A:E' 
}) => {
  const [brackets, setBrackets] = useState<BracketMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const { getParticipantsByTournament, getPairsByTournament } = useParticipants();

  const participants = getParticipantsByTournament(tournamentId);
  const pairs = getPairsByTournament(tournamentId);

  const loadBracketsFromSheets = async () => {
    if (!spreadsheetId) return;

    setLoading(true);
    try {
      const response = await supabase.functions.invoke('google-sheets-import', {
        body: {
          spreadsheetId,
          range: bracketsRange,
          action: 'read_brackets'
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setBrackets(response.data.brackets || []);
    } catch (error) {
      console.error('Error loading brackets:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAutomaticBrackets = () => {
    // Generate basic bracket structure from registered pairs
    if (pairs.length === 0) return;

    const rounds = ['Octavos', 'Cuartos', 'Semifinal', 'Final'];
    const generatedBrackets: BracketMatch[] = [];

    // First round - pair up the teams
    pairs.forEach((pair, index) => {
      if (index % 2 === 0 && pairs[index + 1]) {
        generatedBrackets.push({
          round: rounds[0] || 'Primera Ronda',
          player1: `${pair.player1.name} / ${pair.player2.name}`,
          player2: `${pairs[index + 1].player1.name} / ${pairs[index + 1].player2.name}`,
          winner: '',
          status: 'pending'
        });
      }
    });

    // Generate subsequent rounds with empty matches
    for (let roundIndex = 1; roundIndex < rounds.length; roundIndex++) {
      const matchesInRound = Math.ceil(generatedBrackets.length / Math.pow(2, roundIndex));
      for (let match = 0; match < matchesInRound; match++) {
        generatedBrackets.push({
          round: rounds[roundIndex],
          player1: 'Por definir',
          player2: 'Por definir',
          winner: '',
          status: 'waiting'
        });
      }
    }

    setBrackets(generatedBrackets);
  };

  useEffect(() => {
    if (spreadsheetId) {
      loadBracketsFromSheets();
    }
  }, [spreadsheetId, bracketsRange]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'terminado':
        return 'default';
      case 'in_progress':
      case 'en_curso':
        return 'secondary';
      case 'pending':
      case 'pendiente':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const groupedBrackets = brackets.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<string, BracketMatch[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Llaves del Torneo
            </div>
            <div className="flex gap-2">
              {spreadsheetId && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadBracketsFromSheets}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar desde Sheets
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateAutomaticBrackets}
                disabled={pairs.length === 0}
              >
                <Users className="w-4 h-4 mr-2" />
                Generar Llaves Automáticamente
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{participants.length}</div>
              <div className="text-sm text-muted-foreground">Participantes</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{pairs.length}</div>
              <div className="text-sm text-muted-foreground">Parejas</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{brackets.length}</div>
              <div className="text-sm text-muted-foreground">Partidos</div>
            </div>
          </div>

          {Object.keys(groupedBrackets).length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay llaves configuradas</h3>
              <p className="text-muted-foreground mb-4">
                {pairs.length === 0 
                  ? "Primero necesitas participantes inscritos para generar las llaves."
                  : "Puedes generar las llaves automáticamente o importarlas desde Google Sheets."
                }
              </p>
              {pairs.length > 0 && (
                <Button onClick={generateAutomaticBrackets}>
                  <Users className="w-4 h-4 mr-2" />
                  Generar Llaves Automáticamente
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedBrackets).map(([round, matches]) => (
                <div key={round}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {round}
                  </h3>
                  <div className="grid gap-4">
                    {matches.map((match, index) => (
                      <Card key={`${round}-${index}`} className="relative">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <div className="text-center md:text-left">
                                  <div className="font-medium">{match.player1}</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-muted-foreground">vs</div>
                                </div>
                                <div className="text-center md:text-right">
                                  <div className="font-medium">{match.player2}</div>
                                </div>
                              </div>
                              {match.winner && (
                                <div className="mt-2 text-center">
                                  <Badge variant="default" className="bg-primary">
                                    🏆 Ganador: {match.winner}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <Badge variant={getStatusColor(match.status)}>
                                {match.status}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentBrackets;