import type { RadioStation, Country } from '@/types/radio';

const BASE_URL = 'https://de1.api.radio-browser.info/json';

export class RadioAPI {
  private static async fetchWithUserAgent(url: string): Promise<Response> {
    return fetch(url, {
      headers: {
        'User-Agent': 'RadioPlayer/1.0',
      },
    });
  }

  static async searchStations(params: {
    name?: string;
    country?: string;
    query?: string;
    limit?: number;
  }): Promise<RadioStation[]> {
    const searchParams = new URLSearchParams({
      limit: (params.limit || 20).toString(),
      hidebroken: 'true',
      order: 'votes',
      reverse: 'true',
    });

    if (params.query) {
      // Mobile search: búsqueda general en nombre, país y tags
      searchParams.append('name', params.query);
      searchParams.append('country', params.query);
      searchParams.append('tag', params.query);
    } else {
      // Web search: búsqueda específica por campos
      if (params.name) {
        searchParams.append('name', params.name);
      }
      if (params.country) {
        searchParams.append('country', params.country);
      }
    }

    const response = await this.fetchWithUserAgent(
      `${BASE_URL}/stations/search?${searchParams}`
    );
    
    if (!response.ok) {
      throw new Error(`Error al buscar emisoras: ${response.statusText}`);
    }

    const stations: RadioStation[] = await response.json();
    return stations.filter(station => station.url_resolved && station.lastcheckok === 1);
  }

  static async getCountries(): Promise<Country[]> {
    const response = await this.fetchWithUserAgent(`${BASE_URL}/countries`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener países: ${response.statusText}`);
    }

    const countries: Country[] = await response.json();
    
    // Combinar países duplicados sumando sus stationcount
    const countryMap = new Map<string, Country>();
    
    countries.forEach(country => {
      if (country.stationcount > 0) {
        const existing = countryMap.get(country.name);
        if (existing) {
          // Si el país ya existe, sumar las emisoras
          existing.stationcount += country.stationcount;
        } else {
          // Si es la primera vez que vemos este país, agregarlo
          countryMap.set(country.name, { ...country });
        }
      }
    });
    
    // Convertir el Map de vuelta a array y ordenar
    return Array.from(countryMap.values())
      .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }

  static async recordClick(stationUuid: string): Promise<void> {
    try {
      await this.fetchWithUserAgent(`${BASE_URL}/url/${stationUuid}`);
    } catch (error) {
      console.warn('No se pudo registrar el click:', error);
    }
  }
}