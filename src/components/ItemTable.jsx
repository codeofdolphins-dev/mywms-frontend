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
    handleEdit, handleDelete,
    currentPage, setCurrentPage,
    totalPage, setLimit,
    isLoading = true
}) => {


    const getValue = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

    // if (isLoading) return <FullScreenLoader />;


    return (
        <div className="panel">
            {/* <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg">{title || "Data table"}</h5>
            </div> */}
            <div className="relative table-responsive mb-5 min-h-56">
                {
                    isLoading
                        ?
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
                                            className={`px-3 py-2 
                                ${i === 0 ? "rounded-l-lg" : ""}
                                ${i === columns.length - 1 ? "rounded-r-lg" : ""}
                                ${name.toLowerCase() === "actions" ? "!text-center" : ""} `}
                                        >
                                            <p className='font-bold text-gray-600'>{col.label}</p>
                                        </th>
                                    )}
                                    <th className="px-3 py-2 font-bold text-gray-600">Action</th>
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

                                                        return (
                                                            <td key={j}>
                                                                {col.render
                                                                    ? col.render(value, row)
                                                                    : value ?? "-"}
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="text-center">
                                                        <ul className="flex items-center justify-center gap-2">
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
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </>
                            }
                        </table>
                }
            </div>
            <BasicPagination
                totalPage={totalPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setLimit={setLimit}
            />
        </div>
    )
}

export default ItemTable;
