import ChangeName from './ChangeName'
import ChangeLoginName from './ChangeLoginName';
import { useAppSelector } from '../store/hooks';

const SettingsProfile = () => {
    const { user } = useAppSelector(state => state.userStore)

    return (
        <div className="w-full pl-5 mt-5">
            <h1 className="text-2xl font-bold mb-4">Profil</h1>
            <div className="bg-white rounded-lg shadow-md p-4">
                <ChangeName firstName={user?.firstName} lastName={user?.lastName} />
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 mt-6">
                <ChangeLoginName login={user?.login} />
            </div>
        </div>
    )
}

export default SettingsProfile