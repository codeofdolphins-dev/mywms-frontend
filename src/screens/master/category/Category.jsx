import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import IconSettings from '@/components/Icon/IconSettings';
import IconPencil from '@/components/Icon/IconPencil';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import AnimateHeight from 'react-animate-height';
import IconCode from '@/components/Icon/IconCode';
import IconCaretDown from '@/components/Icon/IconCaretDown';
import Tippy from '@tippyjs/react';
import Input from '@/components/inputs/Input';
import ButtonBoolean from '@/components/inputs/ButtonBoolean';
import { FaPlus } from "react-icons/fa6";
import AddModal from '@/components/Add.modal';
import CategoryForm from '@/components/category/CategoryForm';
import FullScreenLoader from '@/components/loader/FullScreenLoader';
import { utcToLocal } from '@/utils/UTCtoLocal';
import masterData from '@/Backend/master.backend';
import { confirmation } from '@/utils/alerts';
import ComponentHeader from '@/components/ComponentHeader';
import fetchData from '../../../Backend/fetchData.backend';
import StatusToggle from '@/components/StatusToggle';


const headerLink = [
    { title: "master", link: "/master" },
    { title: "category" },
]

const CostHead = () => {
    const [debounceSearch, setDebounceSearch] = useState('');
    const [isShow, setIsShow] = useState(false);

    const { data, isLoading } = fetchData.TQAllCategoryList({ noLimit: true });
    const { mutate: deleteData, isPending } = masterData.TQDeleteMaster(["category-all-list"]);


    const [active, setActive] = useState('1');
    const togglePara = (value) => {
        setActive((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const [editId, setEditId] = useState(null);

    useEffect(() => {
        if (!isShow) {
            setEditId(null);
        }
    }, [isShow])

    function handelEdit(id) {
        setEditId(id);
        setIsShow(true);
    }

    async function handelDelete(id) {
        // console.log(id);
        const isSuccess = await confirmation();
        if (isSuccess) {
            deleteData({ path: `/category/delete/${id}` });
        }
    }


    if (isLoading) return <FullScreenLoader />;

    return (
        <div>
            {/* Header Section */}
            <ComponentHeader
                headerLink={headerLink}
                primaryText='Categories'
                secondaryText='Manage and view all categories'
                btnOnClick={() => setIsShow(p => !p)}
                searchPlaceholder='Search by name...'
                btnTitle='Add Category'
                setDebounceSearch={setDebounceSearch}
            />

            {/* collapsable table */}
            {debounceSearch === '' ?
                (
                    <div className="panel mt-5" id="basic">
                        <div className="mb-5">
                            <div className="space-y-2 font-semibold">
                                {/* Table Header */}
                                <div
                                    className="bg-slate-200 rounded-t px-4 py-3 font-semibold text-sm"
                                    style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 2fr 1fr', alignItems: 'center', gap: '8px' }}
                                >
                                    <div>Name</div>
                                    <div>Desc</div>
                                    <div>Status</div>
                                    <div>CreatedAt</div>
                                    <div className="text-center">Action</div>
                                </div>

                                {/* Table Rows */}
                                {data?.map((item, i) => {
                                    const isSubCate = item.subcategories.length > 0;

                                    return <div key={i} className="border border-[#d3d3d3] rounded">
                                        <button
                                            type="button"
                                            className={`px-4 py-3 w-full flex items-center text-white-dark bg-[#f6f8fa83] ${(active === `${i + 1}` && isSubCate) ? '!text-primary' : ''} ${isSubCate ? "" : "cursor-default"}`}
                                            onClick={() => togglePara(`${i + 1}`)}
                                        >
                                            <div
                                                className="w-full"
                                                style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 2fr 1fr', alignItems: 'center', gap: '8px' }}
                                            >
                                                <div className="whitespace-nowrap text-left">{item.name}</div>
                                                <div className="text-left">{item.description}</div>
                                                <div className="text-left">
                                                    <StatusToggle
                                                        isActive={item.status}
                                                        id={item.id}
                                                        path="/category/update"
                                                        queryKey="category-all-list"
                                                        fieldName="status"
                                                    />
                                                </div>
                                                <div className="text-left">{utcToLocal(item.createdAt)}</div>
                                                <div className="text-center">
                                                    <ul className="flex items-center justify-center gap-2">
                                                        <li>
                                                            <Tippy content="Edit">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handelEdit(item.id)
                                                                    }}
                                                                    className='hover:scale-125'
                                                                >
                                                                    <IconPencil className="text-success" />
                                                                </button>
                                                            </Tippy>
                                                        </li>
                                                        <li>
                                                            <Tippy content="Delete">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handelDelete(item.id)
                                                                    }}
                                                                    className='hover:scale-125'
                                                                >
                                                                    <IconTrashLines className="text-danger" />
                                                                </button>
                                                            </Tippy>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            {isSubCate &&
                                                <div className={`ml-4 flex-shrink-0 transition-transform duration-300 ${active === `${i + 1}` ? 'rotate-180' : ''}`}>
                                                    <IconCaretDown />
                                                </div>
                                            }
                                        </button>
                                        {
                                            isSubCate
                                                ? <div>
                                                    <AnimateHeight duration={300} height={active === `${i + 1}` ? 'auto' : 0}>
                                                        <div className="py-2 text-white-dark text-[13px] border-t border-[#d3d3d3]">
                                                            {item?.subcategories?.map((data) => {
                                                                return (
                                                                    <div
                                                                        key={data.id}
                                                                        className="px-4 py-2 hover:bg-gray-50"
                                                                        style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 2fr 1fr', alignItems: 'center', gap: '8px', paddingLeft: '2rem' }}
                                                                    >
                                                                        <div className="whitespace-nowrap">{data.name}</div>
                                                                        <div>{data.description}</div>
                                                                        <div>
                                                                            <StatusToggle
                                                                                isActive={data.status}
                                                                                id={data.id}
                                                                                path="/category/update"
                                                                                queryKey="category-all-list"
                                                                                fieldName="status"
                                                                            />
                                                                        </div>
                                                                        <div>{utcToLocal(data.createdAt)}</div>
                                                                        <div className="text-center">
                                                                            <ul className="flex items-center justify-center gap-2">
                                                                                <li>
                                                                                    <Tippy content="Edit">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => handelEdit(data.id)}
                                                                                            className='hover:scale-125'
                                                                                        >
                                                                                            <IconPencil className="text-success" />
                                                                                        </button>
                                                                                    </Tippy>
                                                                                </li>
                                                                                <li>
                                                                                    <Tippy content="Delete">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => handelDelete(data.id)}
                                                                                            className='hover:scale-125'
                                                                                        >
                                                                                            <IconTrashLines className="text-danger" />
                                                                                        </button>
                                                                                    </Tippy>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </AnimateHeight>
                                                </div>
                                                : null
                                        }
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    < div className="panel">
                        <div className="table-responsive mb-5">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Date</th>
                                        <th>Sale</th>
                                        <th className="!text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((data) => {
                                        return (
                                            <tr key={data.id}>
                                                <td>
                                                    <div className="whitespace-nowrap">{data.name}</div>
                                                </td>
                                                <td>{data.date}</td>
                                                <td>{data.sale}</td>
                                                <td className="text-center">
                                                    <ul className="flex items-center justify-center gap-2">
                                                        <li>
                                                            <Tippy content="Edit">
                                                                <button type="button">
                                                                    <IconPencil className="text-success" />
                                                                </button>
                                                            </Tippy>
                                                        </li>
                                                        <li>
                                                            <Tippy content="Delete">
                                                                <button type="button">
                                                                    <IconTrashLines className="text-danger" />
                                                                </button>
                                                            </Tippy>
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }

            <AddModal
                isShow={isShow}
                setIsShow={setIsShow}
                title={"Add New Category"}
                maxWidth='60'
            >
                <CategoryForm
                    setIsShow={setIsShow}
                    data={data}
                    editId={editId}
                />
            </AddModal>

        </div >
    )
}

export default CostHead;