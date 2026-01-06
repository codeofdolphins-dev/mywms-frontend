import { RiAdminFill } from "react-icons/ri";
import IconCaretDown from "../Icon/IconCaretDown";
import { NavLink } from "react-router-dom";

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
                <li className="relative">
                    <NavLink to="/admin/business-flow">Business Flow</NavLink>
                </li>
                <li className="relative">
                    <NavLink to="/admin/business/node-register">Register</NavLink>
                </li>
                <li className="relative">
                    <button type="button" className={`nav-link ${location.pathname.includes('/access/permission') ? 'active' : ''} !cursor-default`}>
                        <span className="px-1 text-black">Create</span>
                        <div className="ml-auto -rotate-90">
                            <IconCaretDown className='text-black' />
                        </div>
                    </button>
                    <ul className="rounded absolute top-0 left-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                        <li>
                            <NavLink to="/admin/warehouse">Warehouse</NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/user">User</NavLink>
                        </li>
                    </ul>
                </li>

            </ul>
        </li>
    );
};

export default Admin;
