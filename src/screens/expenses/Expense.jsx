import React, { useEffect, useState } from 'react'
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import masterData from '@/Backend/master.backend';
import { confirmation, successAlert } from '@/utils/alerts';
import CustomeButton from "@/components/inputs/Button";
import Loader from '@/components/loader/Loader';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import TableRow from '../../components/table/TableRow';
import AddModal from '../../components/Add.modal';
import { EXPENSE_COLUMN } from './helper';
import costFetch from '../../Backend/cost.fetch';
import ExpenseForm from '../../components/expense/ExpenseForm';
import { currencyFormatter } from '../../utils/currencyFormatter';
import { utcToLocal } from '../../utils/UTCtoLocal';
import BasicFilterSelect from '../../components/inputs/BasicFilterSelect';


const HEADER_LINK = [
    { title: "expense" },
]

const FILTER_OPTIONS = [
    { label: "Cost Type: All", value: "all" },
    { label: "Cost Type: Onetime", value: "onetime" },
    { label: "Cost Type: Monthly", value: "monthly" },
    { label: "Cost Type: Yearly", value: "yearly" }
]

const Expense = () => {
    const { mutateAsync: deleteData, isLoading: deleteLoading } = masterData.TQDeleteMaster(["costCenterList"]);

    const [debounceSearch, setDebounceSearch] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [editId, setEditId] = useState(null);
    const [type, setType] = useState(null);

    const params = {
        ...(debounceSearch && { search: debounceSearch }),
        ...(type && { type }),
        page: currentPage || null,
        limit: limit || null
    };
    const { data, isLoading, isError } = costFetch.TQCostCenterList(params);
    const isEmpty = data?.data?.length === 0 || isError;

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearch]);

    useEffect(() => {
        if (!isShow) setEditId(null);
    }, [isShow]);


    function handleEdit(id) {
        setEditId(id);
        setIsShow(true);
    };

    async function handleDelete(id) {
        try {
            const isSuccess = await confirmation();
            if (!isSuccess) return;

            const res = await deleteData({ path: `/cost-center/delete/${id}` });
            if (res.success) successAlert(res.message);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            {/* Header Section */}
            <div className="flex items-center gap-5">
                <ComponentHeader
                    headerLink={HEADER_LINK}
                    searchPlaceholder='Search by cost no, cost head or subhead...'
                    setDebounceSearch={setDebounceSearch}
                    btnTitle='Expense'
                    btnOnClick={() => setIsShow(p => !p)}
                />

                <div className="">
                    <BasicFilterSelect
                        value={type}
                        onChange={(e) => setType(e.target.value === "all" ? null : e.target.value)}
                        options={FILTER_OPTIONS}
                    />
                </div>
            </div>

            {/* display table */}
            <div className={`panel mt-5 min-h-64 relative`}>
                {
                    isLoading ? (
                        <div className="absolute inset-0 z-20 bg-white/70 flex items-center justify-center">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <TableBody
                                columns={EXPENSE_COLUMN}
                                isEmpty={isEmpty}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                limit={limit}
                                setLimit={setLimit}
                                totalPage={data?.pagination?.totalPages}
                            >
                                {data?.data?.map((item, idx) => (
                                    <TableRow
                                        key={idx}
                                        columns={EXPENSE_COLUMN}
                                        row={{
                                            no: item?.cost_no || "—",
                                            head: item?.costHead?.name,
                                            shead: item?.costSubHead?.name || "—",
                                            type: item?.type ? (item.type.charAt(0).toUpperCase() + item.type.slice(1)) : "—",
                                            date: utcToLocal(item?.cost_date),
                                            amount: currencyFormatter(item?.amount),
                                            remarks: item?.remarks || "—",
                                            creator: item?.costCreator?.name?.full_name?.toUpperCase() || "—",
                                            action: (
                                                <div className="flex space-x-3">
                                                    <CustomeButton onClick={() => handleEdit(item.id)}>
                                                        <IconPencil className="text-success hover:scale-110 cursor-pointer" />
                                                    </CustomeButton>

                                                    <CustomeButton onClick={() => handleDelete(item.id)}>
                                                        <IconTrashLines className="text-danger hover:scale-110 cursor-pointer" />
                                                    </CustomeButton>
                                                </div>
                                            ),
                                        }}
                                    />
                                ))}
                            </TableBody>
                        </>
                    )
                }
            </div>


            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title={editId ? "Edit Expense" : "Add New Expense"}
                maxWidth='55'
            >
                <ExpenseForm
                    setIsShow={setIsShow}
                    editId={editId}
                />
            </AddModal>

        </div >
    )
}

export default Expense;