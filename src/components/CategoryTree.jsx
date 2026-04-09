import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';

const CategoryTree = ({
    data = [],
    value = [],
    onChange,
    showSelectAllbtn = false,
    addButtton = false,
    disabled = false,
    buttonOnClick,
    required = false
}) => {

    /* ================= helpers ================= */

    const findParent = (nodes, childId, parent = null) => {
        for (let node of nodes) {
            if (node.id === childId) return parent;
            if (node.subcategories?.length) {
                const found = findParent(node.subcategories, childId, node);
                if (found) return found;
            }
        }
        return null;
    };

    /* ================= expand state ================= */

    const [expanded, setExpanded] = useState({});

    // 🔥 Make all expanded by default
    useEffect(() => {
        const expandAll = (nodes, obj = {}) => {
            nodes.forEach(node => {
                obj[node.id] = true;
                if (node.subcategories?.length) {
                    expandAll(node.subcategories, obj);
                }
            });
            return obj;
        };
        setExpanded(expandAll(data));
    }, [data]);

    const toggleExpand = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    /* ================= TreeNode ================= */

    const TreeNode = ({ node, level = 0 }) => {
        const hasChildren = node.subcategories?.length > 0;
        const isExpanded = expanded[node.id];
        const checked = value.includes(node.id);

        const toggleCheck = () => {
            if (disabled) return;

            // If already selected → clear everything
            if (checked) {
                onChange([]);
                return;
            }

            // If parent category
            if (hasChildren) {
                onChange([node.id]); // only this category
            } else {
                // Subcategory selected
                const parent = findParent(data, node.id);
                if (parent) {
                    onChange([parent.id, node.id]); // parent + subcategory
                } else {
                    onChange([node.id]);
                }
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
                {required && <span className="text-danger">*</span>}
            </div>

            <div className="border rounded-md p-2 h-[200px] overflow-y-auto">
                {data.map((cat) => (
                    <TreeNode
                        key={cat.id}
                        node={cat}
                    />
                ))}
            </div>

            {addButtton &&
                <button
                    type="button"
                    onClick={buttonOnClick}
                    className="btn btn-info text-white flex items-center absolute top-8 right-2 !px-2"
                >
                    <FiPlus size={20} />
                    <span className="ml-1 hidden lg:inline">category</span>
                </button>
            }
        </div>
    );
};

export default CategoryTree;
