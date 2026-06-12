// components/SystemNotification.tsx
import { FiLock, FiBell } from "react-icons/fi";

export const SystemNotification = ({ type }: { type: string }) => {
    const isPassword = type === 'password.changed';
    return (
        <div className="flex items-start gap-3">
            <div className="text-xl mt-1 text-gray-500 bg-gray-200 p-2 rounded-full">
                {isPassword ? <FiLock size={24} /> : <FiBell size={24} />}
            </div>
            <div>
                <h4 className="font-semibold text-sm">Rendszerértesítés</h4>
                <p className="text-xs text-gray-600">
                    {isPassword ? 'A jelszavad megváltozott' : 'Új értesítés'}
                </p>
            </div>
        </div>
    );
};