import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import { HiDatabase } from "react-icons/hi";
import { FaClipboardList, FaStore } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { FaTruckRampBox, FaUserGroup } from "react-icons/fa6";
import { BiSolidFactory } from "react-icons/bi";
import { LuWarehouse } from "react-icons/lu";
import { RiAdminFill } from "react-icons/ri";


const requisitionSubMenu = [
    { name: 'Rules', path: '/requisition/admin/rules' },
    { name: 'Browse', path: '/requisition' },
    { name: 'Create', path: '/requisition/create' },
];
const supplierSubMenu = [
    { name: 'Browse', path: '/supplier' },
    { name: 'Create', path: '/supplier/create' },
];
const productionSubMenu = [
    { name: 'Browse', path: '/production' },
    { name: 'Create', path: '/production/create' },
];
const storeSubMenu = [
    { name: 'Browse', path: '/store' },
    { name: 'Create', path: '/store/create' },
];
const dealerSubMenu = [
    { name: 'Browse', path: '/dealer' },
    { name: 'Create', path: '/dealer/create' },
];
const retailerSubMenu = [
    { name: 'Browse', path: '/retailer' },
    { name: 'Create', path: '/retailer/create' },
];
const distributorSubMenu = [
    { name: 'Browse', path: '/distributor' },
    { name: 'Create', path: '/distributor/create' },
];
const warehouseSubMenu = [
    { name: 'Browse', path: '/warehouse' },
    { name: 'Create', path: '/warehouse/create' },
];

const NavBar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <ul className="horizontal-menu gap-1 py-1.5 font-semibold px-6 lg:space-x-1.5 xl:space-x-8 rtl:space-x-reverse bg-white border-t border-[#ebedf2] text-black">
            {/* dashboard */}
            <li
                className="menu nav-item relative"
                onClick={() => navigate("/")}
            >
                <button type="button" className={`nav-link ${location.pathname === '/' ? 'active' : ''} `}>
                    <div className="flex items-center">
                        <IconMenuDashboard className="shrink-0" />
                        <span className="px-1">{'dashboard'}</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    <li>
                        <NavLink to="/">{'sales'}</NavLink>
                    </li>
                </ul>
            </li>

            {/* master */}
            <li
                className="menu nav-item relative !ml-0"
                onClick={() => navigate("/master")}
            >
                <button type="button" className={`nav-link ${location.pathname === '/master' ? 'active' : ''} `}>
                    <div className="flex items-center">
                        <HiDatabase />
                        <span className="px-1">Master</span>
                    </div>
                </button>
            </li>

            {/* manage access */}
            <li className="menu nav-item relative !ml-0" >
                <button type="button" className={`nav-link ${location.pathname.includes('/access') ? 'active' : ''} !cursor-default`}>
                    <div className="flex items-center">
                        <RiAdminFill />
                        <span className="px-1 whitespace-nowrap">Manage Access</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
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
                            <li>
                                <NavLink to="/access/role/create">Create Roles</NavLink>
                            </li>
                            <li>
                                <NavLink to="/access/role/assign">Assign Roles</NavLink>
                            </li>
                        </ul>
                    </li>
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
                            <li>
                                <NavLink to="/access/permission/create">Create Permission</NavLink>
                            </li>
                            <li>
                                <NavLink to="/access/permission/assign">Assign Permission</NavLink>
                            </li>

                        </ul>
                    </li>
                </ul>
            </li>

            {/* requisition */}
            <li
                className="menu nav-item relative !ml-0"
            >
                <button type="button" className={`nav-link ${location.pathname === '/requisition' ? 'active' : ''} !cursor-default`}>
                    <div className="flex items-center">
                        <FaClipboardList />
                        <span className="px-1">Requisition</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    {requisitionSubMenu.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                    ))}
                </ul>
            </li>

            {/* purchase */}
            {/* <li
                        className="menu nav-item relative !ml-0"
                        onClick={() => navigate("/purchase")}
                    >
                        <button type="button" className={`nav-link ${location.pathname === '/purchase' ? 'active' : ''} `}>
                            <div className="flex items-center">
                                <TiShoppingCart />
                                <span className="px-1">Purchase</span>
                            </div>
                        </button>
                    </li> */}

            {/* supplier */}
            <li className="menu nav-item relative !ml-0" >
                <button type="button" className={`nav-link ${location.pathname === '/supplier' ? 'active' : ''} `}>
                    <div className="flex items-center">
                        <FaTruckRampBox />
                        <span className="px-1">Supplier</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    {supplierSubMenu.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                    ))}
                </ul>
            </li>

            {/* production */}
            <li className="menu nav-item relative !ml-0" >
                <button type="button" className={`nav-link ${location.pathname === '/production' ? 'active' : ''} `}>
                    <div className="flex items-center">
                        <BiSolidFactory />
                        <span className="px-1">Production</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    {productionSubMenu.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                    ))}
                </ul>
            </li>

            {/* store */}
            <li className="menu nav-item relative !ml-0" >
                <button type="button" className={`nav-link ${location.pathname === '/store' ? 'active' : ''} `}>
                    <div className="flex items-center">
                        <FaStore />
                        <span className="px-1">Store</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    {storeSubMenu.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                    ))}
                </ul>
            </li>

            {/* dealer */}
            <li className="menu nav-item relative !ml-0" >
                <button type="button" className={`nav-link ${location.pathname === '/dealer' ? 'active' : ''} `}>
                    <div className="flex items-center">
                        <FaUserGroup />
                        <span className="px-1">Dealer</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    {dealerSubMenu.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                    ))}
                </ul>
            </li>

            {/* distributor */}
            <li className="menu nav-item relative !ml-0" >
                <button type="button" className={`nav-link ${location.pathname === '/distributor' ? 'active' : ''} `}>
                    <div className="flex items-center">
                        <FaUserGroup />
                        <span className="px-1">Distributor</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    {distributorSubMenu.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                    ))}
                </ul>
            </li>

            {/* retailer */}
            <li className="menu nav-item relative !ml-0" >
                <button type="button" className={`nav-link ${location.pathname === '/retailer' ? 'active' : ''} `}>
                    <div className="flex items-center">
                        <FaUserGroup />
                        <span className="px-1">Retailer</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    {retailerSubMenu.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                    ))}
                </ul>
            </li>

            {/* warehouse */}
            <li className="menu nav-item relative !ml-0" >
                <button type="button" className={`nav-link ${location.pathname === '/warehouse' ? 'active' : ''} `}>
                    <div className="flex items-center">
                        <LuWarehouse />
                        <span className="px-1">Warehouse</span>
                    </div>
                    <div className="right_arrow">
                        <IconCaretDown />
                    </div>
                </button>
                <ul className="sub-menu">
                    {warehouseSubMenu.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                    ))}
                </ul>
            </li>
        </ul>
    )
}

export default NavBar
