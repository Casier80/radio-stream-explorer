import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Loader2 } from 'lucide-react';
import type { Country } from '@/types/radio';
import { RadioAPI } from '@/services/radioAPI';

interface SearchControlsProps {
  onSearch: (params: { name?: string; country?: string }) => void;
  isSearching: boolean;
}

export function SearchControls({ onSearch, isSearching }: SearchControlsProps) {
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countryList = await RadioAPI.getCountries();
        setCountries(countryList);
      } catch (error) {
        console.error('Error al cargar países:', error);
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  const handleSearch = () => {
    onSearch({
      name: name.trim() || undefined,
      country: selectedCountry && selectedCountry !== 'all' ? selectedCountry : undefined,
    });
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
            <SelectContent className="bg-popover border shadow-lg z-50">
              <SelectItem value="all">Todos los países</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.iso_3166_1} value={country.name}>
                  {country.name} ({country.stationcount} emisoras)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div id="country-help" className="sr-only">
            Filtra las emisoras por país
          </div>
        </div>
      </div>

      <Button
        onClick={handleSearch}
        disabled={isSearching}
        className="w-full md:w-auto"
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
      <div id="search-button-help" className="sr-only">
        Presiona Enter en los campos de búsqueda o usa este botón para buscar emisoras
      </div>
    </section>
  );
}