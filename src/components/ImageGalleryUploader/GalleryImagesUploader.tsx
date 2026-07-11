import { useEffect, useState } from "react";
import { Upload, message, Button, Spin } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import type { RcFile } from "antd/es/upload/interface";
import { useBusinessEmployee } from "../../context/BusinessEmployeeContext";
import { GalleryImage } from "../../helpers/types/GalleryImage";
import {
    createImageGalleryByEmployeeId,
    deleteGalleryImageByEmployeeIdAndImageId,
    getGalleryImagesByEmployeeId,
} from "../../helpers/queries/gallery-image-queries";
import GalleryListItem from "./GalleryListItem";

const MAX_IMAGES = 20;
const MAX_SIZE_MB = 5;

function GalleryImagesUploader() {
    const { businessEmployee } = useBusinessEmployee();

    const [images, setImages] = useState<GalleryImage[]>([]);
    const [pendingFiles, setPendingFiles] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        getGalleryImagesByEmployeeId(businessEmployee.id)
            .then((res) => {
                if (res.status !== 200)
                    throw new Error(
                        `Galéria betöltése sikertelen (${res.status})`,
                    );
                return res.data;
            })
            .then((data: GalleryImage[]) => {
                if (!cancelled) setImages(data);
            })
            .catch((err) => {
                if (!cancelled)
                    message.error(
                        err instanceof Error
                            ? err.message
                            : "Galéria betöltése sikertelen",
                    );
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [businessEmployee]);

    const beforeUpload = (file: RcFile): boolean => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Csak kép fájl tölthető fel");
            return Upload.LIST_IGNORE as unknown as boolean;
        }
        const isWithinSize = file.size / 1024 / 1024 < MAX_SIZE_MB;
        if (!isWithinSize) {
            message.error(
                `A kép mérete nem lehet nagyobb, mint ${MAX_SIZE_MB}MB`,
            );
            return Upload.LIST_IGNORE as unknown as boolean;
        }

        if (images.length + pendingFiles.length >= MAX_IMAGES) {
            message.warning(`Legfeljebb ${MAX_IMAGES} képet tölthetsz fel.`);
            return Upload.LIST_IGNORE as unknown as boolean;
        }

        const localUrl = URL.createObjectURL(file);
        const newFile: UploadFile = {
            uid: file.uid,
            name: file.name,
            status: "done",
            url: localUrl,
            thumbUrl: localUrl,
            originFileObj: file,
        };

        setPendingFiles((prev) => [...prev, newFile]);
        return false;
    };

    const handleUploadSubmit = async () => {
        if (pendingFiles.length === 0) return;

        setSubmitting(true);
        const formData = new FormData();

        pendingFiles.forEach((file) => {
            if (file.originFileObj) {
                formData.append("files", file.originFileObj);
            }
        });

        try {
            const res = await createImageGalleryByEmployeeId(
                businessEmployee.id,
                formData,
            );

            if (res.status !== 201 && res.status !== 200)
                throw new Error(`Feltöltés sikertelen (${res.status})`);

            const uploadedData: GalleryImage | GalleryImage[] = res.data;
            const newImagesList = Array.isArray(uploadedData)
                ? uploadedData
                : [uploadedData];

            pendingFiles.forEach((file) => {
                if (file.url?.startsWith("blob:")) {
                    URL.revokeObjectURL(file.url);
                }
            });

            setImages((prev) => [...prev, ...newImagesList]);
            setPendingFiles([]);
            message.success("Képek sikeresen feltöltve!");
        } catch (err) {
            message.error(
                err instanceof Error ? err.message : "Sikertelen feltöltés",
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleServerImageDelete = async (imageId: number) => {
        setDeletingId(imageId);
        try {
            const res = await deleteGalleryImageByEmployeeIdAndImageId(
                businessEmployee.id,
                imageId,
            );
            if (res.status !== 200 && res.status !== 204) {
                throw new Error("Sikertelen törlés a szerverről");
            }
            setImages((prev) => prev.filter((img) => img.id !== imageId));
            message.success("Kép sikeresen törölve");
        } catch (err) {
            message.error(
                err instanceof Error ? err.message : "Sikertelen törlés",
            );
        } finally {
            setDeletingId(null);
        }
    };

    const handlePendingRemove = (file: UploadFile) => {
        if (file.url?.startsWith("blob:")) {
            URL.revokeObjectURL(file.url);
        }
        setPendingFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    };

    return (
        <div className="mt-8">
            <div>
                <p className="text-lg font-bold text-gray-800 mb-4">
                    Új képek kiválasztása
                </p>
                <Upload
                    listType="picture-card"
                    fileList={pendingFiles}
                    beforeUpload={beforeUpload}
                    onRemove={handlePendingRemove}
                    multiple
                    disabled={loading || submitting || !!deletingId}
                    accept="image/*"
                >
                    {images.length + pendingFiles.length < MAX_IMAGES ? (
                        <div className="text-gray-500 transition-colors">
                            <PlusOutlined className="text-lg" />
                            <div className="mt-1 text-xs">Tallózás</div>
                        </div>
                    ) : null}
                </Upload>

                {pendingFiles.length > 0 && (
                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        loading={submitting}
                        onClick={handleUploadSubmit}
                        className="mt-4 shadow-sm"
                    >
                        {`${pendingFiles.length} új kép feltöltése`}
                    </Button>
                )}
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-bold text-gray-800">
                        Jelenlegi galéria
                    </p>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                        {images.length} / {MAX_IMAGES} kép
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Spin description="Képek betöltése..." />
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                        Még nincsenek képek a galériában.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((image) => (
                            <GalleryListItem
                                key={image.id}
                                image={image}
                                handleDelete={handleServerImageDelete}
                                submitting={submitting}
                                deletingId={deletingId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GalleryImagesUploader;
