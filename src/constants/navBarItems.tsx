// components/NavBar/menuItems.tsx

import { CiCalendar } from 'react-icons/ci';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5';
import { Authorities } from '../helpers/types/Authorities';
import { AppDispatch } from '../store/store';
import { logoutUser, setActiveBusinessEmployeeNull } from '../redux/userSlice';
import { LiaIndustrySolid } from 'react-icons/lia';
import { PiUsersFourBold } from 'react-icons/pi';
import { FiHome } from 'react-icons/fi';

export interface MenuItem {
    key?: string;
    label?: string;
    link?: string;
    icon?: JSX.Element;
    roles?: string[];
    onClick?: () => void;
    type?: 'divider';
}

export const menuItems = (
    t: (key: string) => string,
): MenuItem[] => [
        {
            key: 'dashboard',
            label: t('dashboard'),
            roles: [Authorities.ROLE_USER],
            link: 'dashboard'
        },
        {
            key: 'home',
            label: t('home'),
            link: 'home',
            icon: <FiHome size={20} strokeWidth={2} />
        },
        {
            key: 'about',
            label: t('about'),
            link: 'about',
            icon: <PiUsersFourBold size={20} strokeWidth={0} />
        },
        {
            key: 'calendar',
            label: t('calendar'),
            roles: [Authorities.ROLE_USER],
            link: 'calendar',
            icon: <CiCalendar size={20} />
        },
        {
            key: 'pricing',
            label: t('pricing'),
            link: 'pricing',
            icon: <MdOutlineLibraryBooks size={20} strokeWidth={0} />
        },
        {
            key: 'guests',
            label: t('guests'),
            roles: [Authorities.ROLE_USER],
            link: 'guests',
        }
    ];

const handleAccountChangeBusiness = (dispatch: AppDispatch, navigate: (path: string, options?: { replace: boolean }) => void) => {
    dispatch(setActiveBusinessEmployeeNull());
    navigate('/choose-business', { replace: true });
}

export const userMenuItems = (
    t: (key: string) => string,
    navigate: (path: string) => void,
    dispatch: AppDispatch
): MenuItem[] => [
        {
            key: 'settings',
            icon: <IoSettingsOutline size={16} />,
            label: t('settings'),
            roles: [Authorities.ROLE_USER],
            onClick: () => navigate('/settings')
        },
        {
            type: 'divider',
            roles: [Authorities.ROLE_USER]
        },
        {
            key: 'change-business',
            icon: <LiaIndustrySolid size={16} />,
            label: t('change-business'),
            roles: [Authorities.ROLE_USER],
            onClick: () => handleAccountChangeBusiness(dispatch, navigate)
        },
        {
            key: 'logout',
            icon: <IoLogOutOutline size={16} />,
            label: t('logout'),
            roles: [Authorities.ROLE_USER],
            onClick: () => {
                dispatch(logoutUser())
            }
        }
    ];