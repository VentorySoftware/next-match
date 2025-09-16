import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ZapierContextType {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  sendToGoogleSheets: (data: any, type: 'tournament' | 'participant') => Promise<void>;
  isConfigured: boolean;
}

const ZapierContext = createContext<ZapierContextType | undefined>(undefined);

export const useZapier = () => {
  const context = useContext(ZapierContext);
  if (!context) {
    throw new Error('useZapier must be used within a ZapierProvider');
  }
  return context;
};

interface ZapierProviderProps {
  children: ReactNode;
}

export const ZapierProvider: React.FC<ZapierProviderProps> = ({ children }) => {
  const [webhookUrl, setWebhookUrlState] = useState('');
  const { toast } = useToast();

  // Cargar webhook URL del localStorage al inicializar
  useEffect(() => {
    const savedUrl = localStorage.getItem('zapier-webhook-url');
    if (savedUrl) {
      setWebhookUrlState(savedUrl);
    }
  }, []);

  const setWebhookUrl = (url: string) => {
    setWebhookUrlState(url);
    if (url) {
      localStorage.setItem('zapier-webhook-url', url);
    } else {
      localStorage.removeItem('zapier-webhook-url');
    }
  };

  const sendToGoogleSheets = async (data: any, type: 'tournament' | 'participant') => {
    if (!webhookUrl) {
      console.log('No webhook URL configured');
      return;
    }

    try {
      const payload = {
        type,
        data,
        timestamp: new Date().toISOString(),
        triggered_from: window.location.origin,
      };

      console.log('Sending data to Zapier webhook:', webhookUrl, payload);

      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(payload),
      });

      toast({
        title: "Datos enviados a Google Sheets",
        description: `${type === 'tournament' ? 'Torneo' : 'Participante'} enviado exitosamente`,
      });
    } catch (error) {
      console.error('Error sending to Zapier webhook:', error);
      toast({
        title: "Error al enviar datos",
        description: "No se pudo enviar la información a Google Sheets",
        variant: "destructive",
      });
    }
  };

  const isConfigured = Boolean(webhookUrl);

  return (
    <ZapierContext.Provider value={{
      webhookUrl,
      setWebhookUrl,
      sendToGoogleSheets,
      isConfigured
    }}>
      {children}
    </ZapierContext.Provider>
  );
};