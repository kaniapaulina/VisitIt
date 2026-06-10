import React, { useState, useEffect } from 'react';
import { useJourneys } from '../../hooks/useJourney';
import api from '../../services/api';
import ImageUpload from '../ImageUpload/ImageUpload';
import './JourneyEditor.css';

interface JourneyEditorProps {
  countryName: string;
  countryCode: string;
  onClose: () => void;
  onSave?: () => void;
}

const JourneyEditor: React.FC<JourneyEditorProps> = ({ 
  countryName, 
  countryCode, 
  onClose,
  onSave 
}) => {
  const { createJourney, refreshJourneys } = useJourneys();
  
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [distanceKm, setDistanceKm] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [journeyId, setJourneyId] = useState<number | null>(null);

  const [uploadedImages, setUploadedImages] = useState(0);

  const handleSave = async () => {
    if (!title.trim() || !location.trim()) {
      alert('Title and Place are mandatory!');
      return;
    }

    setIsSaving(true);
    try {
      const result = await createJourney({
        title,
        description: `Rating: ${rating}/5\n\n${description}`,
        country: countryCode,
        location,
        startDate,
        endDate: endDate || null,
        distanceKm,
        notes,
        status: 'published'
      });

      console.log('Created journey:', result);
      setJourneyId(result.id);

      refreshJourneys();
      //onSave?.();
      //onClose();
    } catch (error) {
      console.error('Can\'t save:', error);
      alert('Couldn\'t save entry. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadComplete = () => {
    setUploadedImages(prev => prev + 1);
  };

  const handleFinish = () => {
    onSave?.();
    onClose();
  };

  const LIMITS = {
    title: 50,
    location: 50,
    description: 1000,
    notes: 200
  };

  const getCharCountClass = (current: number, max: number) => {
    if (current >= max) return 'char-count at-limit';
    if (current >= max * 0.8) return 'char-count near-limit';
    return 'char-count';
  };

  return (
    <div className="journey-editor">
      <header className="editor-header">
        <button className="back-button" onClick={onClose}>
          ← Return
        </button>
        <div className="header-country">
          <h1>{countryName}</h1>
        </div>
      </header>

      <div className="editor-content-full">
        <input
          type="text"
          className="title-input"
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= LIMITS.title) {
              setTitle(e.target.value);
            }}
          }
          placeholder="Name your journey!"
          disabled={!!journeyId}
          maxLength={LIMITS.title}
        />

        <span className={getCharCountClass(title.length, LIMITS.title)}>{title.length}/{LIMITS.title}</span>

        <div className="meta-row">
          <div className="meta-item">
            <label>Place Visited</label>
            <input type="text" 
            value={location} onChange={(e) => {
              if (e.target.value.length <= LIMITS.location) {
                setLocation(e.target.value);
              }
            }}
            placeholder="Cities.."
            maxLength={LIMITS.location} disabled={!!journeyId}/>
          </div>
          <span className={getCharCountClass(location.length, LIMITS.title)}>{location.length}/{LIMITS.location}</span>

          <div className="meta-item">
            <label>From</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={!!journeyId}/>
          </div>
          <div className="meta-item">
            <label>To</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={!!journeyId}/>
          </div>
          <div className="meta-item">
            <label>Distance crossed</label>
            <input type="number" value={distanceKm} onChange={(e) => setDistanceKm(Number(e.target.value))} disabled={!!journeyId}/>
          </div>
        </div>

        <div className="rating-section">
          <label>Rate your experience</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            ))}
            <span className="rating-text">
              {rating > 0 ? `${rating}/5` : ''}
            </span>
          </div>
        </div>

        <div className="description-section">
          <label>Your History</label>
          <textarea
            className="description-textarea-full"
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= LIMITS.description) {
                setDescription(e.target.value);
              }
            }}
            placeholder="Tell us about your trip..."
            maxLength={LIMITS.description}
            rows={20}
            disabled={!!journeyId}
          />
          <span className={getCharCountClass(description.length, LIMITS.description)}>{description.length}/{LIMITS.description}</span>
        </div>

        <div className="notes-section">
          <label>Notes</label>
          <textarea
            className="notes-textarea"
            value={notes}
            onChange={(e) => {
              if (e.target.value.length <= LIMITS.notes) {
                setNotes(e.target.value);
              }
            }}
            placeholder="Hints for other users..."
            maxLength={LIMITS.notes}
            rows={5}
            disabled={!!journeyId}
          />
        </div>

        <span className={getCharCountClass(notes.length, LIMITS.notes)}>{notes.length}/{LIMITS.notes}</span>

        {!journeyId && (
          <div className="save-section">
            <button 
              className="save-button-full" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save journey'}
            </button>
          </div>
        )}

        {journeyId && (
          <div className="upload-section">
            <div className="upload-header">
              <h3>Your Gallery</h3>
              <p>Upload photos to remember them forever!</p>
            </div>
            <ImageUpload 
              journeyId={journeyId} 
              onUploadComplete={handleUploadComplete} 
            />
          </div>
        )}

        <div className="header-actions">
          {journeyId && (
            <button className="finish-button" onClick={handleFinish}>
              ✓ Finish
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default JourneyEditor;