import { useEffect, useState } from "react"
import { Guest } from "../helpers/types/Guest"
import { usePagination } from "../hooks/usePagination"
import { Button, message, Table, TablePaginationConfig } from "antd"
import { MdEditNote } from "react-icons/md"
import { IoCheckmarkCircle, IoCloseCircleSharp } from "react-icons/io5"
import CustomPagination from "./CustomPagination"
import { FilterValue, SorterResult } from "antd/es/table/interface"
import { createQuest, patchGuest } from "../helpers/queries/guestService"
import AddOrEditGuestModal from "./Modals/AddOrEditGuestModal"


const SettingsGuests = () => {
    const [guests, setGuests] = useState<Guest[] | null>([])
    const { data, fetchNextPage, fetchPrevPage, totalItems, fetchPage, currentPage, setSort } = usePagination<Guest>(`/api/guests`);
    const [editGuestModal, setEditGuestModal] = useState(false);
    const [editGuest, setEditGuest] = useState<Guest>({} as Guest);

    useEffect(() => {
        if (data) {
            setGuests(data);
        }
    }, [data])

    const handleOpenGuestEditModal = (guest: Guest) => {
        setEditGuestModal(true);
        setEditGuest(guest)
    }

    const handleGuestsChange = (guest: Guest) => {
        if (guest.id === null) {
            createQuest(guest).then(res => {
                if (res.status !== 201) {
                    console.error("Failed to create guest");
                    return;
                }
                setGuests(prev => {
                    if (!prev) return [guest];
                    return [...prev, res.data];
                })
                message.success("Vendég sikeresen hozzáadva!");
            })
        } else {
            patchGuest(guest).then(res => {
                if (res.status !== 200) {
                    console.error("Failed to update guest");
                    return;
                }
                setGuests(prev => {
                    if (!prev) return [guest];
                    const existingGuestIndex = prev.findIndex(g => g.id === guest.id);
                    if (existingGuestIndex > -1) {
                        const updatedGuests = [...prev];
                        updatedGuests[existingGuestIndex] = guest;
                        return updatedGuests;
                    }
                    return [...prev, guest];
                })
                message.success("Vendég sikeresen frissítve!");
            })
        }

    }

    const handleTableChange = (
        _pagination: TablePaginationConfig,
        _filters: Record<string, FilterValue | null>,
        sorter: SorterResult<Guest> | SorterResult<Guest>[]
    ) => {
        const sortObj = Array.isArray(sorter) ? sorter[0] : sorter;
        if (sortObj.field && sortObj.order) {
            // ascend | descend
            const direction = sortObj.order === "ascend" ? "asc" : "desc";
            const newSort = `${sortObj.field},${direction}`;
            setSort(newSort);
        }
    };

    const columns = [
        {
            title: 'Név',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Telefonszám',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Státusz',
            dataIndex: 'canBook',
            key: 'canBook',
            render: (text: boolean) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${text ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {text ? <><IoCheckmarkCircle size={17} className="text-green-600" />Engedélyezett</> : <><IoCloseCircleSharp size={17} className="text-red-600" /> Tiltott</>}
                </span>
            ),
            sorter: true
        },
        {
            title: 'Műveletek',
            key: 'actions',
            render: (_: string, record: Guest) => (
                <span>
                    <Button type="primary"
                        icon={<MdEditNote />}
                        shape="circle"
                        onClick={() => handleOpenGuestEditModal(record)}
                    />
                </span>
            ),
        }
    ]

    return (
        <>
            <AddOrEditGuestModal
                onClose={() => setEditGuestModal(false)}
                open={editGuestModal}
                guest={editGuest}
                key={editGuest.id || "new"}
                onOk={handleGuestsChange}
            />
            <div className="w-full h-full p-5">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">
                        Vendégek kezelése
                    </h1>
                    <Button type="primary" onClick={() => handleOpenGuestEditModal({ id: undefined, name: '', email: '', phoneNumber: '', canBook: true })}>
                        Vendég hozzáadása
                    </Button>
                </div>
                <Table
                    dataSource={guests || []}
                    rowKey="id"
                    columns={columns}
                    pagination={false}
                    onChange={handleTableChange}
                />
                <CustomPagination
                    fetchNextPage={fetchNextPage}
                    fetchPrevPage={fetchPrevPage}
                    totalItems={totalItems || 0}
                    currentPage={currentPage} // Assuming 0-based index for current page
                    fetchPage={fetchPage}
                />
            </div>
        </>
    )
}

export default SettingsGuests