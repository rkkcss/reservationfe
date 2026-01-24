import { Button, Form, TimePicker } from "antd"
import { FiPlus } from "react-icons/fi"
import { DAY_OF_WEEK } from "../helpers/types/OpeningHour"
import { useEffect, useState } from "react"
import { getAllByBusinessOwner } from "../helpers/queries/working-hours-queries"
import { WorkingHours } from "../helpers/types/WorkingHours"
import dayjs from "dayjs"
import { MdDeleteOutline } from "react-icons/md"
import { useAppSelector } from "../store/hooks"
import { AxiosResponse } from "axios"

type SettingsOpeningHoursProps = {
    handleSubmit: (values: { openingHours: WorkingHours[] }) => void,
    fetchOpeningHours?: () => Promise<AxiosResponse<WorkingHours[]>>,
}
const SettingsOpeningHours = ({ handleSubmit, fetchOpeningHours }: SettingsOpeningHoursProps) => {
    const [form] = Form.useForm();
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
                }))
            });
        }
    }, [workingHours, form]);

    const onSubmit = (values: { openingHours: WorkingHours[] }) => {
        handleSubmit(values);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Form form={form} onFinish={onSubmit}>
                <Form.List name="openingHours">
                    {(fields, { add, remove }) => (
                        <>
                            {Object.entries(DAY_OF_WEEK).map(([key, value]) => {
                                const dayHours = fields.filter(field => form.getFieldValue(["openingHours", field.name, "dayOfWeek"]) === Number(key));

                                return (
                                    <div key={key} className="mb-4">
                                        <p className="font-semibold mb-2">{value}</p>
                                        <div className="flex flex-col gap-2 items-start w-fit">
                                            {dayHours.length > 0 ? (
                                                dayHours.map((field) => (
                                                    <div key={field.key} className="flex gap-2 items-start">
                                                        <Form.Item rules={[{ required: true, message: "Kötelező mező" }]} name={[field.name, "startTime"]}>
                                                            <TimePicker needConfirm={false} format="HH:mm" minuteStep={30} />
                                                        </Form.Item>
                                                        -
                                                        <Form.Item rules={[{ required: true, message: "Kötelező mező" }]} name={[field.name, "endTime"]}>
                                                            <TimePicker needConfirm={false} format="HH:mm" minuteStep={30} />
                                                        </Form.Item>
                                                        <Button type="primary" onClick={() => remove(field.name)} danger icon={<MdDeleteOutline />}></Button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-sm mb-4">Nem munkanap</p>
                                            )}
                                            <Button
                                                type="text"
                                                className="text-primary"
                                                icon={<FiPlus />}
                                                onClick={() => add({ dayOfWeek: Number(key), startTime: null, endTime: null })}
                                            >
                                                Új idősáv hozzáadása
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </Form.List>
                <Button type="primary" className="text-right w-full sm:w-fit" htmlType="submit">
                    Mentés
                </Button>
            </Form>
        </div>
    );
};


export default SettingsOpeningHours