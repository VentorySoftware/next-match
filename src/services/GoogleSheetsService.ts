import { supabase } from '@/integrations/supabase/client';

export interface Match {
  pk: string;
  categoria: string;
  zona: string;
  codigoA: string;
  pareja1: string;
  codigoD: string;
  pareja2: string;
  fecha: string;
  hora: string;
  cancha: string;
  set1_p1: string;
  set1_p2: string;
  set2_p1: string;
  set2_p2: string;
  set3_p1?: string;
  set3_p2?: string;
}

export interface ZonesData {
  [key: string]: Match[]; // "Masculino A - Zona A": Match[]
}

interface CacheEntry {
  data: ZonesData;
  timestamp: number;
}

// Caché en memoria con expiración de 5 minutos
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milliseconds
let cache: CacheEntry | null = null;

export class GoogleSheetsService {
  /**
   * Obtiene datos de partidos agrupados por categoría y zona con caché de 5 minutos
   */
  static async getZonesData(spreadsheetId: string): Promise<ZonesData> {
    // Verificar caché
    if (cache && (Date.now() - cache.timestamp) < CACHE_DURATION) {
      console.log('Datos obtenidos desde caché');
      return cache.data;
    }

    console.log('Consultando datos desde Google Sheets...');
    
    try {
      // Intentar leer desde hoja "Partidos Zona" primero
      let zonesData = await this.readFromMainSheet(spreadsheetId);
      
      // Si no existe la hoja principal, leer desde hojas individuales
      if (!zonesData || Object.keys(zonesData).length === 0) {
        zonesData = await this.readFromIndividualSheets(spreadsheetId);
      }

      // Guardar en caché
      cache = {
        data: zonesData,
        timestamp: Date.now()
      };

      return zonesData;
    } catch (error) {
      console.error('Error obteniendo datos de zonas:', error);
      
      // Si hay error y existe caché, devolver caché aunque esté expirado
      if (cache) {
        console.log('Devolviendo caché expirado debido a error');
        return cache.data;
      }
      
      throw error;
    }
  }

  /**
   * Lee datos desde la hoja principal "Partidos Zona"
   */
  private static async readFromMainSheet(spreadsheetId: string): Promise<ZonesData> {
    try {
      const response = await supabase.functions.invoke('google-sheets-import', {
        body: {
          spreadsheetId,
          range: 'Partidos Zona!A:P', // Asumiendo columnas A-P para todos los campos
          action: 'read'
        }
      });

      if (response.error || !response.data?.participants) {
        return {};
      }

      return this.transformToZonesData(response.data.participants);
    } catch (error) {
      console.log('Hoja "Partidos Zona" no encontrada, intentando hojas individuales');
      return {};
    }
  }

  /**
   * Lee datos desde hojas individuales por zona
   */
  private static async readFromIndividualSheets(spreadsheetId: string): Promise<ZonesData> {
    const zonesData: ZonesData = {};
    
    // Lista de posibles hojas de zona (se pueden agregar más según necesidad)
    const possibleSheets = [
      'Masculino A - Zona A',
      'Masculino A - Zona B', 
      'Masculino A - Zona C',
      'Masculino A - Zona D',
      'Femenino A - Zona A',
      'Femenino A - Zona B',
      'Femenino A - Zona C',
      'Femenino A - Zona D',
      'Masculino B - Zona A',
      'Masculino B - Zona B',
      'Femenino B - Zona A',
      'Femenino B - Zona B'
    ];

    // Intentar leer cada hoja posible
    for (const sheetName of possibleSheets) {
      try {
        const response = await supabase.functions.invoke('google-sheets-import', {
          body: {
            spreadsheetId,
            range: `${sheetName}!A:P`,
            action: 'read'
          }
        });

        if (response.data?.participants && response.data.participants.length > 0) {
          const matches = this.transformToMatches(response.data.participants);
          if (matches.length > 0) {
            zonesData[sheetName] = matches;
          }
        }
      } catch (error) {
        // Si la hoja no existe, continuar con la siguiente
        console.log(`Hoja "${sheetName}" no encontrada`);
      }
    }

    return zonesData;
  }

  /**
   * Transforma datos crudos en estructura ZonesData agrupada
   */
  private static transformToZonesData(rawData: any[]): ZonesData {
    const zonesData: ZonesData = {};

    for (const row of rawData) {
      const match = this.transformRowToMatch(row);
      if (match) {
        const key = `${match.categoria} - ${match.zona}`;
        if (!zonesData[key]) {
          zonesData[key] = [];
        }
        zonesData[key].push(match);
      }
    }

    return zonesData;
  }

  /**
   * Transforma datos crudos en array de Match
   */
  private static transformToMatches(rawData: any[]): Match[] {
    const matches: Match[] = [];

    for (const row of rawData) {
      const match = this.transformRowToMatch(row);
      if (match) {
        matches.push(match);
      }
    }

    return matches;
  }

  /**
   * Transforma una fila de datos en objeto Match
   */
  private static transformRowToMatch(row: any): Match | null {
    try {
      // Mapear campos comunes desde Google Sheets
      const match: Match = {
        pk: row.pk || row.id || `${Date.now()}-${Math.random()}`,
        categoria: row.categoria || row.category || '',
        zona: row.zona || row.zone || '',
        codigoA: row.codigoa || row.codigo_a || row.teamACode || '',
        pareja1: row.pareja1 || row.team1 || row.pareja_1 || '',
        codigoD: row.codigod || row.codigo_d || row.teamBCode || '',
        pareja2: row.pareja2 || row.team2 || row.pareja_2 || '',
        fecha: row.fecha || row.date || '',
        hora: row.hora || row.time || '',
        cancha: row.cancha || row.court || '',
        set1_p1: row.set1_p1 || row.set1_team1 || '',
        set1_p2: row.set1_p2 || row.set1_team2 || '',
        set2_p1: row.set2_p1 || row.set2_team1 || '',
        set2_p2: row.set2_p2 || row.set2_team2 || '',
        set3_p1: row.set3_p1 || row.set3_team1 || undefined,
        set3_p2: row.set3_p2 || row.set3_team2 || undefined
      };

      // Validar que tenga al menos los campos esenciales
      if (!match.categoria || !match.zona || !match.pareja1 || !match.pareja2) {
        return null;
      }

      return match;
    } catch (error) {
      console.error('Error transformando fila a Match:', error);
      return null;
    }
  }

  /**
   * Limpia el caché manualmente (útil para testing o reset)
   */
  static clearCache(): void {
    cache = null;
    console.log('Caché limpiado');
  }

  /**
   * Verifica si los datos están en caché y son válidos
   */
  static isCacheValid(): boolean {
    return cache !== null && (Date.now() - cache.timestamp) < CACHE_DURATION;
  }

  /**
   * Obtiene información del estado del caché
   */
  static getCacheInfo(): { hasCache: boolean; isValid: boolean; ageMinutes: number } {
    if (!cache) {
      return { hasCache: false, isValid: false, ageMinutes: 0 };
    }

    const ageMs = Date.now() - cache.timestamp;
    const ageMinutes = Math.floor(ageMs / (60 * 1000));
    const isValid = ageMs < CACHE_DURATION;

    return { hasCache: true, isValid, ageMinutes };
  }
}