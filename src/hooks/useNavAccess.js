import { useSelector } from "react-redux";
import { useMemo } from "react";
import { checkAccess } from "../utils/roles";

export const useNavAccess = () => {
    const { roles, permissions } = useSelector(state => state.auth);

    const filterNav = (navConfig) => {
        const allowedNavItems = [];

        for (const item of navConfig) {
            const hasRoleAccess = item.allowedRoles && item.allowedRoles.some(role => roles.includes(role));

            const hasPermissionAccess = item.key === "open-forum" ? true : permissions.includes(item.key);

            // If either condition is true, the user has access to this item
            let isAuthorized = hasRoleAccess || hasPermissionAccess;

            // Clone the item so we don't mutate the original configuration
            const clonedItem = { ...item };

            // --- LOGIC 3: Process Children ---
            if (clonedItem.children) {
                // Recursively check children
                const children = filterNav(clonedItem.children);

                // Magic rule: If the user doesn't have direct access to the parent, 
                // but DOES have access to a child, show the parent anyway!
                if (children.length > 0) {
                    isAuthorized = true;
                }
            }

            // If authorized, add it to our final navigation list
            if (isAuthorized) {
                // Optional cleanup: If it's a dropdown menu but has no children left, don't show it
                // if (item.children && clonedItem.children.length === 0 && !hasRoleAccess) {
                //     continue;
                // }
                allowedNavItems.push(clonedItem);
            }
        }

        return allowedNavItems;
    }


    /** Recursively filter a nav config array, keeping only items the user can access */
    // const filterNav = (navItems) => {
    //     return navItems
    //         .filter(item => canAccess(item.access))
    //         .map(item => ({
    //             ...item,
    //             children: item.children ? filterNav(item.children) : undefined,
    //         }))
    //         .filter(item => !item.children || item.children.length > 0);
    // };

    return { filterNav };
};
