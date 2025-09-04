import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Volume2, VolumeX, Globe, Music, Zap } from 'lucide-react';
import type { PlaybackState } from '@/types/radio';

interface PlayerControlsProps {
  playbackState: PlaybackState;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
  loading: boolean;
}

export function PlayerControls({
  playbackState,
  onPause,
  onResume,
  onStop,
  onVolumeChange,
  loading
}: PlayerControlsProps) {
  const { isPlaying, currentStation, volume, error } = playbackState;

  const handleVolumeChange = (values: number[]) => {
    onVolumeChange(values[0] / 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (isPlaying) {
        onPause();
      } else if (currentStation) {
        onResume();
      }
    }
  };

  return (
    <section aria-labelledby="player-heading">
      <h2 id="player-heading" className="text-lg font-semibold mb-4">
        Reproductor
      </h2>
      
      <Card>
        <CardContent className="p-6">
          {/* Current Station Info */}
          {currentStation ? (
            <div className="mb-6" role="region" aria-labelledby="current-station">
              <h3 id="current-station" className="font-medium text-lg mb-2">
                {currentStation.name}
              </h3>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  <span>{currentStation.country}</span>
                </div>
                
                {currentStation.language && (
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4" aria-hidden="true" />
                    <span>Idioma: {currentStation.language}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" aria-hidden="true" />
                  <span>Calidad: {currentStation.bitrate > 0 ? `${currentStation.bitrate} kbps` : 'Desconocido'}</span>
                </div>
                
                {currentStation.tags && (
                  <div>
                    <span>Géneros: {currentStation.tags}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-6 text-center py-4">
              <p className="text-muted-foreground">
                No hay ninguna emisora seleccionada
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Selecciona una emisora de la lista para comenzar a escuchar
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div 
              className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md"
              role="alert"
              aria-live="assertive"
            >
              <p className="text-destructive font-medium">Error:</p>
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Playback Status */}
          <div className="mb-4" role="status" aria-live="polite">
            <span className="sr-only">
              Estado de reproducción: {isPlaying ? 'Reproduciendo' : 'Pausado'}
            </span>
            <div className="flex items-center gap-2 text-sm">
              <div 
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? 'bg-radio-playing' : 'bg-radio-stopped'
                }`}
                aria-hidden="true"
              />
              <span className={isPlaying ? 'text-radio-playing' : 'text-radio-stopped'}>
                {loading ? 'Cargando...' : isPlaying ? 'Reproduciendo' : 'Pausado'}
              </span>
            </div>
          </div>

          {/* Playback Controls */}
          <div 
            className="flex items-center justify-center gap-4 mb-6"
            role="group" 
            aria-label="Controles de reproducción"
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={isPlaying ? onPause : onResume}
              disabled={!currentStation || loading}
              aria-label={isPlaying ? 'Pausar reproducción' : 'Reanudar reproducción'}
              className="min-w-[120px]"
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-5 w-5" aria-hidden="true" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" aria-hidden="true" />
                  {currentStation ? 'Reanudar' : 'Reproducir'}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onStop}
              disabled={!currentStation}
              aria-label="Detener reproducción"
            >
              <Square className="mr-2 h-4 w-4" aria-hidden="true" />
              Detener
            </Button>
          </div>

          {/* Volume Control */}
          <div className="space-y-2" role="group" aria-labelledby="volume-label">
            <div className="flex items-center justify-between">
              <label id="volume-label" className="text-sm font-medium">
                Volumen: {Math.round(volume * 100)}%
              </label>
              <div className="flex items-center gap-2">
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
              </div>
            </div>
            
            <Slider
              value={[volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={5}
              className="w-full"
              aria-label="Control de volumen"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(volume * 100)}
              aria-valuetext={`Volumen al ${Math.round(volume * 100)} por ciento`}
            />
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="mt-4 pt-4 border-t border-border">
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground transition-colors">
                Atajos de teclado
              </summary>
              <div className="mt-2 space-y-1">
                <p>• Espacio: Reproducir/Pausar</p>
                <p>• Tab: Navegar entre controles</p>
                <p>• Enter: Activar botón seleccionado</p>
                <p>• Flechas: Ajustar volumen cuando el control está enfocado</p>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}