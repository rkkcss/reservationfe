import { useOutlet } from 'react-router'

const Settings = () => {
    const outlet = useOutlet();
    return (
        <div className="flex flex-1 min-h-[80svh] mb-2">
            {outlet || (
                <div className="flex flex-1 start mt-16 justify-center font-semibold text-base">
                    Nincs kiválasztva menüpont.
                </div>
            )}
        </div>
    )
}

export default Settings