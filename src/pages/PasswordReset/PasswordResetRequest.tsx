
import { useNavigate } from 'react-router'
import { Button, Card, Form, Input, Typography } from 'antd';
import { FaArrowLeft } from 'react-icons/fa';
import { passwordResetRequest } from '../../helpers/queries/account-queries';
import { notificationManager } from '../../utils/notificationConfig';

const PasswordResetRequest = () => {
    const navigate = useNavigate();

    const handleFormFinish = ({ mail }: { mail: string }) => {
        passwordResetRequest(mail)
            .then(() => {
                notificationManager.success("password-reset-request", {
                    title: "Sikeres kiküldés",
                    description: "Elküldtük e-mailben a jelszó visszaállito linket.",
                    duration: 5
                })
            });
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-[90%] sm:w-[450px] text-center shadow-lg rounded-2xl">
                <Typography.Title level={2} className="!font-bold">Elfelejtette jelszavát?</Typography.Title>
                <Typography.Paragraph>Adja meg az e-mail címét, és küldünk egy linket a jelszó visszaállításához.</Typography.Paragraph>
                <Form
                    layout="vertical"
                    onFinish={handleFormFinish}
                >
                    <Form.Item
                        label="E-mail cim"
                        name="mail"
                        rules={[
                            { required: true, message: "Kötelező mező!" },
                            () => ({
                                validator(_, value) {
                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(value)) {
                                        return Promise.reject("E-mail formátum nem megfelelő!");
                                    }
                                    return Promise.resolve();
                                }
                            })
                        ]}
                    >
                        <Input placeholder="pelda@email.com" type="email" />
                    </Form.Item>
                    <Button
                        htmlType="submit"
                        className="w-full"
                        type="primary"
                    >
                        Visszaállito link küldése
                    </Button>

                    <Button
                        className="w-full mt-6"
                        type="link"
                        icon={<FaArrowLeft />}
                        onClick={() => navigate("/home", { state: { openLogin: true } })}
                    >
                        Vissza a bejelentkezéshez
                    </Button>

                </Form>
            </Card>
        </div>
    )
}

export default PasswordResetRequest