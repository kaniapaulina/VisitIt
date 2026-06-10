import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

console.log('api baseURL:', api.defaults.baseURL);

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
  images?: string;
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
  }


  const fetchJourneys = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Journey[]>('/Journeys');
      setJourneys(response.data);
    } catch (err: any) {
      console.error('Error fetching journeys:', err); //DEBUG
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Failed to fetch journeys');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createJourney = useCallback(async (data: CreateJourneyData) => {
    try {
      const response = await api.post<Journey>('/Journeys', data);
      console.log('✅ API response:', response.data);  // DEBUG
      setJourneys(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      console.error('Error creating journey:', err);
      throw err;
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