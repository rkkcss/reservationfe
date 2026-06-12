import { useSelector } from "react-redux";
import { UserStore } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { getAccountBusinessOptions, setActiveBusinessEmployee } from "../redux/userSlice";
import { BusinessEmployee } from "../helpers/types/BusinessEmployee";

const RequireBusiness = () => {
    const { selectedBusinessEmployee } = useSelector((state: UserStore) => state.userStore);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (selectedBusinessEmployee) {
            dispatch(getAccountBusinessOptions())
                .unwrap()
                .then((payload: BusinessEmployee[]) => {
                    if (payload && payload.length > 0) {
                        const found = payload.find((item) => item.id === selectedBusinessEmployee.id);
                        if (found) {
                            dispatch(setActiveBusinessEmployee(found));
                        }
                    }
                });
        }
    }, [dispatch])

    if (!selectedBusinessEmployee) {
        return <Navigate to="/choose-business" replace />;
    }

    return <Outlet />;
}


export default RequireBusiness;
