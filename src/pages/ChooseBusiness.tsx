import { useEffect, useState } from 'react'
import { BusinessEmployee } from '../helpers/types/BusinessEmployee';
import { API } from '../utils/API';
import { useSelector } from 'react-redux';
import { UserStore } from '../store/store';
import { LiaIndustrySolid } from "react-icons/lia";
import { Alert, Badge, Button, Spin } from 'antd';
import { useAppDispatch } from '../store/hooks';
import { logoutUser, setActiveBusinessEmployee } from '../redux/userSlice';
import { useNavigate } from 'react-router';
import { IoLogOutOutline } from 'react-icons/io5';
import { businessEmployeeRoleLabels } from '../helpers/types/BusinessEmployeeRole';
import Loading from '../components/Loading';

const ChooseBusiness = () => {
    const [businessEmployees, setBusinessEmployees] = useState<BusinessEmployee[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state: UserStore) => state.userStore)
    const dispatch = useAppDispatch();
    const [logoError, setLogoError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        API.get("/api/business-employee/current")
            .then(res => {
                if (res.status === 200) {
                    setBusinessEmployees(res.data);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSelectBusinessEmployee = (businessEmployee: BusinessEmployee) => {
        dispatch(setActiveBusinessEmployee(businessEmployee));
        navigate("/dashboard")
    }
    return (
        <div className="flex items-center justify-center h-screen flex-col gap-20">
            <h1 className="text-4xl text-center">Üdv
                <span className="ml-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                    {user?.firstName + " " + user?.lastName}
                </span>
            </h1>
            <div>
                <Alert className="mb-2" showIcon message={"Válasszd ki melyik vállalkozásba szeretnél belépni."} />
                <Spin spinning={loading} indicator={<Loading size={30} />}>
                    <div>
                        <div className="p-6 shadow-lg rounded-lg bg-white w-[600px]">
                            <ul className="flex flex-col gap-4">
                                {businessEmployees.map((businessEmployee) => (
                                    <li key={businessEmployee.id}
                                        onClick={() => handleSelectBusinessEmployee(businessEmployee)}
                                        className="
                                        flex group items-center 
                                        outline outline-1 outline-gray-300 
                                        hover:outline-indigo-600 
                                        hover:text-indigo-600 
                                        cursor-pointer p-2 
                                        rounded-lg "
                                    >
                                        {(!businessEmployee.business.logo || logoError) ? (
                                            <LiaIndustrySolid className="w-10 h-10 " />
                                        ) : (
                                            <img
                                                src={businessEmployee.business.logo}
                                                onError={() => setLogoError(true)}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        )}
                                        <div className="ml-2">
                                            <p className="text-base font-semibold leading-3">
                                                {businessEmployee.business.name}
                                            </p>
                                            <div>
                                                <Badge size="small" count={businessEmployeeRoleLabels[businessEmployee.role]} />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <Button type="text"
                                className="w-full mt-4"
                                icon={<IoLogOutOutline size={20} />}
                                onClick={() => dispatch(logoutUser())}
                            >
                                Inkább kilépek
                            </Button>
                        </div>
                    </div>
                </Spin>
            </div>
        </div>
    )
}

export default ChooseBusiness