import Tippy from '@tippyjs/react';
import React, { useEffect, useState } from 'react'
import IconSettings from './Icon/IconSettings';
import IconPencil from './Icon/IconPencil';
import IconTrashLines from './Icon/IconTrashLines';
import { BsBoxSeam } from "react-icons/bs";
import BasicPagination from './BasicPagination';


const ItemTable = ({
    title = "",
    items = [],
    setItems,
    colName = [],
    upperCase = false,
    edit = false,
}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);


    const handleDelete = (id) => {
        setItems(prevItems => prevItems?.filter(item => item?.[Object.keys(item)[0]] !== id));
    };

    const handleEdit = (id) => { };

    return (
        <div className="panel">
            {/* <div className="flex items-center justify-between mb-5">
                <h5 className="font-semibold text-lg">{title || "Data table"}</h5>
            </div> */}
            <div className="relative table-responsive mb-5 min-h-56">
                <table>
                    <thead>
                        <tr>{colName.map((name, i) =>
                            <th
                                key={i}
                                className={`px-3 py-2 
                                        ${i === 0 ? "rounded-l-lg" : ""}
                                        ${i === colName.length - 1 ? "rounded-r-lg" : ""}
                                        ${name.toLowerCase() === "actions" ? "!text-center" : ""} `}
                            >
                                <p className='font-bold text-gray-600'>{upperCase ? name.toUpperCase() : name}</p>
                            </th>
                        )}
                            {/* <th className="">Action</th> */}
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
                                            {
                                                Object.keys(row).map((item, i) =>
                                                    <td key={i}>{row[item]}</td>
                                                )
                                            }
                                            <td className="text-center">
                                                <ul className="flex items-center justify-center gap-2">
                                                    {edit &&
                                                        <li>
                                                            <Tippy content="Edit">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEdit(row?.[Object.keys(row)[0]])}
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
                                                                onClick={() => handleDelete(row?.[Object.keys(row)[0]])}
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
            </div>
            <BasicPagination
                totalPage={5}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setLimit={setLimit}
            />
        </div>
    )
}

export default ItemTable;
