import FullCalendar from '@fullcalendar/react';
import { Button, Dropdown } from 'antd';
import { MenuProps } from 'antd/lib';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FaAngleDown, FaAngleLeft, FaAngleRight, FaCheck } from 'react-icons/fa';

type CalendarHeaderProps = {
    calendarRef: React.RefObject<FullCalendar>;
}

const CalendarHeader = ({ calendarRef }: CalendarHeaderProps) => {
    const [dateRange, setDateRange] = useState('');
    const [viewType, setViewType] = useState<'timeGridDay' | 'timeGridWeek'>('timeGridDay');

    const handleViewChange = useCallback((view: 'timeGridDay' | 'timeGridWeek') => {
        setViewType(view);
    }, []);

    const viewItems = useMemo<MenuProps['items']>(() => [
        {
            key: 'week',
            label: (
                <span className="flex items-center gap-1">
                    <FaCheck className={viewType === 'timeGridWeek' ? 'visible' : 'invisible'} />
                    Heti nézet
                </span>
            ),
            onClick: () => handleViewChange('timeGridWeek'),
        },
        {
            key: 'day',
            label: (
                <span className="flex items-center gap-1">
                    <FaCheck className={viewType === 'timeGridDay' ? 'visible' : 'invisible'} />
                    Napi nézet
                </span>
            ),
            onClick: () => handleViewChange('timeGridDay'),
        },
    ], [viewType, handleViewChange]);


    useEffect(() => {
        updateDateRange();
    }, [])

    useEffect(() => {
        if (calendarRef.current) {
            calendarRef.current.getApi().changeView(viewType);
            updateDateRange();
        }
    }, [calendarRef, viewType]);

    const handleNext = () => {
        calendarRef.current?.getApi().next();
        updateDateRange();
    };

    const handlePrev = () => {
        calendarRef.current?.getApi().prev();
        updateDateRange();
    };

    const handleToday = () => {
        calendarRef.current?.getApi().today();
        updateDateRange();
    };

    const updateDateRange = () => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            const view = calendarApi.view;
            const start = view.currentStart;
            const end = new Date(view.currentEnd.getTime() - 1);
            setDateRange(formatDateRange(start, end));
        }
    };

    const formatDateRange = (start: Date, end: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        const startStr = new Intl.DateTimeFormat('hu-HU', options).format(start);
        const endStr = new Intl.DateTimeFormat('hu-HU', options).format(
            new Date(end.getTime() - 1) // mert `end` már a következő nap 00:00
        );

        return `${startStr} - ${endStr}`;
    };

    return (
        <>
            <div className="flex items-center flex-col  gap-3 mt-11 mb-2 justify-between">
                <div className="flex gap-4 justify-between w-full">
                    <Dropdown menu={{ items: viewItems }} trigger={['click']}>
                        <Button type="text" onClick={(e) => e.preventDefault()} className="flex items-center gap-1">
                            {viewType === "timeGridDay" ? "Napi nézet" : "Heti nézet"}
                            <FaAngleDown size={20} />
                        </Button>
                    </Dropdown>
                    <Button onClick={handleToday} type="default" className="">
                        Ma
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handlePrev}
                        icon={<FaAngleLeft size={16} />}
                        type="text"
                    />
                    <p className="sm:text-xl lg:text-2xl font-semibold">{dateRange}</p>
                    <Button
                        onClick={handleNext}
                        icon={<FaAngleRight size={16} />}
                        type="text"
                    />
                </div>
            </div>
        </>
    )
}

export default CalendarHeader