import { useState, useEffect } from 'react';
import type { RadioStation } from '@/types/radio';

const FAVORITES_KEY = 'radio-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<RadioStation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
      }
    }
  }, []);

  const addToFavorites = (station: RadioStation) => {
    setFavorites(prev => {
      const updated = [...prev, station];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromFavorites = (stationId: string) => {
    setFavorites(prev => {
      const updated = prev.filter(station => station.stationuuid !== stationId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (stationId: string) => {
    return favorites.some(station => station.stationuuid === stationId);
  };

  const toggleFavorite = (station: RadioStation) => {
    if (isFavorite(station.stationuuid)) {
      removeFromFavorites(station.stationuuid);
      return false;
    } else {
      addToFavorites(station);
      return true;
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
};