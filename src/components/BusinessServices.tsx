import { Button, Collapse, Select, Spin, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Offering } from '../helpers/types/Offering'
import { CiClock2 } from 'react-icons/ci'
import { usePagination } from '../hooks/usePagination'
import AddAppointmentSteps from './MultistepForms/AddAppointment/AddAppointmentSteps'
import CustomPagination from './CustomPagination'
import API from '../utils/API'
import { BusinessEmployee } from '../helpers/types/BusinessEmployee'
import { AxiosResponse } from 'axios'
import Loading from './Loading'

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
        itemsPerPage,
        setRequestParams,
        loading
    } = usePagination<Offering>(
        `/api/offerings/public/business/${businessId}`,
        5
    );

    const [selectedOffer, setSelectedOffer] = useState<Offering>({} as Offering);
    const [addAppointmentModal, setAddAppointmentModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<string>("all");

    useEffect(() => {
        API.get(`/api/business-employee/public/business/${businessId}`)
            .then((res: AxiosResponse<BusinessEmployee[]>) => {
                setEmployees(res.data);
            })
    }, [businessId]);

    const handleAppointmentModal = (e: React.MouseEvent, offer: Offering) => {
        e.preventDefault();
        e.stopPropagation();
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
            <div className="">
                <div className="flex items-center justify-between mb-5">
                    <div className='flex flex-col'>
                        <label className="font-semibold text-xs">Szűrés alkalmazottra:</label>
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
                    <p className="text-gray-700 font-semibold text-base">
                        {totalItems} szolgáltatás
                    </p>
                </div>
                <Spin spinning={loading} indicator={<Loading size={30} />} className="w-full">

                    {data?.length === 0
                        ? (
                            <div className="w-full mt-4 text-center text-xl">Nincsenek szolgáltatások!</div>
                        ) : (
                            <>
                                {data?.map((offer, index) => (
                                    <Collapse
                                        key={offer.id || index}
                                        bordered={true}
                                        className={`mb-5`}
                                    >
                                        <Collapse.Panel
                                            key={offer.id || index}
                                            header={offer.title}
                                            extra={
                                                <div className="flex items-center gap-5">
                                                    <Tooltip
                                                        title="Szolgáltatás időtartama"
                                                        className="flex items-center gap-2 h-full"
                                                    >
                                                        <CiClock2 strokeWidth={1} size={16} />
                                                        <span>{offer.durationMinutes} perc</span>
                                                    </Tooltip>
                                                    <div className="text-slate-600 font-bold flex items-baseline">
                                                        {offer.price?.toFixed(0)} Ft
                                                    </div>
                                                    <Button
                                                        type="primary"
                                                        onClick={(e) => handleAppointmentModal(e, offer)}
                                                    >
                                                        Foglalás
                                                    </Button>
                                                </div>
                                            }
                                        >
                                            <p className="text-xs">{offer.description}</p>
                                        </Collapse.Panel>
                                    </Collapse>
                                ))}
                                <div className="flex justify-end">
                                    <CustomPagination
                                        currentPage={currentPage}
                                        fetchNextPage={fetchNextPage}
                                        fetchPage={fetchPage}
                                        fetchPrevPage={fetchPrevPage}
                                        totalItems={totalItems}
                                        pageSize={itemsPerPage}
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