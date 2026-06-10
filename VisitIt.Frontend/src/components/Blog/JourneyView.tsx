import React, { useState, useEffect } from 'react';
import './JourneyView.css';
import { useJourneys } from '../../hooks/useJourney';  
import api from '../../services/api';

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
  onDelete?: () => void;
}

const JourneyView: React.FC<JourneyViewProps> = ({ journey, onClose, onDelete }) => {
  const { deleteJourney } = useJourneys();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
    try {
      const response = await api.get(`/Journeys/images/${journey.id}`);
      const API_URL = 'https://localhost:7201';
      const imagesWithFullUrl = (response.data || []).map((img: string) => 
          img.startsWith('http') ? img : `${API_URL}${img}`
      );
      setImages(imagesWithFullUrl);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };
    fetchImages();
  }, [journey.id]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-EN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this journey?')) {
      return;
    }

    console.log('TEST DELETE - journey.id:', id); //DEBUG
    
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'JEST' : 'BRAK'); //DEBUG

    setDeletingId(id);
    try {
      await deleteJourney(id);
      console.log('Deleted successfully'); //DEBUG
      onDelete?.();
    } 
    catch (error) {
      alert('Failed to delete journey');
    } 
    finally {
      setDeletingId(null);
    }
  };

  const getRating = (description: string): number => {
    const match = description?.match(/Rating: (\d)\/5/);
    return match ? parseInt(match[1]) : 0;
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

        <div className="header-rating">
          <span className="stars-display">
            {getRating(journey.description) > 0 
              ? '★'.repeat(getRating(journey.description)) + '☆'.repeat(5 - getRating(journey.description))
              : 'No rating'}
          </span>
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
            {journey.description?.replace(/Rating: \d\/5\n\n/, '') || 'No description'}
          </div>
        </div>

        {images.length > 0 && (
          <div className="view-gallery">
            <h2>Photos ({images.length})</h2>
            <div className="gallery-grid">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className="gallery-item"
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`Journey photo ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {journey.notes && (
          <div className="view-notes">
            <h2>Notes</h2>
            <div className="notes-text">
              {journey.notes}
            </div>
          </div>
        )}

      </div>
        <div className="view-actions">
          <button 
            className="delete-journey-btn"
            onClick={(e) => handleDelete(e, journey.id)}
            disabled={deletingId === journey.id}
          >
            {deletingId === journey.id ? 'Deleting...' : 'Delete this journey'}
          </button>
        </div>

       {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <button className="lightbox-close">✕</button>
          <img src={selectedImage} alt="Full size" />
        </div>
      )}

    </div>
  );
};

export default JourneyView;