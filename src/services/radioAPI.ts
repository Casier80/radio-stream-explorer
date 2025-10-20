import type { RadioStation, Country } from '@/types/radio';

const BASE_URL = 'https://de1.api.radio-browser.info/json';

export class RadioAPI {
  private static async fetchWithUserAgent(url: string): Promise<Response> {
    return fetch(url);
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
    return stations
      .filter(station => station.url_resolved && station.lastcheckok === 1)
      .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }

  private static countryTranslations: { [key: string]: string } = {
    'Afghanistan': 'Afganistán',
    'Albania': 'Albania',
    'Algeria': 'Argelia',
    'American Samoa': 'Samoa Americana',
    'Andorra': 'Andorra',
    'Angola': 'Angola',
    'Anguilla': 'Anguila',
    'Antarctica': 'Antártida',
    'Antigua And Barbuda': 'Antigua y Barbuda',
    'Argentina': 'Argentina',
    'Armenia': 'Armenia',
    'Aruba': 'Aruba',
    'Australia': 'Australia',
    'Austria': 'Austria',
    'Azerbaijan': 'Azerbaiyán',
    'The Bahamas': 'Bahamas',
    'Bahrain': 'Baréin',
    'Bangladesh': 'Bangladés',
    'Barbados': 'Barbados',
    'Belarus': 'Bielorrusia',
    'Belgium': 'Bélgica',
    'Belize': 'Belice',
    'Benin': 'Benín',
    'Bermuda': 'Bermudas',
    'Bhutan': 'Bután',
    'Bolivia': 'Bolivia',
    'Bonaire': 'Bonaire',
    'Bosnia And Herzegovina': 'Bosnia y Herzegovina',
    'Botswana': 'Botsuana',
    'Brazil': 'Brasil',
    'British Indian Ocean Territory': 'Territorio Británico del Océano Índico',
    'Brunei Darussalam': 'Brunéi',
    'Bulgaria': 'Bulgaria',
    'Burkina Faso': 'Burkina Faso',
    'Burundi': 'Burundi',
    'Cabo Verde': 'Cabo Verde',
    'Cambodia': 'Camboya',
    'Cameroon': 'Camerún',
    'Canada': 'Canadá',
    'The Cayman Islands': 'Islas Caimán',
    'The Central African Republic': 'República Centroafricana',
    'Chad': 'Chad',
    'Chile': 'Chile',
    'China': 'China',
    'Christmas Island': 'Isla de Navidad',
    'The Cocos Keeling Islands': 'Islas Cocos',
    'Colombia': 'Colombia',
    'The Comoros': 'Comoras',
    'The Congo': 'Congo',
    'The Democratic Republic Of The Congo': 'República Democrática del Congo',
    'The Cook Islands': 'Islas Cook',
    'Costa Rica': 'Costa Rica',
    'Coted Ivoire': 'Costa de Marfil',
    'Croatia': 'Croacia',
    'Cuba': 'Cuba',
    'Curacao': 'Curazao',
    'Cyprus': 'Chipre',
    'Czechia': 'República Checa',
    'Denmark': 'Dinamarca',
    'Djibouti': 'Yibuti',
    'Dominica': 'Dominica',
    'The Dominican Republic': 'República Dominicana',
    'Ecuador': 'Ecuador',
    'Egypt': 'Egipto',
    'El Salvador': 'El Salvador',
    'Equatorial Guinea': 'Guinea Ecuatorial',
    'Eritrea': 'Eritrea',
    'Estonia': 'Estonia',
    'Ethiopia': 'Etiopía',
    'The Falkland Islands Malvinas': 'Islas Malvinas',
    'The Faroe Islands': 'Islas Feroe',
    'Fiji': 'Fiyi',
    'Finland': 'Finlandia',
    'France': 'Francia',
    'French Guiana': 'Guayana Francesa',
    'French Polynesia': 'Polinesia Francesa',
    'Gabon': 'Gabón',
    'The Gambia': 'Gambia',
    'Georgia': 'Georgia',
    'Germany': 'Alemania',
    'Ghana': 'Ghana',
    'Gibraltar': 'Gibraltar',
    'Greece': 'Grecia',
    'Greenland': 'Groenlandia',
    'Grenada': 'Granada',
    'Guadeloupe': 'Guadalupe',
    'Guam': 'Guam',
    'Guatemala': 'Guatemala',
    'Guernsey': 'Guernsey',
    'Guinea': 'Guinea',
    'Guinea Bissau': 'Guinea-Bisáu',
    'Guyana': 'Guyana',
    'Haiti': 'Haití',
    'Honduras': 'Honduras',
    'Hong Kong': 'Hong Kong',
    'Hungary': 'Hungría',
    'Iceland': 'Islandia',
    'India': 'India',
    'Indonesia': 'Indonesia',
    'Islamic Republic Of Iran': 'Irán',
    'Iraq': 'Irak',
    'Ireland': 'Irlanda',
    'Isle Of Man': 'Isla de Man',
    'Israel': 'Israel',
    'Italy': 'Italia',
    'Jamaica': 'Jamaica',
    'Japan': 'Japón',
    'Jordan': 'Jordania',
    'Kazakhstan': 'Kazajistán',
    'Kenya': 'Kenia',
    'Kiribati': 'Kiribati',
    'The Democratic Peoples Republic Of Korea': 'Corea del Norte',
    'The Republic Of Korea': 'Corea del Sur',
    'Kuwait': 'Kuwait',
    'Kyrgyzstan': 'Kirguistán',
    'The Lao Peoples Democratic Republic': 'Laos',
    'Latvia': 'Letonia',
    'Lebanon': 'Líbano',
    'Lesotho': 'Lesoto',
    'Liberia': 'Liberia',
    'Libya': 'Libia',
    'Liechtenstein': 'Liechtenstein',
    'Lithuania': 'Lituania',
    'Luxembourg': 'Luxemburgo',
    'Macao': 'Macao',
    'Republic Of North Macedonia': 'Macedonia del Norte',
    'Madagascar': 'Madagascar',
    'Malawi': 'Malaui',
    'Malaysia': 'Malasia',
    'Maldives': 'Maldivas',
    'Mali': 'Malí',
    'Malta': 'Malta',
    'The Marshall Islands': 'Islas Marshall',
    'Martinique': 'Martinica',
    'Mauritania': 'Mauritania',
    'Mauritius': 'Mauricio',
    'Mexico': 'México',
    'Federated States Of Micronesia': 'Micronesia',
    'The Republic Of Moldova': 'Moldavia',
    'Monaco': 'Mónaco',
    'Mongolia': 'Mongolia',
    'Montenegro': 'Montenegro',
    'Montserrat': 'Montserrat',
    'Morocco': 'Marruecos',
    'Mozambique': 'Mozambique',
    'Myanmar': 'Birmania',
    'Namibia': 'Namibia',
    'Nauru': 'Nauru',
    'Nepal': 'Nepal',
    'The Netherlands': 'Países Bajos',
    'New Caledonia': 'Nueva Caledonia',
    'New Zealand': 'Nueva Zelanda',
    'Nicaragua': 'Nicaragua',
    'The Niger': 'Níger',
    'Nigeria': 'Nigeria',
    'Niue': 'Niue',
    'Norway': 'Noruega',
    'Oman': 'Omán',
    'Pakistan': 'Pakistán',
    'Panama': 'Panamá',
    'Papua New Guinea': 'Papúa Nueva Guinea',
    'Paraguay': 'Paraguay',
    'Peru': 'Perú',
    'The Philippines': 'Filipinas',
    'Poland': 'Polonia',
    'Portugal': 'Portugal',
    'Qatar': 'Catar',
    'Romania': 'Rumania',
    'Russian Federation': 'Rusia',
    'Rwanda': 'Ruanda',
    'Saint Kitts And Nevis': 'San Cristóbal y Nieves',
    'Saint Lucia': 'Santa Lucía',
    'Saint Pierre And Miquelon': 'San Pedro y Miquelón',
    'Saint Vincent And The Grenadines': 'San Vicente y las Granadinas',
    'Samoa': 'Samoa',
    'San Marino': 'San Marino',
    'Sao Tome And Principe': 'Santo Tomé y Príncipe',
    'Saudi Arabia': 'Arabia Saudí',
    'Senegal': 'Senegal',
    'Serbia': 'Serbia',
    'Seychelles': 'Seychelles',
    'Sierra Leone': 'Sierra Leona',
    'Singapore': 'Singapur',
    'Slovakia': 'Eslovaquia',
    'Slovenia': 'Eslovenia',
    'Solomon Islands': 'Islas Salomón',
    'Somalia': 'Somalia',
    'South Africa': 'Sudáfrica',
    'South Sudan': 'Sudán del Sur',
    'Spain': 'España',
    'Sri Lanka': 'Sri Lanka',
    'Sudan': 'Sudán',
    'Suriname': 'Surinam',
    'Sweden': 'Suecia',
    'Switzerland': 'Suiza',
    'Syrian Arab Republic': 'Siria',
    'Taiwan': 'Taiwán',
    'Tajikistan': 'Tayikistán',
    'Tanzania': 'Tanzania',
    'Thailand': 'Tailandia',
    'Timor Leste': 'Timor Oriental',
    'Togo': 'Togo',
    'Tonga': 'Tonga',
    'Trinidad And Tobago': 'Trinidad y Tobago',
    'Tunisia': 'Túnez',
    'Turkey': 'Turquía',
    'Turkmenistan': 'Turkmenistán',
    'Tuvalu': 'Tuvalu',
    'Uganda': 'Uganda',
    'Ukraine': 'Ucrania',
    'The United Arab Emirates': 'Emiratos Árabes Unidos',
    'The United Kingdom Of Great Britain And Northern Ireland': 'Reino Unido',
    'United States Of America': 'Estados Unidos',
    'Uruguay': 'Uruguay',
    'Uzbekistan': 'Uzbekistán',
    'Vanuatu': 'Vanuatu',
    'Vatican City State': 'Ciudad del Vaticano',
    'Venezuela': 'Venezuela',
    'Viet Nam': 'Vietnam',
    'Yemen': 'Yemen',
    'Zambia': 'Zambia',
    'Zimbabwe': 'Zimbabue',
    'Aland Islands': 'Islas Åland'
  };

  static async getCountries(): Promise<Country[]> {
    console.log('🌍 Iniciando carga de países...');
    // Intento robusto: probar múltiples mirrors y dos endpoints (/countries y /countrycodes)
    const MIRRORS = [
      BASE_URL,
      'https://api.radio-browser.info/json',
      'https://nl1.api.radio-browser.info/json',
      'https://fr1.api.radio-browser.info/json',
      'https://us1.api.radio-browser.info/json',
    ];

    let countries: any[] = [];

    for (const base of MIRRORS) {
      try {
        console.log(`🔍 Probando mirror: ${base}`);
        // 1) /countries
        const resMain = await this.fetchWithUserAgent(`${base}/countries`);
        console.log(`📡 Respuesta /countries: ${resMain.status}`);
        if (resMain.ok) {
          const data = await resMain.json();
          console.log(`✅ Datos recibidos: ${data?.length || 0} países`);
          if (Array.isArray(data) && data.length > 0) {
            countries = data;
            break;
          }
        }

        // 2) Fallback /countrycodes
        console.log(`🔄 Probando fallback /countrycodes`);
        const resFallback = await this.fetchWithUserAgent(`${base}/countrycodes`);
        console.log(`📡 Respuesta /countrycodes: ${resFallback.status}`);
        if (resFallback.ok) {
          const data2 = await resFallback.json();
          console.log(`✅ Datos fallback: ${data2?.length || 0} países`);
          if (Array.isArray(data2) && data2.length > 0) {
            countries = data2;
            break;
          }
        }
      } catch (err) {
        console.error(`❌ Mirror falló (${base}):`, err);
      }
    }

    // Si no se pudieron obtener desde la API, usar fallback local
    if (!Array.isArray(countries) || countries.length === 0) {
      console.log('⚠️ No se obtuvieron países de la API, usando fallback local...');
      try {
        const local = await fetch('/countries-fallback.json');
        console.log(`📁 Fallback local status: ${local.status}`);
        if (local.ok) {
          const localData = await local.json();
          console.log(`✅ Fallback local: ${localData?.length || 0} países`);
          if (Array.isArray(localData) && localData.length > 0) {
            countries = localData;
          }
        }
      } catch (e) {
        console.error('❌ Fallback local de países falló:', e);
      }
    }

    if (!Array.isArray(countries) || countries.length === 0) {
      console.error('❌ No se pudieron obtener países de ninguna fuente');
      throw new Error('No se pudieron obtener países. Verifica tu conexión a internet.');
    }

    console.log(`✅ Total de países antes de procesar: ${countries.length}`);

    // Combinar países duplicados sumando sus stationcount
    const countryMap = new Map<string, Country>();

    countries.forEach((country: any) => {
      const name = country?.name as string;
      const stationcount = Number(country?.stationcount || 0);
      const iso = (country?.iso_3166_1 as string) || (country?.iso_3166_2 as string) || (country?.countrycode as string);

      if (name && stationcount > 0) {
        const existing = countryMap.get(name);
        if (existing) {
          existing.stationcount += stationcount;
        } else {
          countryMap.set(name, { name, stationcount, iso_3166_1: iso });
        }
      }
    });

    // Convertir el Map de vuelta a array, mantener nombre original y traducir para mostrar, ordenar
    return Array.from(countryMap.values())
      .map((country) => ({
        ...country,
        originalName: country.name, // Mantener nombre original en inglés para la API
        name: this.countryTranslations[country.name] || country.name, // Nombre traducido para mostrar
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }

  static async recordClick(stationUuid: string): Promise<void> {
    try {
      await this.fetchWithUserAgent(`${BASE_URL}/url/${stationUuid}`);
    } catch (error) {
      console.warn('No se pudo registrar el click:', error);
    }
  }

  static async getRandomStation(): Promise<RadioStation | null> {
    try {
      const response = await this.fetchWithUserAgent(
        `${BASE_URL}/stations/search?limit=1&order=random&hidebroken=true`
      );
      
      if (!response.ok) {
        throw new Error(`Error al obtener emisora aleatoria: ${response.statusText}`);
      }

      const stations: RadioStation[] = await response.json();
      const validStations = stations.filter(
        station => station.url_resolved && station.lastcheckok === 1
      );
      
      return validStations.length > 0 ? validStations[0] : null;
    } catch (error) {
      console.error('Error al obtener emisora aleatoria:', error);
      return null;
    }
  }
}