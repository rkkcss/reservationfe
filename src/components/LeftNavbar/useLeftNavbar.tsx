import { useMemo, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { FaRegClock } from 'react-icons/fa';
import { MdOutlineCleaningServices, MdOutlineDashboard } from 'react-icons/md';
import { RiProfileLine } from 'react-icons/ri';
import { CiCalendar, CiShop } from 'react-icons/ci';
import { GoShieldLock } from 'react-icons/go';
import { PiUsersThree } from 'react-icons/pi';
// 1. Az Ant Design hivatalom MenuProps típusának beimportálása
import type { MenuProps } from 'antd';

import { Authorities } from '../../helpers/types/Authorities';
import { BUSINESS_PERMISSIONS, BusinessPermission } from '../../helpers/types/BusinessPermission';
import { useAppSelector } from '../../store/hooks';

// --- TÍPUSDEFINÍCIÓK ---
interface BaseMenuItem {
    key: string;
    label: string;
    icon?: ReactNode;
    roles?: Authorities[];
    permissions?: BusinessPermission[];
    onClick?: () => void;
    isBeta?: boolean;
}

interface MenuItemDefinition extends BaseMenuItem {
    type?: 'group';
    children?: BaseMenuItem[];
}

// Kinyerjük az Antd által elvárt pontos tömb-elem típust az any elkerüléséhez
type AntdMenuItemType = Required<MenuProps>['items'][number];

// --- A HOOK FÜGGVÉNY ---
export const useLeftNavbar = (): MenuProps['items'] => {
    const navigate = useNavigate();
    const { user, selectedBusinessEmployee } = useAppSelector(state => state.userStore);

    const filteredSettingsMenu = useMemo<MenuProps['items']>(() => {
        // 1. A menüstruktúra teljes definíciója
        const settingsMenuItems: MenuItemDefinition[] = [
            // ÁTTEKINTÉS
            {
                key: 'dashboard',
                label: 'Dashboard',
                icon: <MdOutlineDashboard size={20} />,
                roles: [Authorities.ROLE_USER],
                permissions: [BUSINESS_PERMISSIONS.VIEW_OWN_STATISTICS, BUSINESS_PERMISSIONS.VIEW_ALL_STATISTICS],
                onClick: () => navigate('dashboard'),
                isBeta: true
            }, {
                key: 'calendar',
                label: 'Naptár',
                roles: [Authorities.ROLE_USER],
                onClick: () => navigate('calendar'),
                icon: <CiCalendar size={20} strokeWidth={1} />
            },
            // CSOPORT: SZEMÉLYES MENÜPONTOK
            {
                type: 'group',
                label: 'Saját fiók',
                key: 'personal-group',
                roles: [Authorities.ROLE_USER],
                children: [
                    {
                        key: "profile",
                        label: "Profil",
                        icon: <RiProfileLine size={20} />,
                        roles: [Authorities.ROLE_USER],
                        onClick: () => navigate("/settings/profile")
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
                        key: "security",
                        label: "Biztonság",
                        icon: <GoShieldLock size={20} strokeWidth={1} />,
                        roles: [Authorities.ROLE_USER],
                        onClick: () => navigate("/settings/security")
                    }
                ]
            },
            {
                type: 'group',
                label: 'Üzletvezetés',
                key: 'business-group',
                roles: [Authorities.ROLE_USER],
                children: [
                    {
                        key: "business",
                        label: "Üzlet beállítások",
                        icon: <CiShop size={20} strokeWidth={1} />,
                        roles: [Authorities.ROLE_USER],
                        permissions: [BUSINESS_PERMISSIONS.MANAGE_BUSINESS_SETTINGS],
                        onClick: () => navigate("/settings/business")
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
                        onClick: () => navigate("/guests")
                    }
                ]
            }
        ];

        // 2. Segédfunkció a jogosultság-ellenőrzésre
        const hasAccess = (item: BaseMenuItem | MenuItemDefinition): boolean => {
            const hasRole = !item.roles || item.roles.some(role => user?.authorities?.includes(role));
            const hasPermission = !item.permissions || item.permissions.some(p =>
                selectedBusinessEmployee?.permissions?.includes(p)
            );
            return hasRole && hasPermission;
        };

        // 3. A menü szűrése és típusbiztos átalakítása az Ant Design számára
        return settingsMenuItems
            .filter(item => {
                if (!hasAccess(item)) return false;

                if (item.type === 'group' && item.children) {
                    const visibleChildren = item.children.filter(hasAccess);
                    return visibleChildren.length > 0;
                }

                return true;
            })
            .map((item): AntdMenuItemType => {
                // Közös alap tulajdonságok
                const baseOutput = {
                    key: item.key,
                    icon: item.icon,
                    label: item.label,
                    onClick: item.onClick,
                    className: "md:!rounded-full md:!w-fit",
                };

                if (item.type === 'group') {
                    return {
                        ...baseOutput,
                        type: 'group',
                        children: item.children
                            ? item.children
                                .filter(hasAccess)
                                .map((child) => ({
                                    key: child.key,
                                    icon: child.icon,
                                    label: child.label,
                                    onClick: child.onClick,
                                    className: "md:!rounded-full md:!w-fit !ps-4"
                                }))
                            : []
                    };
                }

                return baseOutput;
            });
    }, [user, selectedBusinessEmployee, navigate]);

    return filteredSettingsMenu;
};