// components/NavBar/NavBar.tsx
import { Badge, Button, Dropdown } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserStore } from '../../store/store';

import LanguageSelector from './LanguageSelector';
import { loginModal } from '../Login/loginModalController';
import { menuItems } from '../../constants/navBarItems';
import { IoMenu } from 'react-icons/io5';
import MobileMainMenu from './MobileMainMenu';
import logo from '../../assets/logo.png';
import UserAvatar from '../UserAvatar';
import { IoMdArrowDropdown } from 'react-icons/io';

const PublicNavbar = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("nav-bar");
    const { user } = useSelector((state: UserStore) => state.userStore);
    const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

    const userAvatarMenuItems = [
        {
            key: 'calendar',
            label: 'Calendar',
            onClick: () => navigate('/calendar'),
            isBeta: false
        }
    ]

    return (
        <>
            <Header className="bg-white mb-4 sticky top-0 z-20 px-1 sm:px-4 md:px-6 border-b border-slate-200 py-2">
                <ul className="flex gap-2 items-center h-full">

                    {/* TODO: implement logic for logo */}
                    <img src={logo} className="h-12 min-h-12 cursor-pointer" alt="logo" onClick={() => navigate('/')} />
                    {menuItems(t).map(item => (
                        <li key={item.key} className="hidden md:block">
                            <NavLink
                                to={`/${item.link}`}
                                className={({ isActive }) =>
                                    `${isActive ? 'text-primary bg-slate-200/70' : ''} text-sm px-4 py-2 hover:text-primary hover:bg-slate-200 rounded-full transition duration-300 font-semibold`
                                }
                            >
                                {t(item.label!)}
                                {item.isBeta && (
                                    <Badge count={t('Béta')} className="ml-1.5 -mt-0.5" style={{ border: 'none' }} color='volcano' />
                                )}
                            </NavLink>
                        </li>
                    ))}
                    <div className="ml-auto mr-0" />
                    {!user ? (
                        <>
                            <li className="">
                                <Button type="primary" onClick={() => loginModal.open()}>
                                    {t('login')}
                                </Button>
                            </li>
                            <li className="md:block hidden">
                                <Button type="text" onClick={() => navigate("/register")}>
                                    {t("register")}
                                </Button>
                            </li>
                        </>
                    ) : (
                        <li className="ml-auto p-[3px] hover:text-primary hover:bg-slate-200 transition rounded-full relative">
                            <Dropdown
                                arrow={{ pointAtCenter: true }}
                                placement="bottomRight"
                                menu={{ items: userAvatarMenuItems }}
                                trigger={['click']}>
                                <div className="flex items-center gap-0.5 cursor-pointer">
                                    <UserAvatar size={28} />
                                    <IoMdArrowDropdown size={14} className=" group-hover:text-primary mt-1" />
                                </div>
                            </Dropdown>
                        </li>
                    )}
                    <li className="p-[5px] hover:text-primary hover:bg-slate-200 transition rounded-full">
                        <LanguageSelector />
                    </li>
                    <div className="md:hidden">
                        <IoMenu size="1.5rem" className="cursor-pointer" onClick={() => setMenuDrawerOpen(true)} />
                    </div>
                </ul>
            </Header >
            <MobileMainMenu
                open={menuDrawerOpen}
                onClose={() => setMenuDrawerOpen(false)}
                menuItems={menuItems(t)}
            />
        </>
    );
};

export default PublicNavbar;
