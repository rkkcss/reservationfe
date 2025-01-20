import { OpeningHour } from "./OpeningHour"

export type Business = {
    id?: string,
    name?: string,
    description?: string,
    services?: string[],
    location?: string,
    openingHours?: OpeningHour[],
}