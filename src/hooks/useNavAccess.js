import { useSelector } from "react-redux";
import { useMemo } from "react";
import { checkAccess } from "../utils/roles";
import business from "../Backend/business.fetch";

export const useNavAccess = () => {
    const { roles, permissions } = useSelector(state => state.auth);

    /** node categories this tenant actually has registered (manufacturing, warehouse, partner...) */
    const { data: nodeCount, isError: nodeCountFailed } = business.TQRegisteredNodeCount();

    const availableCategories = useMemo(() => new Set(
        (nodeCount?.data || [])
            .filter(item => Number(item.count) > 0)
            .map(item => item.category)
    ), [nodeCount]);

    /** a route is useless without the node it operates on.
     *  if the lookup itself failed, keep it rather than breaking navigation */
    const isNodeGated = (item) =>
        !nodeCountFailed && item.requiredNodeCategory && !availableCategories.has(item.requiredNodeCategory);

    /** drop node-gated entries at any depth, leaving every other access rule untouched */
    const stripNodeGated = (items = []) =>
        items
            .filter(item => !isNodeGated(item))
            .map(item => item.children ? { ...item, children: stripNodeGated(item.children) } : item);

    const filterNav = (navConfig) => {
        const allowedNavItems = [];

        for (const item of navConfig) {

            if (isNodeGated(item)) continue;

            const hasRoleAccess = item.allowedRoles && item.allowedRoles.some(role => roles.includes(role));

            // const hasPermissionAccess = item.key === "open-forum" ? true : permissions.includes(item.key);
            const hasPermissionAccess = permissions.includes(item.key);

            /** If either condition is true, the user has access to this item */
            let isAuthorized = hasRoleAccess || hasPermissionAccess;

            /** Clone the item so we don't mutate the original configuration */
            const clonedItem = { ...item };

            /** --- LOGIC 3: Process Children --- */
            if (clonedItem?.children) {
                /** Recursively check children */
                const children = filterNav(clonedItem.children);

                /** Magic rule: If the user doesn't have direct access to the parent, but DOES have access to a child, show the parent anyway! */
                if (children.length > 0) {
                    isAuthorized = true;
                }

                /**
                 * Children normally render unfiltered by design (see NAVIGATION.md §4c): most
                 * declare no allowedRoles and would vanish for full-access users, emptying the menu.
                 * A group whose children EVERY declare their own allowedRoles is opting in to real
                 * per-child filtering — e.g. "Entry", where Inward and Outward are role specific.
                 */
                const childrenSelfGated = clonedItem.children.every(child => child.allowedRoles?.length);

                clonedItem.children = childrenSelfGated
                    ? stripNodeGated(children)
                    : stripNodeGated(clonedItem.children);

                /** a dropdown whose entries are all filtered or node-gated has nothing left to show */
                if (clonedItem.children.length === 0) continue;
            }

            /** If authorized, add it to our final navigation list */
            if (isAuthorized) {
                /** Optional cleanup: If it's a dropdown menu but has no children left, don't show it */
                // if (item.children && clonedItem.children.length === 0 && !hasRoleAccess) {
                //      continue;
                // }
                allowedNavItems.push(clonedItem);
            }
        };
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
