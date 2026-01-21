const TableHeader = ({
    columns = [],
    sticky = true,
    className = "",
    onClick = () => {}
}) => {
    const gridTemplate = columns.map(col => col.width || "1fr").join(" ");

    return (
        <div
            className={`grid bg-gray-50 border-b text-sm font-semibold text-gray-700 ${sticky ? "sticky top-0" : ""} ${className}`}
            style={{ gridTemplateColumns: gridTemplate }}
            onClick={onClick}
        >
            {columns.map((col) => (
                <div
                    key={col.key}
                    className={`px-3 py-2 flex items-center ${col.align === "center" ? "justify-center text-center" : ""} ${col.align === "right" ? "justify-end text-right" : "justify-start"} `}
                >
                    {col.label}
                </div>
            ))}
        </div>
    );
};

export default TableHeader;
