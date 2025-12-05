
export const BUSINESS_PERMISSIONS = {
    VIEW_SCHEDULE: 'VIEW_SCHEDULE',
    EDIT_OWN_SCHEDULE: 'EDIT_OWN_SCHEDULE',
    EDIT_ALL_SCHEDULES: 'EDIT_ALL_SCHEDULES',
    CREATE_BOOKING: 'CREATE_BOOKING',
    EDIT_OWN_BOOKINGS: 'EDIT_OWN_BOOKINGS',
    EDIT_ALL_BOOKINGS: 'EDIT_ALL_BOOKINGS',
    VIEW_SERVICES: 'VIEW_SERVICES',
    EDIT_OWN_SERVICES: 'EDIT_OWN_SERVICES',
    EDIT_ALL_SERVICES: 'EDIT_ALL_SERVICES',
    VIEW_STATISTICS: 'VIEW_STATISTICS',
    MANAGE_EMPLOYEES: 'MANAGE_EMPLOYEES',
    MANAGE_BUSINESS_SETTINGS: 'MANAGE_BUSINESS_SETTINGS',
} as const;

export type BusinessPermission =
    typeof BUSINESS_PERMISSIONS[keyof typeof BUSINESS_PERMISSIONS];

export const BusinessEmployeePermissonLabels: Record<string, string> = {
    VIEW_SCHEDULE: 'Naptár megtekintése',
    EDIT_OWN_SCHEDULE: 'Saját időbeosztás szerkesztése',
    EDIT_ALL_SCHEDULES: 'Minden időbeosztás szerkesztése',
    CREATE_BOOKING: 'Foglalás létrehozása',
    EDIT_OWN_BOOKINGS: 'Saját foglalások szerkesztése',
    EDIT_ALL_BOOKINGS: 'Minden foglalás szerkesztése',
    VIEW_SERVICES: 'Szolgáltatások megtekintése',
    EDIT_OWN_SERVICES: 'Saját szolgáltatások szerkesztése',
    EDIT_ALL_SERVICES: 'Minden szolgáltatás szerkesztése',
    VIEW_STATISTICS: 'Statisztikák megtekintése',
    MANAGE_EMPLOYEES: 'Alkalmazottak kezelése',
    MANAGE_BUSINESS_SETTINGS: 'Üzlet beállításai',
}


export const permissionGroups = [
    {
        title: 'Naptár és Időbeosztás',
        permissions: [
            { key: BUSINESS_PERMISSIONS.VIEW_SCHEDULE, label: 'Naptár megtekintése' },
            { key: BUSINESS_PERMISSIONS.EDIT_OWN_SCHEDULE, label: 'Saját időbeosztás szerkesztése' },
            { key: BUSINESS_PERMISSIONS.EDIT_ALL_SCHEDULES, label: 'Minden időbeosztás szerkesztése' },
        ]
    },
    {
        title: 'Foglalások',
        permissions: [
            { key: BUSINESS_PERMISSIONS.CREATE_BOOKING, label: 'Foglalás létrehozása' },
            { key: BUSINESS_PERMISSIONS.EDIT_OWN_BOOKINGS, label: 'Saját foglalások szerkesztése' },
            { key: BUSINESS_PERMISSIONS.EDIT_ALL_BOOKINGS, label: 'Minden foglalás szerkesztése' },
        ]
    },
    {
        title: 'Szolgáltatások',
        permissions: [
            { key: BUSINESS_PERMISSIONS.VIEW_SERVICES, label: 'Szolgáltatások megtekintése' },
            { key: BUSINESS_PERMISSIONS.EDIT_OWN_SERVICES, label: 'Saját szolgáltatások szerkesztése' },
            { key: BUSINESS_PERMISSIONS.EDIT_ALL_SERVICES, label: 'Minden szolgáltatás szerkesztése' },
        ]
    },
    {
        title: 'Adminisztráció',
        permissions: [
            { key: BUSINESS_PERMISSIONS.VIEW_STATISTICS, label: 'Statisztikák megtekintése' },
            { key: BUSINESS_PERMISSIONS.MANAGE_EMPLOYEES, label: 'Alkalmazottak kezelése' },
            { key: BUSINESS_PERMISSIONS.MANAGE_BUSINESS_SETTINGS, label: 'Üzlet beállításai' },
        ]
    }
];