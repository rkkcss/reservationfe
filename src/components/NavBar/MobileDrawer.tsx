import { Drawer } from 'antd';
import { menuItems, userMenuItems } from '../../constants/navBarItems';
import { Link } from 'react-router-dom';

interface Props {
    open: boolean;
    onClose: () => void;
    user?: { authorities?: string[] };
    onLogout: () => void;
}

export default function MobileDrawer({ open, onClose, user, onLogout }: Props) {
    const hasAccess = (roles?: string[]) =>
        !roles || roles.some(role => user?.authorities?.includes(role));

    return (
        <Drawer title="Menu" open={open} onClose={onClose}>
            <nav className="flex flex-col gap-2">
                {menuItems.filter(item => hasAccess(item.roles)).map(item => (
                    <Link key={item.key} to={item.path} onClick={onClose}>
                        {item.label}
                    </Link>
                ))}
                <hr />
                {user &&
                    userMenuItems.filter(item => hasAccess(item.roles)).map(item => (
                        <button
                            key={item.key}
                            onClick={item.onClick === 'logout' ? onLogout : item.onClick}
                            className="text-left"
                        >
                            {item.label}
                        </button>
                    ))}
            </nav>
        </Drawer>
    );
}
