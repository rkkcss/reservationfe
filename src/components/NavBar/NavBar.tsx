// components/NavBar/NavBar.tsx
import { Badge, Button } from 'antd';
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
import GlobalSearch from '../GlobalSearch/GlobalSearch';

const NavBar = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("nav-bar");
    const { user } = useSelector((state: UserStore) => state.userStore);
    const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

    const userRoles: string[] = user?.authorities ?? [];

    const filteredMenuItems = menuItems(t)
        .filter(item => {
            if (!item.roles) {
                return userRoles.length === 0;
            }
            return item.roles.some(role => userRoles.includes(role));
        });

    return (
        <>
            <Header className="bg-white mb-4 sticky top-0 z-20 px-1 sm:px-4 md:px-6 border-b border-slate-200">
                <ul className="flex gap-2 items-center h-full">

                    {/* TODO: implement logic for logo */}
                    {/* <img src={logo} className="h-12 min-h-12 cursor-pointer" alt="logo" onClick={() => navigate('/')} /> */}
                    {filteredMenuItems.map(item => (
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

                    {!user ? (
                        <>
                            <div className="ml-auto mr-0" />
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
                        <GlobalSearch />
                    )}
                    <li className="md:block hidden p-[5px] hover:text-primary hover:bg-slate-200 transition rounded-full">
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
                menuItems={filteredMenuItems}
            />
        </>
    );
};

export default NavBar;
