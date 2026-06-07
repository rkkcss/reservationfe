import { Button, Card, Form, Input, Typography } from 'antd';
import { useNavigate, useSearchParams } from 'react-router';
import { passwordResetWithKey } from '../../helpers/queries/account-queries';
import { notificationManager } from '../../utils/notificationConfig';
import { useTranslation } from 'react-i18next';

const PasswordResetFinish = () => {
    const { t } = useTranslation("register");
    const [searchParams] = useSearchParams();
    const key = searchParams.get("key");
    const navigate = useNavigate();

    const handleFormFinish = ({ newPassword }: { newPassword: string }) => {
        if (!key) return;
        passwordResetWithKey({ key, newPassword })
            .then(() => {
                notificationManager.success("password-reset-finish",
                    { title: "Sikeres jelszó visszaállítás" });
                navigate("/home", { state: { openLogin: true } });
            });

    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-[90%] sm:w-[450px] text-center shadow-lg rounded-2xl">
                <Typography.Title level={2} className="!font-bold">Új jelszó véglegesítése</Typography.Title>
                <Typography.Paragraph>Állítsd be új jelszavadat, amit ezen túl fogsz tudni használni.</Typography.Paragraph>
                <Form
                    layout="vertical"
                    onFinish={handleFormFinish}
                >
                    <Form.Item
                        label="Új jelszó"
                        name="newPassword"
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
                    >
                        <Input placeholder="Új jelszó..." type="password" />
                    </Form.Item>
                    <Button
                        htmlType="submit"
                        className="w-full mt-3"
                        type="primary"
                    >
                        Jelszó visszaállítás
                    </Button>
                </Form>
            </Card>
        </div>
    )
}

export default PasswordResetFinish