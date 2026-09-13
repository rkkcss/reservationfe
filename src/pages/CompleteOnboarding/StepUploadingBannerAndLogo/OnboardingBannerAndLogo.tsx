import { useState } from "react";
import ImageUploader from "../../../components/ImageUploader/ImageUploader";
import { Button } from "antd";
import { BsArrowRight } from "react-icons/bs";
import { uploadOnboardingImagesQuery } from "../../../helpers/queries/onboarding-queries";
import { useNavigate } from "react-router";

type Props = {
    onSkip: () => void;
};

const OnboardingBannerAndLogo = ({ onSkip }: Props) => {
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(
        null,
    );
    const navigate = useNavigate();

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);

    const handleBannerSelect = (
        file: File | null,
        previewUrl: string | null,
    ) => {
        setBannerFile(file);
        setBannerPreviewUrl(previewUrl);
    };

    const handleLogoSelect = (file: File | null, previewUrl: string | null) => {
        setLogoFile(file);
        setLogoPreviewUrl(previewUrl);
    };

    const handleFinish = async () => {
        setIsSaving(true);

        try {
            const formData = new FormData();
            if (bannerFile) formData.append("bannerImage", bannerFile);
            if (logoFile) formData.append("logoImage", logoFile);

            await uploadOnboardingImagesQuery(formData).then((res) => {
                if (res.status === 200) {
                    navigate("/dashboard");
                }
            });

            // TODO: navigálás a következő onboarding lépésre
        } catch (err) {
            console.error(err);
            // itt jelezhetsz hibát, pl. message.error(...)
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <p className="text-2xl font-semibold mt-8 mb-4">Borítókép</p>
            <ImageUploader
                value={bannerPreviewUrl}
                onFileSelect={handleBannerSelect}
                disabled={isSaving}
            />

            <p className="text-2xl font-semibold mt-5 mb-4">Logo</p>
            <ImageUploader
                value={logoPreviewUrl}
                onFileSelect={handleLogoSelect}
                disabled={isSaving}
            />

            <div className="mt-6 flex justify-end items-center gap-4">
                <Button
                    type="text"
                    className="text-sm"
                    disabled={isSaving}
                    onClick={onSkip}
                >
                    Kihagyás
                    <BsArrowRight />
                </Button>
                <Button
                    type="primary"
                    loading={isSaving}
                    onClick={handleFinish}
                >
                    Készen vagyok!
                </Button>
            </div>
        </div>
    );
};

export default OnboardingBannerAndLogo;
