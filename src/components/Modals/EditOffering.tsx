import { Button, Form, Input, InputNumber, Modal } from "antd"
import { Offering } from "../../helpers/types/Offering"
import { useEffect } from "react"
import TextArea from "antd/es/input/TextArea"

type EditOfferingProps = {
    visible: boolean,
    onClose: () => void,
    onOk: (offer: Offering) => void,
    offer?: Offering
}

const EditOffering = ({ offer, visible, onClose, onOk }: EditOfferingProps) => {
    const [form] = Form.useForm();

    const handleCloseModal = () => {
        form.resetFields();
        onClose();
    };

    useEffect(() => {
        if (offer) {
            form.setFieldsValue(offer);
        } else {
            form.resetFields();
        }
    }, [offer]);

    return (
        <Modal
            onCancel={handleCloseModal}
            open={visible}
            title={offer?.id
                ? "Szerkesztés"
                : "Új szolgáltatás hozzáadása"
            }
            footer={false}
        >
            <Form
                layout="vertical"
                onFinish={onOk}
                form={form}
            >
                <Form.Item hidden name="id"><Input hidden /></Form.Item>
                <Form.Item
                    label="Fejléc"
                    name="title"
                    rules={[{ required: true, message: "Kötelező mező!" }]}
                >
                    <Input placeholder="Fejléc..." />
                </Form.Item>

                <Form.Item
                    label="Leírás"
                    name="description"
                    rules={[{ required: true, message: "Kötelező mező!" }]}
                >
                    <TextArea placeholder="Leírás..." />
                </Form.Item>

                <Form.Item
                    label="Szolgáltatás ára"
                    name="price"
                    rules={[{ required: true, message: "Kötelező mező!" }]}
                >
                    <InputNumber placeholder="Ár..." min={1} className="w-full" />
                </Form.Item>

                <Form.Item
                    label="Idő"
                    name="durationMinutes"
                    rules={[{ required: true, message: "Kötelező mező!" }]}
                >
                    <InputNumber placeholder="Idő..." min={1} className="w-full" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full mt-3">
                        Mentés
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default EditOffering;
