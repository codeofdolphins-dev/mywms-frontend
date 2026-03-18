import { BiSolidFactory } from "react-icons/bi";
import IconCaretDown from "../../Icon/IconCaretDown";
import { NavLink } from "react-router-dom";

const PRODUCTION_MENU = [
    // { name: 'Vendor', path: '/production/vendor' },
    // { name: 'Vendor Category', path: '/production/vendor/category' },
    {
        name: "Facilities / Stores",
        path: "/production/store",
        children: [
            { name: "RM Store", path: "/production/store/rm-store" },
            { name: "Production Unit", path: "/production/store/production-unit" },
            { name: "FG Store", path: "/production/store/fg-store" }
        ]
    },
    {
        name: "MFG Operations",
        path: "/production/store",
        children: [
            { name: "Bill of Materials (BOM)", path: "" },
            { name: "Production Orders", path: "" },
            { name: "Material Issue", path: "" },
            { name: "Production Receipt", path: "" }
        ]
    },
];

const Production = ({ location }) => {
    return (
        <li className="menu nav-item relative !ml-0">
            <button
                type="button"
                className={`nav-link ${["production"].some(a => location.pathname.includes(a)) ? 'active' : ''} !cursor-default`}
            >
                <div className="flex items-center">
                    <BiSolidFactory />
                    <span className="px-1 whitespace-nowrap">Production</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
            </button>

            <ul className="sub-menu">
                {PRODUCTION_MENU?.map((item, idx) =>
                    <li
                        key={idx}
                        className="relative"
                    >
                        {item?.children
                            ? <>
                                <button type="button" className={`nav-link ${location.pathname.includes('store') ? 'active' : ''} ${item.path ? "" : " !cursor-default"}`}>
                                    <span className="px-1 ">{item?.name}</span>
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
};

export default Production;
