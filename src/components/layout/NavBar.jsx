import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import { HiDatabase } from "react-icons/hi";
import { FaClipboardList, FaQuoteLeft, FaStore } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { FaTruckRampBox, FaUserGroup } from "react-icons/fa6";
import { LuWarehouse } from "react-icons/lu";
import { RiAdminFill } from "react-icons/ri";
import { MdAdminPanelSettings, MdOutlineReceiptLong } from 'react-icons/md';
import { BsBoxArrowInDown, BsBoxArrowUp } from "react-icons/bs";
import { hasNodeAccess, hasRoleAccess } from '../../utils/roles';
import { useSelector } from 'react-redux';
import {
    Dashboard,
    Master,
    Admin,
    ManageAccess,
    Requisition,
    Quotation,
    PurchaseOrder,
    Inward,
    Outward,
    SuperAdmin,
} from './menu';
import Production from './menu/production.menu';

const DEV_BYPASS = true;


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


const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userData = useSelector(state => state?.auth?.userData);
    const userRoles = userData?.roles?.map(r => r.role);
    const nodeName = userData?.userBusinessNode?.nodeDetails?.name.toLowerCase();

    return (
        <ul className="horizontal-menu gap-1 py-1.5 font-semibold px-6 lg:space-x-1.5 xl:space-x-8 bg-white border-t border-[#ebedf2] text-black">

            {/* dashboard */}
            {
                (DEV_BYPASS || hasRoleAccess(["system", "owner", "company"], userRoles)) && <Dashboard location={location} />
            }

            {/* master */}
            {
                (DEV_BYPASS || hasRoleAccess(["system", "owner", "company"], userRoles)) && <Master location={location} />
            }

            {/* super admin */}
            {
                // (DEV_BYPASS || (hasRoleAccess(["system", "owner", "company"], userRoles))
                //     || ((hasNodeAccess(["distributor"], nodeName))))
                // && <SuperAdmin location={location} />
            }
            {/* admin */}
            {
                (DEV_BYPASS || (hasRoleAccess(["system", "owner", "company"], userRoles))
                    || ((hasNodeAccess(["distributor"], nodeName))))
                && <Admin location={location} />
            }

            {/* manage access */}
            {
                // (DEV_BYPASS || hasRoleAccess(["system", "owner", "company"], userRoles)) && <ManageAccess location={location} />
            }

            {/* production */}
            {
                (DEV_BYPASS || hasRoleAccess(["system", "owner", "company"], userRoles)) && <Production location={location} />
            }

            {/* requisition */}
            {
                (DEV_BYPASS || (hasRoleAccess(["system", "owner", "company"], userRoles))
                    || ((hasNodeAccess(["distributor"], nodeName))))
                && <Requisition location={location} />
            }

            {/* Quotation */}
            {
                (DEV_BYPASS || (hasRoleAccess(["system", "owner", "company"], userRoles))
                    || ((hasNodeAccess(["distributor"], nodeName))))
                && <Quotation location={location} />
            }

            {/* Purchase Order */}
            {
                (DEV_BYPASS || (hasRoleAccess(["system", "owner", "company"], userRoles))
                    || ((hasNodeAccess(["distributor"], nodeName))))
                && <PurchaseOrder location={location} />
            }

            {/* Inward */}
            {
                (DEV_BYPASS || (hasRoleAccess(["system", "owner", "company"], userRoles))
                    || ((hasNodeAccess(["distributor"], nodeName))))
                && <Inward location={location} />
            }

            {/* outward */}
            {
                (DEV_BYPASS || (hasRoleAccess(["system", "owner", "company"], userRoles))
                    || ((hasNodeAccess(["distributor"], nodeName))))
                && <Outward location={location} />
            }


            {/* vendor */}
            {/* <li className="menu nav-item relative !ml-0" >
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
            </li> */}

            {/* retailer */}
            {/* <li className="menu nav-item relative !ml-0" >
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
            </li> */}
        </ul>
    )
}

export default NavBar;