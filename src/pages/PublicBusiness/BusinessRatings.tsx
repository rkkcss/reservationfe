import { usePagination } from '../../hooks/usePagination';
import { Card, Divider, Rate, Typography } from 'antd';
import { BusinessRatingSummary } from '../../helpers/types/BusinessRating';
import placeholderImage from '../../assets/placeholder.jpg'



const BusinessRatings = () => {
    const { data } = usePagination<BusinessRatingSummary>(`/api/business-ratings/business`, 5);

    return (
        <div>
            {data?.ratings?.length === 0 ? (
                <Typography className="w-full mt-4 text-center text-xl">Nincsenek vélemények!</Typography>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {
                        data?.ratings?.map((rating) => (
                            <li key={rating.id}>
                                <Card styles={{ body: { padding: '6px 12px' } }} >
                                    <div className="flex justify-between items-center">
                                        <Typography>{rating.guest.name}</Typography>
                                        <img src={rating.imageUrl}
                                            onError={e => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = placeholderImage;
                                            }}
                                            className="w-7 h-7 rounded-full"
                                        />
                                    </div>
                                    <div className="mt-1 mb-3">
                                        <Rate disabled defaultValue={rating.number} />
                                    </div>
                                    <div>
                                        <Typography className="text-xs text-gray-500">{rating.description}</Typography>
                                    </div>
                                </Card>
                                <Divider />
                            </li>
                        ))
                    }

                </ul>
            )}
        </div>
    )
}

export default BusinessRatings