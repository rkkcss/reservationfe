import { Button, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function LeftNavBarCalendarHeader ({ value, onChange }: { value: Dayjs; onChange: (date: Dayjs) => void }) {
    // Előző hónapra ugrás
    const prevMonth = () => {
      onChange(value.clone().subtract(1, 'month'));
    };

    // Következő hónapra ugrás
    const nextMonth = () => {
      onChange(value.clone().add(1, 'month'));
    };

    // "Ma" gomb működése
    const goToday = () => {
      onChange(dayjs());
    };

    return (
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-white">
        {/* Bal oldal: Aktuális év és hónap szépen formázva */}
        <Typography.Title level={5} className="!m-0 capitalize">
          {value.format('YYYY. MMMM')}
        </Typography.Title>

        {/* Jobb oldal: Egyedi navigációs gombok */}
        <div className="flex items-center gap-2">
          <Button size="small" onClick={goToday}>
            Ma
          </Button>
          <Button 
            size="small" 
            shape="circle" 
            icon={<FaAngleLeft />} 
            onClick={prevMonth} 
          />
          <Button 
            size="small" 
            shape="circle" 
            icon={<FaAngleRight />} 
            onClick={nextMonth} 
          />
        </div>
      </div>
    );
  };