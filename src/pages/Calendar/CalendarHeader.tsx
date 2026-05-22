import { Button, Select } from 'antd';
import { useCallback, useMemo } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useCalendar } from '../../context/CalendarContext';
import { BusinessEmployee } from '../../helpers/types/BusinessEmployee';
import useSelectedEmployee from '../../hooks/useSelectedEmployee';
import { BUSINESS_PERMISSIONS } from '../../helpers/types/BusinessPermission';
import { useAppSelector } from '../../store/hooks';

type CalendarHeaderProps = {
    dateRange?: string;
    employees: BusinessEmployee[],
    handleEmployeeChange: (name: string) => void;
};

const CalendarHeader = ({ dateRange, employees, handleEmployeeChange }: CalendarHeaderProps) => {
    const { calendarRef } = useCalendar();
    const { user } = useAppSelector(state => state.userStore);
    const { hasPermission } = useSelectedEmployee();
    const getCurrentView = calendarRef.current?.getApi().view.type as 'timeGridDay' | 'timeGridWeek';

    const handleViewChange = useCallback((view: 'timeGridDay' | 'timeGridWeek') => {
        calendarRef.current?.getApi().changeView(view);
    }, [calendarRef]);

    const handleNext = () => calendarRef.current?.getApi().next();
    const handlePrev = () => calendarRef.current?.getApi().prev();
    const handleToday = () => calendarRef.current?.getApi().today();

    const viewItems = useMemo(() => [
        {
            key: 'timeGridWeek',
            label: "Heti nézet",
            onClick: () => handleViewChange('timeGridWeek'),
        },
        {
            key: 'timeGridDay',
            label: "Napi nézet",
            onClick: () => handleViewChange('timeGridDay'),
        },
    ], [handleViewChange, getCurrentView]);

    return (
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
            <div className="flex items-center gap-4">
                {
                    hasPermission(BUSINESS_PERMISSIONS.VIEW_ALL_SCHEDULE) &&
                    <div className="flex flex-col">
                        <label>Munkatárs:</label>
                        <Select defaultValue={"all"} defaultActiveFirstOption onChange={(e) => handleEmployeeChange(e)} className="w-48">
                            <Select.Option value="all" key="all">Összes megtekintése</Select.Option>
                            {
                                employees.map(employee => (
                                    <Select.Option value={employee.user.fullName} key={employee.id}>
                                        <div className="flex items-center">
                                            {
                                                user?.fullName === employee.user.fullName &&
                                                <strong className="mr-1">(Me) </strong>
                                            }
                                            {employee.user.fullName}
                                        </div>
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                }
                <div className="flex flex-col">
                    <label>Nézet:</label>
                    <Select
                        className="w-48"
                        onSelect={handleViewChange}
                        value={getCurrentView}
                    >
                        {viewItems.map(item => (
                            <Select.Option key={item.key} value={item.key}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handleToday}>Ma</Button>
                <Button onClick={handlePrev} icon={<FaAngleLeft size={16} />} type="text" />
                <p className="text-base sm:text-xl lg:text-2xl font-semibold">{dateRange}</p>
                <Button onClick={handleNext} icon={<FaAngleRight size={16} />} type="text" />
            </div>
        </div >
    );
};

export default CalendarHeader;
