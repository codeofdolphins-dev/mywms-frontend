import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from '../../components/inputs/SearchInput';
import TableHeader from '../../components/table/TableHeader';
import { REQUISITION_CREATE_COLUMN_ACTION, REQUISITION_RECEIVE_COLUMN } from '../../utils/helper';
import TableRow from '../../components/table/TableRow';
import IconMenuNotes from '../../components/Icon/Menu/IconMenuNotes';
import CustomeButton from "../../components/inputs/Button";
import AddModal from '../../components/Add.modal';
import ComponentHeader from '../../components/ComponentHeader';
import TableBody from '../../components/table/TableBody';
import fetchData from '../../Backend/fetchData.backend';
import IconPencil from '../../components/Icon/IconPencil';
import QuotationForm from '../../components/quotation/QuotationForm';
import Input from '../../components/inputs/Input';
import { useForm } from 'react-hook-form';
import masterData from '../../Backend/master.backend';
import { successAlert } from '../../utils/alerts';


const headerLink = [
    { title: "quotation", link: "/quotation" },
    { title: "received-requisition" },
];

const ReceiveRequision = () => {
    const navigate = useNavigate();
    const { handleSubmit, register, watch, formState: { errors }, reset, setValue } = useForm();

    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [editId, setEditId] = useState(null);


    const [itemDetails, setItemDetails] = useState([]);
    const [editItem, setEditItem] = useState([]);
    const [quoteItem, setQuoteItem] = useState([]);


    const [isShowDetails, setIsShowDetails] = useState(false);
    const [isShowEditDetails, setIsShowEditDetails] = useState(false);

    const { data: receiveRequisitionList, isLoading: receiveRequisitionListLoading } = fetchData.TQReceiveRequisitionList();
    const { mutateAsync: create, isPending: createPending } = masterData.TQCreateMaster();

    const isEmpty = !receiveRequisitionList?.data || receiveRequisitionList?.data?.length < 1;


    function handelShowDetails(data) {
        const item = data?.items
        setItemDetails(item);
        setIsShowDetails(true);

        setValue("buyer", data.buyer.nodeDetails.name);
        setValue("reqNo", data.requisition_no);
        setValue("title", data.title);
        setValue("deadline", data.required_by_date);
        setValue("priority", data.priority);
    };

    function handleEdit(item) {
        setIsShowEditDetails(true);
        setEditItem(item);
    };

    function handelShow(id) {
        setEditId(id);
        setIsShowEditDetails(true);
    };


    /** reset all state as fresh */
    useEffect(() => {
        if (isShowDetails) return;

        setItemDetails([]);
        setEditItem([]);
        setQuoteItem([]);
    }, [isShowDetails])

    useEffect(() => {
        if (!isShowEditDetails) setEditId(null);
    }, [isShowEditDetails]);


    async function submit(data) {
        data.items = quoteItem;
        data.grandTotal = quoteItem.reduce((grandTotal, item) => grandTotal + Number(item.total), 0);
        console.log(data);

        try {
            const res = await create({ path: "/quotation/create", formData: data });
            if (res.success) successAlert(res?.message);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='Search by sender name...'
                setDebounceSearch={setDebounceSearch}
                addButton={false}
            />

            {/* table view */}
            <div className={`panel mt-5 z-0 ${isEmpty ? "min-h-64" : ""} relative`}>
                <div className="overflow-x-auto">
                    <TableHeader columns={REQUISITION_RECEIVE_COLUMN} />
                    <TableBody
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        limit={limit}
                        setLimit={setLimit}
                        totalPage={1}
                        isEmpty={isEmpty}
                    >
                        {receiveRequisitionList?.data?.map((item, idx) => (
                            <TableRow
                                key={idx}
                                columns={REQUISITION_RECEIVE_COLUMN}
                                row={{
                                    id: item?.requisition_no,
                                    title: item?.title,
                                    sender: item?.buyer?.nodeDetails?.name,
                                    priority: item?.priority,
                                    status: item?.status,
                                    itemsCount: item?.items?.length,
                                    action: (
                                        <div className='flex items-center justify-center'>
                                            <CustomeButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handelShowDetails(item);
                                                }}
                                                className={"self-center"}
                                            >
                                                <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                            </CustomeButton>
                                        </div>
                                    )
                                }}
                            />
                        ))}
                    </TableBody>
                </div>
            </div>

            {/* Item Details */}
            <AddModal
                isShow={isShowDetails}
                setIsShow={setIsShowDetails}
                title={"Item Details"}
            // maxWidth='95'
            >
                <div className="panel">
                    <form onSubmit={handleSubmit(submit)}>
                        <div className="grid grid-cols-3 space-x-4">

                            {/* form side */}
                            <div className="panel" id="forms_grid">
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 gap-3">
                                        <Input
                                            label="Buyer"
                                            labelPosition="inline"
                                            {...register("buyer")}
                                            disabled={true}
                                        />
                                        <Input
                                            label="Requisition No"
                                            labelPosition="inline"
                                            {...register("reqNo")}
                                            disabled={true}
                                        />
                                        <Input
                                            label="Title"
                                            labelPosition="inline"
                                            {...register("title")}
                                            disabled={true}
                                        />
                                        <Input
                                            label="Deadline"
                                            labelPosition="inline"
                                            type="date"
                                            {...register("deadline")}
                                            disabled={true}
                                        />
                                        <Input
                                            label="Priority"
                                            labelPosition="inline"
                                            {...register("priority")}
                                            disabled={true}
                                        />
                                        <Input
                                            label="Valide Till"
                                            labelPosition="inline"
                                            type="date"
                                            {...register("validTill")}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* table side */}
                            <div className="col-span-2 panel space-y-5">
                                <div className="overflow-x-auto">
                                    <TableHeader columns={REQUISITION_CREATE_COLUMN_ACTION} />
                                    {
                                        itemDetails?.map((item, idx) => (
                                            <TableRow
                                                key={item?.id}
                                                columns={REQUISITION_CREATE_COLUMN_ACTION}
                                                row={{
                                                    barcode: item?.product?.barcode,
                                                    product: item?.product?.name,
                                                    brand: item?.brand?.name,
                                                    category: item?.category?.name,
                                                    subCategory: item?.subCategory?.name,
                                                    packSize: `${item?.product?.measure} ${item?.product?.unit_type} ${item?.product?.package_type}`,
                                                    reqQty: item?.qty,
                                                    priceLimit: item?.priceLimit,
                                                    action: (
                                                        <div className='flex items-center justify-center space-x-3'>
                                                            <CustomeButton
                                                                onClick={() => handleEdit(item)}
                                                            >
                                                                <IconPencil className="text-danger hover:scale-110 cursor-pointer" />
                                                            </CustomeButton>

                                                            <CustomeButton
                                                                onClick={() => handelShow(item.id)}
                                                            >
                                                                <IconMenuNotes className="hover:scale-110 cursor-pointer" />
                                                            </CustomeButton>
                                                        </div>
                                                    )
                                                }}
                                            />
                                        ))
                                    }
                                </div>
                            </div>

                            {/* preview side */}
                            {/* <div className="panel" id="forms_grid">
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 gap-3">
                                        <Input
                                            label="Buyer"
                                            labelPosition="inline"
                                            {...register("buyer")}
                                            disabled={true}
                                        />
                                        <Input
                                            label="Requisition No"
                                            labelPosition="inline"
                                            {...register("reqNo")}
                                            disabled={true}
                                        />
                                        <Input
                                            label="Title"
                                            labelPosition="inline"
                                            {...register("title")}
                                            disabled={true}
                                        />
                                        <Input
                                            label="Deadline"
                                            labelPosition="inline"
                                            type="date"
                                            {...register("deadline")}
                                            disabled={true}
                                        />
                                        <Input
                                            label="Priority"
                                            labelPosition="inline"
                                            {...register("priority")}
                                            disabled={true}
                                        />
                                        <Input
                                            label="Valide Till"
                                            labelPosition="inline"
                                            type="date"
                                            {...register("validTill")}
                                        />
                                    </div>
                                </div>
                            </div> */}
                        </div>

                        <div className="">
                            <button
                                type='submit'
                                className='btn btn-info ml-auto mt-5'
                                disabled={quoteItem?.length < 1 ? true : false}
                            >
                                submit
                            </button>
                        </div>
                    </form>
                </div>
            </AddModal >

            {/* Edit Item */}
            < AddModal
                isShow={isShowEditDetails}
                setIsShow={setIsShowEditDetails}
                title={"Edit Item"}
                maxWidth='45'
            // blur={false}
            >
                <QuotationForm
                    editId={editId}
                    editItem={editItem}
                    setIsShowEditDetails={setIsShowEditDetails}
                    quoteItem={quoteItem}
                    setQuoteItem={setQuoteItem}
                />
            </AddModal >
        </div >
    )
}

export default ReceiveRequision