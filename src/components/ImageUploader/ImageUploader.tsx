import React, { useCallback, useState } from "react";
import { Upload, Button, message, Image } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import {
    FiUpload,
    FiTrash2,
    FiEye,
    FiEdit2,
    FiImage,
    FiSave,
} from "react-icons/fi";

const { Dragger } = Upload;

const ACCEPTED_TYPES = ["image/jpeg", "image/png"] as const;
type AcceptedType = (typeof ACCEPTED_TYPES)[number];

const DEFAULT_MAX_SIZE_MB = 5;

export interface ImageUploaderProps {
    /** A jelenlegi (már elmentett) kép URL-je (kontrollált mód, opcionális). */
    value?: string | null;
    /**
     * "Manuális" mód: meghívódik, amikor a felhasználó a belső "Mentés" gombra
     * kattint. Ha ezt megadod, megjelenik a Mentés/Mégse gomb a komponensben.
     */
    onSave?: (file: File) => void | Promise<void>;
    /**
     * "Azonnali" mód: meghívódik rögtön a fájl kiválasztásakor/törlésekor,
     * upload nélkül – nincs belső Mentés gomb, a tényleges feltöltést a
     * szülő komponens intézi (pl. egy közös "Kész" gombbal, több képpel együtt).
     * Ha ez meg van adva, elsőbbséget élvez az `onSave`-vel szemben.
     */
    onFileSelect?: (file: File | null, previewUrl: string | null) => void;
    /** Meghívódik törléskor (a már elmentett kép eltávolításakor). */
    onRemove?: () => void | Promise<void>;
    /** Kívülről vezérelt "mentés folyamatban" állapot (pl. mutation.isPending). */
    saving?: boolean;
    /** Max. fájlméret MB-ban. Alapértelmezett: 5. */
    maxSizeMB?: number;
    disabled?: boolean;
    /** Külső wrapper osztály felülírásához / bővítéséhez. */
    className?: string;
}

function isAcceptedType(type: string): type is AcceptedType {
    return (ACCEPTED_TYPES as readonly string[]).includes(type);
}

export default function ImageUploader({
    value = null,
    onSave,
    onFileSelect,
    onRemove,
    saving = false,
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
    disabled = false,
    className = "",
}: ImageUploaderProps): React.ReactElement {
    const isImmediateMode = Boolean(onFileSelect);

    // Az elmentett (szerveren lévő) kép URL-je
    const [savedUrl, setSavedUrl] = useState<string | null>(value);
    // Az újonnan kiválasztott, de MÉG NEM mentett fájl és annak preview URL-je
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(
        null,
    );
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

    const displayUrl = pendingPreviewUrl ?? savedUrl;
    const hasPendingChange = pendingFile !== null;

    const validateFile = useCallback(
        (file: RcFile): boolean => {
            if (!isAcceptedType(file.type)) {
                message.error("Csak JPG vagy PNG formátumú kép tölthető fel.");
                return false;
            }

            const isWithinSize = file.size / 1024 / 1024 < maxSizeMB;
            if (!isWithinSize) {
                message.error(
                    `A kép mérete nem lehet nagyobb, mint ${maxSizeMB} MB.`,
                );
                return false;
            }

            return true;
        },
        [maxSizeMB],
    );

    const handleBeforeUpload: UploadProps["beforeUpload"] = useCallback(
        (file: RcFile) => {
            if (!validateFile(file)) {
                return Upload.LIST_IGNORE;
            }

            if (pendingPreviewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(pendingPreviewUrl);
            }

            const objectUrl = URL.createObjectURL(file);
            setPendingFile(file);
            setPendingPreviewUrl(objectUrl);

            if (isImmediateMode) {
                // Azonnali mód: nincs belső Mentés gomb, rögtön visszaadjuk a fájlt
                onFileSelect?.(file, objectUrl);
                message.success("Kép kiválasztva.");
            } else {
                message.info(
                    "Kép kiválasztva. Kattints a Mentésre a feltöltéshez.",
                );
            }

            return false;
        },
        [pendingPreviewUrl, validateFile, isImmediateMode, onFileSelect],
    );

    const handleSave = useCallback(async () => {
        if (!pendingFile || !onSave) return;
        await onSave(pendingFile);
        setSavedUrl(pendingPreviewUrl);
        setPendingFile(null);
        setPendingPreviewUrl(null);
    }, [pendingFile, onSave, pendingPreviewUrl]);

    const handleCancelPending = useCallback(() => {
        if (pendingPreviewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(pendingPreviewUrl);
        }
        setPendingFile(null);
        setPendingPreviewUrl(null);

        if (isImmediateMode) {
            onFileSelect?.(null, null);
        }
    }, [pendingPreviewUrl, isImmediateMode, onFileSelect]);

    const handleRemove = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (pendingPreviewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(pendingPreviewUrl);
            }
            setPendingFile(null);
            setPendingPreviewUrl(null);
            setSavedUrl(null);

            if (isImmediateMode) {
                onFileSelect?.(null, null);
            }

            await onRemove?.();
            message.info("Kép törölve.");
        },
        [pendingPreviewUrl, isImmediateMode, onFileSelect, onRemove],
    );

    const uploadProps: UploadProps = {
        accept: ".jpg,.jpeg,.png",
        multiple: false,
        showUploadList: false,
        disabled: disabled || saving,
        beforeUpload: handleBeforeUpload,
    };

    if (displayUrl) {
        return (
            <div className={`w-full ${className}`}>
                <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img
                        src={displayUrl}
                        alt="Kép előnézet"
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                            type="button"
                            title="Nagyban megnézem"
                            onClick={() => setIsPreviewOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow hover:bg-gray-100 disabled:opacity-50"
                        >
                            <FiEye size={18} />
                        </button>

                        <Upload {...uploadProps}>
                            <button
                                type="button"
                                title="Kép módosítása"
                                disabled={disabled || saving}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow hover:bg-gray-100 disabled:opacity-50"
                            >
                                <FiEdit2 size={18} />
                            </button>
                        </Upload>

                        <button
                            type="button"
                            title="Kép törlése"
                            onClick={handleRemove}
                            disabled={disabled || saving}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow hover:bg-red-50 disabled:opacity-50"
                        >
                            <FiTrash2 size={18} />
                        </button>
                    </div>
                </div>

                <Image
                    className="hidden"
                    src={displayUrl}
                    preview={{
                        visible: isPreviewOpen,
                        onVisibleChange: (visible) => setIsPreviewOpen(visible),
                    }}
                />

                {!isImmediateMode && hasPendingChange && (
                    <div className="mt-3 flex items-center gap-2">
                        <Button
                            type="primary"
                            icon={<FiSave className="mr-1" />}
                            loading={saving}
                            disabled={disabled}
                            onClick={handleSave}
                        >
                            Mentés
                        </Button>
                        <Button
                            type="default"
                            disabled={disabled || saving}
                            onClick={handleCancelPending}
                        >
                            Mégse
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`w-full max-w-xl ${className}`}>
            <Dragger {...uploadProps}>
                <div className="flex flex-col items-center justify-center py-4 text-center">
                    <FiImage size={36} className="mb-3 text-blue-500" />
                    <p className="mb-1 font-medium text-gray-800">
                        Kattints ide, vagy húzd ide a képet
                    </p>
                    <p className="text-sm text-gray-500">
                        JPG vagy PNG formátum, max. {maxSizeMB} MB
                    </p>
                    <Button
                        type="default"
                        icon={<FiUpload className="mr-1" />}
                        disabled={disabled}
                        className="mt-4"
                    >
                        Kép kiválasztása
                    </Button>
                </div>
            </Dragger>

            {!isImmediateMode && hasPendingChange && (
                <div className="mt-3 flex items-center gap-2">
                    <Button
                        type="primary"
                        icon={<FiSave className="mr-1" />}
                        loading={saving}
                        disabled={disabled}
                        onClick={handleSave}
                    >
                        Mentés
                    </Button>
                    <Button
                        type="default"
                        disabled={disabled || saving}
                        onClick={handleCancelPending}
                    >
                        Mégse
                    </Button>
                </div>
            )}
        </div>
    );
}
