import { Dropdown, MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { userMenuItems } from '../../constants/navBarItems';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface Props {
    user: { authorities?: string[] };
    onLogout: () => void;
}

export default function UserDropdown({ user }: Props) {
    const { t } = useTranslation("nav-bar");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const menu: MenuProps["items"] = userMenuItems(t, navigate, dispatch)
        .filter((item) => !item.roles || item.roles.some(r => user.authorities?.includes(r)))
        .map((item) => ({
            key: item.key!,
            label: item.label!,
        }));

    return (
        <Dropdown menu={{ items: menu }}>
            <button className="text-2xl p-2 hover:bg-slate-100 rounded-full">
                <UserOutlined />
            </button>
        </Dropdown>
    );
}
