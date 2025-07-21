import { Outlet } from 'react-router'
import NavBar from '../components/NavBar/NavBar'
import Footer from '../components/Footer'

const HomeLayout = () => {
    return (
        <div className="text-custom-gray container mx-auto min-h-svh">
            <NavBar />
            <div className="min-h-[70vh] px-2 md:px-0 flex flex-col">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default HomeLayout