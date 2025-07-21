import { Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { userMenuItems } from '../../constants/navBarItems';

interface Props {
    user: { authorities?: string[] };
    onLogout: () => void;
}

export default function UserDropdown({ user, onLogout }: Props) {
    const menu = userMenuItems
        .filter(item => !item.roles || item.roles.some(r => user.authorities?.includes(r)))
        .map(item => ({
            key: item.key,
            label: item.label,
            onClick: item.onClick === 'logout' ? onLogout : item.onClick,
        }));

    return (
        <Dropdown menu={{ items: menu }}>
            <button className="text-2xl p-2 hover:bg-slate-100 rounded-full">
                <UserOutlined />
            </button>
        </Dropdown>
    );
}
