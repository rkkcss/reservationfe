import { Modal, Upload } from "antd";
import { useState, useEffect } from "react";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons"; // AntD ikonok a hoverhez
import { notificationManager } from "../utils/notificationConfig";
import { patchAccountProfileImage } from "../helpers/queries/account-queries";
import { User } from "../helpers/types/User";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setImageUrl as setUserImageUrl } from "../redux/userSlice";

const ProfileImageSection = () => {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const { user } = useAppSelector((state) => state.userStore);
    const dispatch = useAppDispatch();

    const onSuccess = (res: User) => {
        dispatch(setUserImageUrl(res));
    };

    useEffect(() => {
        if (user?.imageUrl) {
            setImageUrl(user?.imageUrl);
        }
    }, [user?.imageUrl]);

    const handleAutoUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);

        try {
            const res = await patchAccountProfileImage(formData);

            if (res.status === 200) {
                notificationManager.success("image-upload", {
                    title: "Kép sikeresen frissítve!",
                });

                onSuccess(res.data);

                if (res.data?.imageUrl) {
                    setImageUrl(res.data.imageUrl);
                }
            }
        } catch (error) {
            console.error(error);
            notificationManager.error("image-upload-fail", {
                title: "Hiba történt a feltöltés során.",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <p className="text-xl font-semibold mb-6">Profilkép változtatás</p>
            <div className="flex flex-col items-center justify-center">
                <Upload
                    className="[&_.ant-upload-select]:!w-[160px] [&_.ant-upload-select]:!h-[160px] !m-0"
                    listType="picture-circle"
                    showUploadList={false}
                    disabled={uploading}
                    customRequest={() => {}}
                    beforeUpload={(file) => {
                        const isLt10M = file.size / 1024 / 1024 < 10;
                        if (!isLt10M) {
                            notificationManager.error("image-size-error", {
                                title: "A kép mérete nem haladhatja meg a 10 MB-ot!",
                            });
                            return Upload.LIST_IGNORE;
                        }

                        handleAutoUpload(file);
                        return false;
                    }}
                >
                    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-full bg-gray-50 border border-dashed border-gray-300">
                        {uploading ? (
                            <div className="text-sm font-medium text-blue-500 animate-pulse">
                                Feltöltés...
                            </div>
                        ) : imageUrl ? (
                            <div className="group relative w-full h-full">
                                <img
                                    src={imageUrl}
                                    alt="Profil"
                                    className="w-full h-full object-cover rounded-full"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full text-white">
                                    <button
                                        type="button"
                                        title="Nagyítás"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreviewOpen(true);
                                        }}
                                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors flex items-center justify-center"
                                    >
                                        <EyeOutlined className="text-lg" />
                                    </button>
                                    <div
                                        title="Kép módosítása"
                                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                                    >
                                        <UploadOutlined className="text-lg" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm font-medium p-2 text-center text-gray-500 flex flex-col items-center gap-1">
                                <UploadOutlined className="text-base" />
                                <span>Kép kiválasztása</span>
                            </div>
                        )}
                    </div>
                </Upload>

                <div className="mt-2 text-xs text-gray-400 font-normal text-center">
                    Megengedett maximális méret:{" "}
                    <span className="font-semibold text-gray-500">10 MB</span>
                </div>

                <Modal
                    open={previewOpen}
                    title="Kép előnézet"
                    footer={null}
                    onCancel={() => setPreviewOpen(false)}
                >
                    <img alt="előnézet" className="w-full" src={imageUrl} />
                </Modal>
            </div>
        </>
    );
};

export default ProfileImageSection;
