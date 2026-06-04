// components/NavBar/menuItems.tsx

import { MdOutlineLibraryBooks } from 'react-icons/md';
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
    isBeta?: boolean;
}

export const menuItems = (
    t: (key: string) => string,
): MenuItem[] => [
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
            key: 'pricing',
            label: t('pricing'),
            link: 'pricing',
            icon: <MdOutlineLibraryBooks size={20} strokeWidth={0} />
        }
    ];