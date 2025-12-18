export const BUSINESS_EMPLOYEE_ROLE = {
    OWNER: 'OWNER',
    MANAGER: 'MANAGER',
    EMPLOYEE: 'EMPLOYEE',
} as const

export type BusinessEmployeeRole = typeof BUSINESS_EMPLOYEE_ROLE[keyof typeof BUSINESS_EMPLOYEE_ROLE];

export const businessEmployeeRoleLabels: Record<string, string> = {
    MANAGER: 'Menedzser',
    EMPLOYEE: 'Alkalmazott',
    OWNER: 'Tulajdonos'
}