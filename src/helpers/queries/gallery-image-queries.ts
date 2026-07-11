import API from "../../utils/API";
import { GalleryImage } from "../types/GalleryImage";

export const getGalleryImagesByEmployeeId = (employeeId: number) => {
    return API.get<GalleryImage[]>(
        `/api/gallery-image/business-employee/${employeeId}`,
    );
};

export const createImageGalleryByEmployeeId = (
    employeeId: number,
    formData: FormData,
) => {
    return API.post<GalleryImage[]>(
        `/api/gallery-image/business-employee/${employeeId}`,
        formData,
    );
};

export const deleteGalleryImageByEmployeeIdAndImageId = (
    employeeId: number,
    fileId: number,
) => {
    return API.delete(
        `/api/gallery-image/business-employee/${employeeId}/image/${fileId}`,
    );
};
