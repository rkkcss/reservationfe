import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { API } from "../../utils/API";
import { CheckCircleOutlined, LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";

const RegisterActivation = () => {
    const [searchParams] = useSearchParams();
    const key = searchParams.get("key");
    const navigate = useNavigate();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        if (key) {
            API.get(`/api/activate?key=${key}`)
                .then(() => setStatus("success"))
                .catch(() => setStatus("error"));
        } else {
            setStatus("error");
        }
    }, [key]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <Card className="w-[90%] sm:w-[400px] text-center shadow-lg rounded-2xl">
                {status === "loading" && (
                    <div className="flex flex-col items-center space-y-4 py-6">
                        <LoadingOutlined className="text-4xl text-blue-500 animate-spin" />
                        <h2 className="text-xl font-semibold">Fiók aktiválása folyamatban...</h2>
                        <p className="text-gray-500">Kérjük, várjon néhány másodpercet.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center space-y-4 py-6">
                        <CheckCircleOutlined className="text-5xl text-green-500" />
                        <h2 className="text-2xl font-semibold text-green-600">Sikeres aktiválás!</h2>
                        <p className="text-gray-600">Most már bejelentkezhet a fiókjába.</p>
                        <Button type="primary" onClick={() => navigate("/home", { state: { openLogin: true } })} className="mt-3">
                            Bejelentkezés
                        </Button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center space-y-4 py-6">
                        <CloseCircleOutlined className="text-5xl text-red-500" />
                        <h2 className="text-2xl font-semibold text-red-600">Érvénytelen link!</h2>
                        <p className="text-gray-600">
                            Úgy tűnik, ez az aktivációs link már lejárt vagy hibás.
                        </p>
                        <Button type="primary" href="/register" danger className="mt-3">
                            Új regisztráció
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default RegisterActivation;
