import { Select, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Offering } from '../../helpers/types/Offering'
import { usePagination } from '../../hooks/usePagination'
import AddAppointmentSteps from '../../components/MultistepForms/AddAppointment/AddAppointmentSteps'
import CustomPagination from '../../components/CustomPagination'
import { BusinessEmployee } from '../../helpers/types/BusinessEmployee'
import { AxiosResponse } from 'axios'
import Loading from '../../components/Loading'
import BusinessService from './BusinessService'
import API from '../../utils/API'

const BusinessServices = () => {
    const { businessId } = useParams();
    const [employees, setEmployees] = useState<BusinessEmployee[]>([]);
    const {
        data,
        totalItems,
        fetchNextPage,
        fetchPage,
        fetchPrevPage,
        currentPage,
        setRequestParams,
        loading
    } = usePagination<Offering[]>(
        `/api/offerings/public`,
        5
    );

    const [selectedOffer, setSelectedOffer] = useState<Offering>({} as Offering);
    const [addAppointmentModal, setAddAppointmentModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<string>("all");

    useEffect(() => {
        API.get(`/api/business-employee/public`)
            .then((res: AxiosResponse<BusinessEmployee[]>) => {
                setEmployees(res.data);
            })
    }, [businessId]);

    const handleAppointmentModal = (e: React.MouseEvent, offer: Offering) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(offer)
        setSelectedOffer(offer);
        setAddAppointmentModal(true);
    }

    const handleEmployeeFilter = (value: string) => {
        setSelectedEmployee(value);

        if (value === "all") {
            setRequestParams({});
        } else {
            const employee = employees.find(emp => emp.id.toString() === value);
            if (employee) {
                const fullName = `${employee.user.firstName} ${employee.user.lastName}`;
                setRequestParams({ search: fullName });
            }
        }
    }

    return (
        <>
            <AddAppointmentSteps
                offer={selectedOffer}
                open={addAppointmentModal}
                onClose={() => setAddAppointmentModal(false)}
                key={selectedOffer.id || 'new'}
                businessId={Number(businessId)}
            />
            <div>
                <div className="flex items-center justify-between mb-5">
                    <div className='flex flex-col'>
                        <label className="font-semibold text-xs"
                        >Alkalmazottak</label>
                        <Select
                            value={selectedEmployee}
                            onChange={handleEmployeeFilter}
                            className="w-48"
                        >
                            <Select.Option value="all">Összes szolgáltatás</Select.Option>
                            {employees.map((employee) => (
                                <Select.Option key={employee.id} value={employee.id.toString()}>
                                    {employee.user.firstName} {employee.user.lastName}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <p className="font-semibold text-base">
                        {totalItems} szolgáltatás
                    </p>
                </div>
                <Spin spinning={loading} indicator={<Loading size={30} />} className="w-full">

                    {data?.length === 0
                        ? (
                            <Typography className="w-full mt-4 text-center text-xl">Nincsenek szolgáltatások!</Typography>
                        ) : (
                            <>
                                {data?.map((offer, index) => (
                                    <BusinessService
                                        key={offer.id || index}
                                        offer={offer}
                                        handleReservationButton={handleAppointmentModal}
                                    />
                                ))}
                                <div className="flex justify-end">
                                    <CustomPagination
                                        currentPage={currentPage}
                                        fetchNextPage={fetchNextPage}
                                        fetchPage={fetchPage}
                                        fetchPrevPage={fetchPrevPage}
                                        totalItems={totalItems}
                                    />
                                </div>
                            </>
                        )}
                </Spin>
            </div>
        </>
    )
}

export default BusinessServices