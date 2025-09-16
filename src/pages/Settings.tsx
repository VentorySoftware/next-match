import React from 'react';
import Navigation from '@/components/Navigation';
import { GoogleSheetsIntegration } from '@/components/GoogleSheetsIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <SettingsIcon className="h-8 w-8" />
              Configuración
            </h1>
            <p className="text-muted-foreground">
              Configura las integraciones y ajustes del sistema
            </p>
          </div>

          <div className="space-y-6">
            <GoogleSheetsIntegration />
            
            <Card>
              <CardHeader>
                <CardTitle>Información del Sistema</CardTitle>
                <CardDescription>
                  Detalles sobre el funcionamiento actual del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Almacenamiento:</span>
                    <p className="text-muted-foreground">Datos guardados localmente en el navegador</p>
                  </div>
                  <div>
                    <span className="font-medium">Sincronización:</span>
                    <p className="text-muted-foreground">Manual via Google Sheets con Zapier</p>
                  </div>
                  <div>
                    <span className="font-medium">Respaldos:</span>
                    <p className="text-muted-foreground">Configura Zapier para respaldar automáticamente</p>
                  </div>
                  <div>
                    <span className="font-medium">Base de datos:</span>
                    <p className="text-muted-foreground">Para funcionalidades avanzadas conecta Supabase</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;