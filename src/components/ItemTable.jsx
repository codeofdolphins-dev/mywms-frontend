import Tippy from '@tippyjs/react';
import React, { useEffect, useState } from 'react'
import IconSettings from './Icon/IconSettings';
import IconPencil from './Icon/IconPencil';
import IconTrashLines from './Icon/IconTrashLines';
import { BsBoxSeam } from "react-icons/bs";
import BasicPagination from './BasicPagination';
import Loader from './loader/Loader';


const ItemTable = ({
    items = [],
    columns = [],
    edit = false,
    deleteBtn = true,
    handleEdit, handleDelete,
    currentPage, setCurrentPage,
    totalPage, setLimit,
    isLoading = true
}) => {
    const imageUrl = import.meta.env.VITE_IMAGE_URL;
    const getValue = (obj, path) => path?.split('.')?.reduce((acc, key) => acc?.[key], obj);
    return (
        <div className="panel mt-5">
            <div className="relative table-responsive mb-5 min-h-56">
                {isLoading ?
                    <div className="absolute inset-0 z-20 bg-white/70 flex items-center justify-center">
                        <Loader />
                    </div>
                    :
                    <table>
                        <thead>
                            <tr>
                                {columns?.map((col, i) =>
                                    <th
                                        key={i}
                                        className={`px-3 py-2 ${i === 0 ? "rounded-l-lg" : ""} ${i === columns.length - 1 ? "rounded-r-lg" : ""} ${name.toLowerCase() === "actions" ? "!text-center" : ""} `}
                                    >
                                        <p className='font-bold text-gray-600'>{col.label}</p>
                                    </th>
                                )}
                                {
                                    (edit || deleteBtn) && <th className="px-3 py-2 font-bold text-gray-600">Action</th>
                                }
                            </tr>
                        </thead>

                        {
                            items.length === 0 ? <>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 flex flex-col items-center justify-center gap-4">
                                    <BsBoxSeam fontSize={40} color='grey' />
                                    <p className='text-base text-gray-400 font-semibold'>No Records Found</p>
                                </div>
                            </> : <>
                                <tbody>
                                    {items?.map((row, i) => {
                                        return (
                                            <tr key={i}>
                                                {columns.map((col, j) => {
                                                    const value = col.key === "id" ? i + 1 : getValue(row, col.key);
                                                    // const value = getValue(row, col.key);

                                                    return (
                                                        <td key={j}>
                                                            {col.render ? (
                                                                col.render(value, row)

                                                            ) : col.type === "image" ? (
                                                                value ? (
                                                                    <img
                                                                        src={`${imageUrl}/${value}`}
                                                                        alt="img"
                                                                        className="h-16 w-16 object-contain"
                                                                    />
                                                                ) : "-"

                                                            ) : col.type === "array" && Array.isArray(value) ? (
                                                                value.length > 0 ? (
                                                                    <Tippy
                                                                        interactive
                                                                        placement="right"
                                                                        content={
                                                                            <div className="max-w-xs p-3">
                                                                                {renderTwoLevelArray(value, col.arrayRender)}
                                                                            </div>
                                                                        }
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            className="text-primary font-semibold underline"
                                                                        >
                                                                            View ({value.length})
                                                                        </button>
                                                                    </Tippy>
                                                                ) : "-"

                                                            ) : (
                                                                value ?? "-"
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                                {
                                                    (edit || deleteBtn) &&
                                                    <td className="text-center">
                                                        <ul className="flex items-center gap-2">
                                                            {edit &&
                                                                <li>
                                                                    <Tippy content="Edit">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleEdit(row?.id)}
                                                                        >
                                                                            <IconPencil className="text-success" />
                                                                        </button>
                                                                    </Tippy>
                                                                </li>
                                                            }
                                                            <li>
                                                                <Tippy content="Delete">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDelete(row?.id)}
                                                                    >
                                                                        <IconTrashLines className="text-danger" />
                                                                    </button>
                                                                </Tippy>
                                                            </li>
                                                        </ul>
                                                    </td>
                                                }
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </>
                        }
                    </table>
                }
            </div>

            {items.length !== 0 &&
                <BasicPagination
                    totalPage={totalPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setLimit={setLimit}
                />
            }
        </div>
    )
}

export default ItemTable;

const renderTwoLevelArray = (items, renderItem) => {
    return (
        <div className="space-y-2">
            {items.map((item, idx) => (
                <div key={idx}>
                    {/* Parent category */}
                    <p className="font-semibold">
                        {renderItem(item)}
                    </p>

                    {/* Sub categories */}
                    {Array.isArray(item.subcategories) && item.subcategories.length > 0 && (
                        <ul className="ml-4 mt-1 list-disc text-sm">
                            {item.subcategories.map((sub, subIdx) => (
                                <li key={subIdx}>
                                    {renderItem(sub)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};
