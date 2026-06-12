import { Authorities } from "../helpers/types/Authorities";
import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../store/hooks";
import Loading from "./Loading";

type ProtectedRouteProps = {
    allowedRoles: Authorities[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user, loading } = useAppSelector(state => state.userStore);

    if (loading) return <Loading />;

    const hasRequiredRole = user?.authorities?.some(role => allowedRoles.includes(role));

    return hasRequiredRole ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoute