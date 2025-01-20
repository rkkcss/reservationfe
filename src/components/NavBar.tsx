import { Button, Dropdown, MenuProps, notification } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { useTranslation } from 'react-i18next'
import { MdLanguage } from 'react-icons/md'
import LoginModal from './Login/LoginModal'
import { loginModal } from './Login/loginModalController'
import { FiUser } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../redux/userSlice'
import { UserStore } from '../store/store'
import { Authorities } from '../helpers/types/Authorities'
import logo from '../assets/logo.png'
import { IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router'

const NavBar = () => {
    const dispatch = useDispatch();
    const { t, i18n: { changeLanguage, language } } = useTranslation();
    const { user } = useSelector((state: UserStore) => state.userStore);
    const navigate = useNavigate();

    const menuItems = [
        {
            key: 'home',
            label: 'Home',
        },
        {
            key: 'about',
            label: 'About',
        },
    ];

    const items: MenuProps['items'] = [
        {
            key: "en",
            label: "English",
        },
        {
            key: "hu",
            label: "Magyar",
        },
    ];

    const userMenuItems = [
        {
            key: 'settings',
            icon: <IoSettingsOutline strokeWidth={10} size={16} />,
            label: t("settings"),
            roles: [Authorities.ROLE_USER],
            onClick: () => navigate("/settings")
        },
        {
            type: 'divider',
            roles: [Authorities.ROLE_USER]
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <IoLogOutOutline size={18} />,
            label: t("logout"),
            roles: [Authorities.ROLE_USER],
            onClick: () => dispatch(logoutUser())
        },
    ];

    const filteredMenuItems = userMenuItems
        .filter(item => item?.roles?.some(role => user?.authorities?.includes(role)))
        .map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: item.onClick,
            type: item.type
        }));

    return (
        <>
            <Header className="bg-transparent  shadow-lg w-full mb-4 rounded-md">
                <ul className="flex gap-4 items-center">

                    <img src={logo} className="h-12 min-h-12" alt="logo" />

                    {
                        menuItems.map(item => (
                            <li key={item.key}>
                                <Button href={`/${item.key}`} type="text">{t(item.label)}</Button>
                            </li>
                        ))
                    }
                    <div className='hidden md:flex'>asd</div>
                    {!user ?
                        <li className="mr-0 ml-auto">
                            <Button type="primary" onClick={() => loginModal.open()}>
                                {t("login")}
                            </Button>
                        </li>
                        :
                        <li className="mr-0 ml-auto">
                            <Dropdown arrow menu={{ items: filteredMenuItems }} trigger={['click']}>
                                <FiUser strokeWidth={2} size="1.5rem" onClick={(e) => e.preventDefault()} className="cursor-pointer" />
                            </Dropdown>
                        </li>}
                    <li>
                        <Dropdown arrow menu={{ items, selectable: true, defaultSelectedKeys: [language], onSelect: (e) => changeLanguage(e.key) }} trigger={['click']}>
                            <MdLanguage size="1.5rem" onClick={(e) => e.preventDefault()} className="cursor-pointer" />
                        </Dropdown>
                    </li>
                </ul>
            </Header>
            <LoginModal />
        </>
    )
}

export default NavBar