import { Button, Divider, Drawer } from 'antd'
import { useNavigate } from 'react-router'
import { MenuItem } from '../../constants/navBarItems'
import { useTranslation } from 'react-i18next'
import { loginModal } from '../Login/loginModalController'

type MobileMainMenuProps = {
    menuItems: MenuItem[],
    onClose: () => void,
    open: boolean,
}

const MobileMainMenu = ({ menuItems, onClose, open }: MobileMainMenuProps) => {
    const { t } = useTranslation("nav-bar");
    const navigate = useNavigate();

    const handleLink = (link: string | undefined) => {
        if (!link) return;
        navigate(link);
        onClose();
    }

    const handleLogin = () => {
        loginModal.open();
        onClose();
    }


    return (
        <Drawer open={open} onClose={onClose} title={t('Menu elements')}>
            <ul className="flex flex-col gap-4">
                {menuItems.map(item => (
                    <li key={item.key}>
                        <div role="link" onClick={() => handleLink(item.link)} className="flex cursor-pointer items-center gap-2 text-sm px-4 py-2 hover:text-primary hover:bg-slate-200 transition rounded-full font-semibold w-full">
                            {item.icon}
                            {t(item.label!)}
                        </div>
                    </li>
                ))}
                <div>
                    <Button type="primary" className="w-full" onClick={handleLogin}>
                        {t('login')}
                    </Button>
                    <Divider className="!my-1">or</Divider>
                    <Button className="w-full" onClick={() => handleLink("/register")}>
                        {t('register')}
                    </Button>
                </div>
            </ul>
        </Drawer>
    )
}

export default MobileMainMenu