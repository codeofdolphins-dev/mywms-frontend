import React from 'react'
import { NavLink } from 'react-router-dom';
import IconCaretDown from '../../Icon/IconCaretDown';
import { RiAdminFill } from 'react-icons/ri';

const SUPER_ADMIN_MENU = [
    { name: 'Browse', path: '/super-admin/browse' },
    { name: 'Business Flow', path: '/super-admin/business-flow' },
];

const SuperAdmin = ({ location }) => {
    return (
        <li className="menu nav-item relative !ml-0">
            <button
                type="button"
                className={`nav-link ${["/super-admin"].some(a => location.pathname.includes(a)) ? 'active' : ''} !cursor-default`}
            >
                <div className="flex items-center">
                    <RiAdminFill />
                    <span className="px-1 whitespace-nowrap">Super Admin</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
            </button>

            <ul className="sub-menu">
                {SUPER_ADMIN_MENU?.map((item, idx) =>
                    <li
                        key={idx}
                        className="relative"
                    >
                        {item?.children
                            ? <>
                                <button type="button" className={`nav-link ${location.pathname.includes('/user') ? 'active' : ''} !cursor-default`}>
                                    <span className="px-1 text-black">User</span>
                                    <div className="ml-auto -rotate-90">
                                        <IconCaretDown className='text-black' />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 left-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    {
                                        item?.children?.map((item, idx) => (
                                            <li
                                                key={idx}
                                            >
                                                <NavLink
                                                    to={item.path}
                                                    end={item.path}
                                                    className={({ isActive }) => isActive ? "active" : ""}
                                                >
                                                    {item.name}
                                                </NavLink>
                                            </li>

                                        ))
                                    }
                                </ul>
                            </> : <>
                                <NavLink
                                    to={item.path}
                                    end={item.path}
                                    className={({ isActive }) => isActive ? "active" : ""}
                                >
                                    {item.name}
                                </NavLink>
                            </>
                        }
                    </li>
                )}
            </ul>
        </li>
    );
}

export default SuperAdmin