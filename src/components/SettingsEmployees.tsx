import React, { useEffect } from "react";
import { Button, Card, Modal, Pagination } from "antd";
import { usePagination } from "../hooks/usePagination";
import { CiSquareMore } from "react-icons/ci";
import { Employee } from "../helpers/types/Employee";

const SettingsEmployees = () => {
    const { data: employees, fetchNextPage, loading, totalItems, fetchPrevPage, hasNextPage, hasPrevPage, currentPage } = usePagination<Employee>("/api/employees");

    return (
        <>
            <div className="w-full pl-5">
                <h1 className="text-2xl font-bold mb-4">Alkalmazottak</h1>
                <div className="grid grid-cols-3 gap-4">
                    {
                        employees.map((employee) =>
                            <>
                                <Card loading={loading} hoverable extra={
                                    <div className="">
                                        <Button icon={<CiSquareMore size={20} />} type="text">

                                        </Button>
                                    </div>}>

                                    <Card.Meta title={employee?.user?.firstName + " " + employee?.user?.lastName}
                                        description={
                                            <>
                                                {employee.jobTitle}
                                            </>
                                        }
                                    >

                                    </Card.Meta>
                                </Card>
                            </>
                        )
                    }
                </div>
                {
                    hasPrevPage
                    &&
                    <Button onClick={fetchPrevPage} disabled={!hasPrevPage || loading}>Előző</Button>
                }
                {
                    hasNextPage &&
                    <Button onClick={fetchNextPage} disabled={!hasNextPage || loading}>Tovább</Button>
                }
                <Pagination current={currentPage + 1} total={totalItems} onChange={(page) => console.log(page)} />
            </div>
            <Modal open={false}>asd</Modal>
        </>
    );
};

export default SettingsEmployees;
