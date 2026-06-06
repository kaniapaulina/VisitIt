import './AsideStyle.css'
import TravelCalendar from '../Calendar/Calendar'
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
    return(
        <>
        <div className="calendar-wrapper">
            <TravelCalendar visitedDates={[]} onDateClick={() => {}} />
        </div>
        <div className="aside-main">
            <JourneyList onJourneyClick={onJourneyClick} />
        </div>
        </>
    )
}

export default Aside