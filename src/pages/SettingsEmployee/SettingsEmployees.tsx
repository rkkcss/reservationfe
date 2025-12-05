import { Button, Tabs } from "antd";
import { useState } from "react";
import NewEmployeeModal from "../../components/Modals/NewEmployeeModal";
import EmployeeList from "./EmployeeList";
import PendingEmployees from "./PendingEmployees";

const SettingsColleagues = () => {
    const [newEmployeeModal, setNewEmployeeModal] = useState(false);

    const tabs = [
        {
            key: 'employees',
            label: 'Alkalmazottak',
            children: <EmployeeList />
        },
        {
            key: 'permissions',
            label: 'Folyamatban lévő meghívók',
            children: <PendingEmployees />
        }
    ]


    return (
        <>
            {
                newEmployeeModal &&
                <NewEmployeeModal
                    onCancel={() => setNewEmployeeModal(false)}
                />
            }
            <div className="w-full h-full p-5">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-semibold mb-4">Alkalmazottak</h1>
                    <Button type="primary" onClick={() => setNewEmployeeModal(true)}>Új alkalmazott</Button>
                </div>
                <div>
                    <Tabs
                        items={tabs}
                    />

                </div>
            </div>
        </>
    )
}

export default SettingsColleagues