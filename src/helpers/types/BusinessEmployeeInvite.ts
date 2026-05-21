
import { Business } from "./Business";
import { BusinessEmployeeRole } from "./BusinessEmployeeRole";
import { BusinessPermission } from "./BusinessPermission";
import { User } from "./User";

export type BusinessEmployeeInvite = {
    id: number;
    email: string;
    role: BusinessEmployeeRole;
    permissions: BusinessPermission[];
    business: Business;
    expiresAt: Date;
    used: boolean;
    token: string;
    invitedBy: User;
}