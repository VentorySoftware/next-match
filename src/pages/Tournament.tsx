import { useParams } from "react-router-dom";
import { ArrowLeft, Users, Trophy, Calendar, MapPin, DollarSign, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import { ParticipantRegistration } from "@/components/ParticipantRegistration";
import { ParticipantsList } from "@/components/ParticipantsList";
import GoogleSheetsImporter from "@/components/GoogleSheetsImporter";
import TournamentBrackets from "@/components/TournamentBrackets";
import { useTournaments } from "@/context/TournamentContext";
import { useParticipants } from "@/context/ParticipantContext";
import { useState } from "react";

const Tournament = () => {
  const { id } = useParams();
  const { tournaments } = useTournaments();
  const { getParticipantsByTournament } = useParticipants();
  const [sheetsConfig, setSheetsConfig] = useState({
    spreadsheetId: '',
    participantsRange: 'Participantes!A:F',
    bracketsRange: 'Llaves!A:E'
  });

  const tournament = tournaments.find(t => t.id === id);
  const participants = getParticipantsByTournament(id || '');

  if (!tournament) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Torneo no encontrado</h1>
            <Link to="/tournaments">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Torneos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { label: "Pendiente", className: "bg-yellow-500" },
    active: { label: "En Curso", className: "bg-green-500" },
    finished: { label: "Finalizado", className: "bg-gray-500" }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/tournaments">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torneos
              </Button>
            </Link>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{tournament.name}</h1>
                <Badge className={statusConfig[tournament.status].className}>
                  {statusConfig[tournament.status].label}
                </Badge>
              </div>
              <p className="text-muted-foreground">{tournament.location}</p>
            </div>
          </div>
        </div>

        {/* Tournament Hero Image */}
        {tournament.image && (
          <div className="relative rounded-xl overflow-hidden shadow-lg mb-8">
            <img
              src={tournament.image}
              alt={tournament.name}
              className="w-full h-64 lg:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h2 className="text-2xl font-bold mb-2">{tournament.name}</h2>
              <div className="flex items-center space-x-4 text-white/90">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {tournament.startDate} - {tournament.endDate}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {participants.length}/{tournament.maxParticipants}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tournament Details Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{participants.length}</div>
              <div className="text-sm text-muted-foreground">Participantes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold">{tournament.prize}</div>
              <div className="text-sm text-muted-foreground">Premio</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold">{tournament.registrationFee}</div>
              <div className="text-sm text-muted-foreground">Inscripción</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold">{tournament.location}</div>
              <div className="text-sm text-muted-foreground">Ubicación</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Información</TabsTrigger>
            <TabsTrigger value="participants">Participantes ({participants.length})</TabsTrigger>
            <TabsTrigger value="register">Inscribirse</TabsTrigger>
            <TabsTrigger value="import">Importar</TabsTrigger>
            <TabsTrigger value="brackets">Llaves</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detalles del Torneo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{tournament.startDate} - {tournament.endDate}</div>
                      <div className="text-sm text-muted-foreground">
                        {tournament.startTime} - {tournament.endTime}
                      </div>
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
                      <div className="font-medium">{participants.length}/{tournament.maxParticipants} Participantes</div>
                      <div className="text-sm text-muted-foreground">
                        {tournament.maxParticipants - participants.length} cupos disponibles
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {tournament.description || "Este es un torneo de pádel emocionante donde participarán jugadores de diferentes niveles. ¡No te pierdas la oportunidad de competir!"}
                  </p>
                  {tournament.staff && (
                    <div className="mt-4">
                      <div className="text-sm font-medium">Staff:</div>
                      <div className="text-sm text-muted-foreground">{tournament.staff}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="participants">
            <ParticipantsList tournamentId={tournament.id} />
          </TabsContent>

          <TabsContent value="register">
            <ParticipantRegistration 
              tournamentId={tournament.id}
              onSuccess={() => window.location.reload()}
            />
          </TabsContent>

          <TabsContent value="import">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Configurar Google Sheets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="spreadsheet-id">ID o URL de Google Sheets</Label>
                    <Input
                      id="spreadsheet-id"
                      value={sheetsConfig.spreadsheetId}
                      onChange={(e) => setSheetsConfig(prev => ({ ...prev, spreadsheetId: e.target.value }))}
                      placeholder="https://docs.google.com/spreadsheets/d/... o solo el ID"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="participants-range">Rango Participantes</Label>
                      <Input
                        id="participants-range"
                        value={sheetsConfig.participantsRange}
                        onChange={(e) => setSheetsConfig(prev => ({ ...prev, participantsRange: e.target.value }))}
                        placeholder="Participantes!A:F"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brackets-range">Rango Llaves</Label>
                      <Input
                        id="brackets-range"
                        value={sheetsConfig.bracketsRange}
                        onChange={(e) => setSheetsConfig(prev => ({ ...prev, bracketsRange: e.target.value }))}
                        placeholder="Llaves!A:E"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <GoogleSheetsImporter tournamentId={tournament.id} />
            </div>
          </TabsContent>

          <TabsContent value="brackets">
            <TournamentBrackets 
              tournamentId={tournament.id}
              spreadsheetId={sheetsConfig.spreadsheetId}
              bracketsRange={sheetsConfig.bracketsRange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Tournament;