import { User } from "../../redux/userSlice"

export type Employee = {
    id?: number,
    jobTitle?: number,
    phoneNumber?: string,
    email?: number,
    fullName?: Date,
    user?: User
}