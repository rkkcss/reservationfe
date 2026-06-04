import { Outlet } from 'react-router'
import Footer from '../components/Footer'
import { useLoginModalRouteListener } from '../hooks/useLoginModalRouteListener';
import PublicNavbar from '../components/NavBar/PublicNavbar';

const HomeLayout = () => {
    useLoginModalRouteListener();
    return (
        <>
            <PublicNavbar />
            <div className="flex">
                <div className="text-custom-gray container mx-auto min-h-[calc(100svh-(64px+81px))] px-6">
                    <div className="px-2 md:px-0 flex flex-col">
                        <Outlet />
                    </div>
                </div>
            </div>
            < Footer />
        </>
    )
}

export default HomeLayout