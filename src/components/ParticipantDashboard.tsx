import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Calendar, Users, Target, Medal, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Participation {
  id: string;
  tournament_id: string;
  tournament: {
    id: string;
    name: string;
    status: string;
    start_date: string;
    end_date: string;
    location: string;
  };
  category: string;
  partner_name?: string;
  status: string;
  registration_date: string;
}

const ParticipantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeTournaments: 0,
    completedTournaments: 0,
    upcomingTournaments: 0,
  });

  useEffect(() => {
    if (user) {
      fetchParticipations();
    }
  }, [user]);

  const fetchParticipations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          *,
          tournaments:tournament_id (
            id,
            name,
            status,
            start_date,
            end_date,
            location
          )
        `)
        .eq('email', user.email)
        .order('registration_date', { ascending: false });

      if (error) throw error;

      const formattedData = data?.map(participation => ({
        ...participation,
        tournament: participation.tournaments
      })) || [];

      setParticipations(formattedData);
      
      // Calculate stats
      const active = formattedData.filter(p => p.tournament?.status === 'active').length;
      const completed = formattedData.filter(p => p.tournament?.status === 'finished').length;
      const upcoming = formattedData.filter(p => p.tournament?.status === 'pending').length;

      setStats({
        activeTournaments: active,
        completedTournaments: completed,
        upcomingTournaments: upcoming,
      });
    } catch (error) {
      console.error('Error fetching participations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'finished': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'En Curso';
      case 'pending': return 'Próximo';
      case 'finished': return 'Finalizado';
      default: return status;
    }
  };

  const getParticipationStatusBadge = (status: string) => {
    switch (status) {
      case 'registered': return <Badge variant="secondary">Registrado</Badge>;
      case 'confirmed': return <Badge variant="default">Confirmado</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mi Panel de Participante</h1>
        <p className="text-muted-foreground">Gestiona tus inscripciones y torneos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Torneos Activos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTournaments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Torneos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingTournaments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Torneos Completados</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTournaments}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Torneos Activos</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Torneos en Curso</CardTitle>
              <CardDescription>
                Torneos en los que estás participando actualmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {participations
                    .filter(p => p.tournament?.status === 'active')
                    .map((participation) => (
                      <Card key={participation.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">{participation.tournament?.name}</h4>
                              <p className="text-muted-foreground">{participation.tournament?.location}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={getStatusBadgeVariant(participation.tournament?.status || '')}>
                                {getStatusLabel(participation.tournament?.status || '')}
                              </Badge>
                              {getParticipationStatusBadge(participation.status)}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-muted-foreground">Categoría:</span>
                              <p className="font-medium">{participation.category}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Compañero:</span>
                              <p className="font-medium">{participation.partner_name || 'Individual'}</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => navigate(`/tournament/${participation.tournament_id}/bracket`)}
                          >
                            Ver Fixture
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  {participations.filter(p => p.tournament?.status === 'active').length === 0 && (
                    <div className="text-center py-8">
                      <Trophy className="mx-auto h-16 w-16 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No hay torneos activos</h3>
                      <p className="text-muted-foreground">No estás participando en ningún torneo actualmente</p>
                      <Button className="mt-4" onClick={() => navigate('/tournaments')}>
                        <Target className="mr-2 h-4 w-4" />
                        Explorar Torneos
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Torneos</CardTitle>
              <CardDescription>
                Torneos en los que tienes inscripciones pendientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participations
                  .filter(p => p.tournament?.status === 'pending')
                  .map((participation) => (
                    <Card key={participation.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-lg">{participation.tournament?.name}</h4>
                            <p className="text-muted-foreground">{participation.tournament?.location}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={getStatusBadgeVariant(participation.tournament?.status || '')}>
                              {getStatusLabel(participation.tournament?.status || '')}
                            </Badge>
                            {getParticipationStatusBadge(participation.status)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-muted-foreground">Fecha de inicio:</span>
                            <p className="font-medium flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {participation.tournament?.start_date}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Categoría:</span>
                            <p className="font-medium">{participation.category}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(`/tournament/${participation.tournament_id}`)}
                        >
                          Ver Detalles
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                {participations.filter(p => p.tournament?.status === 'pending').length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-16 w-16 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No hay torneos próximos</h3>
                    <p className="text-muted-foreground">No tienes inscripciones en torneos próximos</p>
                    <Button className="mt-4" onClick={() => navigate('/tournaments')}>
                      <Target className="mr-2 h-4 w-4" />
                      Buscar Torneos
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Torneos</CardTitle>
              <CardDescription>
                Todos los torneos en los que has participado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participations
                  .filter(p => p.tournament?.status === 'finished')
                  .map((participation) => (
                    <Card key={participation.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-lg">{participation.tournament?.name}</h4>
                            <p className="text-muted-foreground">{participation.tournament?.location}</p>
                          </div>
                          <Badge variant="outline">Finalizado</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Categoría:</span>
                            <p className="font-medium">{participation.category}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Compañero:</span>
                            <p className="font-medium">{participation.partner_name || 'Individual'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Fechas:</span>
                            <p className="font-medium">{participation.tournament?.start_date} - {participation.tournament?.end_date}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {participations.filter(p => p.tournament?.status === 'finished').length === 0 && (
                  <div className="text-center py-8">
                    <Medal className="mx-auto h-16 w-16 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Sin historial aún</h3>
                    <p className="text-muted-foreground">No has completado ningún torneo todavía</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticipantDashboard;