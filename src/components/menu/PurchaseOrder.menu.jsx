import React from 'react'
import { NavLink } from 'react-router-dom'
import IconCaretDown from '../Icon/IconCaretDown'
import { MdOutlineReceiptLong } from 'react-icons/md'


const pOrderSubMenu = [
    { name: 'Browse', path: '/purchase-order' },
    { name: 'Create', path: '/purchase-order/create' },
];

const PurchaseOrder = ({ location }) => {
    return (
        <li className="menu nav-item relative !ml-0" >
            <button type="button" className={`nav-link ${location.pathname.includes('/purchase-order') ? 'active' : ''} !cursor-default`}>
                <div className="flex items-center">
                    <MdOutlineReceiptLong />
                    <span className="px-1 whitespace-nowrap">Purchase Order</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
            </button>
            <ul className="sub-menu">
                {pOrderSubMenu.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            end={item.path}
                            className={({ isActive }) => isActive ? "active" : ""}
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </li>
    )
}

export default PurchaseOrder