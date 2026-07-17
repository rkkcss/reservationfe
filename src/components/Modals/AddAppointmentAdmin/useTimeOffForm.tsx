import { useEffect } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import {
    TimeOff,
    TIME_OFF_TYPES,
    CreateTimeOffType,
    CreateTimeOffFormType,
} from "../../../helpers/types/TimeOff";

export function useTimeOffForm(
    timeOff: TimeOff | undefined,
    open: boolean,
    onClose: () => void,
    onOk?: (timeOff: CreateTimeOffType) => void,
) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                ...timeOff,
                type: timeOff?.type ?? TIME_OFF_TYPES.VACATION,
                isFullDay: !timeOff?.startTime && !timeOff?.endTime,
                dateRange: [
                    timeOff?.startDate ? dayjs(timeOff.startDate) : undefined,
                    timeOff?.endDate ? dayjs(timeOff.endDate) : undefined,
                ],
                timeRange: [
                    timeOff?.startTime
                        ? dayjs(timeOff.startTime, "HH:mm")
                        : undefined,
                    timeOff?.endTime
                        ? dayjs(timeOff.endTime, "HH:mm")
                        : undefined,
                ],
            });
        }
    }, [open, timeOff, form]);

    const handleOnFinish = (values: CreateTimeOffFormType) => {
        const isFullDay = values.isFullDay;
        const [startDate, endDate] = values.dateRange;
        const [startTime, endTime] = values.timeRange ?? [undefined, undefined];
        console.log("VALUES", values);
        const payload: CreateTimeOffType = {
            id: timeOff?.id ?? null,
            businessEmployeeId:
                values.businessEmployee ?? values?.businessEmployee,
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            startTime: isFullDay ? null : (startTime?.format("HH:mm") ?? null),
            endTime: isFullDay ? null : (endTime?.format("HH:mm") ?? null),
            type: values.type,
            note: values.note ?? "",
        };
        onOk?.(payload);
        onClose();
    };

    return { form, handleOnFinish };
}
