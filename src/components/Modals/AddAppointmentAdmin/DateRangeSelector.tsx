import { DatePicker, Form, FormInstance } from 'antd';
import { TFunction } from 'i18next';

export const DateRangeSelector = ({ form, t }: { form: FormInstance, t: TFunction }) => (
    <>
        <Form.Item
            label={t("appointmentStartAt")}
            rules={[{ required: true, message: t("pleaseSelectDate") }]}
            name="startDate"
        >
            <DatePicker format="YYYY.MM.DD HH:mm" showTime={{ format: "HH:mm", minuteStep: 5 }} className="w-full" />
        </Form.Item>

        <Form.Item
            label={t("appointmentEndAt")}
            name="endDate"
            rules={[
                { required: true, message: t("pleaseSelectDate") },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        const start = getFieldValue("startDate");
                        if (!value || !start || value.isAfter(start)) {
                            return Promise.resolve();
                        }
                        return Promise.reject(t("cantBeforeStart"));
                    },
                }),
            ]}
        >
            <DatePicker
                format="YYYY.MM.DD HH:mm"
                showTime={{ format: "HH:mm", minuteStep: 5 }}
                className="w-full"
                disabledDate={(current) => {
                    const start = form.getFieldValue("startDate");
                    return start && current && current.isBefore(start.startOf("day"));
                }}
                disabledTime={(current) => {
                    const start = form.getFieldValue("startDate");
                    if (!start || !current) return {};
                    if (current.isSame(start, "day")) {
                        return {
                            disabledHours: () => [...Array(24).keys()].filter(h => h < start.hour()),
                            disabledMinutes: (h) =>
                                h === start.hour()
                                    ? [...Array(60).keys()].filter(m => m < start.minute())
                                    : [],
                        };
                    }
                    return {};
                }}
            />
        </Form.Item>
    </>
);