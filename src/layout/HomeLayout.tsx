import { Outlet } from 'react-router'
import NavBar from '../components/NavBar/NavBar'
import Footer from '../components/Footer'
import { useLoginModalRouteListener } from '../hooks/useLoginModalRouteListener';

const HomeLayout = () => {
    useLoginModalRouteListener();

    return (
        <>
            <NavBar />
            <div className="text-custom-gray container mx-auto min-h-[calc(100svh-(64px+81px))]">
                <div className="px-2 md:px-0 flex flex-col">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default HomeLayout