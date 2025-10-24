// components/NavBar/menuItems.tsx

import { CiCalendar } from 'react-icons/ci';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5';
import { Authorities } from '../helpers/types/Authorities';
import { AppDispatch } from '../store/store';
import { logoutUser } from '../redux/userSlice';

export interface MenuItem {
    key?: string;
    label?: string;
    link?: string;
    icon?: JSX.Element;
    roles?: string[];
    onClick?: () => void;
    type?: 'divider';
}

export const menuItems: MenuItem[] = [
    {
        key: 'dashboard',
        label: 'Irányítópult',
        roles: [Authorities.ROLE_USER],
        link: 'dashboard'
    },
    {
        key: 'home',
        label: 'Kezdőoldal',
        link: 'home',
    },
    {
        key: 'about',
        label: 'Rólunk',
        link: 'about',
    },
    {
        key: 'calendar',
        label: "Naptár",
        roles: [Authorities.ROLE_USER],
        link: 'calendar',
        icon: <CiCalendar size={20} />
    },
    {
        key: 'pricing',
        label: 'Árak',
        link: 'pricing',
        icon: <MdOutlineLibraryBooks size={20} />
    }
];

export const userMenuItems = (
    t: (key: string) => string,
    navigate: (path: string) => void,
    dispatch: AppDispatch
): MenuItem[] => [
        {
            key: 'settings',
            icon: <IoSettingsOutline strokeWidth={10} size={16} />,
            label: t('settings'),
            roles: [Authorities.ROLE_USER],
            onClick: () => navigate('/settings')
        },
        {
            type: 'divider',
            roles: [Authorities.ROLE_USER]
        },
        {
            key: 'logout',
            icon: <IoLogOutOutline size={18} />,
            label: t('logout'),
            roles: [Authorities.ROLE_USER],
            onClick: () => {
                dispatch(logoutUser())
            }
        }
    ];
