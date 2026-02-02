import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

const CategoryTree = ({
    data = [],
    value = [],
    onChange,
    showSelectAllbtn = false,
    addButtton = false,
    disabled = false,
    buttonOnClick
}) => {

    /* ================= helpers ================= */

    // get all descendant ids of a node
    const getAllChildIds = (node) => {
        let ids = [];
        if (node.subcategories?.length) {
            node.subcategories.forEach((child) => {
                ids.push(child.id);
                ids = ids.concat(getAllChildIds(child));
            });
        }
        return ids;
    };

    // check if all children are selected
    const areAllChildrenChecked = (node, value) => {
        const childIds = getAllChildIds(node);
        return childIds.length > 0 && childIds.every((id) => value.includes(id));
    };

    // get ALL ids from tree (for Select All)
    const getAllIds = (nodes = []) => {
        let ids = [];
        nodes.forEach((node) => {
            ids.push(node.id);
            if (node.subcategories?.length) {
                ids = ids.concat(getAllIds(node.subcategories));
            }
        });
        return ids;
    };

    /* ================= expand state ================= */

    const [expanded, setExpanded] = useState({});

    const toggleExpand = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    /* ================= select all ================= */

    const allIds = getAllIds(data);
    const isAllSelected =
        allIds.length > 0 && allIds.every((id) => value.includes(id));

    const toggleSelectAll = () => {
        if (isAllSelected) {
            onChange([]);
        } else {
            onChange(allIds);
        }
    };

    /* ================= TreeNode ================= */

    const TreeNode = ({
        node,
        value,
        onChange,
        expanded,
        toggleExpand,
        level = 0,
    }) => {
        const hasChildren = node.subcategories?.length > 0;
        const isExpanded = expanded[node.id];

        const checked =
            value.includes(node.id) ||
            (hasChildren && areAllChildrenChecked(node, value));

        const toggleCheck = () => {
            if (disabled) return;
            const childIds = getAllChildIds(node);

            if (checked) {
                // uncheck parent → remove parent + all children
                onChange(
                    value.filter(
                        (v) => v !== node.id && !childIds.includes(v)
                    )
                );
            } else {
                // check parent → add parent + all children
                onChange([...new Set([...value, node.id, ...childIds])]);
            }
        };

        return (
            <div>
                <div
                    className="flex items-center gap-2 py-1 text-sm text-gray-800"
                    style={{ paddingLeft: `${level * 16}px` }}
                >
                    {hasChildren ? (
                        <button
                            type="button"
                            onClick={() => toggleExpand(node.id)}
                            className="w-4 text-blue-600 font-bold"
                        >
                            {isExpanded ? '−' : '+'}
                        </button>
                    ) : (
                        <span className="w-4" />
                    )}

                    <input
                        id={`cat-${node.id}`}
                        type="checkbox"
                        checked={checked}
                        onChange={toggleCheck}
                        className="h-4 w-4 rounded border-gray-300"
                        disabled={disabled}
                    />
                    <label
                        htmlFor={`cat-${node.id}`}
                        className="cursor-pointer mb-0"
                    >
                        {node.name}
                    </label>
                </div>

                {isExpanded &&
                    hasChildren &&
                    node.subcategories.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            value={value}
                            onChange={onChange}
                            expanded={expanded}
                            toggleExpand={toggleExpand}
                            level={level + 1}
                        />
                    ))}
            </div>
        );
    };

    /* ================= render ================= */

    return (
        <div className="w-full relative">
            <div className="flex items-center mb-1 text-gray-700 text-sm font-semibold">
                <span>Category</span>
                <span className="text-danger">*</span>
            </div>

            <div
                className={`border rounded-md p-2 h-[200px] overflow-y-auto`}
            >
                {/* Select All */}
                {showSelectAllbtn &&
                    <div className="flex items-center gap-2 pb-2 mb-2">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Select All
                        </span>
                    </div>
                }

                {data.map((cat) => (
                    <TreeNode
                        key={cat.id}
                        node={cat}
                        value={value}
                        onChange={onChange}
                        expanded={expanded}
                        toggleExpand={toggleExpand}
                    />
                ))}
            </div>

            {
                addButtton &&
                <button
                    type="button"
                    onClick={buttonOnClick}
                    className="btn btn-info text-white flex items-center absolute top-8 right-2 !px-2"
                >
                    <FiPlus size={20} />
                    <span className="ml-1">category</span>
                </button>
            }
        </div>
    );
};

export default CategoryTree;
