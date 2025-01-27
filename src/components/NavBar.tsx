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
import { Link, useNavigate } from 'react-router'

const NavBar = () => {
    const dispatch = useDispatch();
    const { t, i18n: { changeLanguage, language } } = useTranslation();
    const { user } = useSelector((state: UserStore) => state.userStore);
    const navigate = useNavigate();

    const menuItems = [
        {
            key: 'home',
            label: 'Kezdőoldal',
            link: 'home'
        },
        {
            key: 'about',
            label: 'Rólunk',
            link: 'about'
        },
        {
            key: 'calendar',
            label: 'Naptár',
            roles: [Authorities.ROLE_OWNER, Authorities.ROLE_EMPLOYEE],
            link: 'dashboard/calendar'
        },
        {
            key: 'appointments',
            label: 'Időpontjaim',
            roles: [Authorities.ROLE_USER],
            link: 'dashboard/appointments'
        },
        {
            key: 'working-hours',
            label: 'Munkarend',
            roles: [Authorities.ROLE_OWNER, Authorities.ROLE_EMPLOYEE],
            link: 'dashboard/working-hours'
        },

    ];

    const languages: MenuProps['items'] = [
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

    const filteredProfileItems: Required<MenuProps>["items"][number][] = userMenuItems
        .filter(item => item?.roles?.some(role => user?.authorities?.includes(role)))
        .map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: item.onClick,
            type: item.type as 'divider'
        }));


    return (
        <>
            <Header className="bg-white shadow-lg container mb-4 rounded-md sticky top-2  z-20">
                <ul className="flex gap-4 items-center">
                    <img src={logo} className="h-12 min-h-12" alt="logo" onClick={() => navigate("/")} />
                    {
                        menuItems.map(item => {
                            const userRoles = user?.authorities;

                            const isVisible =
                                (!userRoles?.length && !item.roles) ||
                                (userRoles?.length && item.roles?.some(role => userRoles.includes(role)));

                            return (
                                isVisible && (
                                    <li key={item.key}>
                                        <Link to={`/${item.link}`} className="text-sm px-4 py-2 hover:text-primary hover:bg-slate-100 hover:transition rounded-lg duration-300 font-semibold">{t(item.label)}</Link>
                                    </li>
                                )
                            );
                        })
                    }
                    {!user ?
                        <li className="mr-0 ml-auto">
                            <Button type="primary" onClick={() => loginModal.open()}>
                                {t("login")}
                            </Button>
                        </li>
                        :
                        <li className="mr-0 ml-auto">
                            <Dropdown arrow menu={{ items: filteredProfileItems }} trigger={['click']}>
                                <FiUser strokeWidth={2} size="1.5rem" onClick={(e) => e.preventDefault()} className="cursor-pointer" />
                            </Dropdown>
                        </li>}
                    <li>
                        <Dropdown arrow menu={{ items: languages, selectable: true, defaultSelectedKeys: [language], onSelect: (e) => changeLanguage(e.key) }} trigger={['click']}>
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