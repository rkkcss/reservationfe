import { Authorities } from "../helpers/types/Authorities";
import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../store/hooks";

type ProtectedRouteProps = {
    allowedRoles: Authorities[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user } = useAppSelector(state => state.userStore);

    const hasRequiredRole = user?.authorities?.some(role => allowedRoles.includes(role));

    // Redirect to home page if user is not authenticated
    return hasRequiredRole ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute