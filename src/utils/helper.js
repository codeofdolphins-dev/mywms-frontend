export const PERMISSION_COL = [
    { key: "id", label: "SL" },
    { key: "permission", label: "Name" },
]
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
]

// {
//     id: "5",
//         qno: "QT-FUEL-778",
//             supplier: {
//         id: 1,
//             name: "Prepare invoice",
//         },
//     status: "pending",
//         notes: "New stock arrival from supplier",
//             total: 7800
// }

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
]