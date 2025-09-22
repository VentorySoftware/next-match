import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trophy, Users, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Tournament {
  id: string;
  name: string;
  status: string;
  participants: number;
  max_participants: number;
  start_date: string;
  end_date: string;
}

const OrganizerDashboard = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeTournaments: 0,
    totalParticipants: 0,
    upcomingTournaments: 0,
  });

  useEffect(() => {
    fetchTournaments();
    fetchStats();
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: tournaments } = await supabase
        .from('tournaments')
        .select('status, participants');

      if (tournaments) {
        const activeTournaments = tournaments.filter(t => t.status === 'active').length;
        const upcomingTournaments = tournaments.filter(t => t.status === 'pending').length;
        const totalParticipants = tournaments.reduce((sum, t) => sum + (t.participants || 0), 0);

        setStats({
          activeTournaments,
          totalParticipants,
          upcomingTournaments,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
      case 'active': return 'Activo';
      case 'pending': return 'Pendiente';
      case 'finished': return 'Finalizado';
      default: return status;
    }
  };

  if (!['admin', 'organizer'].includes(userRole || '')) {
    return (
      <div className="text-center py-8">
        <Trophy className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Acceso Denegado</h2>
        <p className="text-muted-foreground">No tienes permisos para acceder al panel de organizador.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Panel de Organizador</h1>
          <p className="text-muted-foreground">Gestiona tus torneos y participantes</p>
        </div>
        <Button onClick={() => navigate('/create-tournament')}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Torneo
        </Button>
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
            <CardTitle className="text-sm font-medium">Total Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tournaments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tournaments">Mis Torneos</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        <TabsContent value="tournaments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Torneos</CardTitle>
              <CardDescription>
                Lista de todos los torneos que has creado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : tournaments.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="mx-auto h-16 w-16 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No hay torneos</h3>
                  <p className="text-muted-foreground">Crea tu primer torneo para comenzar</p>
                  <Button className="mt-4" onClick={() => navigate('/create-tournament')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Torneo
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tournaments.map((tournament) => (
                    <Card key={tournament.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{tournament.name}</CardTitle>
                          <Badge variant={getStatusBadgeVariant(tournament.status)}>
                            {getStatusLabel(tournament.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Participantes:</span>
                            <span>{tournament.participants}/{tournament.max_participants}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Inicio:</span>
                            <span>{tournament.start_date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fin:</span>
                            <span>{tournament.end_date}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          onClick={() => navigate(`/tournament/${tournament.id}`)}
                        >
                          Ver Detalles
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analíticas
              </CardTitle>
              <CardDescription>
                Estadísticas y métricas de tus torneos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Próximamente</h3>
                <p className="text-muted-foreground">Las analíticas detalladas estarán disponibles pronto</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizerDashboard;