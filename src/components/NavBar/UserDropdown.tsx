import { Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { MenuItem, userMenuItems } from '../../constants/navBarItems';

interface Props {
    user: { authorities?: string[] };
    onLogout: () => void;
}

export default function UserDropdown({ user }: Props) {
    const menu = userMenuItems
        .filter((item: MenuItem) => !item.roles || item.roles.some(r => user.authorities?.includes(r)))
        .map((item: MenuItem) => ({
            key: item.key,
            label: item.label,
        }));

    return (
        <Dropdown menu={{ items: menu }}>
            <button className="text-2xl p-2 hover:bg-slate-100 rounded-full">
                <UserOutlined />
            </button>
        </Dropdown>
    );
}
