import { useState } from "react";
import ImageUploader from "./ImageUploader/ImageUploader";
import { uploadCoverImageQuery } from "../helpers/queries/business-queries";

const BusinessCoverImageUpload = () => {
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (file: File) => {
        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await uploadCoverImageQuery(formData);
            setCoverUrl(res.data.bannerUrl);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemove = async () => {
        setCoverUrl(null);
        // await deleteCoverImageQuery();
    };

    return (
        <ImageUploader
            value={coverUrl}
            onSave={handleSave}
            onRemove={handleRemove}
            saving={isSaving}
        />
    );
};

export default BusinessCoverImageUpload;
