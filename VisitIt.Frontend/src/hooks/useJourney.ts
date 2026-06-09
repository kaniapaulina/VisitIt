// src/hooks/useJourneys.ts
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface Journey {
  id: number;
  title: string;
  description: string;
  country: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  distanceKm: number;
  notes: string;
  status: string;
  userName?: string;
}

interface CreateJourneyData {
  title: string;
  description: string;
  country: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  distanceKm: number;
  notes: string;
  status?: string;
}

export const useJourneys = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');
  if (!token) {
    setLoading(false);
    return;
  }


  const fetchJourneys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Journey[]>('/Journeys');
      setJourneys(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch journeys');
      console.error('Error fetching journeys:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createJourney = useCallback(async (data: CreateJourneyData) => {
    try {
      const response = await api.post<Journey>('/Journeys', data);
      setJourneys(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      console.error('Error creating journey:', err);
    }
  }, []);

  const updateJourney = useCallback(async (id: number, data: CreateJourneyData) => {
    try {
      await api.put(`/Journeys/${id}`, data);
      setJourneys(prev => prev.map(j => j.id === id ? { ...j, ...data } : j));
    } catch (err: any) {
      console.error('Error updating journey:', err);
    }
  }, []);

  const deleteJourney = useCallback(async (id: number) => {
    try {
      await api.delete(`/Journeys/${id}`);
      setJourneys(prev => prev.filter(j => j.id !== id));
    } catch (err: any) {
      console.error('Error deleting journey:', err);
    }
  }, []);

  useEffect(() => {
    fetchJourneys();
  }, [fetchJourneys]);

  return {
    journeys,
    loading,
    error,
    createJourney,
    updateJourney,
    deleteJourney,
    refreshJourneys: fetchJourneys
  };
};