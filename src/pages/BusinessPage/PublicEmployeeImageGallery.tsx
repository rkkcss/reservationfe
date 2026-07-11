import { Image, Spin } from "antd";
import { GalleryImage } from "../../helpers/types/GalleryImage";
import { usePagination } from "../../hooks/usePagination";
import CustomPagination from "../../components/CustomPagination";
import Loading from "../../components/Loading";

type Props = {
    employeeId: number | null;
};

const ITEMS_PER_PAGE = 4;

const PublicEmployeeImageGallery = ({ employeeId }: Props) => {
    const {
        data: images,
        currentPage,
        fetchNextPage,
        fetchPrevPage,
        totalItems,
        fetchPage,
        loading,
    } = usePagination<GalleryImage[]>(
        employeeId ? `/api/gallery-image/business-employee/${employeeId}` : "",
        ITEMS_PER_PAGE,
        "",
        {},
        false,
    );

    return (
        <Spin spinning={loading} indicator={<Loading />}>
            {images.length > 0 && (
                <>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2">
                        Referencia munkák
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
                        {images.map((img) => (
                            <Image
                                src={img.url}
                                classNames={{
                                    image: "object-cover",
                                }}
                                height={"160px"}
                                className=""
                                alt={"img" + img.id}
                                preview={{
                                    toolbarRender: () => null,
                                }}
                            />
                        ))}
                    </div>
                    <CustomPagination
                        currentPage={currentPage}
                        fetchNextPage={fetchNextPage}
                        fetchPage={fetchPage}
                        fetchPrevPage={fetchPrevPage}
                        totalItems={totalItems}
                        pageSize={ITEMS_PER_PAGE}
                    />
                </>
            )}
        </Spin>
    );
};

export default PublicEmployeeImageGallery;
