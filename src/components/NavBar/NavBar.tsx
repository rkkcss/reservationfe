// components/NavBar/NavBar.tsx
import { Button, Drawer, Dropdown, MenuProps } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { FiUser } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logoutUser } from '../../redux/userSlice';
import { AppDispatch, UserStore } from '../../store/store';
import logo from '../../assets/logo.png';

import LanguageSelector from './LanguageSelector';
import LoginModal from '../Login/LoginModal';
import { loginModal } from '../Login/loginModalController';
import { menuItems, userMenuItems } from '../../constants/navBarItems';
import { IoMenu } from 'react-icons/io5';
import NotificationDropDown from './NotificationDropDown';

const NavBar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useSelector((state: UserStore) => state.userStore);
    const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

    const userRoles: string[] = user?.authorities ?? [];

    const filteredMenuItems = menuItems.filter(item =>
        !item.roles || item.roles.some(role => userRoles.includes(role))
    );

    const profileMenuItems: MenuProps['items'] = userMenuItems(t, navigate, () => dispatch(logoutUser()))
        .filter(item => item?.roles?.some(role => userRoles.includes(role)))
        .map(item => {
            if (item.type === 'divider') {
                return { type: 'divider' as const };
            }

            return {
                key: item.key!,
                icon: item.icon,
                label: item.label!,
                onClick: item.onClick,
            };
        });


    return (
        <>
            <Header className="bg-white shadow-lg container mb-4 rounded-md sticky top-2 z-20 px-1 sm:px-4 md:px-6">
                <ul className="flex gap-2 items-center h-full">
                    <img src={logo} className="h-12 min-h-12 cursor-pointer" alt="logo" onClick={() => navigate('/')} />

                    {filteredMenuItems.map(item => (
                        <li key={item.key} className="hidden md:block">
                            <NavLink
                                to={`/${item.link}`}
                                className={({ isActive }) =>
                                    `${isActive ? 'text-primary bg-slate-100' : ''} text-sm px-4 py-2 hover:text-primary hover:bg-slate-100 rounded-lg transition duration-300 font-semibold`
                                }
                            >
                                {t(item.label!)}
                            </NavLink>
                        </li>
                    ))}

                    {!user ? (
                        <li className="ml-auto">
                            <Button type="primary" onClick={() => loginModal.open()}>
                                {t('login')}
                            </Button>
                        </li>
                    ) : (
                        <>
                            <li className="ml-auto p-[5px] hover:text-primary hover:bg-slate-100 transition rounded-lg cursor-pointer relative">
                                <NotificationDropDown />
                            </li>
                            <li className="p-[5px] hover:text-primary hover:bg-slate-100 transition rounded-lg">
                                <Dropdown arrow menu={{ items: profileMenuItems }} trigger={['click']}>
                                    <FiUser size="1.5rem" onClick={(e) => e.preventDefault()} className="cursor-pointer" />
                                </Dropdown>
                            </li>
                        </>
                    )}

                    <li className="p-[5px] hover:text-primary hover:bg-slate-100 transition rounded-lg">
                        <LanguageSelector />
                    </li>

                    <div className="md:hidden">
                        <IoMenu size="1.5rem" className="cursor-pointer" onClick={() => setMenuDrawerOpen(true)} />
                    </div>
                </ul>
            </Header>

            <Drawer open={menuDrawerOpen} onClose={() => setMenuDrawerOpen(false)} title={t('Menu elements')}>
                <ul className="flex flex-col gap-4">
                    {filteredMenuItems.map(item => (
                        <li key={item.key}>
                            <Link to={`/${item.link}`} className="flex items-center gap-2 text-sm px-4 py-2 hover:text-primary hover:bg-slate-100 transition rounded-lg font-semibold w-full">
                                {item.icon}
                                {t(item.label!)}
                            </Link>
                        </li>
                    ))}
                </ul>
            </Drawer>

            <LoginModal />
        </>
    );
};

export default NavBar;
