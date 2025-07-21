import { Button, Dropdown } from 'antd'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { MdTaskAlt } from 'react-icons/md'

const NotificationDropDown = () => {
    const notificationItems = [
        {
            key: '1',
            label: (
                <>
                    <div className="flex flex-col py-2">
                        <div className="flex gap-3">
                            <MdTaskAlt size={22} />
                            <p className="text-sm max-w-56">Andrea foglalt hozzád mit fogsz most csinálni vele? El tudod fogadni illetve el tudod utasitani</p>
                        </div>
                        <div className="flex justify-end">
                            <Button size="small" type="primary" className="mt-2">
                                Elfogad
                            </Button>
                        </div>
                    </div >
                </>
            )
        },
        {
            key: '2',
            label: (
                <>
                    <div className="flex flex-col py-2">
                        <div className="flex gap-3">
                            <MdTaskAlt size={22} />
                            <p className="text-sm max-w-56">Andrea foglalt hozzád mit fogsz most csinálni vele? El tudod fogadni illetve el tudod utasitani</p>
                        </div>
                        <div className="flex justify-end">
                            <Button size="small" type="primary" className="mt-2">
                                Elfogad
                            </Button>
                        </div>
                    </div >
                </>
            )
        }
    ]
    return (
        <>
            <Dropdown arrow menu={{ items: notificationItems }} trigger={['click']}>
                <IoMdNotificationsOutline size="1.5rem" />
            </Dropdown >
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex justify-center items-center">
                <span className="text-xs w-min h-min text-neutral-100">12</span>
            </div>
        </>
    )
}

export default NotificationDropDown