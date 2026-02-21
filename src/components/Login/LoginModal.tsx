// LoginModal.tsx
import { useState, useEffect } from "react";
import { Alert, Button, Form, Input, Modal, Typography } from "antd";
import { loginModal, setLoginModalController } from "./loginModalController";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/es/form/Form";
import { LoginForm, loginUser } from "../../redux/userSlice";
import Checkbox from "antd/es/checkbox/Checkbox";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const LoginModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { t } = useTranslation("login-modal");
    const [form] = useForm();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.userStore);
    const navigate = useNavigate();

    useEffect(() => {
        setLoginModalController({
            open: (onSuccess) => {
                setIsOpen(true);
                loginModal._onSuccessCallback = onSuccess;
            },
            close: () => {
                setIsOpen(false);
                setErrorMsg("");
                form.resetFields();
                loginModal._onSuccessCallback = undefined;
            },
        });
    }, [form]);

    const submitLogin = (e: LoginForm) => {
        setErrorMsg("");

        dispatch(loginUser(e))
            .unwrap()
            .then(() => {
                const callback = loginModal._onSuccessCallback;
                loginModal.close();

                if (callback) {
                    callback();
                } else {
                    navigate("/choose-business");
                }
            })
            .catch((err) => {
                if (err.status === 401) {
                    setErrorMsg(err.message);
                } else {
                    setErrorMsg(t("somethingWentWrong"));
                }
            });
    };

    const handleNavigateRegister = () => {
        loginModal.close();
        navigate("/register");
    };

    return (
        <Modal
            open={isOpen}
            onCancel={() => loginModal.close()}
            footer={null}
            title={
                <p className="text-2xl font-bold">
                    {t("loginHeader")}
                </p>
            }
            width={400}
        >
            {errorMsg &&
                <Alert showIcon className="my-4" type="error" message={errorMsg} />
            }
            <Form form={form} layout="vertical" onFinish={submitLogin} className={`${!errorMsg && 'pt-4'} px-1`}>
                <Form.Item name="username" label={t("username")}
                    rules={[{ required: true, message: t("required") }]}
                >
                    <Input type="text" placeholder={t("username") + "..."} />
                </Form.Item>
                <Form.Item name="password" label={t("password")}
                    rules={[{ required: true, message: t("required") }]}
                >
                    <Input type="password" placeholder={t("password") + "..."} />
                </Form.Item>
                <Form.Item name="remember-me" valuePropName="checked" label={null}>
                    <Checkbox>{t("rememberMe")}</Checkbox>
                </Form.Item>
                <div className="flex justify-between">
                    <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                        {t("submit")}
                    </Button>
                </div>
            </Form>
            <div className="mt-4 text-center text-sm">
                <Typography.Link onClick={handleNavigateRegister} className="">
                    {t("dontHaveAccountLink")}
                </Typography.Link>
            </div>
        </Modal>
    );
};

export default LoginModal;