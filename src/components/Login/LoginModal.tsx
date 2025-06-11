import { useState, useEffect } from "react";
import { Alert, Button, Form, Input, message, Modal } from "antd";
import { loginModal, setLoginModalController } from "./loginModalController";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/es/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, User } from "../../redux/userSlice";
import { UserStore } from "../../store/store";
import { PayloadAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchCsrfToken } from "../../helpers/queries/accountService";
import Checkbox from "antd/es/checkbox/Checkbox";

const LoginModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { t } = useTranslation();
    const [form] = useForm();
    const dispatch: ThunkDispatch<User, User, PayloadAction> = useDispatch();
    const { loading } = useSelector((state: UserStore) => state.userStore);

    useEffect(() => {
        setLoginModalController({
            open: () => setIsOpen(true),
            close: () => {
                setIsOpen(false);
                setErrorMsg("");
                form.resetFields();
            },
        });
    }, []);

    const submitLogin = (e) => {
        setErrorMsg("");

        dispatch(loginUser(e))
            .then((res) => {
                if (!res?.payload) return;
                if (res.payload.status === 200) {
                    loginModal.close();
                    message.success(res.payload.message);
                } else {
                    if (res.payload.status === 401) {
                        setErrorMsg(res.payload.message);
                    } else {
                        setErrorMsg(t("loginModal.somethingWentWrong"));
                    }
                }

            })
            .catch((err) => {
                setErrorMsg("An unexpected error occurred");
            });
    };

    useEffect(() => {
        if (isOpen) {
            fetchCsrfToken();
        }
    }, [isOpen])

    return (
        <Modal
            open={isOpen}
            onCancel={() => loginModal.close()}
            footer={null}
            title={t("loginModal.loginHeader")}
            width={400}
        >
            {errorMsg &&
                <Alert showIcon className="my-4" type="error" message={errorMsg} />
            }
            <Form form={form} layout="vertical" onFinish={submitLogin}>
                <Form.Item name="username" label={t("loginModal.username")}
                    rules={
                        [{ required: true, message: t("loginModal.required") }]
                    }
                >
                    <Input type="text" placeholder="login" />
                </Form.Item>
                <Form.Item name="password" label={t("loginModal.password")}
                    rules={
                        [{ required: true, message: t("loginModal.required") }]
                    }
                >
                    <Input type="password" placeholder={t("loginModal.password")} />
                </Form.Item>
                <Form.Item name="remember-me" valuePropName="checked" label={null}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <div className="flex justify-between">

                    <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                        {t("loginModal.submit")}
                    </Button>
                </div>
            </Form>
            <Button size="small" type="text" className="w-full mt-4">{t("loginModal.dontHaveAccountLink")}</Button>
        </Modal>
    );
};

export default LoginModal;