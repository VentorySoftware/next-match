import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { useZapier } from '@/context/ZapierContext';
import { useToast } from '@/hooks/use-toast';

export const GoogleSheetsIntegration: React.FC = () => {
  const { webhookUrl, setWebhookUrl, isConfigured, sendToGoogleSheets } = useZapier();
  const [tempUrl, setTempUrl] = useState(webhookUrl);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setWebhookUrl(tempUrl);
    toast({
      title: "Configuración guardada",
      description: "La integración con Google Sheets ha sido configurada",
    });
  };

  const handleTest = async () => {
    if (!tempUrl) {
      toast({
        title: "Error",
        description: "Por favor ingresa una URL de webhook válida",
        variant: "destructive",
      });
      return;
    }

    setIsTestLoading(true);
    
    try {
      const testData = {
        test: true,
        message: "Prueba de conexión desde el sistema de torneos de pádel",
        timestamp: new Date().toISOString(),
      };

      await fetch(tempUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(testData),
      });

      toast({
        title: "Prueba enviada",
        description: "Revisa tu Zap en Zapier para confirmar que se recibió la prueba",
      });
    } catch (error) {
      console.error("Error testing webhook:", error);
      toast({
        title: "Error en la prueba",
        description: "No se pudo enviar la prueba. Verifica la URL del webhook",
        variant: "destructive",
      });
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Integración con Google Sheets
          {isConfigured ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Configurado
            </Badge>
          ) : (
            <Badge variant="secondary">
              <AlertCircle className="h-3 w-3 mr-1" />
              No configurado
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Conecta con Google Sheets usando Zapier para enviar automáticamente los datos de torneos y participantes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium mb-2">¿Cómo configurar?</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Crea una cuenta en Zapier.com</li>
            <li>Crea un nuevo Zap con trigger "Webhooks by Zapier"</li>
            <li>Selecciona "Catch Hook" como evento</li>
            <li>Copia la URL del webhook que te proporciona Zapier</li>
            <li>Conecta la acción con Google Sheets</li>
            <li>Pega la URL aquí y guarda la configuración</li>
          </ol>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={() => window.open('https://zapier.com', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir Zapier
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL del Webhook de Zapier</Label>
          <Input
            id="webhook-url"
            placeholder="https://hooks.zapier.com/hooks/catch/..."
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={!tempUrl}>
            Guardar Configuración
          </Button>
          <Button 
            variant="outline" 
            onClick={handleTest} 
            disabled={!tempUrl || isTestLoading}
          >
            {isTestLoading ? "Enviando..." : "Probar Conexión"}
          </Button>
        </div>

        {isConfigured && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✅ La integración está activa. Los nuevos torneos y participantes se enviarán automáticamente a Google Sheets.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};