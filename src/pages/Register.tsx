import { Form } from "antd"
import { API } from "../utils/API";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { UserStore } from "../store/store";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { UserWithPassword } from "../helpers/types/User";
import RegistrationForm from "../components/Forms/RegistrationForm";


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
        <div>
            <div className="max-w-md mx-auto outline-none mt-10 p-6 border border-gray-100 rounded-lg shadow-lg bg-white">
                <div className="text-center">
                    <h1 className="text-2xl">{t("title")}</h1>
                </div>

                <RegistrationForm
                    submitText={t("title")}
                    onSubmit={onFinish}
                />
            </div>
        </div>
    )
}

export default Register