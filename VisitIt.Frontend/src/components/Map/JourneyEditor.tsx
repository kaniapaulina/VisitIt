import React, { useState } from 'react';
import { useJourneys } from '../../hooks/useJourney';
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

  const handleSave = async () => {
    if (!title.trim() || !location.trim()) {
      alert('Title and Place are mandatory!');
      return;
    }

    setIsSaving(true);
    try {
      await createJourney({
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
      refreshJourneys();
      onSave?.();
      onClose();
    } catch (error) {
      console.error('Can\'t save:', error);
      alert('Couldn\'t save entry. Try again.');
    } finally {
      setIsSaving(false);
    }
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
        <button 
          className="save-button" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save your journey'}
        </button>
      </header>

      <div className="editor-content-full">
        <input
          type="text"
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <div className="meta-row">
          <div className="meta-item">
            <label>Place Visited</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="ex. Cracov" />
          </div>
          <div className="meta-item">
            <label>From</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="meta-item">
            <label>To</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="meta-item">
            <label>Distance crossed</label>
            <input type="number" value={distanceKm} onChange={(e) => setDistanceKm(Number(e.target.value))} min="0" />
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
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your trip..."
            rows={20}
          />
        </div>

        <div className="notes-section">
          <label>Notes</label>
          <textarea
            className="notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Hints for other users..."
            rows={5}
          />
        </div>
      </div>
    </div>
  );
};

export default JourneyEditor;