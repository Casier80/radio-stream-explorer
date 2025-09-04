import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Heart, HeartOff, Globe, Music, Zap } from 'lucide-react';
import type { RadioStation } from '@/types/radio';

interface StationListProps {
  stations: RadioStation[];
  currentStation: RadioStation | null;
  isPlaying: boolean;
  onPlay: (station: RadioStation) => void;
  onPause: () => void;
  onResume: () => void;
  onToggleFavorite: (station: RadioStation) => boolean;
  isFavorite: (stationId: string) => boolean;
  loading: boolean;
}

export function StationList({
  stations,
  currentStation,
  isPlaying,
  onPlay,
  onPause,
  onResume,
  onToggleFavorite,
  isFavorite,
  loading
}: StationListProps) {
  if (stations.length === 0) {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <p className="text-muted-foreground">
          No se encontraron emisoras. Prueba con otros términos de búsqueda.
        </p>
      </div>
    );
  }

  const formatBitrate = (bitrate: number) => {
    return bitrate > 0 ? `${bitrate} kbps` : 'Desconocido';
  };

  const formatLanguage = (language: string) => {
    return language || 'No especificado';
  };

  return (
    <section aria-labelledby="stations-heading">
      <h2 id="stations-heading" className="text-lg font-semibold mb-4">
        Emisoras Encontradas ({stations.length})
      </h2>
      
      <div 
        className="space-y-3"
        role="list"
        aria-label={`Lista de ${stations.length} emisoras de radio`}
      >
        {stations.map((station) => {
          const isCurrentStation = currentStation?.stationuuid === station.stationuuid;
          const isFav = isFavorite(station.stationuuid);
          
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
                          <span>Idioma: {formatLanguage(station.language)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                        <span>Calidad: {formatBitrate(station.bitrate)}</span>
                      </div>
                      
                      {station.tags && (
                        <div className="text-xs">
                          <span>Géneros: {station.tags}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleFavorite(station)}
                      aria-label={`${isFav ? 'Quitar de' : 'Agregar a'} favoritos: ${station.name}`}
                      className="p-2"
                    >
                      {isFav ? (
                        <HeartOff className="h-4 w-4 text-destructive" aria-hidden="true" />
                      ) : (
                        <Heart className="h-4 w-4" aria-hidden="true" />
                      )}
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
    </section>
  );
}