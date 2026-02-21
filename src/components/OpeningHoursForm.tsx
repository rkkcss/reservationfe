import { Button, Form, FormInstance, TimePicker } from 'antd';
import { DAY_OF_WEEK } from '../helpers/types/OpeningHour';
import { FiPlus } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { WorkingHours } from '../helpers/types/WorkingHours';
import { useForm } from 'antd/es/form/Form';

type OpeningHoursFormProps = {
    form?: FormInstance<{ openingHours: WorkingHours[] }>;
    onSubmit: (values: { openingHours: WorkingHours[] }) => void;
}

const OpeningHoursForm = ({ form, onSubmit }: OpeningHoursFormProps) => {
    const [componentForm] = useForm();

    return (
        <Form form={form ? form : componentForm} onFinish={onSubmit}>
            <Form.List name="openingHours">
                {(fields, { add, remove }) => (
                    <>
                        {Object.entries(DAY_OF_WEEK).map(([key, value]) => {
                            const dayHours = fields.filter(field => form?.getFieldValue(["openingHours", field.name, "dayOfWeek"]) === Number(key));

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
    )
}

export default OpeningHoursForm