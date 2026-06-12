export type AppointmentNotificationData = {
    appointmentId: number;
    guestName: string;
    date: string;
}

export type EmployeeNotificationData = {
    employeeId: number;
    employeeName: string;
}

export type Notification = {
    id: number;
    type: string;
    data: AppointmentNotificationData | EmployeeNotificationData | object;
    read: boolean;
    createdAt: string;
}