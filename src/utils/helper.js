export const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
export const SAMPLE_IMAGE1 = "/assets/images/user-profile.jpeg";
export const SAMPLE_IMAGE2 = "/assets/images/profile-34.jpeg";

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
    { key: "barcode", label: "Barcode" },
    { key: "product", label: "Name" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "subCategory", label: "Sub Category" },
    { key: "packSize", label: "Pack Size" },
    { key: "reqQty", label: "Req Qty." },
    { key: "priceLimit", label: "Price Limit" },
];
export const REQUISITION_CREATE_COLUMN_ACTION = [
    { key: "barcode", label: "Barcode" },
    { key: "product", label: "Name" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "subCategory", label: "Sub Category" },
    { key: "packSize", label: "Pack Size" },
    { key: "reqQty", label: "Req Qty." },
    { key: "priceLimit", label: "Price Limit" },
    { key: "action", label: "Action", align: "center" }
];

export const REQUISITION_COLUMN = [
    {
        key: "id",
        label: "#",
        align: "center"
    },
    {
        key: "title",
        label: "Title",
    },
    {
        key: "status",
        label: "Status",
        align: "center"
    },
    {
        key: "priority",
        label: "Priority",
        align: "center"
    },
    {
        key: "notes",
        label: "Notes",
        align: "center"
    },
    {
        key: "grandTotal",
        label: "Total",
    },
    {
        key: "action",
        label: "Action",
        align: "center"
    },
];

export const REQUISITION_ITEMS_COLUMN = [
    {
        key: "id",
        label: "#",
        width: "0.3fr",
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
        key: "productType",
        label: "Product Type",
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
        key: "qno",
        label: "#",
        align: "center"
    },
    {
        key: "name",
        label: "Supplier Name",
        align: "center"
    },
    {
        key: "status",
        label: "Status",
        align: "center"
    },
    {
        key: "notes",
        label: "Notes",
        align: "center"
    },
    {
        key: "grandTotal",
        label: "Total",
        align: "center"
    },
    {
        key: "validity",
        label: "Validity",
        align: "center"
    },
    {
        key: "action",
        label: "Action",
        align: "center"
    },
];

export const QUOTATION_RECEIVE_COLUMN = [
    {
        key: "barcode",
        label: "Barcode",
        textBlur: true
    },
    {
        key: "product",
        label: "Product Name",
        textBlur: true
    },
    {
        key: "brand",
        label: "Brand",
        textBlur: true
    },
    {
        key: "category",
        label: "Category",
        textBlur: true
    },
    {
        key: "subCategory",
        label: "Sub Category",
        textBlur: true
    },
    {
        key: "qty",
        label: "QTY",
        textBlur: true
    },
    {
        key: "priceLimit",
        label: "Price Limit",
        textBlur: true
    },
    {
        key: "offerPrice",
        label: "Offer Price",
    },
    {
        key: "tax",
        label: "TAX %",
    },
    {
        key: "total",
        label: "Total",
    },
];




export const REQUISITION_RECEIVE_COLUMN = [
    {
        key: "id", label: "#",
        // width: "0.5fr",
        align: "center"
    },
    { key: "title", label: "Title" },
    { key: "sender", label: "Sender" },
    { key: "priority", label: "Priority", align: "center" },
    { key: "status", label: "Status", align: "center" },
    { key: "itemsCount", label: "Total Items", align: "center" },
    { key: "action", label: "Action", align: "center" },
];

export const REQUISITION_RECEIVE_DETAILS_COLUMN = [
    { key: "barcode", label: "Barcode" },
    { key: "product", label: "Name" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "subCategory", label: "Sub Category" },
    { key: "packSize", label: "Pack Size" },
    { key: "reqQty", label: "Req Qty." },

    { key: "unit_price", label: "Unit Price" },
    { key: "tax_percent", label: "Tax Percent" },
    { key: "total_price", label: "Total Price" },
    { key: "note", label: "Note" },
];




export const PURCHASE_ORDER = [
    { key: "id", label: "#" },
    { key: "pr_id", label: "PR id" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
    { key: "expected_delivery_date", label: "Expected Delivary Date" },
    { key: "note", label: "Note" },
    { key: "created_by", label: "Created By" },
    { key: "total_amount", label: "Total Amount" },
    { key: "action", label: "Action" },
];

export const SUPPLIER_COLUMN = [
    // { key: "id", label: "#" },
    { key: "email", label: "Email" },
    { key: "full_name", label: "Name" },
    { key: "phone_no", label: "Phone" },
    { key: "is_active", label: "Status" },
    { key: "address", label: "Address" },
    { key: "action", label: "Action" }
];

export const BRAND_COLUMN = [
    // { key: "id", label: "#", width: "40px" },
    { key: "logo", label: "Logo", width: "80px" },
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

export const USER_LIST_COLUMN = [
    { key: "logo", label: "Image", width: "100px" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone No." },
    { key: "active", label: "Active" },
    { key: "action", label: "Action" },
];