import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TournamentProvider } from "./context/TournamentContext";
import { ParticipantProvider } from "./context/ParticipantContext";
import { ZapierProvider } from "./context/ZapierContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import Tournaments from "./pages/Tournaments";
import CreateTournament from "./pages/CreateTournament";
import Tournament from "./pages/Tournament";
import Bracket from "./pages/Bracket";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import RoleBasedRoute from "./components/RoleBasedRoute";
import AdminDashboard from "./components/AdminDashboard";
import OrganizerDashboard from "./components/OrganizerDashboard";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="next-match-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <ZapierProvider>
            <TournamentProvider>
              <ParticipantProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route 
                      path="/admin" 
                      element={
                        <RoleBasedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </RoleBasedRoute>
                      } 
                    />
                    <Route 
                      path="/organizer" 
                      element={
                        <RoleBasedRoute allowedRoles={['admin', 'organizer']}>
                          <OrganizerDashboard />
                        </RoleBasedRoute>
                      } 
                    />
                    <Route path="/tournaments" element={<Tournaments />} />
                    <Route 
                      path="/tournaments/create" 
                      element={
                        <RoleBasedRoute allowedRoles={['admin', 'organizer']}>
                          <CreateTournament />
                        </RoleBasedRoute>
                      } 
                    />
                    <Route 
                      path="/create-tournament" 
                      element={
                        <RoleBasedRoute allowedRoles={['admin', 'organizer']}>
                          <CreateTournament />
                        </RoleBasedRoute>
                      } 
                    />
                    <Route path="/tournament/:id" element={<Tournament />} />
                    <Route path="/tournament/:id/bracket" element={<Bracket />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </ParticipantProvider>
            </TournamentProvider>
          </ZapierProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
