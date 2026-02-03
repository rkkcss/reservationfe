import { BusinessEmployee } from "./BusinessEmployee"

export type Guest = {
    id: number | null,
    name: string,
    email: string,
    phoneNumber: string,
    canBook: boolean,
    businessEmployee: BusinessEmployee,
    createdDate: Date,
}