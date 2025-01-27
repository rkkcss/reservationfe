import { useSelector } from "react-redux"
import { UserStore } from "../store/store"
import { Authorities } from "../helpers/types/Authorities";
import { Navigate, Outlet } from "react-router";

type ProtectedRouteProps = {
    allowedRoles: Authorities[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user } = useSelector((state: UserStore) => state.userStore);

    const hasRequiredRole = user?.authorities?.some(role => allowedRoles.includes(role));

    // Redirect to home page if user is not authenticated
    return hasRequiredRole ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute