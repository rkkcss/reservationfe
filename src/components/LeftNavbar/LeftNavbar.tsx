import { Badge, Button, Divider, Image, Menu } from 'antd'
import { useNavigate } from 'react-router';
import { useAppSelector } from '../../store/hooks';
import logo from '../../assets/logo.png';
import UserAvatar from '../UserAvatar';
import { employeeRolesExtended } from '../../helpers/types/BusinessEmployeeRole';
import { useLeftNavbar } from './useLeftNavbar';

const LeftNavbar = () => {
    const navigate = useNavigate();
    const filteredSettingsMenu = useLeftNavbar();
    const { user, selectedBusinessEmployee } = useAppSelector(state => state.userStore);

    return (
        <div className="relative">

            <div className="md:w-72 md:max-w-72 bg-white h-screen flex flex-col fixed top-0 border-r">
                <div className="flex items-center justify-start p-4 relative">
                    <Image preview={false} src={logo} className="!h-14 cursor-pointer" alt="logo" onClick={() => navigate('/')} />
                </div>
                <Menu
                    items={filteredSettingsMenu}
                    className="!border-none rounded-xl w-64"
                />
                <div className="block mt-auto mb-0 px-4">
                    <Divider />
                    <Button size="large" type="text" className="flex w-full h-fit py-1 px-1 gap-2 text-left justify-start items-center">
                        <UserAvatar />
                        <div>
                            <p className="text-sm font-semibold">{user?.fullName}</p>
                            <Badge color={employeeRolesExtended[selectedBusinessEmployee?.role].color}
                                count={employeeRolesExtended[selectedBusinessEmployee?.role].label}
                            />
                        </div>
                    </Button>
                    <Button type="text" danger className="!w-full my-4" onClick={() => navigate('/logout')}>Kijelentkezés</Button>
                </div>
            </div>
        </div>
    )
}

export default LeftNavbar