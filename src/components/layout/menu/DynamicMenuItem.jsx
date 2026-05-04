import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import IconCaretDown from "../../Icon/IconCaretDown";

/**
 * Generic menu item renderer.
 * Handles three shapes:
 *   1. Simple link  (has path, no children) → clickable nav item, navigates on click
 *   2. Dropdown     (has children)          → hover-to-open sub-menu with caret
 *   3. Nested flyout (child has children)   → flyout sub-menu positioned to the right
 *
 * Preserves the exact CSS class structure from the existing menu components.
 */
const DynamicMenuItem = ({ item, location }) => {
    const navigate = useNavigate();
    const Icon = item.icon;

    // ── Simple link item (no children) ──
    if (!item.children) {
        const isActive = item.path === "/"
            ? location.pathname === "/"
            : location.pathname.includes(item.path);

        return (
            <li
                className="menu nav-item relative !ml-0"
                onClick={() => navigate(item.path)}
            >
                <button
                    type="button"
                    className={`nav-link ${isActive ? "active" : ""}`}
                >
                    <div className="flex items-center">
                        {Icon && <Icon className="shrink-0" />}
                        <span className="px-1 whitespace-nowrap">{item.label}</span>
                    </div>
                </button>
            </li>
        );
    }

    // ── Dropdown item (has children) ──
    const activePath = item.basePath || item.path;
    const isParentActive = activePath
        ? location.pathname.includes(activePath)
        : false;

    return (
        <li className="menu nav-item relative !ml-0">
            <button
                type="button"
                className={`nav-link ${isParentActive ? "active" : ""} !cursor-default`}
            >
                <div className="flex items-center">
                    {Icon && <Icon className="shrink-0" />}
                    <span className="px-1 whitespace-nowrap">{item.label}</span>
                </div>
                <div className="right_arrow">
                    <IconCaretDown />
                </div>
            </button>

            <ul className="sub-menu">
                {item.children.map((child, idx) => (
                    <SubMenuItem key={idx} item={child} location={location} />
                ))}
            </ul>
        </li>
    );
};


/**
 * Sub-menu item — handles both flat links and nested flyout menus.
 */
const SubMenuItem = ({ item, location }) => {
    // ── Nested flyout (child has its own children) ──
    if (item.children) {
        const flyoutActive = item.basePath
            ? location.pathname.includes(item.basePath)
            : false;

        return (
            <li className="relative min-w-[210px]">
                <button
                    type="button"
                    className={`nav-link ${flyoutActive ? "active" : ""} !cursor-default`}
                >
                    <span className="px-1 text-black">{item.label}</span>
                    <div className="ml-auto -rotate-90">
                        <IconCaretDown className="text-black" />
                    </div>
                </button>
                <ul className="rounded absolute top-0 left-[95%] min-w-[180px] bg-white z-[10] text-dark dark:text-white-dark dark:bg-[#1b2e4b] shadow p-0 py-2 hidden">
                    {item.children.map((grandChild, idx) => (
                        <li key={idx}>
                            <NavLink
                                to={grandChild.path}
                                end={grandChild.path}
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                {grandChild.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </li>
        );
    }

    // ── Flat sub-menu link ──
    return (
        <li className="relative min-w-[210px]">
            <NavLink
                to={item.path}
                end={item.path}
                className={({ isActive }) => (isActive ? "active" : "")}
            >
                {item.label}
            </NavLink>
        </li>
    );
};

export default DynamicMenuItem;
