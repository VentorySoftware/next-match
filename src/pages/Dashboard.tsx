import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import AdminDashboard from '@/components/AdminDashboard';
import OrganizerDashboard from '@/components/OrganizerDashboard';
import ParticipantDashboard from '@/components/ParticipantDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'organizer':
        return <OrganizerDashboard />;
      case 'participant':
        return <ParticipantDashboard />;
      default:
        return <ParticipantDashboard />; // Default to participant dashboard
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;