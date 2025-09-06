import { useState, useEffect } from 'react';
import type { RadioStation } from '@/types/radio';

const RECENT_STATIONS_KEY = 'recentStations';
const MAX_RECENT_STATIONS = 5;

export const useRecentStations = () => {
  const [recentStations, setRecentStations] = useState<RadioStation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_STATIONS_KEY);
    if (stored) {
      try {
        setRecentStations(JSON.parse(stored));
      } catch (error) {
        console.error('Error al cargar emisoras recientes:', error);
      }
    }
  }, []);

  const addToRecent = (station: RadioStation) => {
    setRecentStations(prev => {
      // Filtrar la emisora si ya existe para evitar duplicados
      const filtered = prev.filter(s => s.stationuuid !== station.stationuuid);
      
      // Agregar al inicio y limitar a MAX_RECENT_STATIONS
      const updated = [station, ...filtered].slice(0, MAX_RECENT_STATIONS);
      
      // Guardar en localStorage
      localStorage.setItem(RECENT_STATIONS_KEY, JSON.stringify(updated));
      
      return updated;
    });
  };

  const clearRecent = () => {
    setRecentStations([]);
    localStorage.removeItem(RECENT_STATIONS_KEY);
  };

  return {
    recentStations,
    addToRecent,
    clearRecent,
  };
};