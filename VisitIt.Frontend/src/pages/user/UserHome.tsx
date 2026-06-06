import Nav from '../../components/Sidebar/Nav';
import Content from '../../components/Map/Content';
import JourneyEditor from '../../components/Map/JourneyEditor';
import JourneyView from '../../components/Blog/JourneyView';
import Aside from '../../components/Blog/Aside';
import './Home.css';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SelectedCountry {
  name: string;
  code: string;
}

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

type ViewMode = 'map' | 'newJourney' | 'viewJourney';

const UserHome = () => {
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState<SelectedCountry | null>(null);
    const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('map');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleCountryClick = (country: SelectedCountry) => {
        setSelectedCountry(country);
        setViewMode('newJourney');
    };

    const handleJourneyClick = (journey: Journey) => {
        setSelectedJourney(journey);
        setViewMode('viewJourney');
    };

    const handleClose = () => {
        setViewMode('map');
        setSelectedCountry(null);
        setSelectedJourney(null);
    };

    const handleSaveComplete = () => {
        handleClose();
    };

  return (
        <div className="dashboard">
            <div className='nav-block'>
                <Nav />
            </div>    
            <div className={`main-block ${viewMode !== 'map' ? 'editing' : ''}`}>
                {/* Mapa + Aside */}
                <div className={`map-view ${viewMode === 'map' ? 'active' : ''}`}>
                    <div className="main-content">
                        <Content onCountryClick={handleCountryClick} />
                    </div>
                    <div className="right-content"> 
                        <Aside onJourneyClick={handleJourneyClick} />
                    </div>
                </div>

                <div className={`editor-view ${viewMode !== 'map' ? 'active' : ''}`}>
                    {viewMode === 'newJourney' && selectedCountry && (
                        <JourneyEditor 
                            countryName={selectedCountry.name}
                            countryCode={selectedCountry.code}
                            onClose={handleClose}
                            onSave={handleSaveComplete}
                        />
                    )}
                    {viewMode === 'viewJourney' && selectedJourney && (
                        <JourneyView 
                            journey={selectedJourney}
                            onClose={handleClose}
                        />
            )}
                </div>
            </div>  
            
        </div>
    );
};

export default UserHome;