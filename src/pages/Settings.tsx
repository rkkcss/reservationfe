import { Outlet } from 'react-router'
import SettingsMenu from '../components/SettingsMenu'

const Settings = () => {
    return (
        <div className="flex flex-1 min-h-[80svh] mb-2">
            <SettingsMenu />
            <Outlet />
        </div>
    )
}

export default Settings