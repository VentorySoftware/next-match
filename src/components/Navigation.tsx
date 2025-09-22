import { Link, useLocation, useNavigate } from "react-router-dom";
import { Trophy, Users, Home, Settings, Shield, Plus, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();

  const navItems = [
    { href: "/", icon: Home, label: "Inicio" },
    { href: "/tournaments", icon: Trophy, label: "Torneos" },
    ...(userRole === 'admin' || userRole === 'organizer' ? [
      { href: "/create-tournament", icon: Plus, label: "Crear Torneo" },
      { href: "/organizer", icon: Users, label: "Panel Organizador" },
    ] : []),
    ...(userRole === 'admin' ? [
      { href: "/admin", icon: Shield, label: "Administración" },
    ] : []),
    { href: "/settings", icon: Settings, label: "Configuración" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Next Match
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <ThemeToggle />
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;