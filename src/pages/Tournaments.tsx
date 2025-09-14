import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import TournamentCard from "@/components/TournamentCard";

const Tournaments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data - en una aplicación real vendría de una API
  const tournaments = [
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
      status: "active" as const,
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
      status: "pending" as const,
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
      status: "finished" as const,
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
      status: "pending" as const,
      registrationFee: "$500"
    }
  ];

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tournament.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Torneos de Pádel</h1>
            <p className="text-muted-foreground">
              Descubre y participa en los mejores torneos de pádel
            </p>
          </div>
          
          <Button className="mt-4 lg:mt-0 bg-gradient-hero hover:shadow-primary">
            <Plus className="w-4 h-4 mr-2" />
            Crear Torneo
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar torneos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="active">En Curso</SelectItem>
              <SelectItem value="finished">Finalizados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tournament Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament, index) => (
            <div key={tournament.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <TournamentCard {...tournament} />
            </div>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No se encontraron torneos que coincidan con los filtros aplicados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;