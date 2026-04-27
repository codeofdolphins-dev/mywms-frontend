const TableRow = ({
    columns = [],
    row = {},
    className = "",
    onClick
}) => {
    return (
        <tr
            className={`
                border-b text-sm text-gray-700
                hover:bg-gray-50 transition-colors
                ${onClick ? "cursor-pointer" : ""}
                ${className}
            `}
            onClick={onClick}
        >
            {columns.map((col) => {
                const value = row[col.key];

                return (
                    <td
                        key={col.key}
                        className={`
                            px-3 py-3
                            align-top
                            ${col.align === "center" ? "text-center" : ""}
                            ${col.align === "right" ? "text-right" : "text-left"}
                            ${col.textBlur ? "text-gray-400" : ""}
                        `}
                    >
                        {value ?? <span className="text-gray-400">—</span>}
                    </td>
                );
            })}
        </tr>
    );
};

export default TableRow;