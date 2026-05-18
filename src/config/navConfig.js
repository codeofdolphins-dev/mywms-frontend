import { HiDatabase, HiUserGroup } from "react-icons/hi";
import { RiAdminFill } from "react-icons/ri";
import { MdAdminPanelSettings, MdOutlineReceiptLong } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { FaArrowRightArrowLeft, FaQuoteLeft } from "react-icons/fa6";
import { BsBoxArrowInDown, BsBoxArrowUp } from "react-icons/bs";
import { BiSolidFactory } from "react-icons/bi";


export const NAV_CONFIG = [
    // ─── Open Forum ───
    {
        key: "open-forum",
        label: "Open Forum",
        icon: HiUserGroup,
        path: "/",
        // allowedRoles: ["system", "owner", "company"],
    },

    // ─── Master ───
    {
        key: "master",
        label: "Master",
        icon: HiDatabase,
        path: "/master",
        allowedRoles: ["system", "owner", "company", "admin", "warehouse"],
        children: [
            { key: "category", label: "Category", path: "/master/categories" },
            { key: "brand", label: "Brand", path: "/master/brands" },
            { key: "product", label: "Product", path: "/master/products" },
            { key: "hsn", label: "HSN", path: "/master/hsncodes" },
            { key: "unit", label: "Unit", path: "/master/unit-types" },
            { key: "package", label: "Package", path: "/master/package-types" },
            // { key: "bom", label: "BOM", path: "/master/bom" },
            // { key: "supplier", label: "Supplier", path: "/master/suppliers" },
        ],
    },

    // ─── Super Admin ───
    {
        key: "super-admin",
        label: "Super Admin",
        icon: RiAdminFill,
        basePath: "/super-admin",
        allowedRoles: ["system", "owner"],
        children: [
            { label: "Browse", path: "/super-admin/browse" },
            { label: "Business Flow", path: "/super-admin/business-flow" },
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
                label: "Location (Main WH)",
                basePath: "/admin/location",
                children: [
                    { label: "Browse Locations", path: "/admin/location" },
                    { label: "Register Location", path: "/admin/location/register" },
                ],
            },
            {
                label: "Internal Stores & Units",
                path: "/admin/store",
            },
            {
                label: "User Management",
                basePath: "/admin/user",
                children: [
                    { label: "Browse Users", path: "/admin/user" },
                    { label: "Register User", path: "/admin/user/register" },
                ],
            },
            {
                label: "Inventory",
                path: "/admin/inventory",
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
            { key: "role", label: "Role", path: "/access/role" },
            { key: "permission", label: "Permission", path: "/access/permission" },
        ],
    },

    // ─── Production ───
    {
        key: "production",
        label: "Production",
        icon: BiSolidFactory,
        basePath: "/production",
        allowedRoles: ["system", "owner", "company", "admin", "store_rm", "store_wip", "store_fg"],
        // children: [
        //     {
        //         label: "Facilities / Stores",
        //         basePath: "/production/store",
        children: [
            { key: "store", label: "RM Store", path: "/production/store/rm" },
            { key: "store", label: "Production Unit", path: "/production/store/wip" },
            { key: "store", label: "FG Store", path: "/production/store/fg" },
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
        allowedRoles: ["system", "owner", "company", "admin", "purchase", "warehouse"],
        children: [
            { label: "All List", path: "/requisition" },
            { label: "Create", path: "/requisition/create" },
            { label: "Receive Requisition", path: "/requisition/received-requisition" },
        ],
    },

    // ─── Quotation ───
    {
        key: "quotation",
        // matchKeys: ["quotation"],
        label: "Quotation",
        icon: FaQuoteLeft,
        basePath: "/quotation",
        allowedRoles: ["system", "owner", "company", "admin", "purchase", "sales", "warehouse"],
        children: [
            { label: "All List", path: "/quotation" },
            { label: "Receive Quotation", path: "/quotation/received-quotation" },
        ],
    },

    // ─── Orders ───
    {
        key: "order",
        label: "Orders",
        icon: MdOutlineReceiptLong,
        basePath: "/order",
        allowedRoles: ["system", "owner", "company", "admin", "purchase", "sales", "warehouse"],
        children: [
            { label: "List", path: "/order" },
            { label: "Blanket PO", path: "/order/bpo" },
            // { label: "Indent/Release Order", path: "/order/" },
        ],
    },

    // ─── Inward ───
    {
        key: "inward",
        label: "Inward",
        icon: BsBoxArrowInDown,
        path: "/inward",
        allowedRoles: ["system", "owner", "company", "admin", "store_rm", "warehouse"],
    },

    // ─── Outward ───
    {
        key: "outward",
        label: "Outward",
        icon: BsBoxArrowUp,
        path: "/outward",
        allowedRoles: ["system", "owner", "company", "admin", "store_fg", "warehouse"],
    },
    
    // ─── Direct Transfer ───
    {
        key: "transfer",
        label: "Direct Transfer",
        icon: FaArrowRightArrowLeft,
        path: "/direct-transfer",
        allowedRoles: ["system", "owner", "company", "admin", "store_fg", "warehouse"],
    },
];
