import { Outlet } from 'react-router'
import SettingsMenu from '../components/SettingsMenu'

const Settings = () => {
    return (
        <div className="flex">
            <SettingsMenu />
            <Outlet />
        </div>
    )
}

export default Settings