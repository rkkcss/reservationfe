
import { useNavigate } from "react-router";
import { Button, Image } from "antd";
import { FaChevronLeft } from "react-icons/fa";
import defaultImg from "../../assets/defaultUserImg.png"
import EmployeeTabs from "./EmployeeTabs";
import { useBusinessEmployee } from "../../context/BusinessEmployeeContext";

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
                    <Image
                        src={businessEmployee?.user?.imageUrl ? businessEmployee.user?.imageUrl : defaultImg}
                        preview={false}
                        className="rounded-full"
                        width={100}
                        height={100}
                    />
                    <div>
                        <p className="text-3xl">
                            {businessEmployee?.user?.firstName} {businessEmployee?.user?.lastName}
                        </p>
                        <p>
                            {businessEmployee?.role}
                        </p>
                    </div>
                </div>
                <EmployeeTabs />
            </div>
        </div>
    )
}

export default SettingsEmployeePage