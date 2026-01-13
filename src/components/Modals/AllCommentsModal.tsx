import { useState } from "react";
import { BusinessRating } from "../../helpers/types/BusinessRating";
import { useAppSelector } from "../../store/hooks";
import { Divider, Modal, Rate, Select, Spin } from "antd";
import dayjs from "dayjs";
import { usePagination } from "../../hooks/usePagination";
import CustomPagination from "../CustomPagination";
import Loading from "../Loading";
import { useParams } from "react-router";
import { getInitials } from "../../helpers/NameShorter";

type AllCommentsModalProps = {
    onClose: () => void;
}

const AllCommentsModal = ({ onClose }: AllCommentsModalProps) => {
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);
    const [params, setParams] = useState('createdDate,desc');
    const { data: comments,
        totalItems,
        currentPage,
        fetchNextPage,
        fetchPrevPage,
        fetchPage,
        loading
    } = usePagination<BusinessRating>("/api/business-ratings/business/" + selectedBusinessEmployee?.business.id, 5, params);


    const handleSorting = (value: string) => {
        setParams(value);
        fetchPage(0, value);
    }


    return (
        <Modal title="Összes Értékelés" open={true} footer={null} onCancel={onClose}>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-4xl font-black">4.9</span>
                        <Rate disabled defaultValue={4.9} allowHalf />
                    </div>
                    <Divider type="vertical" className="h-12" />
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold ">{totalItems}</span>
                        <span className="text-xs text-slate-500 font-medium">Összes vélemény</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center gap-2 mt-6">
                <div className="flex items-center gap-2">
                    <Select className="w-1/2" defaultValue={"createdDate,desc"} onChange={handleSorting}>
                        <Select.Option value="createdDate,desc">Legújabb előre</Select.Option>
                        <Select.Option value="createdDate,asc">Legrégebbi előre</Select.Option>
                    </Select>
                </div>
            </div>
            <Spin spinning={loading} indicator={<Loading size={30} />}>
                <div className="flex flex-col gap-4 mt-8 max-h-[50vh] overflow-y-auto">
                    {
                        comments.map(comment => (
                            <div key={comment.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {getInitials(comment.guest.name)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{comment.guest.name}</p>
                                            <p className="text-[10px] text-slate-500">{dayjs(comment.createdAt).fromNow()}</p>
                                        </div>
                                    </div>
                                    <Rate disabled defaultValue={comment.number} allowHalf />
                                </div>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed italic">
                                    "{comment.description}"
                                </p>
                            </div>
                        ))}
                </div>
            </Spin>
            <CustomPagination
                fetchNextPage={fetchNextPage}
                fetchPrevPage={fetchPrevPage}
                fetchPage={fetchPage}
                totalItems={totalItems}
                currentPage={currentPage}
                pageSize={5}
            />
        </Modal>
    )
}

export default AllCommentsModal