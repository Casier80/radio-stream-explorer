import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRadioPlayer } from '@/hooks/useRadioPlayer';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecentStations } from '@/hooks/useRecentStations';
import { SearchControls } from '@/components/SearchControls';
import { StationList } from '@/components/StationList';
import { PlayerControls } from '@/components/PlayerControls';
import { FavoritesList } from '@/components/FavoritesList';
import { RecentStations } from '@/components/RecentStations';
import { InstallPWA } from '@/components/InstallPWA';
import { RadioAPI } from '@/services/radioAPI';
import type { RadioStation } from '@/types/radio';
import radioLogo from '@/assets/radio-logo.png';

const Index = () => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const STATIONS_PER_PAGE = 50;
  
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

  const {
    recentStations,
    addToRecent,
    clearRecent,
  } = useRecentStations();

  const handleSearch = async (params: { name?: string; country?: string; query?: string }) => {
    if (!params.name && !params.country && !params.query) {
      toast({
        title: "Búsqueda vacía",
        description: "Por favor ingresa un término de búsqueda.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setCurrentPage(1); // Reset to first page on new search
    try {
      const results = await RadioAPI.searchStations({
        ...params,
        limit: 1000, // Get more results for pagination
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
      // Agregar a emisoras recientes cuando se reproduce exitosamente
      addToRecent(station);
      toast({
        title: "Reproduciendo",
        description: `Conectando a ${station.name}...`,
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleRandomStation = async () => {
    setIsSearching(true);
    try {
      const randomStation = await RadioAPI.getRandomStation();
      
      if (randomStation) {
        await handlePlay(randomStation);
        toast({
          title: "Emisora aleatoria",
          description: `Reproduciendo ${randomStation.name} de ${randomStation.country}`,
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo encontrar una emisora aleatoria. Intenta de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo obtener una emisora aleatoria.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* PWA Install Button */}
      <InstallPWA />
      
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" aria-hidden="true" />
      
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Main heading */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src={radioLogo} 
              alt="Logo de la aplicación de radio"
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-3xl font-bold">
              Reproductor de Radio Online
            </h1>
          </div>
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
              onRandomStation={handleRandomStation}
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
                currentPage={currentPage}
                stationsPerPage={STATIONS_PER_PAGE}
                totalStations={stations.length}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          {/* Right column: Player, recent stations and favorites */}
          <div className="space-y-6">
            <PlayerControls
              playbackState={playbackState}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              onVolumeChange={setVolume}
              loading={playerLoading}
            />
            
            <RecentStations
              recentStations={recentStations}
              currentStation={playbackState.currentStation}
              isPlaying={playbackState.isPlaying}
              onPlay={handlePlay}
              onPause={pause}
              onResume={resume}
              onClear={clearRecent}
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
