import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRadioPlayer } from '@/hooks/useRadioPlayer';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchControls } from '@/components/SearchControls';
import { StationList } from '@/components/StationList';
import { PlayerControls } from '@/components/PlayerControls';
import { FavoritesList } from '@/components/FavoritesList';
import { RadioAPI } from '@/services/radioAPI';
import type { RadioStation } from '@/types/radio';

const Index = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  
  const {
    audioRef,
    playbackState,
    loading: playerLoading,
    play,
    stop,
    pause,
    resume,
    setVolume,
  } = useRadioPlayer();

  const {
    favorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const handleSearch = async (params: { name?: string; country?: string }) => {
    if (!params.name && !params.country) {
      toast({
        title: "Búsqueda vacía",
        description: "Por favor ingresa un nombre de emisora o selecciona un país.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const results = await RadioAPI.searchStations({
        ...params,
        limit: 50,
      });
      
      setStations(results);
      
      // Announce results to screen readers
      const message = results.length === 0 
        ? "No se encontraron emisoras con los criterios de búsqueda."
        : `Se encontraron ${results.length} emisoras.`;
      
      toast({
        title: "Búsqueda completada",
        description: message,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast({
        title: "Error en la búsqueda",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleFavorite = (station: RadioStation) => {
    const wasAdded = toggleFavorite(station);
    toast({
      title: wasAdded ? "Agregado a favoritos" : "Quitado de favoritos",
      description: `${station.name} ${wasAdded ? 'se agregó a' : 'se quitó de'} tus favoritos.`,
    });
    return wasAdded;
  };

  const handlePlay = async (station: RadioStation) => {
    try {
      await play(station);
      toast({
        title: "Reproduciendo",
        description: `Conectando a ${station.name}...`,
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" aria-hidden="true" />
      
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Main heading */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Reproductor de Radio Online
          </h1>
          <p className="text-muted-foreground">
            Descubre y escucha emisoras de radio de todo el mundo
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Search and stations */}
          <div className="lg:col-span-2 space-y-6">
            <SearchControls 
              onSearch={handleSearch} 
              isSearching={isSearching} 
            />
            
            {stations.length > 0 && (
              <StationList
                stations={stations}
                currentStation={playbackState.currentStation}
                isPlaying={playbackState.isPlaying}
                onPlay={handlePlay}
                onPause={pause}
                onResume={resume}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
                loading={playerLoading}
              />
            )}
          </div>

          {/* Right column: Player and favorites */}
          <div className="space-y-6">
            <PlayerControls
              playbackState={playbackState}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              onVolumeChange={setVolume}
              loading={playerLoading}
            />
            
            <FavoritesList
              favorites={favorites}
              currentStation={playbackState.currentStation}
              isPlaying={playbackState.isPlaying}
              onPlay={handlePlay}
              onPause={pause}
              onResume={resume}
              onRemoveFromFavorites={removeFromFavorites}
              loading={playerLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
