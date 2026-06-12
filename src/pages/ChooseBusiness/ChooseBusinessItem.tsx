import { forwardRef, useState } from 'react'
import { BusinessEmployee } from '../../helpers/types/BusinessEmployee'
import { LiaIndustrySolid } from 'react-icons/lia'
import { Badge, Button } from 'antd'
import { employeeRolesExtended } from '../../helpers/types/BusinessEmployeeRole'
import { useNotifications } from '../../context/NotificationContext'

type Props = React.LiHTMLAttributes<HTMLLIElement> & {
    logo: string
    businessName: string
    role: BusinessEmployee['role']
    onClick?: () => void,
    businessEmployeeId?: number
}
    & (
        | { isInvitation: true; onApprove: () => void; onDecline: () => void; onClick?: () => void }
        | { isInvitation?: false; onApprove?: never; onDecline?: never; onClick: () => void }
    )

const ChooseBusinessItem = forwardRef<HTMLLIElement, Props>(({ businessEmployeeId, logo, businessName, role, isInvitation = false, onClick, onApprove, onDecline, ...props }, ref) => {
    const [logoError, setLogoError] = useState(false);
    const { unreadCountByUser } = useNotifications();
    const unreadCount = businessEmployeeId && unreadCountByUser.get(businessEmployeeId) || 0;

    return (
        <li
            ref={ref}
            onClick={() => !isInvitation && onClick?.()}
            className={` 
                ${!isInvitation
                && 'hover:outline-indigo-600 hover:text-indigo-600 cursor-pointer'
                } 
                flex group items-center 
                outline outline-1 outline-gray-300
                p-2 
                rounded-lg
            `}
            {...props}
        >
            {(!logo || logoError) ? (
                <LiaIndustrySolid className="w-10 h-10" />
            ) : (
                <img
                    src={logo}
                    onError={() => setLogoError(true)}
                    className="w-10 h-10 rounded-full"
                />
            )}
            <div className="ml-2">
                <p className="text-base font-semibold leading-3">
                    {businessName}
                </p>
                <div>
                    <Badge size="small"
                        count={employeeRolesExtended[role].label}
                        color={employeeRolesExtended[role].color}
                    />
                </div>
            </div>
            {unreadCount > 0 &&
                <div className="ml-auto">
                    <Badge count={unreadCount} />
                </div>
            }
            {
                isInvitation &&
                <div className="ml-auto">
                    <Button size="small" type="primary" onClick={onApprove}>Elfogad</Button>
                    <Button size="small" danger type="primary" className="ml-2" onClick={onDecline}>Elutast</Button>
                </div>
            }
        </li>
    )
})

ChooseBusinessItem.displayName = 'ChooseBusinessItem'

export default ChooseBusinessItem