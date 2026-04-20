import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ComponentHeader from '../../../components/ComponentHeader'
import ItemTable from '../../../components/ItemTable'
import AddModal from '../../../components/Add.modal'
import BOMForm from '../../../components/bom/BOMForm'
import bomFetch from '../../../Backend/bom.fetch'
import masterData from '../../../Backend/master.backend'
import { confirmation, successAlert } from '../../../utils/alerts'
import AnimateHeight from 'react-animate-height'
import IconCaretDown from '../../../components/Icon/IconCaretDown'
import Loader from '../../../components/loader/Loader'
import { BsBoxSeam } from 'react-icons/bs'
import { utcToLocal } from '../../../utils/UTCtoLocal'


const headerLink = [
    { title: "master", link: "/master" },
    { title: "BOM" },
]

const BOM_COLUMN = [
    { key: "product", label: "Finished Product" },
    { key: "barcode", label: "Barcode" },
    { key: "sku", label: "SKU" },
    { key: "outputQty", label: "Output Qty" },
    { key: "uom", label: "UOM" },
    { key: "items", label: "Raw Items", align: "center" },
    { key: "status", label: "Status", align: "center" },
    { key: "date", label: "Created" },
]

const BOM_ITEM_COLUMN = [
    { key: "name", label: "Raw Material" },
    { key: "sku", label: "SKU" },
    { key: "qty", label: "Required Qty" },
    { key: "uom", label: "UOM" },
]


const BOM = () => {
    const navigate = useNavigate();

    const [isShow, setIsShow] = useState(false);
    const [debounceSearch, setDebounceSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    /** accordion state */
    const [active, setActive] = useState('');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const { mutateAsync: deleteData, isPending: deletePending } = masterData.TQDeleteMaster(["bomList"]);

    const params = {
        ...(debounceSearch && { barcode: debounceSearch }),
        page: currentPage,
        limit: limit,
    };
    const { data: bomList, isLoading } = bomFetch.TQBOMList(params);

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearch]);


    async function handleDelete(id) {
        try {
            const isConfirm = await confirmation();
            if (isConfirm) {
                const res = await deleteData({ path: `/bom/delete/${id}` });
                if (res?.success) successAlert();
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) return <Loader />

    return (
        <div>
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                searchPlaceholder='Search by barcode...'
                setDebounceSearch={setDebounceSearch}
                className={"mb-5 justify-between"}

                addButton={true}
                btnTitle='Create BOM'
                btnOnClick={() => setIsShow(true)}
            />

            {/* BOM Table with Expandable Rows */}
            <div className="panel">
                <div className="relative table-responsive mb-5 min-h-56">
                    {/* table header */}
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="px-3 py-2 w-[30px]"></th>
                                {BOM_COLUMN.map((col, i) => (
                                    <th
                                        key={i}
                                        className={`px-3 py-2 ${col.align === "center" ? "text-center" : ""}`}
                                    >
                                        <p className='font-bold text-gray-600 whitespace-nowrap'>{col.label}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    </table>

                    {/* data rows */}
                    {(!bomList?.data || bomList.data.length === 0) ? (
                        <div className="flex flex-col items-center justify-center gap-4 py-20">
                            <BsBoxSeam fontSize={40} color='grey' />
                            <p className='text-base text-gray-400 font-semibold'>No BOM Records Found</p>
                        </div>
                    ) : (
                        <div className="space-y-2 mt-2">
                            {bomList.data.map((bom, idx) => {
                                const fp = bom.finishedProduct;
                                const isOpen = active === `${bom.id}`;

                                return (
                                    <div key={bom.id} className="border border-[#d3d3d3] rounded overflow-hidden">
                                        {/* Main Row */}
                                        <button
                                            type="button"
                                            className={`px-2 py-2.5 w-full flex items-center text-sm transition-colors ${isOpen ? 'bg-blue-50 text-blue-600' : 'bg-white hover:bg-gray-50 text-gray-700'
                                                }`}
                                            onClick={() => togglePara(`${bom.id}`)}
                                        >
                                            {/* Expand icon */}
                                            <td className="px-3 w-[30px]">
                                                <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}>
                                                    <IconCaretDown className='w-5 h-5' />
                                                </div>
                                            </td>

                                            {/* product name */}
                                            <td className="px-3 text-left font-semibold flex-1 min-w-[150px]">
                                                {fp?.name || "—"}
                                            </td>

                                            {/* barcode */}
                                            <td className="px-3 text-left flex-1">
                                                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                                                    {fp?.barcode || bom.finished_product_barcode || "—"}
                                                </span>
                                            </td>

                                            {/* sku */}
                                            <td className="px-3 text-left font-mono text-xs flex-1">
                                                {fp?.sku || "—"}
                                            </td>

                                            {/* output qty */}
                                            <td className="px-3 text-left flex-1">
                                                <span className="font-bold">{bom.output_qty}</span>
                                            </td>

                                            {/* uom */}
                                            <td className="px-3 text-left flex-1">
                                                {bom.output_uom || "—"}
                                            </td>

                                            {/* items count */}
                                            <td className="px-3 text-center flex-1">
                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
                                                    {bom.bomItems?.length || 0}
                                                </span>
                                            </td>

                                            {/* status */}
                                            <td className="px-3 text-center flex-1">
                                                <span className={`badge ${bom.is_active ? 'bg-success' : 'bg-danger'}`}>
                                                    {bom.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>

                                            {/* date */}
                                            <td className="px-3 text-left flex-1 text-xs text-gray-500">
                                                {utcToLocal(bom.createdAt)}
                                            </td>
                                        </button>

                                        {/* Expanded Row - Raw Materials */}
                                        <AnimateHeight duration={300} height={isOpen ? 'auto' : 0}>
                                            <div className="border-t border-[#d3d3d3] bg-gray-50 p-4">
                                                {bom.desc && (
                                                    <p className="text-sm text-gray-500 mb-3 italic">
                                                        <span className="font-medium text-gray-600">Note:</span> {bom.desc}
                                                    </p>
                                                )}

                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-gray-200/50">
                                                            {BOM_ITEM_COLUMN.map((col, i) => (
                                                                <th key={i} className="px-3 py-1.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                                    {col.label}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bom.bomItems?.length > 0 ? (
                                                            bom.bomItems.map((item, itemIdx) => (
                                                                <tr key={item.id} className="border-b border-gray-100 last:border-0">
                                                                    <td className="px-3 py-2 text-sm font-medium">
                                                                        {item.rawProduct?.name || "—"}
                                                                    </td>
                                                                    <td className="px-3 py-2 text-sm font-mono text-xs">
                                                                        {item.rawProduct?.sku || "—"}
                                                                    </td>
                                                                    <td className="px-3 py-2 text-sm font-bold">
                                                                        {item.required_qty}
                                                                    </td>
                                                                    <td className="px-3 py-2 text-sm">
                                                                        {item.uom || item.rawProduct?.unit_type || "—"}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={4} className="px-3 py-4 text-center text-gray-400 text-sm">
                                                                    No raw materials added yet
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </AnimateHeight>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Create BOM Modal */}
            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title="Create Bill of Materials"
                maxWidth='80'
            >
                <BOMForm setIsShow={setIsShow} />
            </AddModal>
        </div >
    )
}

export default BOM
