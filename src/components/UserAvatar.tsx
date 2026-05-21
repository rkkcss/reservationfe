import { Avatar, AvatarProps } from 'antd'
import { useAppSelector } from '../store/hooks'

type Props = Omit<AvatarProps & React.HTMLAttributes<HTMLSpanElement>, 'src'>

export default function UserAvatar({ alt = "user avatar", ...props }: Props) {
    const { user } = useAppSelector(state => state.userStore);

    const fallbackUrl = user?.fullName
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`
        : `https://ui-avatars.com/api/?name=U&background=random`;

    return (
        <Avatar
            alt={alt}
            src={user?.imageUrl || fallbackUrl}
            {...props}
        />
    )
}