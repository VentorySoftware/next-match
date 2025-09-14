import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Users, Trophy, DollarSign, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";

const Tournament = () => {
  const { id } = useParams();

  // Mock data - en una aplicación real vendría de una API
  const tournament = {
    id: "1",
    name: "Copa Primavera 2024",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop",
    location: "Club Deportivo Central",
    address: "Av. Principal 123, Buenos Aires",
    startDate: "15 de Marzo, 2024",
    endDate: "17 de Marzo, 2024",
    startTime: "09:00",
    endTime: "18:00",
    participants: 24,
    maxParticipants: 32,
    prize: "$50,000",
    status: "active" as const,
    registrationFee: "$1,200",
    duration: "3 días",
    description: "El torneo más esperado del año llega con grandes premios y la participación de los mejores jugadores de la región. Disfruta de tres días intensos de pádel de alto nivel.",
    staff: "Juan Pérez - Director del Torneo",
    rules: [
      "Formato de eliminación directa",
      "Partidos a mejor de 3 sets",
      "Tiempo máximo por partido: 90 minutos",
      "Equipamiento oficial requerido"
    ]
  };

  const statusConfig = {
    pending: { label: "Pendiente", className: "bg-status-pending text-white" },
    active: { label: "En Curso", className: "bg-status-active text-white" },
    finished: { label: "Finalizado", className: "bg-status-finished text-white" }
  };

  const matches = [
    { id: 1, time: "09:00", court: "Cancha 1", team1: "García/López", team2: "Martín/Silva", result: "6-4, 6-2" },
    { id: 2, time: "10:30", court: "Cancha 2", team1: "Rodríguez/Pérez", team2: "González/Torres", result: "Por jugar" },
    { id: 3, time: "12:00", court: "Cancha 1", team1: "Fernández/Díaz", team2: "Castro/Morales", result: "4-6, 6-3, 6-4" },
    { id: 4, time: "13:30", court: "Cancha 2", team1: "Ruiz/Herrera", team2: "Vargas/Mendoza", result: "Por jugar" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden shadow-card mb-8">
          <img
            src={tournament.image}
            alt={tournament.name}
            className="w-full h-64 lg:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center justify-between">
              <div>
                <Badge className={statusConfig[tournament.status].className + " mb-2"}>
                  {statusConfig[tournament.status].label}
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {tournament.name}
                </h1>
                <p className="text-white/90 text-lg">{tournament.location}</p>
              </div>
              <Link to={`/tournament/${id}/bracket`}>
                <Button className="bg-white text-primary hover:bg-white/90">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Bracket
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="matches">Partidos</TabsTrigger>
                <TabsTrigger value="participants">Participantes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Descripción del Torneo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {tournament.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Reglas y Formato</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tournament.rules.map((rule, index) => (
                        <li key={index} className="flex items-center text-muted-foreground">
                          <ArrowRight className="w-4 h-4 mr-2 text-primary" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="matches" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Partidos de Hoy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {matches.map((match) => (
                        <div key={match.id} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                              {match.time}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {match.court}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{match.team1} vs {match.team2}</div>
                            <div className={`text-sm ${match.result === "Por jugar" ? "text-muted-foreground" : "text-primary font-medium"}`}>
                              {match.result}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="participants">
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Participantes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        "García/López", "Martín/Silva", "Rodríguez/Pérez", "González/Torres",
                        "Fernández/Díaz", "Castro/Morales", "Ruiz/Herrera", "Vargas/Mendoza"
                      ].map((team, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">{index + 1}</span>
                          </div>
                          <span className="font-medium">{team}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Torneo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{tournament.startDate}</div>
                    <div className="text-sm text-muted-foreground">{tournament.startTime} - {tournament.endTime}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{tournament.location}</div>
                    <div className="text-sm text-muted-foreground">{tournament.address}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{tournament.participants}/{tournament.maxParticipants} participantes</div>
                    <div className="text-sm text-muted-foreground">Duración: {tournament.duration}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Premio: {tournament.prize}</div>
                    <div className="text-sm text-muted-foreground">Staff: {tournament.staff}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-3 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Inscripción: {tournament.registrationFee}</div>
                    <div className="text-sm text-muted-foreground">Por pareja</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full bg-gradient-hero hover:shadow-primary" size="lg">
              Inscribirse al Torneo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tournament;