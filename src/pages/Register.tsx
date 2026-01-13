import { Form, Typography } from "antd"
import { API } from "../utils/API";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { UserStore } from "../store/store";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import { UserWithPassword } from "../helpers/types/User";
import RegistrationForm from "../components/Forms/RegistrationForm";
import { loginModal } from "../components/Login/loginModalController";


const Register = () => {
    const { user } = useSelector((state: UserStore) => state.userStore);
    const navigate = useNavigate();
    const { t } = useTranslation("register");

    const [form] = Form.useForm();
    const { i18n: { language } } = useTranslation();

    const onFinish = (values: UserWithPassword) => {

        const finalUser = { ...values, langKey: language };

        API.post('/api/register', finalUser)
            .then(response => {
                console.log('Registration successful:', response);
                if (response.status === 201) {
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
        <div className="flex flex-col justify-center items-center mt-12">
            <div className="text-center max-w-md mx-auto">
                <Typography.Title level={1}>{t("title")}</Typography.Title>
                <Typography.Text type="secondary">{t("subtitle")}</Typography.Text>
            </div>
            <div className="max-w-md mx-auto outline-none mt-6 p-6 border border-gray-100 rounded-lg shadow-lg bg-white w-full md:w-auto">

                <RegistrationForm
                    submitText={t("title")}
                    onSubmit={onFinish}
                />
                <div className="text-center w-full mt-4">
                    <Typography.Text type="secondary">
                        Van már fiókod? <Link to="#" onClick={() => loginModal.open()}>Jelentkezz be</Link>
                    </Typography.Text>
                </div>
            </div>
            <div className="text-center max-w-md mx-auto mt-5">
                <Typography.Text type="secondary" className="mt-6 text-xs">
                    A regisztrációval elfogadod az <Link to="/terms-of-service" className="underline">Általános Szerződési Feltételeket</Link> és az <Link to="/privacy-policy" className="underline">Adatvédelmi Szabályzatot</Link>.
                    <br /> &copy; {new Date().getFullYear()} Reservation App
                </Typography.Text>
            </div>
        </div>
    )
}

export default Register