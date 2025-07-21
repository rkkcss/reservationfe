import { NavLink } from 'react-router-dom';
import { Authorities } from '../../helpers/types/Authorities';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { CiCalendar } from 'react-icons/ci';

interface Props {
    userRoles?: string[];
}

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
        roles: [Authorities.ROLE_USER],
        link: 'dashboard/calendar',
        icon: <CiCalendar size={20} />
    },
    {
        key: 'appointments',
        label: 'Időpontjaim',
        roles: [Authorities.ROLE_USER],
        link: 'dashboard/appointments',
        icon: <MdOutlineLibraryBooks size={20} />
    },
    {
        key: 'working-hours',
        label: 'Munkarend',
        roles: [Authorities.ROLE_USER],
        link: 'dashboard/working-hours'
    },

];


export default function MainMenu({ userRoles }: Props) {
    const hasAccess = (itemRoles?: string[]) =>
        !itemRoles || itemRoles.some(role => userRoles?.includes(role));

    return (
        <ul className="hidden md:flex gap-4">
            {menuItems
                .filter(item => hasAccess(item.roles))
                .map(item => (
                    <li key={item.key}>
                        <NavLink
                            to={item.link}
                            className={({ isActive }) =>
                                `text-sm px-4 py-2 rounded-lg font-semibold transition duration-300 ${isActive ? 'text-primary bg-slate-100' : 'hover:text-primary hover:bg-slate-100'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
        </ul>
    );
}
