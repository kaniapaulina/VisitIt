import './AsideStyle.css'
import TravelCalendar from '../Calendar/Calendar'
import '../Calendar/Calendar.css'

function Aside() {
    return(
        <>
        <div className="calendar-wrapper" style={{ width: '100%' }}>
                <TravelCalendar 
                    visitedDates={[]} 
                    onDateClick={() => {}} 
                        />
                </div>
        <div className="aside-main">
            <p>tu będą blogi help</p>
        </div>
        </>
    )
}

export default Aside