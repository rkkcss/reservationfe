import { useState, useMemo } from 'react'
import { Badge, Segmented } from 'antd';
import { Notification } from '../../helpers/types/Notification';
import dayjs from 'dayjs';
// Ha a dayjs isToday/isYesterday pluginokat használsz, győződj meg róla, hogy be vannak töltve a projektben!
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import CustomPagination from '../../components/CustomPagination';
import { useNotifications } from '../../context/NotificationContext';
import AllNotificationItem from './AllNotificationItem';

dayjs.extend(isToday);
dayjs.extend(isYesterday);

const AllNotification = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    const {
        data: notifications,
        currentBusinessUnreadCount,
        currentPage,
        fetchPage,
        totalItems,
        fetchNextPage,
        fetchPrevPage,
        setRequestParams
    } = useNotifications();

    const groupedData = useMemo(() => {
        const groups: Record<string, Notification[]> = { MA: [], TEGNAP: [], KORÁBBAN: [] };

        notifications.forEach(item => {
            const date = dayjs(item.createdAt);
            if (date.isToday()) groups.MA.push(item);
            else if (date.isYesterday()) groups.TEGNAP.push(item);
            else groups.KORÁBBAN.push(item);
        });

        return groups;
    }, [notifications]);

    const handleTabChange = (value: 'all' | 'unread') => {
        setActiveTab(value);
        setRequestParams({ unreadOnly: value === 'unread' });
    };

    const hasNotifications = notifications.length > 0;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex gap-2 mb-8 sticky top-16 z-50 w-full bg-gray-100 rounded-lg">
                <Segmented
                    className="bg-gray-100"
                    size="large"
                    value={activeTab}
                    onChange={handleTabChange}
                    options={[
                        { label: 'Összes', value: 'all' },
                        { label: 'Olvasatlan', value: 'unread', icon: <Badge count={currentBusinessUnreadCount} className="[&>.ant-badge-count]:bg-primary" /> },
                    ]}
                />
            </div>

            {
                hasNotifications && (Object.keys(groupedData) as Array<keyof typeof groupedData>).map((groupTitle) => {
                    const items = groupedData[groupTitle];
                    if (items.length === 0) return null;

                    return (
                        <div key={groupTitle} className="mb-8">
                            <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4 uppercase">
                                {groupTitle}
                            </h3>

                            {/* Listaelemek */}
                            <div className="space-y-3">
                                {items.map((notification) => (
                                    <AllNotificationItem
                                        key={notification.id}
                                        notification={notification}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })
            }

            {
                hasNotifications && (
                    <div className="flex justify-end pb-12">
                        <CustomPagination
                            currentPage={currentPage}
                            fetchNextPage={fetchNextPage}
                            fetchPrevPage={fetchPrevPage}
                            fetchPage={fetchPage}
                            totalItems={totalItems}
                        />
                    </div>
                )
            }

            {
                !hasNotifications && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-400 text-sm">Nincsenek értesítések ebben a kategóriában.</p>
                    </div>
                )
            }

        </div >
    );
}

export default AllNotification;