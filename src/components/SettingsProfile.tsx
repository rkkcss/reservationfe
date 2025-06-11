import { useSelector } from 'react-redux'
import { UserStore } from '../store/store'
import ChangeName from './ChangeName'
import ChangeLoginName from './ChangeLoginName';

const SettingsProfile = () => {
    const { user } = useSelector((state: UserStore) => state.userStore);

    return (
        <div className="w-full pl-5 mt-5">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Profil</h1>
            </div>
            <ChangeName firstName={user?.firstName} lastName={user?.lastName} />
            <ChangeLoginName login={user?.login} />
        </div>
    )
}

export default SettingsProfile