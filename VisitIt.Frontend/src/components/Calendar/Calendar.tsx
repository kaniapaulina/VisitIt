// src/components/Calendar/Calendar.tsx
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'; 

interface TravelCalendarProps {
  visitedDates: Date[];
  onDateClick: (date: Date) => void;
}

const TravelCalendar = ({ visitedDates, onDateClick }: TravelCalendarProps) => {
  
  const isVisited = (date: Date) => {
    return visitedDates.some(d => 
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    );
  };

  return (
    <div className="calendar-wrapper" style={{ width: '100%' }}>
      <Calendar 
        onClickDay={onDateClick}
        tileClassName={({ date }) => 
          isVisited(date) ? 'visited-day' : ''
        }
      />
    </div>
  );
};

export default TravelCalendar;