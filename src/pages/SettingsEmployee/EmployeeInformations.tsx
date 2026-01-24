import { useBusinessEmployee } from '../../context/BusinessEmployeeContext';

const EmployeeInformations = () => {
    const { businessEmployee } = useBusinessEmployee();
    return (
        <>
            <p className="text-2xl font-semibold mb-6">Személyes adatok</p>
            <div className="bg-white p-5 rounded-xl">
                <div className="flex justify-between">
                    <div className="flex-1">
                        <p className="text-slate-500 text-sm">Teljes név:</p>
                        <p className="text-base font-semibold">{businessEmployee?.user?.firstName} {businessEmployee?.user?.lastName}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-slate-500 text-sm">Email:</p>
                        <p className="text-base font-semibold">{businessEmployee?.user?.email}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-slate-500 text-sm">Telefonszám:</p>
                        <p className="text-base font-semibold">+36307564233</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmployeeInformations