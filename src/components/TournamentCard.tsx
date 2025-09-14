import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TournamentCardProps {
  id: string;
  name: string;
  image: string;
  location: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  prize: string;
  status: "pending" | "active" | "finished";
  registrationFee: string;
}

const statusConfig = {
  pending: { label: "Pendiente", className: "bg-status-pending text-white" },
  active: { label: "En Curso", className: "bg-status-active text-white" },
  finished: { label: "Finalizado", className: "bg-status-finished text-white" }
};

const TournamentCard = ({
  id,
  name,
  image,
  location,
  startDate,
  endDate,
  participants,
  maxParticipants,
  prize,
  status,
  registrationFee
}: TournamentCardProps) => {
  const statusInfo = statusConfig[status];

  return (
    <Card className="overflow-hidden hover:shadow-card transition-all duration-300 animate-scale-in bg-gradient-card">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover"
          />
          <Badge className={`absolute top-4 right-4 ${statusInfo.className}`}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 line-clamp-2">{name}</h3>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{startDate} - {endDate}</span>
          </div>
          
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{location}</span>
          </div>
          
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>{participants}/{maxParticipants} participantes</span>
          </div>
          
          <div className="flex items-center">
            <Trophy className="w-4 h-4 mr-2" />
            <span>Premio: {prize}</span>
          </div>
        </div>
        
        <div className="mt-4 text-lg font-semibold text-primary">
          Inscripción: {registrationFee}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Link to={`/tournament/${id}`} className="w-full">
          <Button className="w-full bg-gradient-hero hover:shadow-primary">
            Ver Detalles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;