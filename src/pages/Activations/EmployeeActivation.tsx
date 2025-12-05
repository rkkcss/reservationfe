import { useEffect, useState } from "react"
import { activateBusinessEmployeeInvite, getActivateBusinessEmployeeInviteQuery } from "../../helpers/queries/business-employee-invite-queries"
import { useLocation, useNavigate } from "react-router"
import { Alert, Button, Result } from "antd";
import { EmployeeInviteActivateType } from "../../helpers/types/BusinessEmployeeInvite";
import { UserWithPassword } from "../../helpers/types/User";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAccountInfo } from "../../redux/userSlice";
import RegistrationForm from "../../components/Forms/RegistrationForm";
import { AxiosError } from "axios";
import { loginModal } from "../../components/Login/loginModalController";

const EmployeeActivation = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const [invite, setInvite] = useState<EmployeeInviteActivateType | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [error, setError] = useState<string | null>(null);
    const { user } = useAppSelector(state => state.userStore);

    useEffect(() => {
        if (token) {
            getActivateBusinessEmployeeInviteQuery(token)
                .then((response) => {
                    if (response.status === 200) {
                        setInvite(response.data);
                        return
                    }
                })
                .catch((error: AxiosError) => {
                    setError(error.message)
                });
        }
    }, []);

    const joinToBusiness = async () => {
        if (!user) {
            loginModal.open()
        }

    }

    const activateAndRegisterUser = async (values: UserWithPassword) => {
        if (!token) return;

        try {
            const response = await activateBusinessEmployeeInvite(token, values);

            if (response.status === 204) {
                await dispatch(getAccountInfo());
                navigate('/choose-business');
            }
        } catch (error) {
            console.error('Activation error:', error);
        }
    };

    if (error) {
        return (
            <>
                <div className="w-fit flex justify-center mx-auto items-center h-screen my-auto">
                    <div className="outline outline-1 outline-gray-200 bg-white p-4 shadow-lg rounded-lg lg:min-w-[500px]">
                        <Result
                            status="error"
                            title="Hiba történt"
                            subTitle="Érvénytelen vagy lejárt meghívó link"
                            extra={[

                                <div className="flex gap-2 justify-center">
                                    <Button type="primary" key="console" onClick={() => navigate("/")}>
                                        Kezdőlap
                                    </Button>
                                </div>

                            ]}
                        />
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="w-full max-w-lg">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-3">
                            Csatlakozz hozzánk!
                        </h1>
                        <p className="text-lg text-gray-600">
                            <span className="font-semibold text-indigo-600">{invite?.businessEmployeeInvite.business.name}</span> csapata vár rád
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
                        {
                            invite?.userExists ? (
                                <>
                                    <Alert
                                        message="Már létezik fiókod a rendszerben. Egyszerű kattintással csatlakozhatsz a csapathoz."
                                        type="info"
                                        showIcon
                                        className="mb-6 border-l-4 border-blue-500 rounded-lg"
                                    />
                                    <Button type="primary" className="w-full" onClick={joinToBusiness}>Csatlakozás</Button>
                                </>
                            )
                                :
                                <>
                                    <Alert
                                        message="Hozd létre a fiókodat, hogy csatlakozhass a csapathoz"
                                        type="info"
                                        showIcon
                                        className="mb-6 border-l-4 border-blue-500 rounded-lg"
                                    />
                                    <RegistrationForm onSubmit={activateAndRegisterUser} />
                                </>
                        }

                    </div>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Kérdésed van? Írj nekünk: <a href="mailto:support@example.com" className="text-indigo-600 hover:underline">support@example.com</a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default EmployeeActivation