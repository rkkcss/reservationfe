import { Badge, Button, Divider, Image, Menu, Popover } from 'antd'
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import logo from '../../assets/logo.png';
import UserAvatar from '../UserAvatar';
import { BUSINESS_EMPLOYEE_ROLE, employeeRolesExtended } from '../../helpers/types/BusinessEmployeeRole';
import { useLeftNavbar } from './useLeftNavbar';
import { RiSpaceShipLine } from 'react-icons/ri';
import { useState } from 'react';
import { logoutUser, setActiveBusinessEmployeeDefault } from '../../redux/userSlice';
import { LiaIndustrySolid } from 'react-icons/lia';
import { IoLogOutOutline } from 'react-icons/io5';

const LeftNavbar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const filteredSettingsMenu = useLeftNavbar();
    const { user, selectedBusinessEmployee } = useAppSelector(state => state.userStore);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleAccountChangeBusiness = (navigate: (path: string, options?: { replace: boolean }) => void) => {
        dispatch(setActiveBusinessEmployeeDefault());
        navigate('/choose-business', { replace: true });
    }

    return (
        <div className="relative">

            <div className="md:w-72 md:max-w-72 bg-white h-screen flex flex-col fixed top-0 border-r">
                <div className="flex items-center justify-start p-4 relative">
                    <Image preview={false} src={logo} className="!h-14 cursor-pointer" alt="logo" onClick={() => navigate('/')} />
                </div>
                <Menu
                    items={filteredSettingsMenu}
                    className="!border-none rounded-xl overflow-y-auto w-full"
                />
                <div className="block mt-auto mb-0 px-4 pb-4">
                    <Divider />
                    <Popover
                        open={popoverOpen}
                        onOpenChange={(open) => setPopoverOpen(open)}
                        content={
                            <div className="flex flex-col">
                                <Button type="text" className="!text-left justify-start" icon={<LiaIndustrySolid size={20} />} onClick={() => handleAccountChangeBusiness(navigate)}>Fiók váltás</Button>
                                <Button type="text" danger className=" mt-2" icon={<IoLogOutOutline size={20} />} onClick={() => dispatch(logoutUser())}>Kijelentkezés</Button>
                            </div>
                        }
                        placement={"right"}
                        trigger="click"
                    >
                        <Button size="large" type="text" className="flex w-full h-fit py-1 px-1 gap-2 text-left justify-start items-center">
                            <UserAvatar />
                            <div>
                                <p className="text-sm font-semibold">{user?.fullName}</p>
                                <Badge color={employeeRolesExtended[selectedBusinessEmployee?.role].color}
                                    count={employeeRolesExtended[selectedBusinessEmployee?.role].label}
                                />
                                {
                                    BUSINESS_EMPLOYEE_ROLE.OWNER === selectedBusinessEmployee.role &&
                                    <Badge color={"cyan"}
                                        count={"Próba időszak"}
                                        className="ml-2"
                                    />
                                }
                            </div>
                        </Button>
                    </Popover>
                    <Button type="primary" className="!w-full mt-6">
                        <RiSpaceShipLine className="text-xl" />
                        Upgrade
                    </Button>

                </div>
            </div>
        </div>
    )
}

export default LeftNavbar