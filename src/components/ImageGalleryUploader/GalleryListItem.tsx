import { Button, Image } from "antd";
import { GalleryImage } from "../../helpers/types/GalleryImage";
import { DeleteOutlined } from "@ant-design/icons";

type Props = {
    image: GalleryImage;
    handleDelete: (imageId: number) => Promise<void>;
    deletingId: number | null;
    submitting: boolean;
};

const GalleryListItem = ({
    image,
    handleDelete,
    deletingId,
    submitting,
}: Props) => {
    return (
        <>
            <div className="relative group  rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 ">
                <Image
                    width={"100%"}
                    height={160}
                    src={image.url}
                    alt="Kép"
                    style={{ objectFit: "cover" }}
                />

                <div className="absolute gap-4 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                    <Button
                        shape="circle"
                        danger
                        type="primary"
                        size="large"
                        className="pointer-events-auto scale-75 group-hover:scale-100 transition-transform duration-200 shadow-lg"
                        icon={<DeleteOutlined />}
                        loading={deletingId === image.id}
                        disabled={
                            submitting ||
                            (deletingId !== null && deletingId !== image.id)
                        }
                        onClick={() => handleDelete(image.id)}
                    />
                </div>
            </div>
        </>
    );
};

export default GalleryListItem;
