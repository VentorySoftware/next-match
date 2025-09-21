import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Download, FileSpreadsheet, Users, Trophy } from 'lucide-react';
import { useParticipants } from '@/context/ParticipantContext';
import { supabase } from '@/integrations/supabase/client';

interface GoogleSheetsImporterProps {
  tournamentId: string;
}

interface ImportedParticipant {
  nombre?: string;
  name?: string;
  email?: string;
  correo?: string;
  telefono?: string;
  phone?: string;
  categoria?: string;
  category?: string;
  pareja?: string;
  partner?: string;
}

interface BracketMatch {
  round: string;
  player1: string;
  player2: string;
  winner: string;
  status: string;
}

const GoogleSheetsImporter: React.FC<GoogleSheetsImporterProps> = ({ tournamentId }) => {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [participantsRange, setParticipantsRange] = useState('Participantes!A:F');
  const [bracketsRange, setBracketsRange] = useState('Llaves!A:E');
  const [isImporting, setIsImporting] = useState(false);
  const [importedData, setImportedData] = useState<{
    participants: ImportedParticipant[];
    brackets: BracketMatch[];
  } | null>(null);
  
  const { toast } = useToast();
  const { registerParticipant, loadParticipants } = useParticipants();

  const extractSpreadsheetId = (url: string): string => {
    // Extract spreadsheet ID from various Google Sheets URL formats
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  const normalizeParticipant = (participant: ImportedParticipant) => {
    return {
      name: participant.nombre || participant.name || '',
      email: participant.email || participant.correo || '',
      phone: participant.telefono || participant.phone || '',
      category: (participant.categoria || participant.category || 'principiante') as 'principiante' | 'intermedio' | 'avanzado' | 'profesional',
      partnerName: participant.pareja || participant.partner || ''
    };
  };

  const importParticipants = async () => {
    if (!spreadsheetId.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el ID o URL de la hoja de cálculo",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);

    try {
      const sheetId = extractSpreadsheetId(spreadsheetId);
      
      // Import participants
      const participantsResponse = await supabase.functions.invoke('google-sheets-import', {
        body: {
          spreadsheetId: sheetId,
          range: participantsRange,
          action: 'read'
        }
      });

      if (participantsResponse.error) {
        throw new Error(participantsResponse.error.message);
      }

      const { participants } = participantsResponse.data;

      // Import brackets
      const bracketsResponse = await supabase.functions.invoke('google-sheets-import', {
        body: {
          spreadsheetId: sheetId,
          range: bracketsRange,
          action: 'read_brackets'
        }
      });

      const brackets = bracketsResponse.data?.brackets || [];

      setImportedData({ participants, brackets });

      toast({
        title: "Datos importados exitosamente",
        description: `Se encontraron ${participants.length} participantes y ${brackets.length} partidos en las llaves`,
      });

    } catch (error) {
      console.error('Error importing from Google Sheets:', error);
      toast({
        title: "Error al importar",
        description: error instanceof Error ? error.message : "No se pudieron importar los datos",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const confirmImport = async () => {
    if (!importedData?.participants.length) return;

    setIsImporting(true);

    try {
      let importedCount = 0;
      
      for (const participant of importedData.participants) {
        const normalized = normalizeParticipant(participant);
        
        if (normalized.name && normalized.email) {
          await registerParticipant({
            ...normalized,
            tournamentId
          });
          importedCount++;
        }
      }

      await loadParticipants();

      toast({
        title: "Participantes registrados",
        description: `Se registraron ${importedCount} participantes en el torneo`,
      });

      setImportedData(null);
      setSpreadsheetId('');

    } catch (error) {
      console.error('Error registering participants:', error);
      toast({
        title: "Error al registrar participantes",
        description: "Hubo un problema al registrar algunos participantes",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Importar desde Google Sheets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="spreadsheet-id">ID o URL de Google Sheets</Label>
            <Input
              id="spreadsheet-id"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/... o solo el ID"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="participants-range">Rango de Participantes</Label>
              <Input
                id="participants-range"
                value={participantsRange}
                onChange={(e) => setParticipantsRange(e.target.value)}
                placeholder="Participantes!A:F"
              />
            </div>
            <div>
              <Label htmlFor="brackets-range">Rango de Llaves</Label>
              <Input
                id="brackets-range"
                value={bracketsRange}
                onChange={(e) => setBracketsRange(e.target.value)}
                placeholder="Llaves!A:E"
              />
            </div>
          </div>

          <Button 
            onClick={importParticipants} 
            disabled={isImporting}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            {isImporting ? 'Importando...' : 'Importar Datos'}
          </Button>
        </CardContent>
      </Card>

      {importedData && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Participantes Encontrados ({importedData.participants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {importedData.participants.map((participant, index) => {
                  const normalized = normalizeParticipant(participant);
                  return (
                    <div key={index} className="p-2 bg-muted rounded text-sm">
                      <div className="font-medium">{normalized.name}</div>
                      <div className="text-muted-foreground">
                        {normalized.email} | {normalized.category}
                        {normalized.partnerName && ` | Pareja: ${normalized.partnerName}`}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button onClick={confirmImport} disabled={isImporting} className="w-full mt-4">
                Confirmar Importación de Participantes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Llaves del Torneo ({importedData.brackets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {importedData.brackets.map((match, index) => (
                  <div key={index} className="p-2 bg-muted rounded text-sm">
                    <div className="font-medium">{match.round}</div>
                    <div className="text-muted-foreground">
                      {match.player1} vs {match.player2}
                    </div>
                    {match.winner && (
                      <div className="text-primary font-medium">
                        Ganador: {match.winner}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Estado: {match.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GoogleSheetsImporter;