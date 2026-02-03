import { Form } from "antd"
import { useEffect, useState } from "react"
import { getAllByBusinessOwner } from "../../helpers/queries/working-hours-queries"
import { WorkingHours } from "../../helpers/types/WorkingHours"
import dayjs from "dayjs"
import { useAppSelector } from "../../store/hooks"
import { AxiosResponse } from "axios"
import OpeningHoursForm from "../OpeningHoursForm"

type SettingsOpeningHoursProps = {
    handleSubmit: (values: { openingHours: WorkingHours[] }) => void,
    fetchOpeningHours?: () => Promise<AxiosResponse<WorkingHours[]>>,
}
const SettingsOpeningHours = ({ handleSubmit, fetchOpeningHours }: SettingsOpeningHoursProps) => {
    const [form] = Form.useForm<{ openingHours: WorkingHours[] }>();
    const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);

    useEffect(() => {
        if (fetchOpeningHours) {
            fetchOpeningHours().then(res => {
                setWorkingHours(res.data);
            });
        } else {
            getAllByBusinessOwner(Number(selectedBusinessEmployee?.business.id))
                .then(res => {
                    setWorkingHours(res.data);
                });
        }
    }, []);

    useEffect(() => {
        if (workingHours.length > 0) {
            form.setFieldsValue({
                openingHours: workingHours.map(item => ({
                    ...item,
                    startTime: item.startTime ? dayjs(item.startTime, "HH:mm") : null,
                    endTime: item.endTime ? dayjs(item.endTime, "HH:mm") : null,
                })) as [],
            });
        }
    }, [workingHours, form]);

    const onSubmit = (values: { openingHours: WorkingHours[] }) => {
        handleSubmit(values);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <OpeningHoursForm form={form} onSubmit={onSubmit} />
        </div>
    );
};


export default SettingsOpeningHours