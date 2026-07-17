import { Form, Select } from "antd";
import { TIME_OFF_TYPES } from "../../../helpers/types/TimeOff";

type TimeOffTypeSelectorProps = {
    t: (key: string) => string;
};

export const TimeOffTypeSelector = ({ t }: TimeOffTypeSelectorProps) => {
    const options = [
        { label: t("vacation"), value: TIME_OFF_TYPES.VACATION },
        { label: t("sickLeave"), value: TIME_OFF_TYPES.SICK_LEAVE },
        { label: t("other"), value: TIME_OFF_TYPES.OTHER },
    ];

    return (
        <Form.Item
            label={t("type")}
            name="type"
            rules={[{ required: true, message: t("typeRequired") }]}
        >
            <Select options={options} />
        </Form.Item>
    );
};
