import React, { useEffect, useState } from 'react'
import { Employee } from '../helpers/types/Employee';
import { useParams } from 'react-router';
import { getEmployeesByBusinessId } from '../helpers/queries/employeeService';

const BusinessWorkers = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const { businessId } = useParams();


    useEffect(() => {
        getEmployeesByBusinessId(businessId).then((res) => {
            setEmployees(res.data)
        })
    }, [])

    return (
        <div>
            {
                employees.map((employee) => (
                    <div key={employee.id}>
                        <p>{employee.jobTitle}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default BusinessWorkers