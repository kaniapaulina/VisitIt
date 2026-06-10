import React, { useState, useRef } from 'react';
import api from '../../services/api';
import './ImageUpload.css';

interface ImageUploadProps {
    journeyId: number;
    onUploadComplete?: (images: string[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ journeyId, onUploadComplete }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(prev => [...prev, ...files]);
        
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;
        
        setUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });
        
        try {
            const response = await api.post(`/Journeys/upload/${journeyId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            onUploadComplete?.(response.data.images);
            setSelectedFiles([]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const removePreview = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="image-upload">
            <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    hidden
                />
                <div className="upload-placeholder">
                    <span></span>
                    <p>Click to add photos</p>
                </div>
            </div>
            
            {previews.length > 0 && (
                <div className="previews">
                    {previews.map((preview, index) => (
                        <div key={index} className="preview-item">
                            <img src={preview} alt={`Preview ${index}`} />
                            <button className="remove-btn" onClick={() => removePreview(index)}>✕</button>
                        </div>
                    ))}
                </div>
            )}
            
            {selectedFiles.length > 0 && (
                <button 
                    className="upload-btn" 
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} photos`}
                </button>
            )}
        </div>
    );
};

export default ImageUpload;