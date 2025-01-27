import { Outlet } from 'react-router'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const HomeLayout = () => {
    return (
        <>
            <NavBar />
            <div className="min-h-[70vh]">
                <Outlet />
            </div>
            <Footer />
        </>
    )
}

export default HomeLayout