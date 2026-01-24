export type BusinessRating = {
    id: number;
    title: string;
    description: string;
    number: number;
    imageUrl?: string;
    guest: {
        id: number;
        name: string;
        email?: string;
    };
    createdAt: string;
    updatedAt: string;
};

export type BusinessRatingSummary = {
    ratings: BusinessRating[];
    averageRating: number;
}