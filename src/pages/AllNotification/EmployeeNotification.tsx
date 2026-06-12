// components/EmployeeNotification.tsx
import { FiUserPlus } from "react-icons/fi";
import { EmployeeNotificationData } from "../../helpers/types/Notification";

export const EmployeeNotification = ({ data }: { data: EmployeeNotificationData }) => (
    <div className="flex items-start gap-3">
        <div className="text-xl mt-1 text-purple-600 bg-purple-200 p-2 rounded-full"><FiUserPlus size={24} /></div>
        <div>
            <h4 className="font-semibold text-sm">Új munkatárs</h4>
            <p className="text-xs text-gray-600">{data.employeeName} csatlakozott a csapathoz</p>
        </div>
    </div>
);