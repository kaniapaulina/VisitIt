import './AsideStyle.css'
import TravelCalendar from '../Calendar/Calendar'
import '../Calendar/Calendar.css'
import { useJourneys } from '../../hooks/useJourney'
import '../Calendar/Calendar.css'
import JourneyList from './JourneyList';

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

interface AsideProps {
  onJourneyClick: (journey: Journey) => void;
}

function Aside({ onJourneyClick }: AsideProps) {

    const { journeys } = useJourneys();
    
    const getTravelDates = (): Date[] => {
        const dates: Date[] = [];
        
        journeys.forEach(journey => {
            const start = new Date(journey.startDate);
            dates.push(start);
            
            if (journey.endDate) {
                const end = new Date(journey.endDate);
                const current = new Date(start);
                while (current <= end) {
                    dates.push(new Date(current));
                    current.setDate(current.getDate() + 1);
                }
            }
        });
        
        return dates;
    };

        const handleDateClick = (date: Date) => {
        const journeysOnDate = journeys.filter(journey => {
            const start = new Date(journey.startDate);
            const end = journey.endDate ? new Date(journey.endDate) : start;
            return date >= start && date <= end;
        });
        
        if (journeysOnDate.length > 0) {
            onJourneyClick(journeysOnDate[0]);
        }
    };


    return(
        <>
        <div className="calendar-wrapper">
            <TravelCalendar 
                visitedDates={getTravelDates()} 
                onDateClick={handleDateClick} 
            />
        </div>
        <div className="aside-main">
            <JourneyList onJourneyClick={onJourneyClick} />
        </div>
        </>
    )
}

export default Aside