import { Outlet } from 'react-router'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const HomeLayout = () => {
    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    )
}

export default HomeLayout