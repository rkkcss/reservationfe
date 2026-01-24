
import { useAppSelector } from '../store/hooks'
import { BusinessPermission } from '../helpers/types/BusinessPermission'

const useSelectedEmployee = () => {
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore)

    const hasPermission = (permission: BusinessPermission) => {
        return selectedBusinessEmployee?.permissions?.some(p => p === permission)
    }

    return {
        hasPermission
    }
}

export default useSelectedEmployee