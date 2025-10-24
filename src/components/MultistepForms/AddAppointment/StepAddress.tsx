import { Form, Input } from "antd";
import { isValidPhoneNumber } from "libphonenumber-js";

const StepPersonalData: React.FC = () => {

    return (
        <>
            <Form.Item
                name="name"
                label="Vendég neve"
                rules={[{ required: true, message: 'Kérjük válasszon vendéget!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'E-mail címed...' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="phoneNumber"
                label="Telefonszám"
                rules={[
                    {
                        required: true, message: 'Telefonszám...'
                    },
                    {
                        validator(_, value) {
                            if (!value || isValidPhoneNumber(value)) {
                                return Promise.resolve();
                            }
                            return Promise.reject("Érvénytelen telefonszám formátum!");
                        },
                    },
                ]}
            >
                <Input />
            </Form.Item>
        </>
    );
}

export default StepPersonalData;
