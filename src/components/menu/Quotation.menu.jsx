import React from 'react'
import IconCaretDown from '../Icon/IconCaretDown'
import { NavLink } from 'react-router-dom'
import { FaQuoteLeft } from 'react-icons/fa6'

const quotationSubMenu = [
    { name: 'Browse', path: '/quotation' },
    { name: 'Create', path: '/quotation/create' },
    { name: 'Receive Requisition', path: '/quotation/received-requisition' },
];

const Quotation = ({ location }) => {
    return (
        <li className="menu nav-item relative !ml-0" >
            <button type="button" className={`nav-link ${location.pathname.includes('/quotation') ? 'active' : ''} !cursor-default`}>
                <div className="flex items-center">
                    <FaQuoteLeft />
                    <span className="px-1">Quotation</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
            </button>
            <ul className="sub-menu">
                {quotationSubMenu.map((item) => (
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

export default Quotation