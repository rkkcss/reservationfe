import { Badge, Button, Card, Modal, Pagination, Tooltip } from "antd";
import { usePagination } from "../hooks/usePagination";
import { Employee } from "../helpers/types/Employee";
import defaultUserImg from "../assets/defaultUserImg.png"
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";
import { GoPlus } from "react-icons/go";
import AddEmployee from "./Modals/AddEmployee";

const SettingsEmployees = () => {
    const { data: employees, loading, totalItems, currentPage, fetchPage } = usePagination<Employee>("/api/employees/business");
    const [editUserModal, setEditUserModal] = useState(false)
    const [addEmployeeModal, setAddEmployeeModal] = useState(false);

    const userActions = [
        <Tooltip title="Szerkesztés">
            <div className="flex justify-center" onClick={() => setEditUserModal(true)}>
                <FiEdit3 size={20} />
            </div>
        </Tooltip>
        ,
        <Tooltip title="Törlés" >
            <div className="flex justify-center">
                <MdDeleteForever size={20} />
            </div>
        </Tooltip>
    ]

    return (
        <>
            {
                addEmployeeModal &&
                <AddEmployee open={addEmployeeModal} onCancel={() => setAddEmployeeModal(false)} />
            }

            <div className="w-full pl-5 mt-5">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold mb-4">Alkalmazottak</h1>
                    <Button type="primary" icon={<GoPlus />} onClick={() => setAddEmployeeModal(true)}>Új alkalmazott</Button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {
                        employees.map((employee) =>
                            <>
                                <Card loading={loading}
                                    cover={
                                        <div className="!flex justify-center w-full">
                                            <img src={defaultUserImg} className="max-w-40" />
                                        </div>
                                    }
                                    hoverable
                                    actions={userActions}
                                >
                                    <Card.Meta title={employee?.user?.firstName + " " + employee?.user?.lastName}
                                        description={
                                            <>
                                                <Badge count={employee.jobTitle}></Badge>
                                                <p className="mt-2 font-bold text-slate-500">E-mail</p>
                                                <p >{employee.email}</p>
                                                <p className="mt-2 font-bold text-slate-500">Telefonszám</p>
                                                <p className="">{employee.phoneNumber}</p>
                                            </>
                                        }
                                    >
                                    </Card.Meta>
                                </Card>
                            </>
                        )
                    }
                </div>

                <Pagination className="mt-5" current={currentPage + 1} total={totalItems} pageSize={20} onChange={(page) => fetchPage(page - 1)} />
            </div>
            <Modal open={editUserModal} onCancel={() => setEditUserModal(false)}>asd</Modal>
        </>
    );
};

export default SettingsEmployees;
