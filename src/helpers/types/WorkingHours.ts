
export type WorkingHours = {
    id: number,
    dayOfWeek: number,
    startTime: Date,
    endTime: Date,
}

export type WorkingHoursRequest = Omit<WorkingHours, 'startTime' | 'endTime'> & {
    startTime: string;
    endTime: string;
};