import { useForm } from 'antd/es/form/Form';
import OpeningHoursForm from '../OpeningHoursForm'
import { getBusinessOpeningHoursByBusinessId, saveBusinessOpeningHoursByBusinessId } from '../../helpers/queries/business-opening-hours';
import { useAppSelector } from '../../store/hooks';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { WorkingHours } from '../../helpers/types/WorkingHours';


const BusinessOpeningHours = () => {
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);
    const [form] = useForm();
    const onSubmit = async (values: { openingHours: WorkingHours[] }) => {
        const formattedOpeningHours = values.openingHours.map((item) => {
            const formattedStartTime = dayjs(item.startTime).format("HH:mm");
            const formattedEndTime = dayjs(item.endTime).format("HH:mm");

            return { ...item, startTime: formattedStartTime, endTime: formattedEndTime };
        });
        await saveBusinessOpeningHoursByBusinessId(Number(selectedBusinessEmployee?.business.id), formattedOpeningHours);
    }

    const fetchOpeningHours = async () => {
        const { data } = await getBusinessOpeningHoursByBusinessId(Number(selectedBusinessEmployee?.business.id));
        console.log(data);
        form.setFieldsValue({
            openingHours: data.map((item: WorkingHours) => ({
                ...item,
                startTime: item.startTime ? dayjs(item.startTime, "HH:mm") : null,
                endTime: item.endTime ? dayjs(item.endTime, "HH:mm") : null,
            })) as [],
        });
    }

    useEffect(() => {
        fetchOpeningHours();
    }, [])

    return (
        <OpeningHoursForm form={form} onSubmit={onSubmit} />
    )
}

export default BusinessOpeningHours