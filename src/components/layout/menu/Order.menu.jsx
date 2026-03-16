import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import IconCaretDown from '../../Icon/IconCaretDown'
import { MdOutlineReceiptLong } from 'react-icons/md'


const orderSubMenu = [
    { name: 'List', path: '/order' },
    { name: 'Blanket PO', path: '/order/bpo' },
    // { name: 'Create BPO', path: '/order/bpo/create' },
    { name: 'Indent/Release Order', path: '/order/' },
];

const Order = ({ location }) => {
    const navigate = useNavigate();
    return (
        <li className="menu nav-item relative !ml-0" >
            <button type="button" className={`nav-link ${location.pathname.includes("/order") ? 'active' : ''} !cursor-default`}>
                <div className="flex items-center">
                    <MdOutlineReceiptLong />
                    <span className="px-1 whitespace-nowrap">Orders</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
            </button>
            <ul className="sub-menu">
                {orderSubMenu.map((item) => (
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

export default Order;