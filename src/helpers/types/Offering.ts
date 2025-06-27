export type Offering = {
    id: number;
    title: string;
    description?: string;
    price?: number;
    durationMinutes: number;
    isActive?: boolean;
}