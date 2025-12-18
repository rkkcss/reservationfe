
import { Business } from "./Business";
import { User } from "./User";

export type BusinessEmployeeInvite = {
    id: number;
    email: string;
    role: string;
    permissions: string[];
    business: Business;
    expiresAt: Date;
    used: boolean;
    token: string;
    invitedBy: User;
}

export type EmployeeInviteActivateType = {
    businessEmployeeInvite: BusinessEmployeeInvite;
    userExists: boolean;
}