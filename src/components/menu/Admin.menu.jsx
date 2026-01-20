import { RiAdminFill } from "react-icons/ri";
import IconCaretDown from "../Icon/IconCaretDown";
import { NavLink } from "react-router-dom";

const ADMIN_MENU = [
    { name: 'Browse', path: '/admin/browse' },
    { name: 'Business Flow', path: '/admin/business-flow' },
    { name: 'Register', path: '/admin/business/node-register' },
    {
        name: 'user',
        children: [
            { name: 'List', path: '/user' },
            { name: 'Create', path: '/user/register' },
        ]
    },
];

const Admin = ({ location }) => {
    return (
        <li className="menu nav-item relative !ml-0">
            <button
                type="button"
                className={`nav-link ${location.pathname.includes('/admin') ? 'active' : ''} !cursor-default`}
            >
                <div className="flex items-center">
                    <RiAdminFill />
                    <span className="px-1 whitespace-nowrap">Admin</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
            </button>

            <ul className="sub-menu">
                {ADMIN_MENU?.map((item) =>
                    <li key={item.path} className="relative">
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
                                        item?.children?.map(item => (
                                            <li
                                                key={item.path}
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
};

export default Admin;
