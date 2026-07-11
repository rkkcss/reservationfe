import { BusinessEmployee } from "./BusinessEmployee";

export type GalleryImage = {
    id: number;
    url: string;
    publicId: string;
    createdAt: string;
    businessEmployee: BusinessEmployee;
};
