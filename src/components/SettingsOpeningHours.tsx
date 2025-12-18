import { Button, Form, TimePicker } from "antd"
import { FiPlus } from "react-icons/fi"
import { DAY_OF_WEEK } from "../helpers/types/OpeningHour"
import { useEffect, useState } from "react"
import { getAllByBusinessOwner } from "../helpers/queries/working-hours-queries"
import { WorkingHours } from "../helpers/types/WorkingHours"
import dayjs from "dayjs"
import { MdDeleteOutline } from "react-icons/md"
import { useAppSelector } from "../store/hooks"

console.log(dayjs.locale());
const SettingsOpeningHours = () => {
    const [form] = Form.useForm();
    const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);

    // API hívás a workingHours adat betöltésére
    useEffect(() => {
        getAllByBusinessOwner(Number(selectedBusinessEmployee?.business.id))
            .then(res => {
                setWorkingHours(res.data);
            });
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

    const handleSubmit = (values: { openingHours: WorkingHours[] }) => {
        console.log(values)
        // const formattedOpeningHours = values.openingHours.map((item) => {
        //     const formattedStartTime = dayjs(item.startTime).format("HH:mm");
        //     const formattedEndTime = dayjs(item.endTime).format("HH:mm");

        //     return { ...item, startTime: formattedStartTime, endTime: formattedEndTime };
        // });

        // updateWorkingHours(Number(selectedBusinessEmployee?.business.id), Number(selectedBusinessEmployee?.user.id), formattedOpeningHours)
        //     .then(res => {
        //         console.log(res);
        //     });
    };

    return (
        <div className="w-full pl-5 mt-5">
            <h1 className="text-2xl font-bold mb-4">Nyitvatartási idő</h1>
            <Form form={form} onFinish={handleSubmit}>
                <Form.List name="openingHours">
                    {(fields, { add, remove }) => (
                        <>
                            {Object.entries(DAY_OF_WEEK).map(([key, value]) => {
                                // Az egyes napokhoz tartozó órák kiszűrése
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
                                                <p className="text-gray-500 text-sm">Nem munkanap</p>
                                            )}
                                            <Button
                                                className="!w-full"
                                                icon={<FiPlus />}
                                                onClick={() => add({ dayOfWeek: Number(key), startTime: null, endTime: null })}
                                            >
                                                Új idő hozzáadása
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