import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'; 

interface TravelCalendarProps {
  visitedDates: Date[];
  onDateClick: (date: Date) => void;
}

const TravelCalendar = ({ visitedDates, onDateClick }: TravelCalendarProps) => {
  return (
    <div className="calendar-wrapper" style={{ width: '100%' }}>
      <Calendar 
        onClickDay={onDateClick}
        tileClassName={({ date }) => 
          visitedDates.find(d => d.toDateString() === date.toDateString()) 
            ? 'visited-day' : ''
        }
      />
    </div>
  );
};

export default TravelCalendar;