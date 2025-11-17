import { BasicEntityStatus } from './BasicEntityStatus';
export type Offering = {
    id: number;
    title: string;
    description?: string;
    price?: number;
    durationMinutes: number;
    isActive?: boolean;
    status: BasicEntityStatus;
}