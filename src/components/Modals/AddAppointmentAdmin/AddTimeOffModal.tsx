import { Button, Form, Modal, Popconfirm, Select, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import { CreateTimeOffType, TimeOff } from "../../../helpers/types/TimeOff";
import { MdDeleteForever } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useTimeOffForm } from "./useTimeOffForm";
import { TimeOffTypeSelector } from "./TimeOffTypeSelector";
import { TimeOffDateRangeSelector } from "./TimeOffDateRangeSelector";
import { useEmployees } from "../../../pages/Calendar/useEmployees";
import { BiUser } from "react-icons/bi";
import { useEffect } from "react";

type AddTimeOffModalProps = {
    open: boolean;
    onClose: () => void;
    timeOff?: TimeOff;
    onOk?: (timeOff: CreateTimeOffType) => void;
    deleteTimeOff?: (timeOffId: number) => void;
};

const AddTimeOffModal = ({
    open,
    onClose,
    timeOff,
    onOk,
    deleteTimeOff,
}: AddTimeOffModalProps) => {
    const { t } = useTranslation("add-timeoff-modal");
    const employees = useEmployees();
    const { form, handleOnFinish } = useTimeOffForm(
        timeOff,
        open,
        onClose,
        onOk,
    );

    const handleDelete = () => {
        if (timeOff?.id && deleteTimeOff) deleteTimeOff(timeOff.id);
        onClose();
    };

    useEffect(() => {
        console.log(timeOff);
        // Ha be van zárva a modal, vagy nincs meg az alkalmazott adata, nem csinálunk semmit
        if (!open || !timeOff?.businessEmployee) return;

        // Ha a timeOff.businessEmployee egy OBJEKTUM, akkor a .id kell nekünk:
        const employeeId =
            typeof timeOff.businessEmployee === "object"
                ? timeOff.businessEmployee.id
                : timeOff.businessEmployee;

        form.setFieldsValue({
            businessEmployee: employeeId,
        });
    }, [form, open, timeOff]);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={timeOff?.id ? t("editTimeOff") : t("addTimeOff")}
            footer={null}
            destroyOnHidden
        >
            <div className="mt-8">
                <Form
                    layout="vertical"
                    initialValues={timeOff}
                    onFinish={handleOnFinish}
                    form={form}
                    key={`${timeOff?.id ?? "new"}-${open ? "open" : "closed"}`}
                >
                    <Form.Item name="id" hidden />

                    <Form.Item
                        label={t("employee")}
                        name="businessEmployee" // <-- Ennek meg kell egyeznie a form.setFieldsValue kulcsával!
                        rules={[{ required: true, message: "Kötelező mező!" }]}
                    >
                        <Select
                            labelRender={(e) => (
                                <div className="flex items-center gap-1">
                                    <p className="text-sm">{e.label}</p>
                                </div>
                            )}
                            optionRender={(e) => (
                                <div className="flex items-center gap-2">
                                    <BiUser size={20} />
                                    <p className="text-sm">{e.label}</p>
                                </div>
                            )}
                        >
                            {employees.map((employee) => (
                                <Select.Option
                                    key={employee.id}
                                    value={employee.id} // <-- Mivel ez egy szám (ID), a form.setFieldsValue-nak is számot kell adni!
                                >
                                    {employee.user.fullName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <TimeOffTypeSelector t={t} />
                    <TimeOffDateRangeSelector form={form} t={t} />

                    <Form.Item label={t("note")} name="note">
                        <TextArea placeholder={t("note") + "..."} />
                    </Form.Item>

                    <div className="flex justify-between items-center mt-4">
                        {timeOff?.id && deleteTimeOff && (
                            <Tooltip
                                title={t("deleteTimeOff")}
                                placement="bottom"
                            >
                                <Popconfirm
                                    title={t("confirmDeleteTimeOff")}
                                    onConfirm={handleDelete}
                                >
                                    <Button
                                        type="text"
                                        icon={
                                            <MdDeleteForever
                                                size={24}
                                                color="red"
                                            />
                                        }
                                        shape="circle"
                                    />
                                </Popconfirm>
                            </Tooltip>
                        )}
                        <div className="flex gap-2">
                            <Button type="primary" htmlType="submit">
                                {timeOff?.id
                                    ? t("editTimeOff")
                                    : t("addTimeOff")}
                            </Button>
                            <Button onClick={onClose}>{t("cancel")}</Button>
                        </div>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default AddTimeOffModal;
