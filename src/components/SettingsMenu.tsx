import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router'
import { Authorities } from '../helpers/types/Authorities'
import { useSelector } from 'react-redux'
import { UserStore } from '../store/store'
import { RiProfileLine } from 'react-icons/ri'
import { FaRegClock } from 'react-icons/fa'
import { MdOutlineCleaningServices } from 'react-icons/md'
import { CiShop } from 'react-icons/ci'
import { useEffect, useState } from 'react'
import { PiUsersThree } from "react-icons/pi";
import { GoShieldLock } from 'react-icons/go'
import { BUSINESS_PERMISSIONS } from '../helpers/types/BusinessPermission'

const SettingsMenu = () => {
    const navigate = useNavigate();
    const { user, selectedBusinessEmployee } = useSelector((state: UserStore) => state.userStore);
    const location = useLocation();
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    console.log(selectedBusinessEmployee)

    useEffect(() => {
        window.addEventListener('resize', () => {
            setIsMenuCollapsed(window.innerWidth <= 640)
        });
    }, [])

    const settingsMenuItems = [
        {
            key: "opening-hours",
            label: "Saját munkaidő",
            icon: <FaRegClock size={20} />,
            roles: [Authorities.ROLE_USER],
            permissions: [BUSINESS_PERMISSIONS.EDIT_OWN_WORKING_HOURS],
            onClick: () => navigate("/settings/opening-hours")
        },
        {
            key: "services",
            label: "Szolgáltatásaim",
            icon: <MdOutlineCleaningServices size={20} />,
            roles: [Authorities.ROLE_USER],
            permissions: [BUSINESS_PERMISSIONS.VIEW_SERVICES],
            onClick: () => navigate("/settings/my-services")
        },
        {
            key: "profile",
            label: "Profil",
            icon: <RiProfileLine size={20} />,
            roles: [Authorities.ROLE_USER],
            onClick: () => navigate("/settings/profile")
        },
        {
            key: "business",
            label: "Üzlet",
            icon: <CiShop size={20} strokeWidth={1} />,
            roles: [Authorities.ROLE_USER],
            permissions: [BUSINESS_PERMISSIONS.MANAGE_BUSINESS_SETTINGS],
            onClick: () => navigate("/settings/business")
        },
        {
            key: "guests",
            label: "Vendégek",
            icon: <PiUsersThree size={20} strokeWidth={1} />,
            roles: [Authorities.ROLE_USER],
            onClick: () => navigate("/settings/guests")
        },
        {
            key: "security",
            label: "Biztonság",
            icon: <GoShieldLock size={20} />,
            roles: [Authorities.ROLE_USER],
            onClick: () => navigate("/settings/security")
        },
        {
            key: "employees",
            label: "Kollégák",
            icon: <PiUsersThree size={20} strokeWidth={1} />,
            roles: [Authorities.ROLE_USER],
            permissions: [BUSINESS_PERMISSIONS.MANAGE_EMPLOYEES],
            onClick: () => navigate("/settings/employees")
        }
    ]

    const filteredSettingsMenu = settingsMenuItems
        .filter(item => {
            const hasRole =
                item.roles?.some(role => user?.authorities?.includes(role));

            const hasPermission =
                !item.permissions ||
                item.permissions.some(p =>
                    selectedBusinessEmployee?.permissions?.includes(p)
                );

            return hasRole && hasPermission;
        })
        .map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: item.onClick,
            className: "md:!rounded-full md:!w-fit"
        }));




    return (
        <div className="min-h-72">
            <div className="h-full border border-gray-200 rounded-xl md:w-72 md:max-w-72 bg-white">
                <Menu
                    items={filteredSettingsMenu}
                    inlineCollapsed={isMenuCollapsed}
                    className="sticky top-20 !border-none rounded-xl"
                    selectedKeys={[settingsMenuItems.find(item => location.pathname.includes(item.key))?.key || ""]}
                />
            </div>
        </div>
    )
}

export default SettingsMenu