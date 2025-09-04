import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Play, Pause, HeartOff, ChevronDown, ChevronRight, Globe, Music, Zap } from 'lucide-react';
import { useState } from 'react';
import type { RadioStation } from '@/types/radio';

interface FavoritesListProps {
  favorites: RadioStation[];
  currentStation: RadioStation | null;
  isPlaying: boolean;
  onPlay: (station: RadioStation) => void;
  onPause: () => void;
  onResume: () => void;
  onRemoveFromFavorites: (stationId: string) => void;
  loading: boolean;
}

export function FavoritesList({
  favorites,
  currentStation,
  isPlaying,
  onPlay,
  onPause,
  onResume,
  onRemoveFromFavorites,
  loading
}: FavoritesListProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (favorites.length === 0) {
    return (
      <section aria-labelledby="favorites-heading">
        <h2 id="favorites-heading" className="text-lg font-semibold mb-4">
          Emisoras Favoritas
        </h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No tienes emisoras favoritas aún.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Usa el botón de corazón en las emisoras para agregarlas a favoritos.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section aria-labelledby="favorites-heading">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-0 h-auto"
            aria-expanded={isOpen}
            aria-controls="favorites-content"
          >
            <h2 id="favorites-heading" className="text-lg font-semibold">
              Emisoras Favoritas ({favorites.length})
            </h2>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent 
          id="favorites-content"
          className="space-y-3 mt-4"
        >
          <div 
            role="list"
            aria-label={`Lista de ${favorites.length} emisoras favoritas`}
          >
            {favorites.map((station) => {
              const isCurrentStation = currentStation?.stationuuid === station.stationuuid;
              
              return (
                <Card 
                  key={station.stationuuid}
                  className={`transition-colors ${
                    isCurrentStation 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  role="listitem"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1 truncate">
                          {station.name}
                        </h3>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                            <span>{station.country}</span>
                          </div>
                          
                          {station.language && (
                            <div className="flex items-center gap-2">
                              <Music className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                              <span>Idioma: {station.language}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Zap className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                            <span>Calidad: {station.bitrate > 0 ? `${station.bitrate} kbps` : 'Desconocido'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRemoveFromFavorites(station.stationuuid)}
                          aria-label={`Quitar de favoritos: ${station.name}`}
                          className="p-2"
                        >
                          <HeartOff className="h-4 w-4 text-destructive" aria-hidden="true" />
                        </Button>

                        <Button
                          variant={isCurrentStation ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (isCurrentStation && isPlaying) {
                              onPause();
                            } else if (isCurrentStation && !isPlaying) {
                              onResume();
                            } else {
                              onPlay(station);
                            }
                          }}
                          disabled={loading}
                          aria-label={
                            isCurrentStation && isPlaying
                              ? `Pausar ${station.name}`
                              : `Reproducir ${station.name}`
                          }
                          className="min-w-[100px]"
                        >
                          {isCurrentStation && isPlaying ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" aria-hidden="true" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                              {isCurrentStation ? 'Reanudar' : 'Reproducir'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}