import { useState, useRef, useCallback, useEffect } from 'react';
import type { RadioStation, PlaybackState } from '@/types/radio';
import { RadioAPI } from '@/services/radioAPI';

export const useRadioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentStation: null,
    volume: 0.5,
    error: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playbackState.volume;
    }
  }, [playbackState.volume]);

  const play = useCallback(async (station: RadioStation) => {
    try {
      setLoading(true);
      setPlaybackState(prev => ({ ...prev, error: null }));

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = station.url_resolved;
        
        await new Promise((resolve, reject) => {
          const audio = audioRef.current!;
          
          const onCanPlay = () => {
            audio.removeEventListener('canplay', onCanPlay);
            audio.removeEventListener('error', onError);
            resolve(void 0);
          };
          
          const onError = () => {
            audio.removeEventListener('canplay', onCanPlay);
            audio.removeEventListener('error', onError);
            reject(new Error(`No se pudo cargar la emisora: ${station.name}`));
          };
          
          audio.addEventListener('canplay', onCanPlay);
          audio.addEventListener('error', onError);
          
          audio.load();
        });

        await audioRef.current.play();
        
        // Record click for statistics
        RadioAPI.recordClick(station.stationuuid);
        
        setPlaybackState(prev => ({
          ...prev,
          isPlaying: true,
          currentStation: station,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al reproducir';
      setPlaybackState(prev => ({
        ...prev,
        error: errorMessage,
        isPlaying: false,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setPlaybackState(prev => ({
      ...prev,
      isPlaying: false,
      currentStation: null,
      error: null,
    }));
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlaybackState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resume = useCallback(async () => {
    if (audioRef.current && playbackState.currentStation) {
      try {
        await audioRef.current.play();
        setPlaybackState(prev => ({ ...prev, isPlaying: true, error: null }));
      } catch (error) {
        setPlaybackState(prev => ({
          ...prev,
          error: 'No se pudo reanudar la reproducción',
        }));
      }
    }
  }, [playbackState.currentStation]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setPlaybackState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  return {
    audioRef,
    playbackState,
    loading,
    play,
    stop,
    pause,
    resume,
    setVolume,
  };
};