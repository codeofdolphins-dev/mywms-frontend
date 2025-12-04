import Tippy from '@tippyjs/react';
import React from 'react'
import IconSettings from '../Icon/IconSettings';
import IconPencil from '../Icon/IconPencil';
import IconTrashLines from '../Icon/IconTrashLines';


const AddItemTable = ({
    items = [],
    setItems
}) => {


    const handleDelete = (id) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    return (
        <div>
            {/* checkboxes */}
            <div className="panel">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg">Requested Item List</h5>
                </div>
                <div className="table-responsive mb-5">
                    <table>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>GSTIN No.</th>
                                <th>Brand</th>
                                <th>Product</th>
                                <th>Pack Size</th>
                                <th>Req Qty.</th>
                                <th className="!text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items?.map((data) => {
                                return (
                                    <tr key={data.id}>
                                        <td>{data.id}</td>
                                        <td>{data.gstin}</td>
                                        <td>
                                            <div className="whitespace-nowrap">{data.brand}</div>
                                        </td>
                                        <td>
                                            <div className="whitespace-nowrap">{data.product}</div>
                                        </td>
                                        <td>{data.packSize}</td>
                                        <td>{data.reqQty}</td>
                                        <td className="text-center">
                                            <ul className="flex items-center justify-center gap-2">
                                                {/* <li>
                                                    <Tippy content="Edit">
                                                        <button type="button">
                                                            <IconPencil className="text-success" />
                                                        </button>
                                                    </Tippy>
                                                </li> */}
                                                <li>
                                                    <Tippy content="Delete">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(data.id)}
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
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AddItemTable
