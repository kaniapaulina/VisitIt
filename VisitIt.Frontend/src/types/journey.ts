// src/types/journey.ts
export interface Country {
  code: string;
  name: string;
  status: 'visited' | 'wantToVisit' | 'notVisited';
}

export interface Journey {
  id: number;
  title: string;
  description: string;
  country: string;
  startDate: string;
  endDate?: string | null;
  location: string;
  notes: string;
  status: string;
}

export interface JourneyFormData {
  title: string;
  description: string;
  country: string;
  startDate: string;
  endDate?: string | null;
  location: string;
  notes: string;
}