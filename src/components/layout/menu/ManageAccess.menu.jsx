import React from 'react'
import { MdAdminPanelSettings } from 'react-icons/md'
import { NavLink } from 'react-router-dom'
import IconCaretDown from '../../Icon/IconCaretDown'


const requisitionSubMenu = [
    { name: 'Role', path: '/access/role' },
    { name: 'Permission', path: '/access/permission' },
];


const ManageAccess = () => {
    return (
        <li className="menu nav-item relative !ml-0" >
            <button type="button" className={`nav-link ${location.pathname.includes("/access") ? 'active' : ''} !cursor-default`}>
                <div className="flex items-center">
                    <MdAdminPanelSettings />
                    <span className="px-1 whitespace-nowrap">Manage Access</span>
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

export default ManageAccess