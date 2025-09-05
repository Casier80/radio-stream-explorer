import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Loader2 } from 'lucide-react';

interface SearchControlsProps {
  onSearch: (params: { query?: string }) => void;
  isSearching: boolean;
}

export function SearchControls({ onSearch, isSearching }: SearchControlsProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch({
      query: query.trim() || undefined,
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