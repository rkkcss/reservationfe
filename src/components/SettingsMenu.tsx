import { Menu, MenuProps } from 'antd'
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

const SettingsMenu = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: UserStore) => state.userStore);
    const location = useLocation();
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false)

    useEffect(() => {
        window.addEventListener('resize', () => {
            setIsMenuCollapsed(window.innerWidth <= 640)
        });
    }, [])

    const settingsMenuItems = [
        {
            key: "opening-hours",
            label: "Nyitvatartási idők",
            icon: <FaRegClock size={20} />,
            roles: [Authorities.ROLE_USER],
            onClick: () => navigate("/settings/opening-hours")
        },
        {
            key: "services",
            label: "Szolgáltatásaim",
            icon: <MdOutlineCleaningServices size={20} />,
            roles: [Authorities.ROLE_USER],
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
        }
    ]

    const filteredSettingsMenu: Required<MenuProps>["items"][number][] = settingsMenuItems
        .filter(item => item?.roles?.some(role => user?.authorities?.includes(role)))
        .map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: item.onClick,
            className: "md:!rounded-full md:!w-fit"
        }));

    return (
        <div className="min-h-72">
            <Menu
                items={filteredSettingsMenu}
                inlineCollapsed={isMenuCollapsed}
                className="!border-none h-full outline outline-gray-100 rounded-xl outline-2 md:w-72 md:max-w-72"
                selectedKeys={[settingsMenuItems.find(item => location.pathname.includes(item.key))?.key || ""]}
            />
        </div>
    )
}

export default SettingsMenu