import { Button, Calendar, Form, Radio } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getBusinessAvailableSlots } from "../../../helpers/queries/appointment-queries";

type StepSelectAppointmentProps = {
    businessId: number;
    durationMinutes: number; // in minutes
}

const StepSelectAppointment = ({ businessId, durationMinutes }: StepSelectAppointmentProps) => {
    const [calendarMonth, setCalendarMonth] = useState(dayjs());
    const [availableDates, setAvailableDates] = useState<Map<Date, string[]>>(new Map());
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

    const startDate = calendarMonth.startOf('month').format('YYYY-MM-DD');
    const endDate = calendarMonth.endOf('month').format('YYYY-MM-DD');

    const selectedDateStr = selectedDate?.format('YYYY-MM-DD');

    const availableTimes = selectedDateStr
        ? Array.from(availableDates.entries())
            .find(([date]) => dayjs(date).format('YYYY-MM-DD') === selectedDateStr)?.[1] || []
        : [];

    const disabledDate = (currentDate: dayjs.Dayjs) => {
        if (!currentDate) return false;

        const currentStr = currentDate.format('YYYY-MM-DD');

        return !Array.from(availableDates.keys()).some(date =>
            dayjs(date).format('YYYY-MM-DD') === currentStr
        );
    };

    useEffect(() => {
        getBusinessAvailableSlots({
            businessId,
            startDate,
            endDate,
            durationMinutes
        }).then((res) => {
            const rawData = res.data as Record<string, string[]>;
            const map = new Map<Date, string[]>(
                Object.entries(rawData).map(
                    ([dateStr, slots]) => [new Date(dateStr), slots]
                )
            );
            setAvailableDates(map);
        });
    }, [calendarMonth, businessId, durationMinutes]);

    return (
        <>
            <Form.Item name="date">
                <Calendar
                    headerRender={({ value, onChange }) => {
                        const current = dayjs(value);

                        const prevMonth = () => {
                            const newValue = current.subtract(1, 'month');
                            onChange(newValue);
                            setCalendarMonth(newValue);
                        };

                        const nextMonth = () => {
                            const newValue = current.add(1, 'month');
                            onChange(newValue);
                            setCalendarMonth(newValue);
                        };

                        return (
                            <div className="flex justify-between items-center py-2">
                                <Button onClick={prevMonth}>{'<'}</Button>
                                <span className="text-lg font-medium">{current.format('MMMM')}</span>
                                <Button onClick={nextMonth}>{'>'}</Button>
                            </div>
                        );
                    }}
                    fullscreen={false}
                    disabledDate={disabledDate}
                    onSelect={(date) => setSelectedDate(date)}
                />
            </Form.Item>

            <Form.Item
                name="time"
                label="Időpont kiválasztása"
                rules={[{ required: true, message: 'Kérjük válasszon időpontot!' }]}>
                <div>
                    <Radio.Group className="grid grid-cols-5 gap-2">
                        {availableTimes.map((time) => {
                            const formatted = dayjs(time.split('[')[0]).format('HH:mm');
                            return (
                                <Radio.Button className="rounded-sm" key={time} value={formatted}>
                                    {formatted}
                                </Radio.Button>
                            );
                        })}
                    </Radio.Group>
                </div>
            </Form.Item>
        </>
    );
}

export default StepSelectAppointment;
