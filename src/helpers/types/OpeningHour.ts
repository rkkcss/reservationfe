export const DAY_OF_WEEK: { [key: number]: string } = {
    1: 'Hétfő',
    2: 'Kedd',
    3: 'Szerda',
    4: 'Csütörtök',
    5: 'Péntek',
    6: 'Szombat',
    7: 'Vasárnap',
} as const;

export type DayOfWeek = keyof typeof DAY_OF_WEEK;

export type OpeningHour = {
    dayOfWeek?: number,
    openTime?: string,
    closeTime?: string,
    isClose: boolean
}