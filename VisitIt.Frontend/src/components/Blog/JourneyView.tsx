import React from 'react';
import './JourneyView.css';

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
}

interface JourneyViewProps {
  journey: Journey;
  onClose: () => void;
}

const JourneyView: React.FC<JourneyViewProps> = ({ journey, onClose }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="journey-view">
      <header className="view-header">
        <button className="back-button" onClick={onClose}>
          ← Return
        </button>
        <div className="header-country">
          <h1>{journey.title}</h1>
        </div>
      </header>

      <div className="view-content">
        <div className="view-meta">
          <div className="meta-card">
            <div>
              <span className="meta-label">Place</span>
              <span className="meta-value">{journey.location}</span>
            </div>
          </div>
          
          <div className="meta-card">
            <div>
              <span className="meta-label">Date</span>
              <span className="meta-value">
                {formatDate(journey.startDate)}
                {journey.endDate && ` → ${formatDate(journey.endDate)}`}
              </span>
            </div>
          </div>
          
          {journey.distanceKm > 0 && (
            <div className="meta-card">
              <div>
                <span className="meta-label">Distans</span>
                <span className="meta-value">{journey.distanceKm} km</span>
              </div>
            </div>
          )}
        </div>

        <div className="view-description">
          <h2>My history</h2>
          <div className="description-text">
            {journey.description}
          </div>
        </div>

        {journey.notes && (
          <div className="view-notes">
            <h2>Notes</h2>
            <div className="notes-text">
              {journey.notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyView;