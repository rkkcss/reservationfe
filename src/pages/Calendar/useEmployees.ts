import { useEffect, useState } from "react";
import { BusinessEmployee } from "../../helpers/types/BusinessEmployee";
import { getEmployeesByBusinessId } from "../../helpers/queries/business-employee";

export function useEmployees() {
    const [employees, setEmployees] = useState<BusinessEmployee[]>([]);

    useEffect(() => {
        getEmployeesByBusinessId().then((res) => setEmployees(res.data));
    }, []);

    return employees;
}