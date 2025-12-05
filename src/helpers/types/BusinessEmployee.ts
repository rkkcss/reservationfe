import { BusinessEmployeeRole } from './BusinessEmployeeRole';
import { User } from "../../redux/userSlice";
import { BasicEntityStatus } from "./BasicEntityStatus";
import { Business } from "./Business";
import { BusinessPermission } from './BusinessPermission';

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