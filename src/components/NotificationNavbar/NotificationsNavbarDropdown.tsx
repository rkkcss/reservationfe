import { Badge, Dropdown } from 'antd';
import NotificationList from './NotificationNavbarList';
import { IoMdArrowDropdown } from 'react-icons/io';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import { useState } from 'react';

const NotificationsDropdown = () => {
    const { notifications, markAsRead, currentBusinessUnreadCount } = useNotifications();
    const [open, setOpen] = useState(false);

    return (
        <Dropdown
            open={open}
            onOpenChange={setOpen}
            arrow={{ pointAtCenter: true }}
            placement="bottomRight"
            popupRender={() => (
                <NotificationList
                    closeDropdown={() => setOpen(false)}
                    notifications={notifications}
                    onRead={markAsRead}
                    unreadCount={currentBusinessUnreadCount}
                />
            )}
            trigger={['click']}
        >
            <div className="flex items-center gap-0.5 cursor-pointer">
                <Badge count={currentBusinessUnreadCount}>
                    <FiBell size="1.5rem" onClick={(e) => e.preventDefault()} className="cursor-pointer" />
                </Badge>
                <IoMdArrowDropdown size={14} className=" group-hover:text-primary mt-1" />
            </div>
        </Dropdown>
    );
}

export default NotificationsDropdown