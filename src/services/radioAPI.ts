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
    limit?: number;
  }): Promise<RadioStation[]> {
    const searchParams = new URLSearchParams({
      limit: (params.limit || 20).toString(),
      hidebroken: 'true',
      order: 'votes',
      reverse: 'true',
    });

    if (params.name) {
      searchParams.append('name', params.name);
    }
    if (params.country) {
      searchParams.append('country', params.country);
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
    return countries
      .filter(country => country.stationcount > 0)
      .sort((a, b) => b.stationcount - a.stationcount);
  }

  static async recordClick(stationUuid: string): Promise<void> {
    try {
      await this.fetchWithUserAgent(`${BASE_URL}/url/${stationUuid}`);
    } catch (error) {
      console.warn('No se pudo registrar el click:', error);
    }
  }
}