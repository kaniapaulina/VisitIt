import React, { useState, useEffect } from 'react';
import { useJourneys } from '../../hooks/useJourney';
import './JourneyList.css';

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
  createdAt: string;
}

interface JourneyListProps {
  onJourneyClick: (journey: Journey) => void; 
}

const JourneyList: React.FC<JourneyListProps> = ({ onJourneyClick }) => {
  const { journeys, loading } = useJourneys();
  const [expandedId, setExpandedId] = useState<number | null>(null);


// DODAJ:
useEffect(() => {
    console.log('🗺️ Content - journeys:', journeys?.length);
}, [journeys]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-EN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="journey-list">
      </div>
    );
  }

  return (
    <div className="journey-list">
      <div className='list-header'>
        <h3>Your Entries</h3><p className='travel-count'>{journeys.length} {journeys.length === 1 ? 'journey' : 'journeys'}</p>
      </div>
      
      <div className='list-content'>
        {journeys.length === 0 ? (
          <div className="empty-state">
            <p>Nothing visited yet</p>
            <p className="hint">Click on a country to mark a past endeavour!</p>
          </div>
        ) : (
          <div className="journey-items">
            {journeys.map(journey => (
              <div 
                key={journey.id} 
                className={`journey-item ${expandedId === journey.id ? 'expanded' : ''}`}
              >
                <div 
                  className="journey-header"
                  onClick={() => {
                    onJourneyClick(journey);
                  }}
                >
                  <div className="journey-title-section">
                  
                    <div>
                      <h4>{journey.title}</h4>
                      <span className="journey-location">Country: {journey.country} | Location: {journey.location}</span>
                    </div>
                  </div>
                  <div className="journey-meta">
                    <span className="journey-date">{formatDate(journey.startDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default JourneyList;