// components/NavBar/NavBar.tsx
import { Button, Dropdown, MenuProps } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { FiUser } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AppDispatch, UserStore } from '../../store/store';
import logo from '../../assets/logo.png';

import LanguageSelector from './LanguageSelector';
import { loginModal } from '../Login/loginModalController';
import { menuItems, userMenuItems } from '../../constants/navBarItems';
import { IoMenu } from 'react-icons/io5';
import MobileMainMenu from './MobileMainMenu';
import { IoMdArrowDropdown } from 'react-icons/io';

const NavBar = () => {
    const dispatch = useDispatch<AppDispatch>();
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

    const profileMenuItems: MenuProps['items'] = userMenuItems(t, navigate, dispatch)
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
            <Header className="bg-[#f1f5ff]/60 outline outline-1 outline-gray-300 backdrop-blur-xl shadow-xl mb-4 sticky top-0 z-20 px-1 sm:px-4 md:px-6">
                <ul className="flex gap-2 items-center h-full">
                    <img src={logo} className="h-12 min-h-12 cursor-pointer" alt="logo" onClick={() => navigate('/')} />

                    {filteredMenuItems.map(item => (
                        <li key={item.key} className="hidden md:block">
                            <NavLink
                                to={`/${item.link}`}
                                className={({ isActive }) =>
                                    `${isActive ? 'text-primary bg-slate-200/70' : ''} text-sm px-4 py-2 hover:text-primary hover:bg-slate-200 rounded-full transition duration-300 font-semibold`
                                }
                            >
                                {t(item.label!)}
                            </NavLink>
                        </li>
                    ))}

                    {!user ? (
                        <>
                            <li className="ml-auto">
                                <Button type="primary" onClick={() => loginModal.open()}>
                                    {t('login')}
                                </Button>
                            </li>
                            <li className="md:block hidden">
                                {/* <Dropdown arrow menu={{ items: threeDotMenuItems(t) }} trigger={['click']}>
                                    <BsThreeDots size="1.5rem" onClick={(e) => e.preventDefault()} className="cursor-pointer" />
                                </Dropdown> */}
                                <Button type="text" onClick={() => navigate("/register")}>
                                    {t("register")}
                                </Button>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* <li className="ml-auto p-[5px] hover:text-primary hover:bg-slate-200 transition rounded-full cursor-pointer relative">
                                <NotificationDropDown />
                            </li> */}
                            <li className="ml-auto p-[5px] hover:text-primary hover:bg-slate-200 transition rounded-full relative">
                                <Dropdown
                                    arrow={{ pointAtCenter: true }}
                                    placement="bottomRight"
                                    menu={{ items: profileMenuItems }}
                                    trigger={['click']}>
                                    <div className="flex items-center gap-0.5 cursor-pointer">
                                        <FiUser size="1.5rem" className="group-hover:text-primary transition" />
                                        <IoMdArrowDropdown size={14} className=" group-hover:text-primary mt-1" />
                                    </div>
                                </Dropdown>
                                {/* <div className="absolute bottom-0 right-1 h-3 w-3 rounded-full bg-gray-400">
                                    <IoMdArrowDropdown size={12} />
                                </div> */}
                            </li>
                        </>
                    )}

                    {/* <li className="p-[5px] hover:text-primary hover:bg-slate-200 transition rounded-full">

                    </li> */}

                    <li className="p-[5px] hover:text-primary hover:bg-slate-200 transition rounded-full">
                        <LanguageSelector />
                    </li>

                    <div className="md:hidden">
                        <IoMenu size="1.5rem" className="cursor-pointer" onClick={() => setMenuDrawerOpen(true)} />
                    </div>
                </ul>
            </Header>
            <MobileMainMenu
                open={menuDrawerOpen}
                onClose={() => setMenuDrawerOpen(false)}
                menuItems={filteredMenuItems}
            />
        </>
    );
};

export default NavBar;
