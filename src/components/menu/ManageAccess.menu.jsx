import React from 'react'
import { MdAdminPanelSettings } from 'react-icons/md'
import IconCaretDown from '../Icon/IconCaretDown'
import { NavLink } from 'react-router-dom'

const ManageAccess = () => {
    return (
        <li className="menu nav-item relative !ml-0" >
            <button type="button" className={`nav-link ${location.pathname.includes('/access') ? 'active' : ''} !cursor-default`}>
                <div className="flex items-center">
                    <MdAdminPanelSettings
                        size={120}
                    />
                    <span className="px-1 whitespace-nowrap">Manage Access</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
            </button>
            {/* role */}
            <ul className="sub-menu">
                <li className="relative">
                    <button type="button" className={`nav-link ${location.pathname.includes('/access/role') ? 'active' : ''} !cursor-default`}>
                        <span className="px-1 text-black">Role</span>
                        <div className="ml-auto -rotate-90">
                            <IconCaretDown className='text-black' />
                        </div>
                    </button>
                    <ul className="rounded absolute top-0 left-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                        <li>
                            <NavLink to="/access/role">All Roles</NavLink>
                        </li>
                    </ul>
                </li>
                {/* permission */}
                <li className="relative">
                    <button type="button" className={`nav-link ${location.pathname.includes('/access/permission') ? 'active' : ''} !cursor-default`}>
                        <span className="px-1 text-black">Permission</span>
                        <div className="ml-auto -rotate-90">
                            <IconCaretDown className='text-black' />
                        </div>
                    </button>
                    <ul className="rounded absolute top-0 left-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                        <li>
                            <NavLink to="/access/permission">All Permission</NavLink>
                        </li>

                    </ul>
                </li>
            </ul>
        </li>
    )
}

export default ManageAccess