import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { FaRegClock } from 'react-icons/fa';
import { MdOutlineCleaningServices, MdOutlineDashboard } from 'react-icons/md';
import { RiProfileLine } from 'react-icons/ri';
import { CiShop } from 'react-icons/ci';
import { GoShieldLock } from 'react-icons/go';
import { PiUsersThree } from 'react-icons/pi';

import { Authorities } from '../../helpers/types/Authorities';
import { BUSINESS_PERMISSIONS } from '../../helpers/types/BusinessPermission';
import { useAppSelector } from '../../store/hooks';

export const useLeftNavbar = () => {
    const navigate = useNavigate();
    const { user, selectedBusinessEmployee } = useAppSelector(state => state.userStore);

    const filteredSettingsMenu = useMemo(() => {
        const settingsMenuItems = [
            {
                key: 'dashboard',
                label: 'Dashboard',
                icon: <MdOutlineDashboard size={20} />,
                roles: [Authorities.ROLE_USER],
                permissions: [BUSINESS_PERMISSIONS.VIEW_OWN_STATISTICS, BUSINESS_PERMISSIONS.VIEW_ALL_STATISTICS],
                onClick: () => navigate('dashboard'),
                isBeta: true
            },
            {
                key: "opening-hours",
                label: "Saját munkaidő",
                icon: <FaRegClock size={20} />,
                roles: [Authorities.ROLE_USER],
                permissions: [BUSINESS_PERMISSIONS.EDIT_OWN_WORKING_HOURS],
                onClick: () => navigate("/settings/opening-hours")
            },
            {
                key: "services",
                label: "Szolgáltatásaim",
                icon: <MdOutlineCleaningServices size={20} />,
                roles: [Authorities.ROLE_USER],
                permissions: [BUSINESS_PERMISSIONS.VIEW_SERVICES],
                onClick: () => navigate("/settings/my-services")
            },
            {
                key: "profile",
                label: "Profil",
                icon: <RiProfileLine size={20} />,
                roles: [Authorities.ROLE_USER],
                onClick: () => navigate("/settings/profile")
            },
            {
                key: "business",
                label: "Üzlet",
                icon: <CiShop size={20} strokeWidth={1} />,
                roles: [Authorities.ROLE_USER],
                permissions: [BUSINESS_PERMISSIONS.MANAGE_BUSINESS_SETTINGS],
                onClick: () => navigate("/settings/business")
            },
            {
                key: "security",
                label: "Biztonság",
                icon: <GoShieldLock size={20} />,
                roles: [Authorities.ROLE_USER],
                onClick: () => navigate("/settings/security")
            },
            {
                key: "employees",
                label: "Kollégák",
                icon: <PiUsersThree size={20} strokeWidth={1} />,
                roles: [Authorities.ROLE_USER],
                permissions: [BUSINESS_PERMISSIONS.MANAGE_EMPLOYEES],
                onClick: () => navigate("/settings/employees")
            },
            {
                key: "guests",
                label: "Vendégek",
                icon: <PiUsersThree size={20} strokeWidth={1} />,
                roles: [Authorities.ROLE_USER],
                permissions: [BUSINESS_PERMISSIONS.VIEW_ALL_GUESTS],
                onClick: () => navigate("/guests")
            }
        ];

        return settingsMenuItems
            .filter(item => {
                // no role -> true
                const hasRole = !item.roles || item.roles.some(role => user?.authorities?.includes(role));

                const hasPermission =
                    !item.permissions ||
                    item.permissions.some(p =>
                        selectedBusinessEmployee?.permissions?.includes(p)
                    );

                return hasRole && hasPermission;
            })
            .map(item => ({
                key: item.key,
                icon: item.icon,
                label: item.label,
                onClick: item.onClick,
                className: "md:!rounded-full md:!w-fit"
            }));
    }, [user, selectedBusinessEmployee, navigate]);

    return filteredSettingsMenu;
};