import { Button, Calendar, Form, Radio } from "antd";
import dayjs from "dayjs";
import { useEffect, useState, useMemo } from "react";
import { getBusinessAvailableSlots } from "../../../helpers/queries/appointment-queries";

type StepSelectAppointmentProps = {
    businessId: number;
    durationMinutes: number; // in minutes
    employeeId: number;
}

const StepSelectAppointment = ({ businessId, employeeId, durationMinutes }: StepSelectAppointmentProps) => {
    // 1. ÁLLAPOTOK: Kezdeti értéknek azonnal a mai napot állítjuk be mindkettőnél.
    const [calendarMonth, setCalendarMonth] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
    const [availableDates, setAvailableDates] = useState<Map<Date, string[]>>(new Map());

    // 2. SEGÉDVÁLTOZÓK: Stringként definiáljuk a hónapot. 
    // Ez a kulcs a useEffect-hez! Ha ez a string változik, a query fut.
    const currentMonthStr = calendarMonth.format('YYYY-MM');

    // Kiszámoljuk a start/end dátumokat a hónap alapján
    const startDate = calendarMonth.startOf('month').format('YYYY-MM-DD');
    const endDate = calendarMonth.endOf('month').format('YYYY-MM-DD');

    // A kiválasztott dátum string formátuma az összehasonlításhoz
    const selectedDateStr = selectedDate.format('YYYY-MM-DD');

    // 3. ADAT KIKERESÉSE: useMemo-t használunk, hogy ne fusson le feleslegesen minden renderkor,
    // csak ha az adat vagy a kiválasztott nap változik.
    const availableTimes = useMemo(() => {
        if (!selectedDateStr) return [];

        // Megkeressük a Map-ben az adott naphoz tartozó tömböt
        const entry = Array.from(availableDates.entries()).find(([date]) =>
            dayjs(date).format('YYYY-MM-DD') === selectedDateStr
        );

        return entry ? entry[1] : [];
    }, [availableDates, selectedDateStr]);

    const disabledDate = (currentDate: dayjs.Dayjs) => {
        if (!currentDate) return false;
        const currentStr = currentDate.format('YYYY-MM-DD');
        // Ellenőrizzük, hogy van-e az adott napra adat a Map-ben
        return !Array.from(availableDates.keys()).some(date =>
            dayjs(date).format('YYYY-MM-DD') === currentStr
        );
    };

    // 4. LEKÉRDEZÉS (QUERY):
    useEffect(() => {
        // Biztonsági ellenőrzés: ha nincs businessId, ne fusson (pl. még nem töltött be a prop)
        if (!businessId) return;

        console.log("Query futtatása erre az időszakra:", startDate, endDate);

        getBusinessAvailableSlots({
            businessId,
            startDate,
            endDate,
            durationMinutes,
            employeeId: employeeId
        }).then((res) => {
            const rawData = res.data as Record<string, string[]>;
            const map = new Map<Date, string[]>(
                Object.entries(rawData).map(
                    ([dateStr, slots]) => [new Date(dateStr), slots]
                )
            );
            setAvailableDates(map);
        }).catch(err => {
            console.error("Hiba a lekérdezés közben:", err);
        });

        // FONTOS: A 'currentMonthStr' a dependency, nem a 'calendarMonth' objektum.
        // Így betöltéskor (amikor létrejön a string) ÉS hónap váltáskor is garantáltan lefut.
    }, [currentMonthStr, businessId, durationMinutes, employeeId, startDate, endDate]);

    return (
        <>
            <Form.Item name="date" initialValue={dayjs()}>
                <Calendar
                    value={selectedDate}
                    headerRender={({ value, onChange }) => {
                        const current = dayjs(value);

                        const changeMonth = (diff: number) => {
                            const newValue = current.add(diff, 'month');
                            onChange(newValue);
                            setCalendarMonth(newValue);
                            // Ha lapozunk, a kiválasztást is érdemes lehet törölni, vagy átrakni, 
                            // de itt most hagyjuk az eredeti logikát.
                        };

                        return (
                            <div className="flex justify-between items-center py-2">
                                <Button onClick={() => changeMonth(-1)}>{'<'}</Button>
                                <span className="text-lg font-medium">{current.format('MMMM')}</span>
                                <Button onClick={() => changeMonth(1)}>{'>'}</Button>
                            </div>
                        );
                    }}
                    fullscreen={false}
                    disabledDate={disabledDate}
                    onSelect={(date) => {
                        setSelectedDate(date);
                        // Ha a felhasználó a naptár "szürke" részére kattint (előző/köv hónap napja),
                        // frissíteni kell a query-t a hónap váltással:
                        if (!date.isSame(calendarMonth, 'month')) {
                            setCalendarMonth(date);
                        }
                    }}
                />
            </Form.Item>

            <Form.Item
                name="time"
                label="Időpont kiválasztása"
                rules={[{ required: true, message: 'Kérjük válasszon időpontot!' }]}>
                <div>
                    {availableTimes.length > 0 ? (
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
                    ) : (
                        <div className="text-gray-500 italic mt-2">
                            {availableDates.size === 0
                                ? "Időpontok betöltése..."
                                : "Erre a napra nincs szabad időpont."}
                        </div>
                    )}
                </div>
            </Form.Item>
        </>
    );
}

export default StepSelectAppointment;