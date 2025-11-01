import { Button, Form, Input, message } from "antd"
import { API } from "../utils/API";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { User } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { UserStore } from "../store/store";
import { useNavigate } from "react-router";
import { useEffect } from "react";


const Register = () => {
    const { user } = useSelector((state: UserStore) => state.userStore);
    const navigate = useNavigate();
    const { t } = useTranslation("register");

    const [form] = Form.useForm();
    const { i18n: { language } } = useTranslation();

    const onFinish = (values: User) => {

        const finalUser = { ...values, langKey: language };

        API.post('/api/register', finalUser)
            .then(response => {
                console.log('Registration successful:', response);
                if (response.status === 201) {
                    message.success(t("registrationSuccess"), 6000);
                    form.resetFields();
                }
            })
            .catch((error: AxiosError) => {
                console.error('Registration failed:', error);
                if (error.message === "error.userexists") {
                    form.setFields([
                        {
                            name: 'login',
                            errors: [t("error.userexists")]
                        }
                    ])
                }
                if (error.message === "error.emailexists") {
                    form.setFields([
                        {
                            name: 'email',
                            errors: [t("error.emailexists")]
                        }
                    ])
                }
            })
    }

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    return (
        <div>
            <div className="max-w-md mx-auto outline-none mt-10 p-6 border border-gray-100 rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl">{t("title")}</h1>
                </div>

                <Form layout="vertical"
                    className="mt-6"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label={t("username")}
                        name="login"
                        rules={[{ required: true, message: t("loginRequired") }]}
                    >
                        <Input name="login" placeholder={t("login") + "..."} />
                    </Form.Item>

                    <Form.Item
                        label={t("email")}
                        name="email"
                        rules={[
                            { required: true, message: t("emailRequired") },
                            () => ({
                                validator(_, value) {
                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(value)) {
                                        return Promise.reject(t("validEmail"));
                                    }
                                    return Promise.resolve();
                                }
                            })
                        ]}
                    >
                        <Input name="email" placeholder={t("email") + "..."} />
                    </Form.Item>

                    <Form.Item
                        label={t("firstName")}
                        name="firstName"
                        rules={[{ required: true, message: t("firstName") }]}
                    >
                        <Input name="firstName" placeholder={t("firstName") + "..."} />
                    </Form.Item>

                    <Form.Item
                        label={t("lastName")}
                        name="lastName"
                        rules={[{ required: true, message: t("lastName") }]}
                    >
                        <Input name="lastName" placeholder={t("lastName") + "..."} />
                    </Form.Item>
                    <Form.Item
                        label={t("password")}
                        name="password"
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
                        <Input.Password name="password" placeholder={t("password") + "..."} />
                    </Form.Item>

                    <Form.Item
                        label={t("confirmPassword")}
                        name="passwordAgain"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: t("confirmPasswordRequired") },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t("passwordMismatch")));
                                }
                            })
                        ]}
                    >
                        <Input.Password name="passwordAgain" placeholder={t("confirmPassword") + "..."} />
                    </Form.Item>
                    <Button className="w-full" type="primary" htmlType="submit">{t("title")}</Button>
                </Form>
            </div>
        </div>
    )
}

export default Register