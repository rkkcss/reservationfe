import { useParams } from 'react-router'
import { usePagination } from '../hooks/usePagination';
import { Card, Rate } from 'antd';
import { BusinessRating } from '../helpers/types/BusinessRating';
import placeholderImage from '../assets/placeholder.jpg'

const BusinessRatings = () => {
    const { businessId } = useParams<{ businessId: string }>();
    const { data } = usePagination<BusinessRating>(`/api/business-ratings/business/${businessId}`, 5);

    return (
        <div>
            {data?.length === 0 ? (
                <div className="w-full mt-4 text-center text-xl">Nincsenek vélemények!</div>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {
                        data?.map((rating) => (
                            <li>
                                <Card styles={{ body: { padding: '6px 12px' } }} >
                                    <div className="flex justify-between items-center">
                                        <p>{rating.guest.name}</p>
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
                                        <p className="text-xs text-gray-500">{rating.description}</p>
                                    </div>
                                </Card>
                            </li>
                        ))
                    }

                </ul>
            )}
        </div>
    )
}

export default BusinessRatings