import { RiAdminFill } from "react-icons/ri";
import IconCaretDown from "../../Icon/IconCaretDown";
import { NavLink } from "react-router-dom";

const ADMIN_MENU = [
    {
        name: "Location (Main WH)",
        path: "/admin/business",
        children: [
            { name: "Browse Nodes", path: "/admin/business" },
            { name: "Register Node", path: "/admin/business/register" }
        ]
    },
    {
        name: "Internal Stores & Units",
        path: "/admin/store",
        // children: [
        //     { name: "Browse All Stores", path: "/admin/store" },
        //     { name: "Register Store/Unit", path: "/admin/store/register" }
        // ]
    },
    {
        name: "User Management",
        path: "/admin/user",
        children: [
            { name: "Browse Users", path: "/admin/user" },
            { name: "Register User", path: "/admin/user/register" }
        ]
    }
];




const Admin = ({ location }) => {
    return (
        <li className="menu nav-item relative !ml-0">
            <button
                type="button"
                className={`nav-link ${location.pathname.includes("admin") ? 'active' : ''} !cursor-default`}
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
                {ADMIN_MENU?.map((item, idx) =>
                    <li
                        key={idx}
                        className="relative min-w-[210px]"
                    >
                        {item?.children
                            ? <>
                                <button type="button" className={`nav-link ${location.pathname.includes(item.path) ? 'active' : ''} !cursor-default`}>
                                    <span className="px-1 text-black">{item.name}</span>
                                    <div className="ml-auto -rotate-90">
                                        <IconCaretDown className='text-black' />
                                    </div>
                                </button>
                                <ul className="rounded absolute top-0 left-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                                    {item?.children?.map((item, idx) => (
                                        <li key={idx}>
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
