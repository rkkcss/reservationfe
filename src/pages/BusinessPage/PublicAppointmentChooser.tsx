import { Button, Calendar, Form, Radio } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react'
import { getBusinessAvailableSlots } from '../../helpers/queries/appointment-queries';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { usePublicReservation } from '../../context/PublicAppointmentReservation';
import { Offering } from '../../helpers/types/Offering';

const PublicAppointmentChooser = () => {
    const { form } = usePublicReservation()
    const employeeId: number = Form.useWatch('employeeId', form);
    const selectedFormOffer: Offering = Form.useWatch('offering', form);
    const selectedTime = Form.useWatch('time', form);

    const [calendarMonth, setCalendarMonth] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
    const [availableDates, setAvailableDates] = useState<Record<string, string[]>>({});

    const currentMonthStr = calendarMonth.format('YYYY-MM');
    const selectedDateStr = selectedDate?.format('YYYY-MM-DD');

    const availableTimes = useMemo(() => {
        if (!selectedDateStr) return [];
        return availableDates[selectedDateStr] ?? [];
    }, [availableDates, selectedDateStr]);

    const disabledDate = (currentDate: dayjs.Dayjs) => {
        if (!currentDate) return false;
        return !availableDates[currentDate.format('YYYY-MM-DD')];
    };

    useEffect(() => {
        if (!selectedFormOffer) return;

        getBusinessAvailableSlots({
            startDate: calendarMonth.startOf('month').format('YYYY-MM-DD'),
            endDate: calendarMonth.endOf('month').format('YYYY-MM-DD'),
            durationMinutes: selectedFormOffer.durationMinutes,
            employeeId
        }).then((res) => {
            setAvailableDates(res.data as Record<string, string[]>);
        }).catch(err => {
            console.error("Hiba a lekérdezés közben:", err);
        });
    }, [currentMonthStr, employeeId, selectedFormOffer]);

    useEffect(() => {
        setSelectedDate(null);
        setAvailableDates({});
    }, [selectedFormOffer, employeeId]);

    return (
        <>
            <Form.Item name="date">
                <Calendar
                    value={selectedDate ?? dayjs()}
                    headerRender={({ onChange }) => {
                        const current = selectedDate ?? dayjs();
                        const changeMonth = (diff: number) => {
                            const newValue = current.add(diff, 'month');
                            onChange(newValue);
                            setCalendarMonth(newValue);
                        };
                        return (
                            <div className="flex justify-between items-center py-2">
                                <Button onClick={() => changeMonth(-1)} icon={<FaChevronLeft />} />
                                <span className="text-lg font-medium">{calendarMonth.format('MMMM')}</span>
                                <Button onClick={() => changeMonth(1)} icon={<FaChevronRight />} />
                            </div>
                        );
                    }}
                    fullscreen={false}
                    disabledDate={disabledDate}
                    onSelect={(date) => {
                        setSelectedDate(date);
                        if (!date.isSame(calendarMonth, 'month')) {
                            setCalendarMonth(date);
                        }
                    }}
                />
            </Form.Item>

            <Form.Item
                name="time"
                label={<p className="text-xs font-bold uppercase tracking-widest">Időpont kiválasztása</p>}
                rules={[{ required: true, message: 'Kérjük válasszon időpontot!' }]}
            >
                <div>
                    {availableTimes.length > 0 ? (
                        <Radio.Group buttonStyle="solid" className="grid grid-cols-5 gap-2" value={selectedTime}>
                            {availableTimes.map((time) => {
                                const formatted = dayjs(time.split('[')[0]).format('HH:mm');
                                return (
                                    <Radio.Button className="!rounded-md flex justify-center" key={time} value={formatted}>
                                        {formatted}
                                    </Radio.Button>
                                );
                            })}
                        </Radio.Group>
                    ) : (
                        <div className="text-gray-500 italic mt-2">
                            {Object.keys(availableDates).length === 0
                                ? "Nincs időpont..."
                                : "Erre a napra nincs szabad időpont."}
                        </div>
                    )}
                </div>
            </Form.Item>
        </>
    );
}

export default PublicAppointmentChooser;