import React from "react";
import clsx from "clsx";

/**
 * @param {Array} columns - Column configuration
 * @param {Function} onSort - Optional sort handler
 * @param {Object} sortState - { key: string, direction: 'asc' | 'desc' }
 */
const TableHeader = ({
    columns = [],
    onSort,
    sortState,
    className = "",
}) => {
    // Build grid template columns dynamically
    const gridTemplateColumns = columns
        .map(col => col.width || "1fr")
        .join(" ");

    return (
        <div
            className={clsx(
                "grid items-center border-b bg-gray-100 text-sm font-semibold text-gray-700",
                className
            )}
            style={{ gridTemplateColumns }}
        >
            {columns.map(col => {
                const isSortable = !!onSort && col.sortKey;
                const isActiveSort = sortState?.key === col.sortKey;

                return (
                    <div
                        key={col.key}
                        className={clsx(
                            "px-4 py-3 flex items-center gap-2 select-none",
                            col.align === "center" && "justify-center text-center",
                            col.align === "right" && "justify-end text-right",
                            isSortable && "cursor-pointer hover:text-gray-900"
                        )}
                        onClick={() => isSortable && onSort(col.sortKey)}
                    >
                        <span>{col.label}</span>

                        {isSortable && (
                            <span className="text-xs">
                                {isActiveSort
                                    ? sortState.direction === "asc"
                                        ? "▲"
                                        : "▼"
                                    : "⇅"}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default TableHeader;