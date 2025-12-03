import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconXCircle from './Icon/IconXCircle';
import IconPencil from './Icon/IconPencil';
import IconTrashLines from './Icon/IconPencil';
import { IoListCircleOutline } from "react-icons/io5";

// import { useDispatch, useSelector } from 'react-redux';
// import { setPageTitle } from '../../store/themeConfigSlice';

const rowData = [
    {
        id: 1,
        title: "Prepare project brief",
        priority: "high",
        notes: "Outline goals and deliverables",
        status: "in-progress"
    },
    {
        id: 2,
        title: "Email client",
        priority: "medium",
        notes: "Request feedback on draft",
        status: "pending"
    },
    {
        id: 3,
        title: "Update website copy",
        priority: "low",
        notes: "Adjust homepage text",
        status: "completed"
    },
    {
        id: 4,
        title: "Team stand-up meeting",
        priority: "medium",
        notes: "Daily sync at 10 AM",
        status: "in-progress"
    },
    {
        id: 5,
        title: "Design wireframes",
        priority: "high",
        notes: "Mobile-first layout",
        status: "pending"
    },
    {
        id: 6,
        title: "Review budget",
        priority: "medium",
        notes: "Check Q2 forecast",
        status: "pending"
    },
    {
        id: 7,
        title: "Write documentation",
        priority: "low",
        notes: "Add API examples",
        status: "in-progress"
    },
    {
        id: 8,
        title: "Fix login bug",
        priority: "high",
        notes: "Affects multiple users",
        status: "in-progress"
    },
    {
        id: 9,
        title: "Plan marketing campaign",
        priority: "medium",
        notes: "Brainstorm social posts",
        status: "pending"
    }
];

const BrowseTable = () => {
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(setPageTitle('Multiple Tables'));
    // });

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'firstName'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [columnName, setColumnName] = useState([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState({
        columnAccessor: 'firstName',
        direction: 'asc',
    });

    console.log(recordsData);

    useEffect(() => {
        setColumnName(
            rowData.length > 0 ? Object.keys(rowData[0]) : []
        )
    }, [recordsData]);


    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return rowData.filter((item) => {
                return (
                    item.title.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortStatus]);

    const formatDate = (date) => {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return day + '/' + month + '/' + dt.getFullYear();
        }
        return '';
    };

    const randomColor = () => {
        const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
        const random = Math.floor(Math.random() * color.length);
        return color[random];
    };

    return (
        <div>
            <div className="panel">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Table 1</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            ...columnName
                            .filter(col => col !== "status")
                            .map(col => ({
                                accessor: col,
                                sortable: true
                            })),
                            {
                                accessor: 'status',
                                title: 'Status',
                                sortable: true,
                                render: (e) => <span className={`badge bg-${randomColor()} `}>{e.status}</span>,
                            },
                            {
                                accessor: 'action',
                                title: 'Action',
                                titleClassName: '!text-center',
                                render: () => (
                                    <div className="flex items-center w-max mx-auto">
                                        <Tippy content="Details">
                                            <button type="button">
                                                <IoListCircleOutline />
                                            </button>
                                        </Tippy>
                                    </div>
                                ),
                            },
                        ]}
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default BrowseTable;
