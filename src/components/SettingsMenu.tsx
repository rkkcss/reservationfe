import { Menu } from 'antd'
import React from 'react'
import { PiUsersFour } from 'react-icons/pi'
import { useNavigate } from 'react-router'

type Props = {}

const SettingsMenu = (props: Props) => {
    const navigate = useNavigate();

    const settingsMenuItems = [
        {
            key: 'employees',
            label: 'Kollégák',
            icon: <PiUsersFour size={20} />,
            className: "text-base",
            onClick: () => navigate("/settings/employees")
        }
    ]
    return (
        <div className="w-80 min-h-72">
            <Menu items={settingsMenuItems} className="h-full">

            </Menu>
        </div>
    )
}

export default SettingsMenu