import React from 'react'
import { BsBoxArrowUp } from 'react-icons/bs'
import IconCaretDown from '../../Icon/IconCaretDown'
import { NavLink } from 'react-router-dom'

const outwardSubMenu = [
    { name: 'Browse', path: '/outward' },
    { name: 'Create', path: '/outward/create' },
];

const Outward = () => {
    return (
        <li className="menu nav-item relative !ml-0" >
            <button type="button" className={`nav-link ${location.pathname.includes('/outward') ? 'active' : ''} `}>
                <div className="flex items-center">
                    <BsBoxArrowUp />
                    <span className="px-1">Outward</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
            </button>
            <ul className="sub-menu">
                {outwardSubMenu.map((item) => (
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

export default Outward