
export const BUSINESS_PERMISSIONS = {
    VIEW_ALL_SCHEDULE: 'VIEW_ALL_SCHEDULE',
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
    EDIT_OWN_WORKING_HOURS: 'EDIT_OWN_WORKING_HOURS',
    EDIT_ALL_WORKING_HOURS: 'EDIT_ALL_WORKING_HOURS',
    VIEW_ALL_GUESTS: 'VIEW_ALL_GUESTS',
    VIEW_OWN_STATISTICS: 'VIEW_OWN_STATISTICS',
    VIEW_ALL_STATISTICS: 'VIEW_ALL_STATISTICS',
} as const;

export type BusinessPermission =
    typeof BUSINESS_PERMISSIONS[keyof typeof BUSINESS_PERMISSIONS];

export const BusinessEmployeePermissonLabels: Record<string, string> = {
    VIEW_SCHEDULE: 'Naptár megtekintése',
    EDIT_OWN_SCHEDULE: 'Saját időpontok szerkesztése',
    EDIT_ALL_SCHEDULES: 'Minden időpont szerkesztése',
    CREATE_BOOKING: 'Foglalás létrehozása',
    EDIT_OWN_BOOKINGS: 'Saját foglalások szerkesztése',
    EDIT_ALL_BOOKINGS: 'Minden foglalás szerkesztése',
    VIEW_SERVICES: 'Szolgáltatások megtekintése',
    EDIT_OWN_SERVICES: 'Saját szolgáltatások szerkesztése',
    EDIT_ALL_SERVICES: 'Minden szolgáltatás szerkesztése',
    VIEW_STATISTICS: 'Statisztikák megtekintése',
    MANAGE_EMPLOYEES: 'Alkalmazottak kezelése',
    MANAGE_BUSINESS_SETTINGS: 'Üzlet beállításai',
    EDIT_OWN_WORKING_HOURS: 'Saját munkaidőbeosztás szerkesztése',
    EDIT_ALL_WORKING_HOURS: 'Minden munkaidőbeosztás szerkesztése',
    VIEW_OWN_STATISTICS: 'Saját statisztika megtekintése',
    VIEW_ALL_STATISTICS: 'Minden statisztika megtekintése',
    VIEW_ALL_GUESTS: 'Mindenki vendég megtekintése',
    VIEW_ALL_SCHEDULE: 'Mindenki időpontjának megtekintése',
}


export const permissionGroups = [
    {
        title: 'Naptár és Beosztás',
        permissions: [
            { key: BUSINESS_PERMISSIONS.VIEW_ALL_SCHEDULE, label: 'Összesített naptár megtekintése' },
            { key: BUSINESS_PERMISSIONS.EDIT_ALL_WORKING_HOURS, label: 'Mindenki munkaidejének módosítása' },
            { key: BUSINESS_PERMISSIONS.EDIT_OWN_WORKING_HOURS, label: 'Saját munkaidő módosítása' },
        ]
    },
    {
        title: 'Foglalások kezelése',
        permissions: [
            { key: BUSINESS_PERMISSIONS.CREATE_BOOKING, label: 'Új foglalás rögzítése' },
            { key: BUSINESS_PERMISSIONS.EDIT_ALL_BOOKINGS, label: 'Minden foglalás módosítása/törlése' },
            { key: BUSINESS_PERMISSIONS.EDIT_OWN_BOOKINGS, label: 'Saját foglalások módosítása' },
        ]
    },
    {
        title: 'Szolgáltatások és Portfólió',
        permissions: [
            { key: BUSINESS_PERMISSIONS.VIEW_SERVICES, label: 'Szolgáltatások listázása' },
            { key: BUSINESS_PERMISSIONS.EDIT_ALL_SERVICES, label: 'Összes szolgáltatás szerkesztése' },
            { key: BUSINESS_PERMISSIONS.EDIT_OWN_SERVICES, label: 'Saját szolgáltatások kezelése' },
        ]
    },
    {
        title: 'Ügyfélkezelés',
        permissions: [
            { key: BUSINESS_PERMISSIONS.VIEW_ALL_GUESTS, label: 'Vendégadatbázis megtekintése' },
        ]
    },
    {
        title: 'Üzleti adatok és Statisztika',
        permissions: [
            { key: BUSINESS_PERMISSIONS.VIEW_ALL_STATISTICS, label: 'Teljes üzleti statisztika' },
            { key: BUSINESS_PERMISSIONS.VIEW_OWN_STATISTICS, label: 'Saját teljesítmény statisztika' },
        ]
    },
    {
        title: 'Rendszerbeállítások',
        permissions: [
            { key: BUSINESS_PERMISSIONS.MANAGE_EMPLOYEES, label: 'Alkalmazottak és jogosultságok' },
            { key: BUSINESS_PERMISSIONS.MANAGE_BUSINESS_SETTINGS, label: 'Üzlet alapbeállításai' },
        ]
    }
];