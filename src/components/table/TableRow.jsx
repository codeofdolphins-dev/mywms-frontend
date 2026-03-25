import { getGridTemplate } from "../../helper/calculateGridTemplate";

const TableRow = ({
    columns = [],
    row = {},
    className = "",
    onClick
}) => {
    const gridTemplate = getGridTemplate(columns);

    return (
        <div
            className={`
                grid border-b text-sm text-gray-700
                hover:bg-gray-50 transition
                min-h-12
                ${onClick ? "cursor-pointer" : ""}
                ${className}
            `}
            style={{
                gridTemplateColumns: gridTemplate,
                // width: "max-content",   // 🔥 key fix
                minWidth: "100%"
            }}
            onClick={onClick}
        >
            {columns.map((col) => {
                const value = row[col.key];

                return (
                    <div
                        key={col.key}
                        className={`
                            px-2 py-2 flex items-start 
                            min-w-0
                            ${col.align === "center" ? "justify-center text-center" : ""}
                            ${col.align === "right" ? "justify-end text-right" : "justify-start"}
                            ${col.textBlur ? "text-gray-400" : ""}
                        `}
                        title={value}
                    >
                        <span className="block w-full break-words">
                            {value ?? <span className="text-gray-400">—</span>}
                        </span>
                    </div>

                );
            })}
        </div>
    );
};


export default TableRow;