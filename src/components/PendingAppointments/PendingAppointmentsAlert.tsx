import { Alert, Button, Spin } from "antd"
import { useDispatch, useSelector } from "react-redux";
import { GeneralStore } from "../../store/store";
import { closeCalendarAlert, openCalendarAlert } from "../../redux/generalSlice";
import { useEffect } from "react";

type PendingAppointmentsAlertProps = {
    loading: boolean;
    dataLength: number;
    onViewClick: () => void;
}

const PendingAppointmentsAlert = ({ loading, dataLength, onViewClick }: PendingAppointmentsAlertProps) => {
    const dispatch = useDispatch();
    const { isCalendarAlertOpen } = useSelector((state: GeneralStore) => state.generalStore);

    useEffect(() => {
        if (dataLength > 0) {
            dispatch(openCalendarAlert());
        }

    }, [dataLength, isCalendarAlertOpen, dispatch]);

    if (!isCalendarAlertOpen && dataLength === 0) return;

    return (
        <Spin spinning={loading}>
            <Alert
                type={dataLength > 0 ? "warning" : "info"}
                message={
                    <div className="flex justify-between items-center">
                        {dataLength > 0 ?
                            <p>
                                <strong className="mr-1">{dataLength}</strong>
                                függőben lévő időpontod van.
                            </p>
                            :
                            <p>Nincsenek függőben lévő időpontjaid.</p>
                        }

                        {
                            dataLength > 0 &&
                            <Button
                                type="primary"
                                className="mr-0 ml-auto"
                                onClick={onViewClick}
                            >
                                Megtekintés
                            </Button>
                        }
                    </div>}
                showIcon
                closable={dataLength === 0}
                onClose={() => dispatch(closeCalendarAlert())}
            />
        </Spin>
    )
}

export default PendingAppointmentsAlert