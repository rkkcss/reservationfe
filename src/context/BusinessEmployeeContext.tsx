import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { BusinessEmployee } from "../helpers/types/BusinessEmployee";
import { API } from "../utils/API";
import { useNavigate, useParams } from "react-router";
import { UserStore } from "../store/store";
import { useSelector } from "react-redux";

type BusinessEmployeeContextType = {
    businessEmployee: BusinessEmployee | null;
};

const BusinessEmployeeContext = createContext<BusinessEmployeeContextType>({ businessEmployee: null });

export const BusinessEmployeeProvider = ({ children }: { children: ReactNode }) => {
    const [businessEmployee, setBusinessEmployee] = useState<BusinessEmployee>({} as BusinessEmployee);
    const { employeeId } = useParams();
    const { selectedBusinessEmployee } = useSelector((state: UserStore) => state.userStore);
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/api/business-employee/business/" + selectedBusinessEmployee?.business.id + "/employee/" + employeeId)
            .then(res => {
                setBusinessEmployee(res.data);
            }).catch(err => {
                if (err.status === 403 || err.status === 404) {
                    navigate('/not-found', { replace: true });
                }
            });
    }, [employeeId]);

    return (
        <BusinessEmployeeContext.Provider
            value={{
                businessEmployee
            }}
        >
            {children}
        </BusinessEmployeeContext.Provider>
    );
};

export const useBusinessEmployee = () => {
    const context = useContext(BusinessEmployeeContext);
    if (!context) throw new Error("useBusinessEmployee must be used within a BusinessEmployeeContext");
    return context;
};
