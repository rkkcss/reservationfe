import { Drawer } from 'antd';
import { menuItems, userMenuItems } from '../../constants/navBarItems';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

interface Props {
    open: boolean;
    onClose: () => void;
    user?: { authorities?: string[] };
    onLogout: () => void;
}

export default function MobileDrawer({ open, onClose, user }: Props) {
    const { t } = useTranslation("nav-bar");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const hasAccess = (roles?: string[]) =>
        !roles || roles.some(role => user?.authorities?.includes(role));

    return (
        <Drawer title="Menu" open={open} onClose={onClose}>
            <nav className="flex flex-col gap-2">
                {menuItems(t).filter(item => hasAccess(item.roles)).map(item => (
                    <Link key={item.key} to={item.link ? item.link : ""} onClick={onClose}>
                        {item.label}
                    </Link>
                ))}
                <hr />
                {user &&
                    userMenuItems(t, navigate, dispatch).filter(item => hasAccess(item.roles)).map(item => (
                        <button
                            key={item.key}
                            onClick={item.onClick}
                            className="text-left"
                        >
                            {item.label}
                        </button>
                    ))}
            </nav>
        </Drawer>
    );
}
