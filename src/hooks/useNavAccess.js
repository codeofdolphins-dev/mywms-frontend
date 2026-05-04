import { useSelector } from "react-redux";
import { useMemo } from "react";
import { checkAccess } from "../utils/roles";

/**
 * Hook that provides access-checking helpers using pre-computed Redux state.
 * Returns canAccess() for individual checks and filterNav() for filtering nav config.
 */
export const useNavAccess = () => {
    const { userRoles, permissions, userType, nodeType, nodeCategory, department } = useSelector(state => state.auth);

    // Build a stable context object
    const ctx = useMemo(() => ({
        userRoles,
        permissions,
        userType,
        nodeType,
        nodeCategory,
        department,
    }), [userRoles, permissions, userType, nodeType, nodeCategory, department]);

    /** Check if the current user can access an item with the given access rules */
    const canAccess = (accessRules) => checkAccess(accessRules, ctx);

    /** Recursively filter a nav config array, keeping only items the user can access */
    const filterNav = (navItems) => {
        return navItems
            .filter(item => canAccess(item.access))
            .map(item => ({
                ...item,
                children: item.children ? filterNav(item.children) : undefined,
            }))
            .filter(item => !item.children || item.children.length > 0);
    };

    return { canAccess, filterNav, ctx };
};
