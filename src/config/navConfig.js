import { HiDatabase, HiUserGroup } from "react-icons/hi";
import { RiAdminFill } from "react-icons/ri";
import { MdAdminPanelSettings, MdOutlineReceiptLong } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { FaQuoteLeft } from "react-icons/fa6";
import { BsBoxArrowInDown, BsBoxArrowUp } from "react-icons/bs";
import { BiSolidFactory } from "react-icons/bi";

/**
 * Centralized navigation configuration.
 *
 * Each item can have:
 *   - key:       unique identifier
 *   - label:     display text
 *   - icon:      react-icon component (top-level only)
 *   - path:      direct navigation path (for simple link items)
 *   - basePath:  path prefix used for active-state highlighting (dropdown items)
 *   - access:    access rules evaluated by checkAccess()
 *   - children:  sub-menu items (can nest one more level for flyouts)
 *
 * Access rules:
 *   roles, permissions     → OR match (any one passes)
 *   nodeTypes              → OR match — specific codes like "L-111"
 *   nodeCategories         → OR match — broad groups: "partner", "warehouse", "manufacturing", "retail"
 *   userTypes              → hard block (must match)
 *   departments            → hard block (must match, "both" passes all)
 *
 * Node Type Codes (from dataset.js):
 *   L-101  Mfg Bond Warehouse        (manufacturing)
 *   L-102  Mother Warehouse           (warehouse)
 *   L-103  Central Warehouse          (warehouse)
 *   L-104  Regional Warehouse         (warehouse)
 *   L-105  State Warehouse            (warehouse)
 *   L-106  CFA / C&F Agent            (partner)
 *   L-107  3PL Warehouse              (partner)
 *   L-108  Storage Hub                (warehouse)
 *   L-109  Super Stockist             (partner)
 *   L-110  Dealer                     (partner)
 *   L-111  Distributor                (partner)
 *   L-112  Sub-Distributor            (partner)
 *   L-113  Fulfilment Centre          (warehouse)
 *   L-114  Retail Warehouse           (retail)
 */
export const NAV_CONFIG = [
    // ─── Open Forum ───
    {
        key: "open-forum",
        label: "Open Forum",
        icon: HiUserGroup,
        path: "/",
        access: {
            roles: ["system", "owner", "company"],
        },
    },

    // ─── Master ───
    {
        key: "master",
        label: "Master",
        icon: HiDatabase,
        path: "/master",
        access: {
            roles: ["system", "owner", "company"],
        },
    },

    // ─── Super Admin ───
    {
        key: "super-admin",
        label: "Super Admin",
        icon: RiAdminFill,
        basePath: "/super-admin",
        access: {
            roles: ["system", "owner"],
        },
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
        access: {
            roles: ["system", "owner", "company", "admin"],
            nodeCategories: ["partner"],   // distributor, dealer, etc.
        },
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
        access: {
            roles: ["system", "owner", "company"],
        },
        children: [
            { label: "Role", path: "/access/role" },
            { label: "Permission", path: "/access/permission" },
        ],
    },

    // ─── Production ───
    {
        key: "production",
        label: "Production",
        icon: BiSolidFactory,
        basePath: "/production",
        access: {
            roles: ["system", "owner", "company"],
            userTypes: ["internal"],
        },
        children: [
            {
                label: "Facilities / Stores",
                basePath: "/production/store",
                children: [
                    { label: "RM Store", path: "/production/store/rm" },
                    { label: "Production Unit", path: "/production/store/wip" },
                    { label: "FG Store", path: "/production/store/fg" },
                ],
            },
        ],
    },

    // ─── Requisition ───
    {
        key: "requisition",
        label: "Requisition",
        icon: FaClipboardList,
        basePath: "/requisition",
        access: {
            roles: ["system", "owner", "company"],
            nodeCategories: ["partner"],
        },
        children: [
            { label: "All List", path: "/requisition" },
            { label: "Create", path: "/requisition/create" },
            { label: "Receive Requisition", path: "/requisition/received-requisition" },
        ],
    },

    // ─── Quotation ───
    {
        key: "quotation",
        label: "Quotation",
        icon: FaQuoteLeft,
        basePath: "/quotation",
        access: {
            roles: ["system", "owner", "company"],
            nodeCategories: ["partner"],
        },
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
        access: {
            roles: ["system", "owner", "company"],
            nodeCategories: ["partner"],
        },
        children: [
            { label: "List", path: "/order" },
            { label: "Blanket PO", path: "/order/bpo" },
            { label: "Indent/Release Order", path: "/order/" },
        ],
    },

    // ─── Inward ───
    {
        key: "inward",
        label: "Inward",
        icon: BsBoxArrowInDown,
        path: "/inward",
        access: {
            roles: ["system", "owner", "company"],
            nodeCategories: ["partner"],
        },
    },

    // ─── Outward ───
    {
        key: "outward",
        label: "Outward",
        icon: BsBoxArrowUp,
        path: "/outward",
        access: {
            roles: ["system", "owner", "company"],
            nodeCategories: ["partner"],
        },
    },
];
