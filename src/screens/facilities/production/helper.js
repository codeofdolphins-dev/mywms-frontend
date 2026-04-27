export const PRODUCTION_ORDER_COLUMN = [
    { key: "no", label: "#", align: "center", width: "160px" },
    { key: "product", label: "Target Product" },
    { key: "qty", label: "Target Qty", align: "center", width: "100px" },
    { key: "produced_qty", label: "Produced Qty", align: "center", width: "110px" },
    { key: "items", label: "RM Items", align: "center", width: "90px" },
    { key: "date", label: "Start Date", align: "center", width: "110px" },
    { key: "completion_date", label: "Completion", align: "center", width: "110px" },
    { key: "status", label: "Status", align: "center", width: "120px" },
    { key: "createdBy", label: "Created By", align: "center" },
    { key: "action", label: "Action", align: "center", width: "100px" },
];

export const PRODUCTION_ORDER_ITEM_COLUMN = [
    { key: "sku", label: "Code" },
    { key: "rm_name", label: "Raw Material" },
    { key: "required_qty", label: "Required Qty" }
];

export const PRODUCTION_RECEIPT_COLUMN = [
    { key: "no", label: "#", align: "center", width: "160px" },
    { key: "barcode", label: "Barcode" },
    { key: "product", label: "Product" },
    { key: "qty", label: "Qty", align: "center", width: "100px" },
    { key: "fg_store", label: "To FG Store", align: "center" },
    { key: "mfg_date", label: "MFG Date", align: "center", width: "110px" },
    { key: "status", label: "Status", align: "center", width: "120px" },
    { key: "createdBy", label: "Created By", align: "center" },
    // { key: "action", label: "Action", align: "center", width: "100px" },
];