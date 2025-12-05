import { Authorities } from "./Authorities";

export type User = {
    id: number;
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl?: string | "";
    activated: boolean;
    langKey: string;
    createdDate: Date;
    authorities: [Authorities];
};

export type UserWithPassword = User & {
    password?: string;
};
