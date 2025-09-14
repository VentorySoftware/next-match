import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

const Bracket = () => {
  const { id } = useParams();

  // Mock bracket data
  const bracketData = {
    tournamentName: "Copa Primavera 2024",
    status: "active" as const,
    currentRound: "Cuartos de Final",
    rounds: [
      {
        name: "Cuartos de Final",
        matches: [
          {
            id: 1,
            team1: "García/López",
            team2: "Martín/Silva", 
            score1: "6-4, 6-2",
            score2: "",
            winner: "García/López",
            completed: true
          },
          {
            id: 2,
            team1: "Rodríguez/Pérez",
            team2: "González/Torres",
            score1: "",
            score2: "",
            winner: null,
            completed: false
          },
          {
            id: 3,
            team1: "Fernández/Díaz",
            team2: "Castro/Morales",
            score1: "4-6, 6-3, 6-4",
            score2: "",
            winner: "Fernández/Díaz",
            completed: true
          },
          {
            id: 4,
            team1: "Ruiz/Herrera",
            team2: "Vargas/Mendoza",
            score1: "",
            score2: "",
            winner: null,
            completed: false
          }
        ]
      },
      {
        name: "Semifinales",
        matches: [
          {
            id: 5,
            team1: "García/López",
            team2: "TBD",
            score1: "",
            score2: "",
            winner: null,
            completed: false
          },
          {
            id: 6,
            team1: "Fernández/Díaz", 
            team2: "TBD",
            score1: "",
            score2: "",
            winner: null,
            completed: false
          }
        ]
      },
      {
        name: "Final",
        matches: [
          {
            id: 7,
            team1: "TBD",
            team2: "TBD",
            score1: "",
            score2: "",
            winner: null,
            completed: false
          }
        ]
      }
    ]
  };

  const MatchCard = ({ match, roundIndex }: { match: any, roundIndex: number }) => {
    const isCompleted = match.completed;
    const hasTBD = match.team1 === "TBD" || match.team2 === "TBD";
    
    return (
      <div className={`relative p-4 rounded-lg border transition-all duration-300 ${
        isCompleted 
          ? "bg-accent/50 border-primary/50" 
          : hasTBD 
          ? "bg-muted/30 border-muted" 
          : "bg-background border-border hover:shadow-card"
      }`}>
        {isCompleted && (
          <Trophy className="absolute top-2 right-2 w-4 h-4 text-primary" />
        )}
        
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-2 rounded ${
            match.winner === match.team1 ? "bg-primary/10 border border-primary/20" : ""
          }`}>
            <span className={`font-medium ${match.winner === match.team1 ? "text-primary" : ""}`}>
              {match.team1}
            </span>
            <span className="text-sm text-muted-foreground">{match.score1}</span>
          </div>
          
          <div className="text-center text-xs text-muted-foreground">VS</div>
          
          <div className={`flex items-center justify-between p-2 rounded ${
            match.winner === match.team2 ? "bg-primary/10 border border-primary/20" : ""
          }`}>
            <span className={`font-medium ${match.winner === match.team2 ? "text-primary" : ""}`}>
              {match.team2}
            </span>
            <span className="text-sm text-muted-foreground">{match.score2}</span>
          </div>
        </div>
        
        {!isCompleted && !hasTBD && (
          <div className="mt-3 text-center">
            <Badge variant="outline" className="text-xs">
              Por jugar
            </Badge>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to={`/tournament/${id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{bracketData.tournamentName}</h1>
              <p className="text-muted-foreground">Bracket del Torneo</p>
            </div>
          </div>
          
          <Badge className="bg-status-active text-white">
            {bracketData.currentRound}
          </Badge>
        </div>

        {/* Tournament Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="w-8 h-8 text-primary mr-3" />
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">Equipos</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <Trophy className="w-8 h-8 text-primary mr-3" />
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Rondas</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">%</span>
              </div>
              <div>
                <div className="text-2xl font-bold">50%</div>
                <div className="text-sm text-muted-foreground">Completado</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bracket */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Llaves del Torneo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex space-x-8 min-w-max pb-4">
                {bracketData.rounds.map((round, roundIndex) => (
                  <div key={roundIndex} className="flex flex-col space-y-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-4 sticky top-0 bg-background py-2">
                        {round.name}
                      </h3>
                    </div>
                    
                    <div className="space-y-8" style={{ minWidth: '280px' }}>
                      {round.matches.map((match) => (
                        <MatchCard 
                          key={match.id} 
                          match={match} 
                          roundIndex={roundIndex}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Leyenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary/10 border border-primary/20 rounded"></div>
                <span className="text-sm">Ganador</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-accent/50 border border-primary/50 rounded"></div>
                <span className="text-sm">Partido finalizado</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-background border border-border rounded"></div>
                <span className="text-sm">Partido pendiente</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-muted/30 border border-muted rounded"></div>
                <span className="text-sm">Por definir</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Bracket;