import { NotificationProvider } from '../context/NotificationContext'
import { Outlet } from 'react-router'

const AuthenticatedLayout = () => {
    return (
        <NotificationProvider>
            <Outlet />
        </NotificationProvider>
    )
}

export default AuthenticatedLayout