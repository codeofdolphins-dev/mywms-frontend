const TableRow = ({
    columns = [],
    row = {},
    index,
    className = "",
    onClick = () => { }
}) => {
    const gridTemplate = columns.map(col => col.width || "1fr").join(" ");

    return (
        <div
            className={`grid border-b text-sm text-gray-700 hover:bg-gray-50 transition relative min-h-12 ${onClick ? "cursor-pointer" : ""} ${className}`}
            style={{ gridTemplateColumns: gridTemplate }}
            onClick={onClick}
        >
            {columns.map((col) => {
                const value = row[col.key];

                return (
                    <div
                        key={col.key}
                        title={value}
                        className={`
                                px-2 py-2 flex items-center min-w-0
                                ${col.align === "center" ? "justify-center text-center" : ""}
                                ${col.align === "right" ? "justify-end text-right" : "justify-start"}
                            `}
                    >
                        <span className="overflow-hidden text-ellipsis block w-full">
                            {value !== undefined && value !== null
                                ? value
                                : <span className="text-gray-400">—</span>
                            }
                        </span>
                    </div>

                );
            })}
        </div>
    );
};

export default TableRow;
