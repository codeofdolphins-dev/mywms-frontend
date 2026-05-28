export const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
export const SAMPLE_IMAGE1 = "/assets/images/user-profile.jpeg";
export const SAMPLE_IMAGE2 = "/assets/images/profile-34.jpeg";
export const SAMPLE_IMAGE3 = "/assets/images/product-camera.jpg";

export const WAREHOUSE_COLUMN = [
    { key: "id", label: "#" },
    { key: "permission", label: "Name" },
];

export const PERMISSION_COL = [
    { key: "id", label: "#" },
    { key: "permission", label: "Name" },
];



export const REQUISITION_CREATE_COLUMN = [
    { key: "barcode", label: "Barcode" },
    { key: "product", label: "Name" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "subCategory", label: "Sub Category" },
    { key: "packSize", label: "Pack Size" },
    { key: "reqQty", label: "Req Qty." },
    // { key: "priceLimit", label: "Price Limit" },
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

export const REQUISITION_CREATE_RAW_COLUMN_ACTION = [
    { key: "name", label: "Name" },
    { key: "sku", label: "Code / SKU" },
    { key: "uom", label: "Masure Unit" },
    { key: "reqQty", label: "Req Qty." },
    { key: "priceLimit", label: "Price Limit" },
    { key: "action", label: "Action", align: "center" }
];

export const REQUISITION_ITEMS_COLUMN = [
    { key: "id", label: "#", width: "0.3fr" },
    { key: "barcode", label: "Barcode" },
    { key: "productName", label: "Product Name" },
    { key: "productType", label: "Product Type" },
    { key: "qty", label: "QTY" },
];


export const QUOTATION_COLUMN = [
    { key: "qno", label: "#", align: "center" },
    { key: "name", label: "Buyer Name", align: "center" },
    { key: "status", label: "Status", align: "center" },
    { key: "notes", label: "Notes", align: "center" },
    { key: "grandTotal", label: "Total", align: "center" },
    { key: "validity", label: "Validity", align: "center" },
    { key: "action", label: "Action", align: "center" },
];
export const EXTERNAL_QUOTATION_COLUMN = [
    { key: "qno", label: "#", align: "center" },
    { key: "name", label: "Buyer Name", align: "center" },
    { key: "status", label: "Status", align: "center" },
    { key: "grandTotal", label: "Total", align: "center" },
    { key: "validity", label: "Validity", align: "center" },
    { key: "revision", label: "Revision", align: "center" },
    { key: "action", label: "Action", align: "center" },
];

export const QUOTATION_RECEIVE_COLUMN = [
    { key: "barcode", label: "Barcode", textBlur: true },
    { key: "product", label: "Product Name", textBlur: true },
    { key: "brand", label: "Brand", textBlur: true },
    { key: "category", label: "Category", textBlur: true },
    { key: "subCategory", label: "Sub Category", textBlur: true },
    { key: "qty", label: "QTY", textBlur: true },
    { key: "priceLimit", label: "Price Limit", textBlur: true },
    { key: "offerPrice", label: "Offer Price", },
    // { key: "tax", label: "TAX %" },
    { key: "total", label: "Total", },
];

export const QUOTATION_RECEIVE_RAW_COLUMN = [
    { key: "name", label: "Product Name", textBlur: true },
    { key: "uom", label: "UOM", textBlur: true },
    { key: "qty", label: "QTY", textBlur: true },
    { key: "priceLimit", label: "Price Limit", textBlur: true },
    { key: "offerPrice", label: "Offer Price", },
    { key: "total", label: "Total", }
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


export const ORDER = [
    { key: "barcode", label: "Barcode", width: "150px" },
    { key: "product", label: "Product" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "subCategory", label: "Sub Category" },
    { key: "packSize", label: "Pack Size" },
    { key: "qty", label: "Qty" },
    // { key: "tax", label: "Tax %" },
    { key: "unitPrice", label: "Unit Price" },
    { key: "total", label: "Total" },
];
export const ORDER_RAW = [
    { key: "product", label: "Product" },
    { key: "sku", label: "Code / SKU" },
    { key: "uom", label: "Masure Unit" },
    { key: "qty", label: "Qty" },
    { key: "unitPrice", label: "Unit Price" },
    { key: "total", label: "Total" },
];


export const BPO_COLUMN = [
    { key: "slno", label: "SL.NO", align: "center" },
    { key: "id", label: "#", align: "center" },
    { key: "createdAt", label: "Creation Date" },
    { key: "partner", label: "Business Partner" },
    { key: "name", label: "Item Name" },
    { key: "remQty", label: "Remaining Qty.", align: "center" },
    { key: "status", label: "Status" },
    { key: "valid_until", label: "Validity" },
    { key: "action", label: "Action", align: "center" },
];


export const SUPPLIER_COLUMN = [
    { key: "id", label: "#" },
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
    { key: "action", label: "Action", width: "50px" },
    { key: "name", label: "Model" },
    { key: "code", label: "Level Code", width: "120px", align: "center" },
];
export const BASIC_NODE_COLUMN = [
    { key: "id", label: "#", width: "50px" },
    { key: "name", label: "Model", },
    { key: "code", label: "Level Code" },
    { key: "action", label: "Action", width: "50px", align: "center" },
];

export const USER_LIST_COLUMN = [
    { key: "logo", label: "Image", width: "100px" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone No." },
    { key: "active", label: "Active" },
    { key: "action", label: "Action" },
];

export const SUPER_ADMIN_BROWSE_COLUMN = [
    { key: "name", label: "Company Name" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
    { key: "phone", label: "Phone No." },
    { key: "joiningDate", label: "Joining Date" },
    { key: "status", label: "Status", width: "150px", align: "center" },
    { key: "action", label: "Action", align: "center" },
];

export const VENDOR_LIST_COLUMN = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "cName", label: "Company Name" },
    { key: "phone", label: "Phone No." },
    { key: "gst", label: "GST No." },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
]

export const VENDOR_CATEGORY_LIST_COLUMN = [
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
    { key: "desc", label: "Desc" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
]

export const STORE_LIST_COLUMN = [
    { key: "name", label: "Name", width: "200px" },
    { key: "location", label: "Location" },
    { key: "category", label: "Category" },
    { key: "linked", label: "Linked(WH) - Location", width: "200px" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
]

export const PRODUCT_COLUMN = [
    { key: "barcode", label: "Barcode" },
    { key: "product", label: "Name" },
    { key: "sku", label: "sku" },
    { key: "packSize", label: "Pack Size" },
    { key: "reqQty", label: "Req Qty." },
    { key: "price", label: "Price" },
];

export const TRANSFER_ORDER_RAW_PRODUCT_COLUMN = [
    { key: "name", label: "Name" },
    { key: "sku", label: "sku" },
    { key: "packSize", label: "Pack Size" },
    { key: "reqQty", label: "Req Qty." },
];



export const RM_INVENTORY_COLUMN = [
    { key: "barcode", label: "Barcode" },
    { key: "product", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    // { key: "totalQty", label: "Total Qty", align: "center" },
    { key: "availableQty", label: "Available", align: "center" },
    // { key: "reservedQty", label: "Reserved", align: "center" },
    { key: "reorderLevel", label: "Reorder Lvl", align: "center" },
    { key: "stockStatus", label: "Status", align: "center" },
    // { key: "unitPrice", label: "Unit Price", align: "right" },
    // { key: "stockValue", label: "Stock Value", align: "right" },
    { key: "action", label: "", align: "center", width: "60px" },
];

export const RM_INVENTORY_BATCH_COLUMN = [
    { key: "batchNo", label: "Batch / Lot #" },
    { key: "qty", label: "Qty", align: "center" },
    // { key: "unitPrice", label: "Unit Price", align: "right" },
    { key: "mfgDate", label: "Mfg. Date" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "daysToExpiry", label: "Days Left", align: "center" },
    { key: "grnRef", label: "GRN Ref" },
    { key: "batchStatus", label: "Status", align: "center" },
];

export const LOCATION_LIST_COLUMN = [
    { key: "name", label: "Name", width: "200px" },
    { key: "location", label: "Location" },
    { key: "type", label: "Type", width: "200px" },
    { key: "category", label: "Category", width: "150px" },
    { key: "address", label: "State/District", width: "150px" },
    { key: "gst", label: "GST No" },
    { key: "license", label: "License No" },
    { key: "action", label: "Action", align: "center", width: "80px" },
];


export const INVENTORY_COLUMN = [
    { key: "product", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    { key: "subCategory", label: "Sub Category" },
    { key: "product_type", label: "Type" },
    { key: "location", label: "Location" },
    { key: "totalQty", label: "Total Qty", align: "center" },
    { key: "availableQty", label: "Available", align: "center" },
    { key: "reservedQty", label: "Reserved", align: "center" },
    { key: "reorderLevel", label: "Reorder Lvl", align: "center" },
    { key: "stockStatus", label: "Status", align: "center" },
    { key: "unitPrice", label: "Unit Price", align: "right" },
    { key: "stockValue", label: "Stock Value", align: "right" },
    { key: "action", label: "", align: "center", width: "60px" },
];

export const INVENTORY_BATCH_COLUMN = [
    { key: "batchNo", label: "Batch / Lot #" },
    { key: "qty", label: "Qty", align: "center" },
    { key: "mfgDate", label: "Mfg. Date" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "daysToExpiry", label: "Days Left", align: "center" },
    { key: "grnRef", label: "GRN Ref" },
    { key: "storageLocation", label: "Zone / Bin" },
    { key: "batchStatus", label: "Status", align: "center" },
];