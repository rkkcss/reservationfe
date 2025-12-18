import { BasicEntityStatus } from './BasicEntityStatus';
import { BusinessEmployee } from './BusinessEmployee';
export type Offering = {
    id: number;
    title: string;
    description?: string;
    price?: number;
    durationMinutes: number;
    isActive?: boolean;
    status: BasicEntityStatus;
    businessEmployee: BusinessEmployee;
}