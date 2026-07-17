import { Checkbox, DatePicker, Form, FormInstance, TimePicker } from "antd";

const { RangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;

type TimeOffDateRangeSelectorProps = {
    form: FormInstance;
    t: (key: string) => string;
};

export const TimeOffDateRangeSelector = ({
    form,
    t,
}: TimeOffDateRangeSelectorProps) => {
    const isFullDay = Form.useWatch("isFullDay", form);

    return (
        <>
            <Form.Item
                name="dateRange"
                label={t("dateRange")}
                rules={[{ required: true, message: t("dateRangeRequired") }]}
            >
                <RangePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>

            <Form.Item name="isFullDay" valuePropName="checked">
                <Checkbox>{t("fullDay")}</Checkbox>
            </Form.Item>

            {!isFullDay && (
                <Form.Item
                    name="timeRange"
                    label={t("timeRange")}
                    rules={[
                        {
                            required: !isFullDay,
                            message: t("timeRangeRequired"),
                        },
                    ]}
                >
                    <TimeRangePicker format="HH:mm" className="w-full" />
                </Form.Item>
            )}
        </>
    );
};
