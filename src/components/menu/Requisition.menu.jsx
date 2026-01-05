import React from 'react'
import { FaClipboardList } from 'react-icons/fa6'
import IconCaretDown from '../Icon/IconCaretDown'
import { NavLink } from 'react-router-dom'

const requisitionSubMenu = [
    { name: 'Browse', path: '/requisition' },
    { name: 'Create', path: '/requisition/create' },
];

const Requisition = ({ location }) => {
    return (
        <li className="menu nav-item relative !ml-0" >
            <button type="button" className={`nav-link ${location.pathname.includes("/requisition") ? 'active' : ''} !cursor-default`}>
                <div className="flex items-center">
                    <FaClipboardList />
                    <span className="px-1">Requisition</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
            </button>
            <ul className="sub-menu">
                {requisitionSubMenu.map((item) => (
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

export default Requisition