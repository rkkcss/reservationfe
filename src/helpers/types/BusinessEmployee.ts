import { BusinessEmployeeRole } from './BusinessEmployeeRole';
import { BasicEntityStatus } from "./BasicEntityStatus";
import { Business } from "./Business";
import { BusinessPermission } from './BusinessPermission';
import { User } from './User';

export type BusinessEmployee = {
    id: number;
    business: Business;
    user: User;
    status: BasicEntityStatus;
    createdBy: string;
    createdDate: Date;
    updatedDate: Date;
    role: BusinessEmployeeRole;
    permissions: BusinessPermission[];
}