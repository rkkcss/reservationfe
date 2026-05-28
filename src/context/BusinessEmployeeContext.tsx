import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { BusinessEmployee } from "../helpers/types/BusinessEmployee";
import { API } from "../utils/API";
import { useNavigate, useParams } from "react-router";
import { UserStore } from "../store/store";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import { Spin } from "antd";

type BusinessEmployeeContextType = {
    businessEmployee: BusinessEmployee | null;
};

const BusinessEmployeeContext = createContext<BusinessEmployeeContextType>({ businessEmployee: null });

export const BusinessEmployeeProvider = ({ children }: { children: ReactNode }) => {
    const [businessEmployee, setBusinessEmployee] = useState<BusinessEmployee | null>(null);
    const { employeeId } = useParams();
    const { selectedBusinessEmployee } = useSelector((state: UserStore) => state.userStore);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        API.get("/api/business-employee/business/" + selectedBusinessEmployee?.business.id + "/employee/" + employeeId)
            .then(res => {
                setBusinessEmployee(res.data);
                setIsLoading(false);
            }).catch(err => {
                setIsLoading(false);
                if (err.status === 403 || err.status === 404) {
                    navigate('/not-found', { replace: true });
                }
            });
    }, [employeeId]);

    return (
        <Spin spinning={isLoading} indicator={<Loading size={30} />}>
            {businessEmployee && (
                <BusinessEmployeeContext.Provider value={{ businessEmployee }}>
                    {children}
                </BusinessEmployeeContext.Provider>
            )}
        </Spin>
    );
};

export const useBusinessEmployee = () => {
    const context = useContext(BusinessEmployeeContext);
    if (!context || !context.businessEmployee) throw new Error("useBusinessEmployee must be used within a BusinessEmployeeContext and can't be null");
    return context as { businessEmployee: BusinessEmployee };
};
