import { CalendarProvider } from '../context/CalendarContext'
import CalendarPage from '../pages/Calendar/Calendar'

const CalendarLayout = () => {
    return (
        <CalendarProvider>
            <CalendarPage />
        </CalendarProvider>
    )
}

export default CalendarLayout