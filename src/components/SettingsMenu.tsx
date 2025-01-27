import { Menu, MenuProps } from 'antd'
import React from 'react'
import { PiUsersFour } from 'react-icons/pi'
import { useLocation, useNavigate } from 'react-router'
import { Authorities } from '../helpers/types/Authorities'
import { useSelector } from 'react-redux'
import { UserStore } from '../store/store'
import { RiProfileLine } from 'react-icons/ri'
import { FaRegClock } from 'react-icons/fa'
import { MdOutlineCleaningServices } from 'react-icons/md'

type Props = {}

const SettingsMenu = (props: Props) => {
    const navigate = useNavigate();
    const { user } = useSelector((state: UserStore) => state.userStore);
    const location = useLocation();

    console.log(location);
    const settingsMenuItems = [
        {
            key: "employees",
            label: "Kollégák",
            icon: <PiUsersFour size={20} />,
            roles: [Authorities.ROLE_OWNER],
            onClick: () => navigate("/settings/employees")
        },
        {
            key: "opening-hours",
            label: "Nyitvatartási idők",
            icon: <FaRegClock size={20} />,
            roles: [Authorities.ROLE_OWNER],
            onClick: () => navigate("/settings/opening-hours")
        },
        {
            key: "services",
            label: "Szolgáltatásaim",
            icon: <MdOutlineCleaningServices size={20} />,
            roles: [Authorities.ROLE_OWNER, Authorities.ROLE_EMPLOYEE],
            onClick: () => navigate("/settings/my-services")
        },
        {
            key: "profile",
            label: "Profil",
            icon: <RiProfileLine size={20} />,
            roles: [Authorities.ROLE_USER],
            onClick: () => navigate("/settings/profile")
        }
    ]

    const filteredSettingsMenu: Required<MenuProps>["items"][number][] = settingsMenuItems
        .filter(item => item?.roles?.some(role => user?.authorities?.includes(role)))
        .map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: item.onClick,
        }));

    return (
        <div className="min-h-72">
            <Menu
                items={filteredSettingsMenu}

                className="!border-none h-full outline outline-gray-100 rounded-xl outline-1 w-72"
                selectedKeys={[settingsMenuItems.find(item => location.pathname.includes(item.key))?.key || ""]}
            />
        </div>
    )
}

export default SettingsMenu