import React, { lazy, Suspense } from 'react';
import { FiBell } from 'react-icons/fi';
import { Notification } from '../../helpers/types/Notification';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REGISTRY: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
    'appointment.cancelled': lazy(() => import('./AppointmentNotification').then(m => ({ default: m.AppointmentNotification }))),
    'appointment.confirmed': lazy(() => import('./AppointmentNotification').then(m => ({ default: m.AppointmentNotification }))),
    'new.booking': lazy(() => import('./AppointmentNotification').then(m => ({ default: m.AppointmentNotification }))),
    'employee.added': lazy(() => import('./EmployeeNotification').then(m => ({ default: m.EmployeeNotification }))),
    'password.changed': lazy(() => import('./SystemNotification').then(m => ({ default: m.SystemNotification }))),
};

// 2. A Fallback
const DefaultNotification = lazy(() => import('./SystemNotification').then(m => ({ default: m.SystemNotification })));

export const NotificationRenderer = ({ notification }: { notification: Notification }) => {
    const Component = REGISTRY[notification.type] || DefaultNotification;

    return (
        <Suspense fallback={<NotificationFallback />}>
            <Component type={notification.type} data={notification.data} />
        </Suspense>
    );
};

const NotificationFallback = () => (
    <div className="animate-pulse p-3 bg-gray-50 rounded-full flex items-center justify-center text-xl">
        <FiBell className="text-gray-300" />
    </div>
);