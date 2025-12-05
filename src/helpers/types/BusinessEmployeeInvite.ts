import { User } from "../../redux/userSlice";
import { Business } from "./Business";

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