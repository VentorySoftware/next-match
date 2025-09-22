import { Link } from "react-router-dom";
import { Trophy, Users, Calendar, Award, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";
import heroImage from "@/assets/hero-padel.jpg";

const Index = () => {
  const { user, userRole } = useAuth();
  
  const features = [
    {
      icon: Trophy,
      title: "Gestión Completa",
      description: "Administra torneos desde la creación hasta la finalización con herramientas profesionales."
    },
    {
      icon: Users,
      title: "Múltiples Roles",
      description: "Sistema de roles para administradores, jueces, participantes y espectadores."
    },
    {
      icon: Calendar,
      title: "Fixture Automático",
      description: "Generación automática de llaves y calendario de partidos con avance dinámico."
    },
    {
      icon: Award,
      title: "Histórico Completo",
      description: "Mantén un registro completo de todos los torneos y resultados históricos."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Padel Tournament"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fade-up">
              <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Next Match
              </span>
              <span className="text-3xl lg:text-4xl block mt-2">
                Sistema de Gestión de Torneos de Pádel
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Plataforma profesional para organizar, gestionar y seguir torneos de pádel.
              Desde la inscripción hasta la entrega de premios.
            </p>
            
            <div className="text-lg text-white/70 mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              Desarrollado por <span className="font-semibold text-white">NUVEM Software</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.5s" }}>
              <Link to="/tournaments">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover:shadow-glow">
                  Ver Torneos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              {user ? (
                (userRole === 'admin' || userRole === 'organizer') && (
                  <Link to="/create-tournament">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Crear Torneo
                    </Button>
                  </Link>
                )
              ) : (
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <LogIn className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Todo lo que necesitas para tus torneos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Una solución completa que simplifica la organización de torneos profesionales
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center hover:shadow-card transition-all duration-300 animate-fade-up bg-gradient-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            ¿Listo para organizar tu próximo torneo?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a Next Match, la plataforma líder en gestión de torneos de pádel y brinda una experiencia profesional a tus participantes.
          </p>
          <Link to="/tournaments">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover:shadow-glow">
              Explorar Torneos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          
          <div className="mt-8 text-white/60">
            <p>Una solución de NUVEM Software</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;