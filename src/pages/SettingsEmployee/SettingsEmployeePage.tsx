
import { useNavigate } from "react-router";
import { Badge, Button } from "antd";
import { FaChevronLeft } from "react-icons/fa";
import EmployeeTabs from "./EmployeeTabs";
import { useBusinessEmployee } from "../../context/BusinessEmployeeContext";
import UserAvatar from "../../components/UserAvatar";
import { employeeRolesExtended } from "../../helpers/types/BusinessEmployeeRole";

const SettingsEmployeePage = () => {
    const { businessEmployee } = useBusinessEmployee();
    const navigate = useNavigate();

    return (
        <div className="w-full h-full p-5">
            <div className="flex items-center gap-4">
                <Button icon={<FaChevronLeft />}
                    type="link"
                    onClick={() => navigate(-1)}
                >Vissza</Button>
            </div>
            <div className="mt-4">
                <div className="flex items-center gap-4">
                    <UserAvatar className="w-20 h-20" />
                    <div>
                        <p className="text-3xl">
                            {businessEmployee.user.firstName} {businessEmployee.user.lastName}
                        </p>
                        <p>
                            <Badge
                                count={employeeRolesExtended[businessEmployee.role].label}
                                color={employeeRolesExtended[businessEmployee.role].color}
                            />
                        </p>
                    </div>
                </div>
                <EmployeeTabs />
            </div>
        </div>
    )
}

export default SettingsEmployeePage