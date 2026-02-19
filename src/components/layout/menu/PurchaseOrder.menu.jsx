import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import IconCaretDown from '../../Icon/IconCaretDown'
import { MdOutlineReceiptLong } from 'react-icons/md'

const PurchaseOrder = ({ location }) => {
    const navigate = useNavigate();
    return (
        <li
            className="menu nav-item relative !ml-0"
            onClick={() => navigate("/purchase-order")}
        >
            <button type="button" className={`nav-link ${location.pathname.includes('/purchase-order') ? 'active' : ''}`}>
                <div className="flex items-center">
                    <MdOutlineReceiptLong />
                    <span className="px-1 whitespace-nowrap">Purchase Order</span>
                </div>
            </button>
        </li>
    )
}

export default PurchaseOrder