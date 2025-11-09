import { useState, useEffect } from "react";
import { Alert, Button, Form, Input, message, Modal } from "antd";
import { loginModal, setLoginModalController } from "./loginModalController";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/es/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { LoginForm, loginUser, User } from "../../redux/userSlice";
import { UserStore } from "../../store/store";
import { PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import Checkbox from "antd/es/checkbox/Checkbox";
import { useLocation, useNavigate } from "react-router";

const LoginModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { t } = useTranslation("login-modal");
    const [form] = useForm();
    const dispatch: ThunkDispatch<User, User, PayloadAction> = useDispatch();
    const { loading } = useSelector((state: UserStore) => state.userStore);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        setLoginModalController({
            open: () => setIsOpen(true),
            close: () => {
                setIsOpen(false);
                setErrorMsg("");
                form.resetFields();
            },
        });
    }, [form]);

    const submitLogin = (e: LoginForm) => {
        setErrorMsg("");

        dispatch(loginUser(e))
            .unwrap()
            .then((res) => {
                message.success(res.message);
                loginModal.close();
                if (pathname === "/") {
                    navigate("/dashboard");
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
    }

    return (
        <Modal
            open={isOpen}
            onCancel={() => loginModal.close()}
            footer={null}
            title={t("loginHeader")}
            width={400}
        >
            {errorMsg &&
                <Alert showIcon className="my-4" type="error" message={errorMsg} />
            }
            <Form form={form} layout="vertical" onFinish={submitLogin}>
                <Form.Item name="username" label={t("username")}
                    rules={
                        [{ required: true, message: t("required") }]
                    }
                >
                    <Input type="text" placeholder="login" />
                </Form.Item>
                <Form.Item name="password" label={t("password")}
                    rules={
                        [{ required: true, message: t("required") }]
                    }
                >
                    <Input type="password" placeholder={t("password")} />
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
            <Button size="small" type="text" onClick={handleNavigateRegister} className="w-full mt-4">{t("dontHaveAccountLink")}</Button>
        </Modal>
    );
};

export default LoginModal;