import { useEffect, useState } from "react"
import { Guest } from "../../helpers/types/Guest"
import { usePagination } from "../../hooks/usePagination"
import { Button, Table, TablePaginationConfig } from "antd"
import { MdEditNote } from "react-icons/md"
import { IoCheckmarkCircle, IoCloseCircleSharp } from "react-icons/io5"
import CustomPagination from "../CustomPagination"
import { FilterValue, SorterResult } from "antd/es/table/interface"
import { createQuest, patchGuest } from "../../helpers/queries/guest-queries"
import AddOrEditGuestModal from "../Modals/AddOrEditGuestModal"
import { useAppSelector } from "../../store/hooks"
import SettingsGuestsHeader from "./SettingsGuestsHeader"
import { BUSINESS_PERMISSIONS } from "../../helpers/types/BusinessPermission"
import useSelectedEmployee from "../../hooks/useSelectedEmployee"


const SettingsGuests = () => {
    const [guests, setGuests] = useState<Guest[] | null>([])
    const [editGuestModal, setEditGuestModal] = useState(false);
    const [editGuest, setEditGuest] = useState<Guest>({} as Guest);
    const { selectedBusinessEmployee } = useAppSelector(state => state.userStore);
    const { data, fetchNextPage, fetchPrevPage, totalItems, fetchPage, currentPage, setSort, setRequestParams } = usePagination<Guest[]>(
        `/api/guests/business/${selectedBusinessEmployee?.business.id}`,
        10,
        "",
        { employeeSearchParam: "all" }
    );
    const { hasPermission } = useSelectedEmployee();

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
        if (!guest.id) {
            createQuest(Number(selectedBusinessEmployee?.business.id), guest).then(res => {
                if (res.status !== 201) {
                    console.error("Failed to create guest");
                    return;
                }
                setGuests(prev => {
                    if (!prev) return [guest];
                    return [...prev, res.data];
                })
            })
        } else {
            patchGuest(guest).then(res => {
                if (res.status === 200) {
                    const updatedFromBackend = res.data;

                    setGuests(prev => {
                        if (!prev) return [updatedFromBackend];
                        return prev.map(g => g.id === updatedFromBackend.id ? updatedFromBackend : g);
                    });
                }
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
            title: (<span className="font-semibold">Név</span>),
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
            title: (<span className="font-semibold">Státusz</span>),
            dataIndex: 'canBook',
            key: 'canBook',
            render: (text: boolean) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${text ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {text ? <><IoCheckmarkCircle size={17} className="text-green-600" />Engedélyezett</> : <><IoCloseCircleSharp size={17} className="text-red-600" /> Tiltott</>}
                </span>
            ),
            sorter: true
        },
        ...(hasPermission(BUSINESS_PERMISSIONS.VIEW_ALL_GUESTS) ? [{
            title: (<span className="font-semibold">Kihez tartozik a vendég</span>),
            dataIndex: ['businessEmployee', 'user', 'fullName'],
            key: 'businessEmployee',
        }] : []),
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
        },
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

                    <Button type="primary" onClick={() => handleOpenGuestEditModal({} as Guest)}>
                        Vendég hozzáadása
                    </Button>
                </div>

                <div className="flex justify-between items-center my-4">
                    {
                        hasPermission(BUSINESS_PERMISSIONS.VIEW_ALL_GUESTS) &&
                        <SettingsGuestsHeader setQueryParams={setRequestParams} />
                    }
                    <p className="text-base ml-auto mr-0">
                        <span className="font-semibold">{totalItems || 0}</span> találat összesen
                    </p>
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
                    currentPage={currentPage}
                    fetchPage={fetchPage}
                />
            </div>
        </>
    )
}

export default SettingsGuests