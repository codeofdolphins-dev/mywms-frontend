export const IMAGE_URL = import.meta.env.VITE_IMAGE_URL

export const WAREHOUSE_COLUMN = [
    { key: "id", label: "#" },
    { key: "permission", label: "Name" },
];

export const PERMISSION_COL = [
    { key: "id", label: "SL" },
    { key: "permission", label: "Name" },
];
export const ROLE_COL = [
    {
        key: "id",
        label: "#",
        width: "0.5fr",
        align: "start"
    },
    {
        key: "name",
        label: "Product Name",
        // width: "2fr"
    },
    {
        key: "action",
        label: "Action",
        // width: "120px",
        align: "center"
    },
    {
        key: "status",
        label: "Status",
        // width: "120px",
        align: "center"
    },
];

export const REQUISITION_CREATE_COLUMN = [
    { key: "id", label: "#" },
    { key: "permission", label: "GSTIN No." },
    { key: "permission", label: "Brand" },
    { key: "permission", label: "Product" },
    { key: "permission", label: "Pack Size" },
    { key: "permission", label: "Req Qty." },
];
export const REQUISITION_COLUMN = [
    {
        key: "id",
        label: "#",
        // width: "0.5fr",
        align: "center"
    },
    {
        key: "title",
        label: "Title",
        // width: "2fr"
    },
    {
        key: "status",
        label: "Status",
        // width: "120px",
        align: "center"
    },
    {
        key: "priority",
        label: "Priority",
        // width: "120px",
        align: "center"
    },
    {
        key: "notes",
        label: "Notes",
        // width: "120px",
        align: "center"
    },
    {
        key: "total",
        label: "Total",
        // width: "120px",
        align: "center"
    },
    {
        key: "action",
        label: "Action",
        // width: "120px",
        align: "center"
    },
];
export const REQUISITION_ITEMS_COLUMN = [
    {
        key: "id",
        label: "#",
        // width: "0.5fr",
        // align: "center"
    },
    {
        key: "barcode",
        label: "Barcode",
        // width: "2fr"
    },
    {
        key: "productName",
        label: "Product Name",
        // width: "120px",
        // align: "center"
    },
    {
        key: "price",
        label: "Price",
        // width: "120px",
        // align: "center"
    },
    {
        key: "qty",
        label: "QTY",
        // width: "120px",
        // align: "center"
    },
];

export const QUOTATION_COLUMN = [
    {
        key: "id",
        label: "#",
        // width: "0.5fr",
        align: "center"
    },
    {
        key: "qno",
        label: "QNo",
        // width: "2fr"
    },
    {
        key: "name",
        label: "Supplier Name",
        // width: "120px",
        align: "center"
    },
    {
        key: "status",
        label: "Status",
        // width: "120px",
        align: "center"
    },
    {
        key: "notes",
        label: "Notes",
        // width: "120px",
        align: "center"
    },
    {
        key: "total",
        label: "Total",
        // width: "120px",
        align: "center"
    },
    {
        key: "action",
        label: "Action",
        // width: "120px",
        align: "center"
    },
];
export const QUOTATION_RECEIVE_COLUMN = [
    {
        key: "id",
        label: "#",
        // width: "0.5fr",
        // align: "center"
    },
    {
        key: "barcode",
        label: "Barcode",
        // width: "2fr"
    },
    {
        key: "productName",
        label: "Product Name",
        // width: "120px",
        // align: "center"
    },
    {
        key: "price",
        label: "Price",
        // width: "120px",
        // align: "center"
    },
    {
        key: "qty",
        label: "QTY",
        // width: "120px",
        // align: "center"
    },
];
export const REQUISITION_RECEIVE_COLUMN = [
    {
        key: "id",
        label: "#",
        // width: "0.5fr",
        // align: "center"
    },
    {
        key: "title",
        label: "Title",
        // width: "2fr"
    },
    {
        key: "sender",
        label: "Sender",
        // width: "2fr"
    },
    {
        key: "priority",
        label: "Priority",
        // width: "120px",
        // align: "center"
    },
    {
        key: "total",
        label: "Total",
        // width: "120px",
        // align: "center"
    },
    {
        key: "itemsCount",
        label: "Total Items",
        // width: "120px",
        // align: "center"
    },
    {
        key: "action",
        label: "Action",
        // width: "120px",
        // align: "center"
    },
]

export const PURCHASE_ORDER = [
    {
        key: "id",
        label: "#",
        // width: "0.5fr",
        // align: "center"
    },
    {
        key: "pr_id",
        label: "PR id",
        // width: "2fr"
    },
    {
        key: "status",
        label: "Status",
        // width: "2fr"
    },
    {
        key: "priority",
        label: "Priority",
        // width: "120px",
        // align: "center"
    },
    {
        key: "expected_delivery_date",
        label: "Expected Delivary Date",
        // width: "120px",
        // align: "center"
    },
    {
        key: "note",
        label: "Note",
        // width: "120px",
        // align: "center"
    },
    {
        key: "created_by",
        label: "Created By",
        // width: "120px",
        // align: "center"
    },
    {
        key: "total_amount",
        label: "Total Amount",
        // width: "120px",
        // align: "center"
    },
    {
        key: "action",
        label: "Action",
        // width: "120px",
        // align: "center"
    },
]

export const SUPPLIER_COLUMN = [
    { key: "id", label: "#", width: "0.5fr", },
    { key: "email", label: "Email", width: "2fr" },
    { key: "full_name", label: "Name" },
    { key: "company_name", label: "Company" },
    { key: "phone_no", label: "Phone" },
    { key: "is_active", label: "Status" },
    { key: "address", label: "Address" },
    { key: "account_holder_name", label: "A/C Holder Name" },
    { key: "account_number", label: "A/C Number" },
    { key: "account_type", label: "Type" },
    { key: "ifsc_code", label: "IFSC Code" },
    { key: "bank_branch", label: "Branch" },
    { key: "bank_name", label: "Bank Name" },
    { key: "action", label: "Action" }
];

export const BRAND_COLUMN = [
    { key: "id", label: "#" },
    { key: "logo", label: "Logo" },
    { key: "name", label: "Brand Name" },
    { key: "slug", label: "Slug" },
    { key: "supplier", label: "Supplier" },
    { key: "is_active", label: "Status" },
    { key: "action", label: "Action" }
];

export const NODE_COLUMN = [
    { key: "action", label: "Action", width: ".1fr" },
    { key: "name", label: "Model", width: "2.5fr", align: "start" },
    { key: "code", label: "Level Code", align: "start" },
];
export const BASIC_NODE_COLUMN = [
    { key: "id", label: "#", width: ".1fr" },
    { key: "name", label: "Model", width: "2.5fr", },
    { key: "code", label: "Level Code" },
    { key: "action", label: "Action", width: ".5fr", align: "center" },
];

// { key: "action", label: "Action", width: ".5fr", align: "center" },
export const USER_LIST_COLUMN = [
    { key: "logo", label: "Image", width: ".5fr" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone No.", width: ".8fr" },
    { key: "address", label: "Address", width: "1.5fr" },
    { key: "active", label: "Active", width: ".6fr" },
    { key: "action", label: "Action", width: ".7fr" },
];