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

export const employeeRolesExtended: Record<string, { label: string; color: string }> = {
    [BUSINESS_EMPLOYEE_ROLE.OWNER]: {
        label: "Tulajdonos",
        color: "red",
    },
    [BUSINESS_EMPLOYEE_ROLE.MANAGER]: {
        label: "Menedzser",
        color: "blue",
    },
    [BUSINESS_EMPLOYEE_ROLE.EMPLOYEE]: {
        label: "Alkalmazott",
        color: "green",
    },
};