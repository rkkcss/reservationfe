import { Button, Form, Input, InputNumber, Modal, Switch } from "antd"
import { Offering } from "../../helpers/types/Offering"
import { useEffect } from "react"
import TextArea from "antd/es/input/TextArea"
import { useTranslation } from "react-i18next"

type EditOfferingProps = {
    visible: boolean,
    onClose: () => void,
    onOk: (offer: Offering) => void,
    offer?: Offering
}

const EditOffering = ({ offer, visible, onClose, onOk }: EditOfferingProps) => {
    const [form] = Form.useForm();
    const { t } = useTranslation('edit-offering');

    const handleCloseModal = () => {
        form.resetFields();
        onClose();
    };

    const handleOnOk = (values: Offering) => {
        if (onOk) {
            const payload = {
                ...values,
                status: values.status ? "ACTIVE" : "INACTIVE",
            };

            onOk(payload);
            form.resetFields();
            onClose();
        }
    }

    useEffect(() => {
        if (offer) {
            form.setFieldsValue({ ...offer, status: offer.status === "ACTIVE" ? true : false });
        }
    }, [offer]);

    return (
        <Modal
            onCancel={handleCloseModal}
            open={visible}
            title={offer?.id
                ? t("edit")
                : t("newService")
            }
            footer={false}
            destroyOnClose
        >
            <Form
                layout="vertical"
                onFinish={handleOnOk}
                form={form}
            >
                <Form.Item hidden name="id"><Input hidden /></Form.Item>
                <Form.Item
                    label={t("serviceName")}
                    name="title"
                    rules={[{ required: true, message: t("requiredField") }]}
                >
                    <Input placeholder={t("serviceName") + "..."} />
                </Form.Item>

                <Form.Item
                    label={t("serviceDescription")}
                    name="description"
                    rules={[{ required: true, message: t("requiredField") }]}
                >
                    <TextArea placeholder={t("serviceDescription") + "..."} maxLength={100} showCount />
                </Form.Item>

                <Form.Item
                    label={t("servicePrice")}
                    name="price"
                    rules={[{ required: true, message: t("requiredField") }]}
                >
                    <InputNumber placeholder={t("servicePrice") + "..."}
                        min={1}
                        className="w-full"
                        suffix="Ft"
                    />
                </Form.Item>

                <Form.Item
                    label={t("serviceDuration")}
                    name="durationMinutes"
                    rules={[{ required: true, message: t("requiredField") }]}
                >
                    <InputNumber placeholder={t("serviceDuration") + "..."}
                        min={1}
                        className="w-full"
                        suffix={t("minutes")}
                    />
                </Form.Item>
                <Form.Item
                    label={t("status")}
                    name="status"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                <div className="flex justify-between mb-0">
                    <Button type="primary" htmlType="submit" className="mt-3">
                        {t("save")}
                    </Button>
                    <Button className="mt-3" onClick={onClose}>
                        {t("cancel")}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default EditOffering;
