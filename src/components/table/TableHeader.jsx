const TableHeader = ({
    columns = [],
    sticky = true,
    className = ""
}) => {
    return (
        <thead>
            <tr
                className={`
                    bg-gray-50 border-b text-sm font-semibold text-gray-600
                    ${sticky ? "sticky top-0 z-10" : ""}
                    ${className}
                `}
            >
                {columns.map((col) => (
                    <th
                        key={col.key}
                        className={`
                            px-3 py-3
                            whitespace-nowrap
                            font-semibold
                            ${col.align === "center" ? "text-center" : ""}
                            ${col.align === "right" ? "text-right" : "text-left"}
                        `}
                    >
                        {col.label}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHeader;