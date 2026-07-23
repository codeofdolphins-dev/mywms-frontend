export const REQUISITION_COLUMN_NON_MANUFACTURING = [
    { key: "id", label: "#", align: "center" },
    { key: "title", label: "Title" },
    { key: "items", label: "Total Item", align: "center" },
    { key: "status", label: "Status", align: "center" },
    { key: "priority", label: "Priority", align: "center" },
    { key: "notes", label: "Notes" },
    { key: "deadline", label: "Deadline" },
    // { key: "grandTotal", label: "Total" },
    { key: "action", label: "Action", align: "center" },
];

export const REQUISITION_COLUMN_MANUFACTURING = [
    { key: "id", label: "#", align: "center" },
    { key: "title", label: "Title" },
    { key: "name", label: "Product" },
    { key: "status", label: "Status", align: "center" },
    { key: "quotationReceived", label: "Quo. Received", align: "center" },
    { key: "price", label: "Price" },
    { key: "limitType", label: "Price Limit" },
    { key: "priority", label: "Priority", align: "center" },
    { key: "notes", label: "Notes" },
    { key: "deadline", label: "Deadline" },
    // { key: "grandTotal", label: "Total" },
    { key: "action", label: "Action", align: "center" },
];

export const TRADING_REQUISITION_COLUMN = [
    { key: "id", label: "#", align: "center" },
    { key: "title", label: "Title" },
    { key: "items", label: "Total Item", align: "center" },
    { key: "status", label: "Status", align: "center" },
    { key: "priority", label: "Priority", align: "center" },
    { key: "notes", label: "Notes" },
    { key: "deadline", label: "Deadline" },
    { key: "action", label: "Action", align: "center" },
];

export const REQUISITION_RECEIVE_COLUMN = [
    { key: "id", label: "#", align: "center" },
    { key: "title", label: "Title" },
    { key: "sender", label: "Sender" },
    { key: "location", label: "Location" },
    { key: "priority", label: "Priority", align: "center" },
    { key: "status", label: "Status", align: "center" },
    { key: "itemsCount", label: "Total Items", align: "center" },
    { key: "notes", label: "Notes" },
    { key: "action", label: "Action", align: "center" },
];

export const TRADING_DETAILS_ITEM_COLUMN = [
    { key: "sl", label: "#", align: "center" },
    { key: "product", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "barcode", label: "Barcode" },
    { key: "hsn", label: "HSN" },
    { key: "packSize", label: "Pack Size" },
    { key: "mrp", label: "MRP", align: "right" },
    { key: "qty", label: "Req. Qty", align: "center" },
];

export const TRADING_RECEIVE_COLUMN = [
    { key: "id", label: "#", align: "center" },
    { key: "title", label: "Title" },
    { key: "sender", label: "Sender" },
    { key: "connectionType", label: "Connection", align: "center" },
    { key: "priority", label: "Priority", align: "center" },
    { key: "status", label: "Status", align: "center" },
    { key: "itemsCount", label: "Total Items", align: "center" },
    { key: "deadline", label: "Deadline" },
    { key: "notes", label: "Notes" },
    { key: "action", label: "Action", align: "center" },
];
