import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, Play, Pause, Trash2 } from 'lucide-react';
import type { RadioStation } from '@/types/radio';

interface RecentStationsProps {
  recentStations: RadioStation[];
  currentStation: RadioStation | null;
  isPlaying: boolean;
  onPlay: (station: RadioStation) => void;
  onPause: () => void;
  onResume: () => void;
  onClear: () => void;
  loading: boolean;
}

export function RecentStations({
  recentStations,
  currentStation,
  isPlaying,
  onPlay,
  onPause,
  onResume,
  onClear,
  loading,
}: RecentStationsProps) {
  if (recentStations.length === 0) {
    return null;
  }

  const handlePlayPause = (station: RadioStation) => {
    if (currentStation?.stationuuid === station.stationuuid) {
      if (isPlaying) {
        onPause();
      } else {
        onResume();
      }
    } else {
      onPlay(station);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" aria-hidden="true" />
            Emisoras Recientes
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            aria-label="Limpiar historial de emisoras recientes"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentStations.map((station) => {
            const isCurrentStation = currentStation?.stationuuid === station.stationuuid;
            const showPlay = !isCurrentStation || !isPlaying;

            return (
              <div
                key={station.stationuuid}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePlayPause(station)}
                  disabled={loading}
                  aria-label={
                    showPlay 
                      ? `Reproducir ${station.name}` 
                      : `Pausar ${station.name}`
                  }
                  className="shrink-0 min-h-[44px] touch-manipulation"
                >
                  {showPlay ? (
                    <Play className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Pause className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {station.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {station.country}
                  </p>
                </div>

                {isCurrentStation && (
                  <div 
                    className="w-2 h-2 bg-primary rounded-full animate-pulse"
                    aria-label="Reproduciendo actualmente"
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}