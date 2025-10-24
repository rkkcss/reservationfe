import { Button, Dropdown } from 'antd';
import { MenuProps } from 'antd/lib';
import { useCallback, useMemo } from 'react'
import { FaAngleDown, FaAngleLeft, FaAngleRight, FaCheck } from 'react-icons/fa';
import { useCalendar } from '../../context/CalendarContext';

type CalendarHeaderProps = {
    dateRange?: string;
};

const CalendarHeader = ({ dateRange }: CalendarHeaderProps) => {
    const { calendarRef } = useCalendar();

    const getCurrentView = calendarRef.current?.getApi().view.type as 'timeGridDay' | 'timeGridWeek';

    const handleViewChange = useCallback((view: 'timeGridDay' | 'timeGridWeek') => {
        calendarRef.current?.getApi().changeView(view);
    }, [calendarRef]);

    const handleNext = () => calendarRef.current?.getApi().next();
    const handlePrev = () => calendarRef.current?.getApi().prev();
    const handleToday = () => calendarRef.current?.getApi().today();

    const viewItems = useMemo<MenuProps['items']>(() => [
        {
            key: 'week',
            label: <div className="flex items-center gap-1">
                <FaCheck className={getCurrentView === 'timeGridWeek' ? 'visible' : 'invisible'} />
                Heti nézet
            </div>,
            onClick: () => handleViewChange('timeGridWeek'),
        },
        {
            key: 'day',
            label: <div className="flex items-center gap-1">
                <FaCheck className={getCurrentView === 'timeGridDay' ? 'visible' : 'invisible'} />
                Napi nézet
            </div>,
            onClick: () => handleViewChange('timeGridDay'),
        },
    ], [handleViewChange, getCurrentView]);

    return (
        <div className="flex flex-col md:flex-row items-center gap-3 mt-11 mb-2 justify-between">
            <div className="flex items-center">
                <Button onClick={handleToday}>Ma</Button>
                <Dropdown menu={{ items: viewItems }} trigger={['click']}>
                    <Button type="text" className="flex items-center gap-1" onClick={e => e.preventDefault()}>
                        {getCurrentView === 'timeGridDay' ? 'Napi nézet' : 'Heti nézet'}
                        <FaAngleDown size={20} />
                    </Button>
                </Dropdown>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handlePrev} icon={<FaAngleLeft size={16} />} type="text" />
                <p className="text-base sm:text-xl lg:text-2xl font-semibold">{dateRange}</p>
                <Button onClick={handleNext} icon={<FaAngleRight size={16} />} type="text" />
            </div>
        </div>
    );
};

export default CalendarHeader;
