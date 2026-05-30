import { Button, Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { changePassword } from '../helpers/queries/account-queries';
import { useState } from 'react';

const ChangePassword = () => {
    const { t } = useTranslation("register");
    const [error, setError] = useState<string>("");
    const [form] = Form.useForm();

    const handleFormSubmit = (data: { currentPassword: string, newPassword: string }) => {
        setError("");
        changePassword(data)
            .catch((error) => form.setFields([{ name: "currentPassword", errors: [error.message] }]));
    }

    return (
        <>
            <p className="text-xl font-semibold mb-6">Jelszó változtatás</p>
            {
                error &&
                <p className="text-red-500 my-2">{error}</p>
            }
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
            >
                <Form.Item
                    label="Jelenlegi jelszavad"
                    rules={[
                        { required: true, message: "Kötelező mező!" },
                        { min: 6, message: "Legalább 6 karakternek kell lennie!" },
                        { max: 50, message: "Legalább 50 karakternek kell lennie!" },
                    ]}
                    name="currentPassword"
                >
                    <Input type="password" placeholder="Jelenlegi jelszavad..." />
                </Form.Item>
                <Form.Item
                    rules={[
                        { required: true, message: t("passwordRequired") },
                        { min: 8, message: t("passwordValidation1") },
                        { max: 20, message: t("passwordValidation2") },
                        () => ({
                            validator(_, value) {
                                if (!value) return Promise.resolve();

                                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

                                if (!regex.test(value)) {
                                    return Promise.reject(
                                        new Error(t("passwordValidation3"))
                                    );
                                }

                                return Promise.resolve();
                            }
                        })
                    ]}
                    name="newPassword"
                    label="Új jelszó"
                >
                    <Input type="password" placeholder="Új jelszó..." />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="w-full sm:w-fit">
                    Módosít
                </Button>
            </Form>
        </>
    )
}

export default ChangePassword