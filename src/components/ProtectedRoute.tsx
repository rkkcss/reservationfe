import { useSelector } from "react-redux"
import { UserStore } from "../store/store"
import { Authorities } from "../helpers/types/Authorities";
import { Outlet } from "react-router";

const ProtectedRoute = () => {
    const { user } = useSelector((state: UserStore) => state.userStore);
    return user?.authorities && user?.authorities?.includes(Authorities.ROLE_USER) ? <Outlet /> : null
}

export default ProtectedRoute