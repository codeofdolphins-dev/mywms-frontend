import React from 'react'
import { BsBoxArrowInDown } from 'react-icons/bs'
import IconCaretDown from '../../Icon/IconCaretDown'
import { NavLink } from 'react-router-dom'

const inwardSubMenu = [
    { name: 'Browse', path: '/inward' },
    { name: 'Create', path: '/inward/create' },
];

const Inward = ({ location }) => {
    return (
        <li className="menu nav-item relative !ml-0" >
            <button type="button" className={`nav-link ${location.pathname.includes('/inward') ? 'active' : ''} `}>
                <div className="flex items-center">
                    <BsBoxArrowInDown />
                    <span className="px-1">Inward</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
            </button>
            <ul className="sub-menu">
                {inwardSubMenu.map((item) => (
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

export default Inward