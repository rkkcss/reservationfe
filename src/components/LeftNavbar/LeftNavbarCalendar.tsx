import { Calendar } from 'antd'

import LeftNavBarCalendarHeader from './LeftNavBarCalendarHeader';
import { Dayjs } from 'dayjs';
import { SelectInfo } from 'antd/es/calendar/generateCalendar';
import { useCalendar } from '../../context/CalendarContext';


const LeftNavbarCalendar = () => {
  const { calendarRef } = useCalendar();

  const handleSelect = (value: Dayjs, selectInfo: SelectInfo) => {
    console.log(selectInfo)
    if (selectInfo.source === 'date') {
      if (calendarRef?.current) {
        const fullCalendarApi = calendarRef.current.getApi();

        fullCalendarApi.gotoDate(value.toDate());
      }
    }
  };
  return (
    <div className="bg-gray-50 rounded-xl max-w-md">
      <Calendar 
        fullscreen={false} 
        headerRender={LeftNavBarCalendarHeader}
        onSelect={handleSelect}
      />
    </div>
  );
}

export default LeftNavbarCalendar