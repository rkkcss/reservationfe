import { Badge, Button, Form, FormInstance, TimePicker } from "antd";
import { DAY_OF_WEEK } from "../helpers/types/OpeningHour";
import { FiPlus } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { WorkingHours } from "../helpers/types/WorkingHours";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { ReactNode } from "react";

type OpeningHoursFormProps = {
    form?: FormInstance<{ openingHours: WorkingHours[] }>;
    onSubmit: (values: { openingHours: WorkingHours[] }) => void;
    submitBtnText?: string;
    footer?: boolean;
    customFooter?: ReactNode;
};

const OpeningHoursForm = ({
    form,
    onSubmit,
    submitBtnText,
    footer = true,
    customFooter,
}: OpeningHoursFormProps) => {
    const [componentForm] = useForm();
    const activeForm = form || componentForm;

    return (
        <Form form={activeForm} onFinish={onSubmit} className="w-full">
            <Form.List name="openingHours">
                {(fields, { add, remove }) => (
                    <div className="flex flex-col gap-4 mb-6">
                        {Object.entries(DAY_OF_WEEK).map(([key, value]) => {
                            const dayHours = fields.filter(
                                (field) =>
                                    form?.getFieldValue([
                                        "openingHours",
                                        field.name,
                                        "dayOfWeek",
                                    ]) === Number(key),
                            );

                            return (
                                <div
                                    key={key}
                                    className="p-4 border border-gray-200 rounded-lg bg-white shadow-xs transition-all"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="font-semibold text-gray-800 text-base">
                                            {value}
                                        </p>
                                        {dayHours.length === 0 ? (
                                            <Badge
                                                color="gray"
                                                count={"Nem munkanap"}
                                            />
                                        ) : (
                                            <Badge
                                                color="green"
                                                count={"Munkanap"}
                                            ></Badge>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-3 items-start w-full">
                                        {dayHours.map((field) => (
                                            <div
                                                key={field.key}
                                                className="flex gap-2 items-center w-full sm:w-auto [&_.ant-form-item]:mb-0"
                                            >
                                                <Form.Item
                                                    name={[
                                                        field.name,
                                                        "dayOfWeek",
                                                    ]}
                                                    hidden
                                                >
                                                    <input type="hidden" />
                                                </Form.Item>
                                                <Form.Item
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Kötelező mező",
                                                        },
                                                    ]}
                                                    name={[
                                                        field.name,
                                                        "startTime",
                                                    ]}
                                                >
                                                    <TimePicker
                                                        needConfirm={false}
                                                        format="HH:mm"
                                                        minuteStep={30}
                                                        placeholder="Nyitás"
                                                    />
                                                </Form.Item>
                                                <span className="text-gray-400 font-medium px-1">
                                                    -
                                                </span>
                                                <Form.Item
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Kötelező mező",
                                                        },
                                                    ]}
                                                    name={[
                                                        field.name,
                                                        "endTime",
                                                    ]}
                                                >
                                                    <TimePicker
                                                        needConfirm={false}
                                                        format="HH:mm"
                                                        minuteStep={30}
                                                        placeholder="Zárás"
                                                    />
                                                </Form.Item>
                                                <Button
                                                    type="text"
                                                    danger
                                                    onClick={() =>
                                                        remove(field.name)
                                                    }
                                                    icon={
                                                        <MdDeleteOutline className="text-lg" />
                                                    }
                                                    className="flex items-center justify-center text-gray-400 hover:text-red-500"
                                                />
                                            </div>
                                        ))}

                                        <Button
                                            type="text"
                                            className="text-primary font-medium p-0 h-auto hover:bg-transparent flex items-center gap-1 mt-1"
                                            icon={<FiPlus />}
                                            onClick={() => {
                                                add({
                                                    dayOfWeek: Number(key),
                                                    startTime: dayjs(
                                                        "09:00",
                                                        "HH:mm",
                                                    ),
                                                    endTime: dayjs(
                                                        "17:00",
                                                        "HH:mm",
                                                    ),
                                                });
                                            }}
                                        >
                                            Új idősáv hozzáadása
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Form.List>
            {footer ? (
                <div className="flex justify-end">
                    <Button type="primary" htmlType="submit">
                        {submitBtnText ? submitBtnText : "Mentés"}
                    </Button>
                </div>
            ) : (
                customFooter
            )}
        </Form>
    );
};

export default OpeningHoursForm;
