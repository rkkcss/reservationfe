import { Button, Calendar, Form, Modal, Radio, Select, Steps } from 'antd'
import { getAllGuestsBySearch } from '../../helpers/queries/guestService'
import { Guest } from '../../helpers/types/Guest'
import { useCallback, useEffect, useState } from 'react'
import { getOfferingByLoggedInBusiness } from '../../helpers/queries/offeringService'
import { Offering } from '../../helpers/types/Offering'
import { getBusinessAvailableSlots } from '../../helpers/queries/appointmentService'
import dayjs from 'dayjs'

type AddAppointmentProps = {
    open: boolean,
    onClose: () => void,
    onOk: () => void,
}

const stepsItems = [
    {
        title: 'Vendég',
        description: 'Válassza ki a vendéget',
    },
    {
        title: 'Szolgáltatás',
        description: 'Válassza ki a szolgáltatást',
    },
    {
        title: 'Időpont',
        description: 'Válassza ki az időpontot',
    },
]

const AddAppointment = ({ open, onClose, onOk }: AddAppointmentProps) => {
    const [searchedGuests, setSearchedGuests] = useState<Guest[]>([]);
    const [offers, setOffers] = useState<Offering[]>([]);
    const [availableDates, setAvailableDates] = useState<Map<Date, string[]>>(new Map());
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

    const selectedDateStr = selectedDate?.format('YYYY-MM-DD');

    const availableTimes = selectedDateStr
        ? Array.from(availableDates.entries())
            .find(([date]) => dayjs(date).format('YYYY-MM-DD') === selectedDateStr)?.[1] || []
        : [];

    const searchInGuests = (value: string) => {
        getAllGuestsBySearch(value).then((res) => {
            setSearchedGuests(res.data);
        });
    }

    const getAllOffers = useCallback(() => {
        getOfferingByLoggedInBusiness().then((res) => {
            setOffers(res);
        });
    }, []);

    useEffect(() => {
        if (open) {
            getAllOffers();
            getBusinessAvailableSlots({
                businessId: 1,
                startDate: '2025-06-02',
                endDate: '2025-06-17',
                durationMinutes: 30
            }).then((res) => {
                const rawData = res.data as Record<string, string[]>;
                const map = new Map<Date, string[]>(
                    Object.entries(rawData).map(
                        ([dateStr, slots]) => [new Date(dateStr), slots]
                    )
                );
                setAvailableDates(map);
            });
        }
    }, [open, getAllOffers]);

    const disabledDate = (currentDate: dayjs.Dayjs) => {
        if (!currentDate) return false;

        const currentStr = currentDate.format('YYYY-MM-DD');

        return !Array.from(availableDates.keys()).some(date =>
            dayjs(date).format('YYYY-MM-DD') === currentStr
        );
    };

    return (
        <>
            <Modal onCancel={onClose} open={open} onOk={onOk} title="Időpont hozzáadása" footer={false}>
                <div className="bg-white absolute top-0 left-0 w-full h-16 flex items-center justify-center">
                    <Steps current={0} labelPlacement="vertical" items={stepsItems} />
                </div>
                <Form layout="vertical" className="mt-9" onFinish={(values) => console.log(values)}>
                    <Form.Item
                        name="guestId"
                        label="Vendég neve"
                        rules={[{ required: true, message: 'Kérjük válasszon vendéget!' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Vendég neve"
                            filterOption={false}
                            onSearch={searchInGuests}
                        >
                            {searchedGuests.map((guest) => (
                                <Select.Option key={guest.id} value={guest.id} label={guest.name}>
                                    {guest.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="offeringId"
                        label="Szolgáltatás"
                        rules={[{ required: true, message: 'Kérjük válasszon szolgáltatást!' }]}
                    >
                        <Select placeholder="Szolgáltatás">
                            {offers.map((offer) => (
                                <Select.Option key={offer.id} value={offer.id} label={offer.name}>
                                    {offer.title}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="date">
                        <Calendar
                            headerRender={({ value, onChange }) => {
                                const current = dayjs(value);

                                const prevMonth = () => {
                                    const newValue = current.subtract(1, 'month');
                                    onChange(newValue);
                                };

                                const nextMonth = () => {
                                    const newValue = current.add(1, 'month');
                                    onChange(newValue);
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


                    <div className="flex justify-between">
                        <Button type="primary" htmlType="submit">Mentés</Button>
                        <Button type="default" onClick={onClose}>Mégsem</Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default AddAppointment;
