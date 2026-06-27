import { Form, Typography } from 'antd';
import { useEffect } from 'react'
import { BiCheckCircle } from 'react-icons/bi';
import { Offering } from '../../helpers/types/Offering';
import { usePublicReservation } from '../../context/PublicAppointmentReservation';
import { usePagination } from '../../hooks/usePagination';


const PublicOfferingChooser = ({ value, onChange }: {
    value?: Offering | null;
    onChange?: (offer: Offering) => void
}) => {
    const { form } = usePublicReservation()
    const selectedEmployeeId: number | null = Form.useWatch('employeeId', form);
    const { data, setRequestParams } = usePagination<Offering[]>(
        selectedEmployeeId ? "/api/offerings/business-employee/public" : null, 5, "", { employeeId: selectedEmployeeId }, false
    )

    useEffect(() => {
        setRequestParams({ employeeId: selectedEmployeeId });
    }, [selectedEmployeeId]);

    if (data.length === 0) {
        return <Typography.Paragraph className="text-center mt-8">Nincs a szakembernek szolgáltatása.</Typography.Paragraph>
    }

    return (
        <>
            {data.map(offer => {
                const isSelected = value?.id === offer.id;
                return (
                    <div key={offer.id} onClick={() => onChange?.(offer)} className={`
                        mb-3 p-5 rounded-2xl border-2 flex justify-between items-center 
                        group cursor-pointer transition-all 
                        ${isSelected ? 'border-primary bg-primary/5' : 'border-primary/30 hover:border-primary/50'}`
                    }>
                        <div className="flex flex-col">
                            <span className={`font-bold text-lg ${isSelected && 'text-primary'}`}>{offer.title}</span>
                            <span className="text-sm text-gray-600">{offer.durationMinutes} perc • {offer.price} Ft</span>
                        </div>
                        {isSelected && <BiCheckCircle size={24} className="text-primary" />}
                    </div>
                )
            })}
        </>
    )
}

export default PublicOfferingChooser;