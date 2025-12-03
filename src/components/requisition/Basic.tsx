import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import IconXCircle from '../Icon/IconXCircle';
// import { useDispatch } from 'react-redux';
// import { setPageTitle } from '../../store/themeConfigSlice';
// import IconBell from '../../components/Icon/IconBell';

type BasicProps = {
    selectedRecords?: [];
    setSelectedRecords?:any ;
};

const Basic: React.FC<BasicProps> = ({
    selectedRecords,
    setSelectedRecords
}) => {
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     dispatch(setPageTitle('Basic Table'));
    // });
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    let initialRecords = selectedRecords?.slice(0, pageSize);

    useEffect(() => {
        initialRecords = selectedRecords?.slice(0, pageSize);
    }, [selectedRecords]);

    const [recordsData, setRecordsData] = useState(initialRecords);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData(selectedRecords?.slice(from, to));
    }, [page, pageSize, selectedRecords]);

    const removeItem = (id: number): void => {
        setSelectedRecords((prev: any[]) => prev.filter((item: any) => item.id !== id));
    }

    return (
        <div>
            <div className="panel">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">Basic</h5>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No records"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            { accessor: 'id', sortable: true },
                            { accessor: 'module', sortable: true },
                            { accessor: 'levelCode', sortable: true },
                            {
                                accessor: 'action',
                                title: 'Action',
                                titleClassName: '!text-center',
                                render: (e: any) => (
                                    <div className="flex items-start w-max mx-auto">
                                        <Tippy content="Delete">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(e.id)}
                                            >
                                                <IconXCircle />
                                            </button>
                                        </Tippy>
                                    </div>
                                ),
                            },
                        ]}
                        totalRecords={selectedRecords?.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `${from} to ${to} of ${totalRecords}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default Basic;
