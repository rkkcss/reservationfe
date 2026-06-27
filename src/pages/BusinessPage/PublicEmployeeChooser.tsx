import { useEffect, useState } from 'react'
import { BusinessEmployee } from '../../helpers/types/BusinessEmployee'
import { getPublicBusinessEmployees } from '../../helpers/queries/business-employee'

const PublicEmployeeChooser = ({ value, onChange }: {
    value?: number | null;
    onChange?: (employeeId: number) => void
}) => {
    const [employees, setEmployees] = useState<BusinessEmployee[]>([]);

    useEffect(() => {
        getPublicBusinessEmployees()
            .then(res => setEmployees(res.data))
    }, []);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-3 mt-4">
            {
                employees.map((employee) => {
                    const isSelected = value === employee.id;
                    return (
                        <div
                            onClick={() => onChange?.(employee.id)}
                            key={employee.id}
                            className={`flex flex-col items-center gap-2 cursor-pointer group transition-all ${isSelected ? "" : "opacity-50 hover:opacity-100"
                                }`}
                        >
                            <div className="relative">
                                <img
                                    alt={employee.user.fullName}
                                    className={`w-16 h-16 rounded-full object-cover border-2 p-0.5 transition-all ${isSelected
                                        ? "border-primary !w-16 !h-16"
                                        : "border-transparent group-hover:border-outline-variant"
                                        }`}
                                    src={employee.user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.user.fullName)}&background=random`}
                                />
                            </div>
                            <div className="text-center">
                                <p
                                    className={`text-[11px] font-bold leading-tight ${isSelected ? "text-primary" : "text-on-surface"
                                        }`}
                                >
                                    {employee.user.fullName}
                                </p>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    )
}

export default PublicEmployeeChooser