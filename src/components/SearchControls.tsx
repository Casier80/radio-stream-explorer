import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Loader2, Shuffle } from 'lucide-react';
import type { Country } from '@/types/radio';
import { RadioAPI } from '@/services/radioAPI';

interface SearchControlsProps {
  onSearch: (params: { name?: string; country?: string; query?: string }) => void;
  isSearching: boolean;
  onRandomStation: () => void;
}

export function SearchControls({ onSearch, isSearching, onRandomStation }: SearchControlsProps) {
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [countryError, setCountryError] = useState(false);
  const [query, setQuery] = useState('');

  // Detect if running on mobile/Capacitor
  const isMobile = typeof window !== 'undefined' && 
    (window.location.href.includes('capacitor://') || 
     /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  useEffect(() => {
    if (!isMobile) {
      const loadCountries = async () => {
        try {
          const countryList = await RadioAPI.getCountries();
          setCountries(countryList);
          setCountryError(false);
        } catch (error) {
          console.error('Error al cargar países:', error);
          setCountryError(true);
        } finally {
          setLoadingCountries(false);
        }
      };

      loadCountries();
    }
  }, [isMobile]);

  const handleSearch = () => {
    if (isMobile) {
      onSearch({
        query: query.trim() || undefined,
      });
    } else {
      onSearch({
        name: name.trim() || undefined,
        country: selectedCountry && selectedCountry !== 'all' ? selectedCountry : undefined,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section 
      className="space-y-4 p-4 bg-card border rounded-lg"
      aria-labelledby="search-heading"
    >
      <h2 id="search-heading" className="text-lg font-semibold">
        Búsqueda de Emisoras
      </h2>
      
      {isMobile ? (
        // Mobile/Android interface - simple search
        <div className="space-y-2">
          <Label htmlFor="search-query">Buscar emisoras</Label>
          <Input
            id="search-query"
            type="text"
            placeholder="Buscar por nombre, país o género..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-describedby="search-help"
            className="min-h-[44px] text-lg"
          />
          <div id="search-help" className="sr-only">
            Busca emisoras por nombre, país o género musical
          </div>
        </div>
      ) : (
        // Web interface - with country dropdown
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="station-name">Nombre de la emisora</Label>
            <Input
              id="station-name"
              type="text"
              placeholder="Buscar por nombre..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-describedby="name-help"
            />
            <div id="name-help" className="sr-only">
              Escribe el nombre de la emisora que quieres buscar
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country-select">País</Label>
            <Select
              value={selectedCountry}
              onValueChange={setSelectedCountry}
              disabled={loadingCountries}
            >
              <SelectTrigger id="country-select" aria-describedby="country-help">
                <SelectValue placeholder={loadingCountries ? "Cargando países..." : "Selecciona un país"} />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border shadow-lg z-50">
                <SelectItem value="all">Todos los países</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.iso_3166_1 || country.originalName || country.name} value={country.originalName || country.name}>
                    {country.name} ({country.stationcount} emisoras)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {countryError && (
              <p className="text-xs text-muted-foreground">
                Lista de países cargada desde caché local
              </p>
            )}
            <div id="country-help" className="sr-only">
              Filtra las emisoras por país
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="flex-1 md:flex-initial md:w-auto"
          aria-describedby="search-button-help"
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" aria-hidden="true" />
              Buscar Emisoras
            </>
          )}
        </Button>
        
        <Button
          onClick={onRandomStation}
          disabled={isSearching}
          variant="secondary"
          className="flex-1 md:flex-initial md:w-auto"
          aria-label="Reproducir emisora aleatoria"
        >
          <Shuffle className="mr-2 h-4 w-4" aria-hidden="true" />
          Aleatoria
        </Button>
      </div>
      <div id="search-button-help" className="sr-only">
        Presiona Enter en los campos de búsqueda o usa este botón para buscar emisoras
      </div>
    </section>
  );
}