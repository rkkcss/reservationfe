export type BusinessRating = {
    id: number;
    title: string;
    description: string;
    number: number;
    imageUrl?: string; // Optional image URL
    guest: {
        id: number;
        name: string; // User's name
        email?: string; // Optional email field
    };
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}