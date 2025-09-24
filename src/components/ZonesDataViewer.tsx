import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Clock, Database, MapPin, Users } from 'lucide-react';
import { GoogleSheetsService, type ZonesData, type Match } from '@/services/GoogleSheetsService';
import { useToast } from '@/hooks/use-toast';

interface ZonesDataViewerProps {
  defaultSpreadsheetId?: string;
}

export const ZonesDataViewer: React.FC<ZonesDataViewerProps> = ({ 
  defaultSpreadsheetId = '' 
}) => {
  const [spreadsheetId, setSpreadsheetId] = useState(defaultSpreadsheetId);
  const [zonesData, setZonesData] = useState<ZonesData>({});
  const [loading, setLoading] = useState(false);
  const [cacheInfo, setCacheInfo] = useState(GoogleSheetsService.getCacheInfo());
  const { toast } = useToast();

  const loadZonesData = async () => {
    if (!spreadsheetId) {
      toast({
        title: "Error",
        description: "Por favor ingresa un ID de Google Sheets válido",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await GoogleSheetsService.getZonesData(spreadsheetId);
      setZonesData(data);
      setCacheInfo(GoogleSheetsService.getCacheInfo());
      
      const totalMatches = Object.values(data).reduce((sum, matches) => sum + matches.length, 0);
      toast({
        title: "Datos cargados",
        description: `Se cargaron ${totalMatches} partidos de ${Object.keys(data).length} zonas`,
      });
    } catch (error) {
      console.error('Error cargando datos de zonas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos desde Google Sheets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    GoogleSheetsService.clearCache();
    setCacheInfo(GoogleSheetsService.getCacheInfo());
    toast({
      title: "Caché limpiado",
      description: "El caché ha sido eliminado. La próxima consulta será desde Google Sheets",
    });
  };

  const extractSpreadsheetId = (url: string): string => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  const handleSpreadsheetChange = (value: string) => {
    const id = extractSpreadsheetId(value);
    setSpreadsheetId(id);
  };

  const renderMatchCard = (match: Match, index: number) => (
    <Card key={`${match.pk}-${index}`} className="mb-3">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">{match.pareja1}</span>
              <Badge variant="outline" className="text-xs">{match.codigoA}</Badge>
            </div>
            <div className="text-center font-bold text-lg">VS</div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">{match.pareja2}</span>
              <Badge variant="outline" className="text-xs">{match.codigoD}</Badge>
            </div>
          </div>
          
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{match.fecha} - {match.hora}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Cancha {match.cancha}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Resultados:</div>
            <div className="space-y-1">
              {(match.set1_p1 || match.set1_p2) && (
                <div className="flex justify-between">
                  <span>Set 1:</span>
                  <span>{match.set1_p1} - {match.set1_p2}</span>
                </div>
              )}
              {(match.set2_p1 || match.set2_p2) && (
                <div className="flex justify-between">
                  <span>Set 2:</span>
                  <span>{match.set2_p1} - {match.set2_p2}</span>
                </div>
              )}
              {(match.set3_p1 || match.set3_p2) && (
                <div className="flex justify-between">
                  <span>Set 3:</span>
                  <span>{match.set3_p1} - {match.set3_p2}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Consultar Partidos por Zonas
            </div>
            <div className="flex items-center gap-2">
              {cacheInfo.hasCache && (
                <Badge variant={cacheInfo.isValid ? "default" : "secondary"}>
                  <Clock className="w-3 h-3 mr-1" />
                  Caché: {cacheInfo.ageMinutes}min
                </Badge>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearCache}
                disabled={!cacheInfo.hasCache}
              >
                Limpiar Caché
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spreadsheet-input">ID o URL de Google Sheets</Label>
            <Input
              id="spreadsheet-input"
              placeholder="1ABC123def456... o https://docs.google.com/spreadsheets/d/1ABC123def456..."
              value={spreadsheetId}
              onChange={(e) => handleSpreadsheetChange(e.target.value)}
            />
          </div>

          <Button 
            onClick={loadZonesData} 
            disabled={loading || !spreadsheetId}
            className="w-full"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Cargando datos...' : 'Cargar Partidos por Zonas'}
          </Button>

          {cacheInfo.hasCache && (
            <div className="bg-muted p-3 rounded-lg text-sm">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" />
                <strong>Estado del Caché:</strong>
              </div>
              <div>
                Edad: {cacheInfo.ageMinutes} minutos | 
                Estado: {cacheInfo.isValid ? 'Válido' : 'Expirado'} |
                Próxima expiración: {cacheInfo.isValid ? `${5 - cacheInfo.ageMinutes} minutos` : 'Ya expirado'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {Object.keys(zonesData).length > 0 && (
        <div className="space-y-6">
          {Object.entries(zonesData).map(([zoneName, matches]) => (
            <Card key={zoneName}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{zoneName}</span>
                  <Badge variant="outline">
                    {matches.length} partidos
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {matches.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No hay partidos en esta zona
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matches.map((match, index) => renderMatchCard(match, index))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {Object.keys(zonesData).length === 0 && spreadsheetId && !loading && (
        <Card>
          <CardContent className="py-8 text-center">
            <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron datos</h3>
            <p className="text-muted-foreground">
              No se pudieron cargar partidos desde Google Sheets. 
              Verifica que el ID sea correcto y que las hojas tengan el formato esperado.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};