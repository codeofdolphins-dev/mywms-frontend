import React, { useState } from 'react';




const CategoryTree = ({ data, value, onChange }) => {

    function TreeNode({
        node,
        value,
        onChange,
        expanded,
        toggleExpand,
        level = 0,
    }) {
        const hasChildren = node.subcategories?.length > 0;
        const isExpanded = expanded[node.id];
        const checked = value.some((v) => v.id === node.id);

        const toggleCheck = () => {
            if (checked) {
                onChange(value.filter((v) => v.id !== node.id));
            } else {
                onChange([...value, { id: node.id, name: node.name }]);
            }
        };

        return (
            <div>
                <div
                    className="flex items-center gap-2 py-1 text-sm text-gray-800"
                    style={{ paddingLeft: `${level * 16}px` }}
                >
                    {/* expand / collapse */}
                    {hasChildren ? (
                        <button
                            type="button"
                            onClick={() => toggleExpand(node.id)}
                            className="w-4 text-blue-600 font-bold"
                        >
                            {isExpanded ? "−" : "+"}
                        </button>
                    ) : (
                        <span className="w-4" />
                    )}

                    {/* checkbox */}
                    <input
                        id={node.id}
                        type="checkbox"
                        checked={checked}
                        onChange={toggleCheck}
                        className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={node.id}>{node.name}</label>

                    {/* <span>{node.name}</span> */}
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
    }


    const [expanded, setExpanded] = useState({});

    const toggleExpand = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-primary">
                <span>Category</span>
                <span className="text-blue-600">+</span>
            </div>

            <div className="border rounded-md p-2 h-[260px] overflow-y-auto">
                {data?.map((cat) => (
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
        </div>
    );
}

export default CategoryTree;