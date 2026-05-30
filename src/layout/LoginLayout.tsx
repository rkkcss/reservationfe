import { Outlet } from 'react-router'
import NavBar from '../components/NavBar/NavBar'
import { useLoginModalRouteListener } from '../hooks/useLoginModalRouteListener';
import LeftNavbar from '../components/LeftNavbar/LeftNavbar';

const LoginLayout = () => {
    useLoginModalRouteListener();
    return (
        <div className="flex">
            <LeftNavbar />
            <div className="flex flex-1 flex-col ml-72">
                <NavBar />
                <div className="text-custom-gray container mx-auto min-h-[calc(100svh-(64px+81px))] px-6">
                    <div className="px-2 md:px-0 flex flex-col">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginLayout