import { getGridTemplate } from "../../helper/calculateGridTemplate";
// const TableHeader = ({
//     columns = [],
//     sticky = true,
//     className = "",
//     onClick = () => {}
// }) => {
//     // const gridTemplate = columns.map(col => col.width || "1fr").join(" ");
//     const gridTemplate = columns.map(col => col.width ? col.width : "minmax(0, 1fr)").join(" ");


//     return (
//         <div
//             className={`grid bg-gray-50 border-b text-sm font-semibold text-gray-700 ${sticky ? "sticky top-0" : ""} ${className}`}
//             style={{ gridTemplateColumns: gridTemplate }}
//             onClick={onClick}
//         >
//             {columns.map((col) => (
//                 <div
//                     key={col.key}
//                     className={`px-3 py-2 flex items-center whitespace-nowrap ${col.align === "center" ? "justify-center text-center" : ""} ${col.align === "right" ? "justify-end text-right" : "justify-start"} `}
//                 >
//                     {col.label}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default TableHeader;

const TableHeader = ({
    columns = [],
    sticky = true,
    className = ""
}) => {
    const gridTemplate = getGridTemplate(columns);

    return (
        <div
            className={`
                grid bg-gray-50 border-b text-sm font-semibold text-gray-700
                ${sticky ? "sticky top-0 z-10" : ""}
            `}
            style={{
                gridTemplateColumns: gridTemplate,
                width: "max-content",   // 🔥 allow overflow
                minWidth: "100%"
            }}
        >
            {columns.map((col) => (
                <div
                    key={col.key}
                    className={`
                        px-3 py-2 flex items-center
                        min-w-0                 // 🔥 important
                        whitespace-nowrap
                        ${col.align === "center" ? "justify-center text-center" : ""}
                        ${col.align === "right" ? "justify-end text-right" : "justify-start"}
                    `}
                >
                    {col.label}
                </div>

            ))}
        </div>
    );
};


export default TableHeader;