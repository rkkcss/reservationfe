import { Button, Rate, Spin } from "antd"
import { Suspense, useEffect, useState } from "react"
import { BusinessRating } from "../../helpers/types/BusinessRating"
import { getBusinessRatingsQuery } from "../../helpers/queries/business-rating-queries";
import { useAppSelector } from "../../store/hooks";
import dayjs from "dayjs";
import AllCommentsModal from "../Modals/AllCommentsModal";
import Loading from "../Loading";

const STATIC_PARAMS = {
    sort: 'createdDate,desc',
    size: 2
}

const LastComments = () => {
    const [comments, setComments] = useState<BusinessRating[]>([]);
    const [allCommentsModal, setAllCommentsModal] = useState(false);
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBusinessRatingsQuery(Number(selectedBusinessEmployee?.business.id), STATIC_PARAMS).then(response => {
            setComments(response.data);
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="relative h-full">
            {
                allCommentsModal &&
                <Suspense fallback={<Spin />}>
                    <AllCommentsModal onClose={() => setAllCommentsModal(false)} />
                </Suspense>
            }

            <Spin spinning={loading} indicator={<Loading size={30} />} wrapperClassName="h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-slate-900 text-lg font-bold">Legutóbbi Értékelések</h3>
                    <Button type="link" className="p-0" onClick={() => setAllCommentsModal(true)}>Összes</Button>
                </div>
                <div className="flex flex-1 flex-col gap-4">
                    {
                        comments.map(comment => (
                            <div key={comment.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">NA</div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{comment.guest.name}</p>
                                            <p className="text-[10px] text-slate-500">{dayjs(comment.createdAt).fromNow()}</p>
                                        </div>
                                    </div>
                                    <Rate disabled defaultValue={comment.number} allowHalf />
                                </div>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    "{comment.description}"
                                </p>
                            </div>
                        ))}
                </div>
            </Spin >
        </div >
    )
}

export default LastComments