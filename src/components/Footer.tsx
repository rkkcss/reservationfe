import { Divider } from 'antd'
import logo from '../assets/logo.png'

const Footer = () => {
    return (
        <footer>
            <Divider />
            <img src={logo} className="h-14" alt="" />
        </footer>
    )
}

export default Footer