import { HiDatabase, HiUserGroup } from "react-icons/hi";
import { RiAdminFill } from "react-icons/ri";
import {
    MdAdminPanelSettings,
    MdOutlineReceiptLong,
    MdOutlineCategory,
    MdOutlineInventory2,
    MdOutlineDescription,
    MdOutlineAccountBalanceWallet,
    MdOutlineTravelExplore,
    MdOutlineLocationOn,
    MdOutlineWarehouse,
    MdOutlineBadge,
    MdOutlineVpnKey,
    MdOutlineHub,
    MdPrecisionManufacturing,
    MdOutlineMoveToInbox,
    MdOutlineSwapVert,
    MdOutlineBrandingWatermark,
} from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { FaArrowRightArrowLeft, FaHandshake, FaQuoteLeft } from "react-icons/fa6";
import { BsBoxArrowInDown, BsBoxArrowUp, BsBoxSeam } from "react-icons/bs";
import { BiSolidFactory, BiSolidStore } from "react-icons/bi";
import { HiOutlineDocumentCurrencyRupee, HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FiList, FiPlusCircle, FiUsers } from "react-icons/fi";
import { TbNumbers, TbRulerMeasure, TbHierarchy3 } from "react-icons/tb";


export const NAV_CONFIG = [
    // ─── Open Forum ───
    {
        key: "open-forum",
        label: "Open Forum",
        icon: HiUserGroup,
        path: "/",
        allowedRoles: ["system", "owner", "company", "purchase", "sales"],
    },

    // ─── Master ───
    {
        key: "master",
        label: "Master",
        icon: HiDatabase,
        path: "/master",
        allowedRoles: ["system", "company", "admin"],
        children: [
            { key: "category", label: "Category", icon: MdOutlineCategory, path: "/master/categories" },
            { key: "brand", label: "Brand", icon: MdOutlineBrandingWatermark, path: "/master/brands" },
            { key: "product", label: "Product", icon: MdOutlineInventory2, path: "/master/products" },
            { key: "hsn", label: "HSN", icon: TbNumbers, path: "/master/hsncodes" },
            { key: "unit", label: "Unit", icon: TbRulerMeasure, path: "/master/unit-types" },
            { key: "package", label: "Package", icon: BsBoxSeam, path: "/master/package-types" },
            { key: "cost-heads", label: "Cost-heads", icon: MdOutlineAccountBalanceWallet, path: "/master/cost-heads" },
            // { key: "bom", label: "BOM", path: "/master/bom" },
            // { key: "supplier", label: "Supplier", path: "/master/suppliers" },
        ],
    },


    // ─── Inventory ───
    {
        key: "inventory",
        label: "Inventory",
        icon: BiSolidStore,
        path: "/inventory",
        allowedRoles: ["system", "company", "admin", "warehouse", "partner"],
    },

    // ─── Super Admin ───
    {
        key: "super-admin",
        label: "Super Admin",
        icon: RiAdminFill,
        basePath: "/super-admin",
        allowedRoles: ["system", "owner"],
        children: [
            { label: "Browse", icon: MdOutlineTravelExplore, path: "/super-admin/browse" },
            { label: "Business Flow", icon: TbHierarchy3, path: "/super-admin/business-flow" },
        ],
    },

    // ─── Admin ───
    {
        key: "admin",
        label: "Admin",
        icon: RiAdminFill,
        basePath: "/admin",
        allowedRoles: ["system", "owner", "company", "admin"],
        children: [
            {
                label: "All Locations",
                icon: MdOutlineLocationOn,
                path: "/admin/location",
            },
            {
                label: "Internal Stores & Units",
                icon: MdOutlineWarehouse,
                path: "/admin/store",
                requiredNodeCategory: "manufacturing",
            },
            {
                label: "User Management",
                icon: FiUsers,
                path: "/admin/user",
            },
        ],
    },

    // ─── Manage Access ───
    {
        key: "access",
        label: "Manage Access",
        icon: MdAdminPanelSettings,
        basePath: "/access",
        allowedRoles: ["system", "owner", "company", "admin"],
        children: [
            { key: "role", label: "Role", icon: MdOutlineBadge, path: "/access/role" },
            { key: "permission", label: "Permission", icon: MdOutlineVpnKey, path: "/access/permission" },
        ],
    },
    {
        key: "connection",
        label: "Connection",
        icon: FaHandshake,
        basePath: "/connection",
        allowedRoles: ["system", "owner", "company", "admin"],
        children: [
            { key: "my-connections", label: "My Connections", icon: MdOutlineHub, path: "/connection" },
            { key: "browse-companies", label: "Browse Companies", icon: HiOutlineBuildingOffice2, path: "/connection/browse" },
        ],
    },

    // ─── Production ───
    {
        key: "production",
        label: "Production",
        icon: BiSolidFactory,
        basePath: "/production",
        allowedRoles: ["system", "store_rm", "store_wip", "store_fg", "company"],
        requiredNodeCategory: "manufacturing",
        // children: [
        //     {
        //         label: "Facilities / Stores",
        //         basePath: "/production/store",
        children: [
            { key: "store", label: "RM Store", icon: MdOutlineWarehouse, path: "/production/store/rm" },
            { key: "store", label: "Production Unit", icon: MdPrecisionManufacturing, path: "/production/store/wip" },
            { key: "store", label: "FG Store", icon: BsBoxSeam, path: "/production/store/fg" },
        ],
        //     },
        // ],
    },

    // ─── Requisition ───
    {
        key: "requisition",
        matchKeys: [],
        label: "Requisition",
        icon: FaClipboardList,
        basePath: "/requisition",
        allowedRoles: ["system", "purchase", "warehouse", "partner", "company"],
        children: [
            { label: "All List", icon: FiList, path: "/requisition" },
            { label: "Create", icon: FiPlusCircle, path: "/requisition/create" },
            { label: "Receive Requisition", icon: MdOutlineMoveToInbox, path: "/requisition/received-requisition" },
        ],
    },

    // ─── Quotation ───
    {
        key: "quotation",
        // matchKeys: ["quotation"],
        label: "Quotation",
        icon: FaQuoteLeft,
        basePath: "/quotation",
        allowedRoles: ["system", "purchase", "sales", "company"],
        children: [
            { label: "All List", icon: FiList, path: "/quotation" },
            { label: "Receive Quotation", icon: MdOutlineMoveToInbox, path: "/quotation/received-quotation" },
        ],
    },

    // ─── Orders ───
    {
        key: "order",
        label: "Orders",
        icon: MdOutlineReceiptLong,
        basePath: "/order",
        allowedRoles: ["system", "purchase", "sales", "warehouse", 'partner', "company"],
        children: [
            { label: "List", icon: FiList, path: "/order" },
            { label: "Blanket PO", icon: MdOutlineDescription, path: "/order/bpo" },
            // { label: "Indent/Release Order", path: "/order/" },
        ],
    },

    // ─── entry ───
    {
        key: "entry",
        label: "Entry",
        icon: MdOutlineSwapVert,        // goods in and out — distinct from Orders' receipt icon
        basePath: "/entry",
        // allowedRoles: ["system", "purchase", "sales", "warehouse", 'partner', "company"],
        children: [
            {
                key: "inward",
                label: "Inward",
                icon: BsBoxArrowInDown,
                path: "/inward",
                allowedRoles: ["system", "store_rm", "warehouse", "partner", "company"],
            },
            {
                key: "outward",
                label: "Outward",
                icon: BsBoxArrowUp,
                path: "/outward",
                allowedRoles: ["system", "store_fg", "warehouse", "partner", "company"],
            },
        ],
    },

    // ─── Inward ───
    // {
    //     key: "inward",
    //     label: "Inward",
    //     icon: BsBoxArrowInDown,
    //     path: "/inward",
    //     allowedRoles: ["system", "store_rm", "warehouse", "partner", "company"],
    // },

    // ─── Outward ───
    // {
    //     key: "outward",
    //     label: "Outward",
    //     icon: BsBoxArrowUp,
    //     path: "/outward",
    //     allowedRoles: ["system", "store_fg", "warehouse", "partner", "company"],
    // },

    // ─── Direct Transfer ───
    {
        key: "direct-transfer",
        label: "Direct Transfer",
        icon: FaArrowRightArrowLeft,
        path: "/direct-transfer",
        allowedRoles: ["system", "store_fg", "company"],
    },
    {
        key: "expense",
        label: "Expenses",
        icon: HiOutlineDocumentCurrencyRupee,
        path: "/expense",
        allowedRoles: ["system", "store_rm", "store_wip", "store_fg", "warehouse", "partner", "company"],
    },
];
