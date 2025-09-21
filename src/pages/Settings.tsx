import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { GoogleSheetsIntegration } from '@/components/GoogleSheetsIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, FileSpreadsheet, Database, Save } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Configuraciones de Google Sheets
    defaultSheetsTemplate: '',
    participantsRange: 'Participantes!A:F',
    bracketsRange: 'Llaves!A:E',
    autoSync: false,
    
    // Configuraciones generales
    tournamentEmailNotifications: true,
    participantConfirmations: true,
    maxParticipantsPerTournament: 32,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Simular guardado de configuraciones
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuraciones guardadas",
        description: "Tus configuraciones han sido actualizadas correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar las configuraciones.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
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

          <Tabs defaultValue="system" className="w-full">
            <TabsList>
              <TabsTrigger value="system">Sistema</TabsTrigger>
              <TabsTrigger value="sheets">Google Sheets</TabsTrigger>
              <TabsTrigger value="integrations">Integraciones</TabsTrigger>
            </TabsList>

            <TabsContent value="system" className="space-y-6">
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
                      <p className="text-muted-foreground">Supabase Database (PostgreSQL)</p>
                    </div>
                    <div>
                      <span className="font-medium">Sincronización:</span>
                      <p className="text-muted-foreground">Tiempo real con Google Sheets API</p>
                    </div>
                    <div>
                      <span className="font-medium">Respaldos:</span>
                      <p className="text-muted-foreground">Automático en Supabase + Google Sheets</p>
                    </div>
                    <div>
                      <span className="font-medium">API:</span>
                      <p className="text-muted-foreground">Edge Functions para integraciones externas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <SettingsIcon className="w-5 h-5 mr-2" />
                    Configuraciones Generales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="maxParticipants">Máximo de participantes por torneo</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={settings.maxParticipantsPerTournament}
                      onChange={(e) => handleSettingChange('maxParticipantsPerTournament', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={settings.tournamentEmailNotifications}
                      onChange={(e) => handleSettingChange('tournamentEmailNotifications', e.target.checked)}
                    />
                    <Label htmlFor="emailNotifications">Notificaciones por email</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="participantConfirmations"
                      checked={settings.participantConfirmations}
                      onChange={(e) => handleSettingChange('participantConfirmations', e.target.checked)}
                    />
                    <Label htmlFor="participantConfirmations">Confirmaciones de participantes</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sheets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileSpreadsheet className="w-5 h-5 mr-2" />
                    Configuraciones de Google Sheets
                  </CardTitle>
                  <CardDescription>
                    Configure los rangos y plantillas predeterminadas para la integración con Google Sheets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="defaultTemplate">Plantilla predeterminada de Google Sheets</Label>
                    <Input
                      id="defaultTemplate"
                      value={settings.defaultSheetsTemplate}
                      onChange={(e) => handleSettingChange('defaultSheetsTemplate', e.target.value)}
                      placeholder="ID de la hoja de plantilla"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      ID de la hoja de Google Sheets que se usará como plantilla para nuevos torneos
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="participantsRange">Rango predeterminado para participantes</Label>
                      <Input
                        id="participantsRange"
                        value={settings.participantsRange}
                        onChange={(e) => handleSettingChange('participantsRange', e.target.value)}
                        placeholder="Participantes!A:F"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bracketsRange">Rango predeterminado para llaves</Label>
                      <Input
                        id="bracketsRange"
                        value={settings.bracketsRange}
                        onChange={(e) => handleSettingChange('bracketsRange', e.target.value)}
                        placeholder="Llaves!A:E"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoSync"
                      checked={settings.autoSync}
                      onChange={(e) => handleSettingChange('autoSync', e.target.checked)}
                    />
                    <Label htmlFor="autoSync">Sincronización automática con Google Sheets</Label>
                  </div>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-2">Formato esperado en Google Sheets</h3>
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Hoja de Participantes:</strong></p>
                        <p>Columnas: Nombre, Email, Teléfono, Categoría, Pareja (opcional)</p>
                        
                        <p className="mt-3"><strong>Hoja de Llaves:</strong></p>
                        <p>Columnas: Ronda, Jugador1, Jugador2, Ganador, Estado</p>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <GoogleSheetsIntegration />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar Configuraciones'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;