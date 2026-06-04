import { useEffect, useState } from 'react'
import { BusinessEmployee } from '../../helpers/types/BusinessEmployee';
import { Alert, Button, Divider, Spin, Tour } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser, setActiveBusinessEmployee } from '../../redux/userSlice';
import { useNavigate } from 'react-router';
import { IoLogOutOutline } from 'react-icons/io5';
import Loading from '../../components/Loading';
import { getCurrentBusinessEmployeeOptions } from '../../helpers/queries/business-employee';
import { useChooseBusinessTour } from './useChooseBusinessTour';
import { activateBusinessEmployeeInvite, getAllPendingInvitations } from '../../helpers/queries/business-employee-invite-queries';
import { BusinessEmployeeInvite } from '../../helpers/types/BusinessEmployeeInvite';
import ChooseBusinessItem from './ChooseBusinessItem';

const ChooseBusiness = () => {
    const [businessEmployees, setBusinessEmployees] = useState<BusinessEmployee[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAppSelector((state) => state.userStore)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { openTour, steps, handleClose, refs } = useChooseBusinessTour();

    const [pendingInvitations, setPendingInvitations] = useState<BusinessEmployeeInvite[]>([]);

    const fetchPendingInvitations = () => {
        getCurrentBusinessEmployeeOptions()
            .then(res => {
                if (res.status === 200) {
                    setBusinessEmployees(res.data);
                }
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchPendingInvitations();

        getAllPendingInvitations().then(res => {
            setPendingInvitations(res.data);
        })
    }, []);

    const handleSelectBusinessEmployee = (businessEmployee: BusinessEmployee) => {
        dispatch(setActiveBusinessEmployee(businessEmployee));
        navigate("/calendar");
    }

    const handleOnApprove = (invitation: BusinessEmployeeInvite) => {
        if (!invitation.token) {
            console.warn("Nincs token!")
        }
        activateBusinessEmployeeInvite(invitation.token).then(res => {
            if (res.status === 204) {
                fetchPendingInvitations();
                setPendingInvitations(prev => prev.filter(i => i.id !== invitation.id));
            }
        })
    }

    return (
        <>
            <div className="flex items-center justify-center h-screen flex-col gap-20">
                <h1 className="text-4xl text-center">Üdv
                    <span className="ml-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                        {user?.firstName + " " + user?.lastName}
                    </span>
                </h1>
                <div>
                    {
                        businessEmployees.length > 0 &&
                        < Alert className="mb-2" showIcon message={"Válasszd ki melyik vállalkozásba szeretnél belépni."} />
                    }

                    <Spin spinning={loading} indicator={<Loading size={30} />}>
                        <div>
                            <div className="p-6 shadow-lg rounded-lg bg-white w-full md:w-[600px]">
                                {
                                    businessEmployees.length === 0 &&
                                    <Alert className="mb-2" showIcon message={"Nem tartozol meg egy vállalkozáshoz sem."} />
                                }
                                {
                                    businessEmployees.length > 0 &&
                                    <ul className="flex flex-col gap-4">
                                        {businessEmployees.map((businessEmployee, index) => (
                                            <ChooseBusinessItem
                                                key={businessEmployee.id}
                                                logo={businessEmployee.business.logo}
                                                businessName={businessEmployee.business.name}
                                                role={businessEmployee.role}
                                                onClick={() => handleSelectBusinessEmployee(businessEmployee)}
                                                ref={index === 0 ? refs.listRef : null}
                                            />
                                        ))}
                                    </ul>
                                }

                                {
                                    pendingInvitations.length > 0 &&
                                    <>
                                        <Divider rootClassName={`${businessEmployees.length === 0 && "!mt-0"}`}>Meghivók</Divider>
                                        <Alert className="mb-2" showIcon type="warning" message={"Az alábbi vállalkozásokba kaptál meghivást."} />
                                        <ul className="flex flex-col gap-4">
                                            {pendingInvitations.map((invitation, index) => (
                                                <>
                                                    <ChooseBusinessItem
                                                        key={invitation.id}
                                                        logo={invitation.business.logo}
                                                        businessName={invitation.business.name}
                                                        role={invitation.role}
                                                        onApprove={() => handleOnApprove(invitation)}
                                                        onDecline={() => console.log("decline")}
                                                        isInvitation={true}
                                                        ref={index === 0 ? refs.listRef : null}
                                                    />
                                                </>
                                            ))}
                                        </ul>
                                    </>
                                }
                                <Button type="text"
                                    className="w-full mt-4"
                                    icon={<IoLogOutOutline size={20} />}
                                    onClick={() => dispatch(logoutUser())}
                                    ref={refs.logoutRef}
                                >
                                    Inkább kilépek
                                </Button>
                            </div>
                        </div>
                    </Spin>
                </div>
            </div>
            <Tour open={openTour} onClose={handleClose} steps={steps} disabledInteraction />
        </>
    )
}

export default ChooseBusiness