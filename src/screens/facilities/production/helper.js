export const PRODUCTION_ORDER_COLUMN = [
    { key: "no", label: "#", align: "center" },
    { key: "product", label: "Target Product" },
    { key: "items", label: "RM Items", align: "center" },
    { key: "qty", label: "Target Qty", align: "center" },
    { key: "produced_qty", label: "Produced Qty", align: "center" },
    { key: "wasted_qty", label: "Wasted Qty", align: "center" },
    { key: "date", label: "Start Date", align: "center" },
    { key: "completion_date", label: "Completion", align: "center" },
    { key: "part", label: "Part", align: "center" },
    { key: "status", label: "Status", align: "center" },
    { key: "createdBy", label: "Created By", align: "center" },
    { key: "action", label: "Action", align: "center" },
];

export const PRODUCTION_ORDER_ITEM_COLUMN = [
    { key: "sku", label: "Code" },
    { key: "rm_name", label: "Raw Material" },
    { key: "required_qty", label: "Required Qty" }
];

export const PRODUCTION_RECEIPT_COLUMN = [
    { key: "no", label: "#", align: "center", width: "200px" },
    { key: "pro_no", label: "PRO No", align: "center", width: "200px" },
    { key: "batch_no", label: "Batch No" },
    { key: "barcode", label: "Barcode" },
    { key: "product", label: "Product" },
    { key: "qty", label: "Qty", align: "center" },
    { key: "fg_store", label: "To FG Store", align: "center" },
    { key: "mfg_date", label: "MFG Date", align: "center" },
    { key: "status", label: "Status", align: "center" },
    { key: "createdBy", label: "Created By", align: "center" },
    // { key: "action", label: "Action", align: "center", width: "100px" },
];