import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserStore } from '../store/store';
import { BusinessEmployeeRole } from '../helpers/types/BusinessEmployeeRole';
import { BusinessPermission } from '../helpers/types/BusinessPermission';

type ProtectedEmployeeRolesProps = {
    roles?: BusinessEmployeeRole[],
    permissions?: BusinessPermission[]
}

const ProtectedEmployeeRoles = ({
    roles = [],
    permissions = []
}: ProtectedEmployeeRolesProps) => {

    const { selectedBusinessEmployee } = useSelector((state: UserStore) => state.userStore);

    if (!selectedBusinessEmployee) return <Navigate to="/choose-business" />;

    const employeeRole = selectedBusinessEmployee.role;
    const employeePermissions = selectedBusinessEmployee.permissions;

    // ---- ROLE CHECK ----
    if (roles.length > 0) {
        const hasRequiredRole = roles.includes(employeeRole);

        if (!hasRequiredRole) {
            return <Navigate to="/not-found" />;
        }
    }

    // ---- PERMISSION CHECK ----
    if (permissions.length > 0) {
        const hasRequiredPermission = permissions.some(p =>
            employeePermissions.includes(p)
        );

        if (!hasRequiredPermission) {
            return <Navigate to="/not-found" />;
        }
    }

    // Ha minden OK → mehet tovább
    return <Outlet />;
}

export default ProtectedEmployeeRoles;
