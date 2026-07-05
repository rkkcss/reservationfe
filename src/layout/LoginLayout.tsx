import { Outlet } from 'react-router'
import NavBar from '../components/NavBar/NavBar'
import { useLoginModalRouteListener } from '../hooks/useLoginModalRouteListener';
import LeftNavbar from '../components/LeftNavbar/LeftNavbar';
import { useAppSelector } from '../store/hooks';
import { CalendarProvider } from '../context/CalendarContext';

const LoginLayout = () => {
    useLoginModalRouteListener();
    const { isLeftMenuCollapsed } = useAppSelector(state => state.generalStore);
    return (
        <CalendarProvider>
            <div className="flex">
                <LeftNavbar />
                <div className={`${!isLeftMenuCollapsed ? 'ml-72' : 'ml-16'} flex flex-1 flex-col`}>
                    <NavBar />
                    <div className="text-custom-gray container mx-auto min-h-[calc(100svh-(64px+81px))] px-6">
                        <div className="px-2 md:px-0 flex flex-col">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </CalendarProvider>
    )
}

export default LoginLayout