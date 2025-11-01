import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginModal } from "../components/Login/loginModalController";

export const useLoginModalRouteListener = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.openLogin) {
            loginModal.open();

            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, location.pathname, navigate]);
};
