import { Alert, Modal, Switch } from 'antd'
import { useBusinessEmployee } from '../../context/BusinessEmployeeContext'
import { BASIC_ENTITY_STATUSES } from '../../helpers/types/BasicEntityStatus';
import { useState } from 'react';

const EmployeeStatus = () => {
    const { businessEmployee } = useBusinessEmployee();
    const [isChecked, setIsChecked] = useState(businessEmployee?.status === BASIC_ENTITY_STATUSES.ACTIVE);

    const handleStatusChange = () => {
        Modal.confirm({
            content: "Biztosan meg szeretne változtatni az alkalmazott akkalmazott állapotot?",
            onOk: () => {
                setIsChecked(!isChecked);
            }
        });
    }

    return (
        <>
            <Alert showIcon type="info" message="Késöbb bármikor vissza tudod állítani az alkalmazott állapotot." className="mb-4 mt-3" />
            <div className="flex flex-col">
                <label>Alkalmazott állapota:</label>
                <Switch
                    checkedChildren="Aktív"
                    unCheckedChildren="Inaktív"
                    checked={isChecked}
                    className="w-fit"
                    onClick={() => handleStatusChange()}
                />
            </div>
        </>
    )
}

export default EmployeeStatus
