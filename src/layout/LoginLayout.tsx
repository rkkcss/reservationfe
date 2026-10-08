import { Outlet } from "react-router";
import NavBar from "../components/NavBar/NavBar";
import { useLoginModalRouteListener } from "../hooks/useLoginModalRouteListener";
import LeftNavbar from "../components/LeftNavbar/LeftNavbar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { CalendarProvider } from "../context/CalendarContext";
import { toggleLeftMenu } from "../redux/generalSlice";

const LoginLayout = () => {
    useLoginModalRouteListener();
    const { isLeftMenuCollapsed } = useAppSelector(
        (state) => state.generalStore,
    );
    const dispatch = useAppDispatch();

    return (
        <CalendarProvider>
            <div className="flex">
                <LeftNavbar />
                <div
                    className={`${!isLeftMenuCollapsed ? "md:ml-72" : "ml-16"} flex min-w-0 flex-1 flex-col`}
                >
                    <NavBar />
                    <div className="text-custom-gray container mx-auto min-h-[calc(100svh-(64px+81px))] min-w-0 px-6">
                        <div className="flex min-w-0 flex-col px-2 md:px-0">
                            <Outlet />
                            {!isLeftMenuCollapsed && (
                                <div
                                    className="md:hidden absolute inset-0 bg-white/30 backdrop-blur-md z-10"
                                    onClick={() => dispatch(toggleLeftMenu())}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CalendarProvider>
    );
};

export default LoginLayout;
