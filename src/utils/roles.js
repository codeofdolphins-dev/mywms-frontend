
/**
 * Multi-dimensional access check.
 *
 * @param {Object} accessRules - Access rules on a nav item / route
 * @param {string[]} [accessRules.roles]          - Allowed role names (OR)
 * @param {string[]} [accessRules.permissions]     - Allowed permission strings (OR)
 * @param {string[]} [accessRules.userTypes]       - Allowed user types — hard block
 * @param {string[]} [accessRules.nodeTypes]       - Allowed node type codes e.g. ["L-111"] (OR)
 * @param {string[]} [accessRules.nodeCategories]  - Allowed node categories e.g. ["partner"] (OR)
 * @param {string[]} [accessRules.departments]     - Allowed departments — hard block
 *
 * @param {Object} ctx - Pre-computed user context from Redux
 * @param {string[]} ctx.userRoles
 * @param {string|string[]} ctx.permissions  - "*" for all access, or array
 * @param {string} ctx.userType
 * @param {string|null} ctx.nodeType          - e.g. "L-111"
 * @param {string|null} ctx.nodeCategory      - e.g. "partner"
 * @param {string|null} ctx.department
 *
 * @returns {boolean}
 */
export const checkAccess = (accessRules, ctx) => {
    if (!accessRules) return true;

    const { userRoles = [], permissions = [], userType, nodeType, nodeCategory, department } = ctx;

    // console.log("accessRules", accessRules)
    // console.log("ctx", ctx)

    // Hard blocks
    if (accessRules.userTypes?.length && !accessRules.userTypes.includes(userType)) return false;
    if (accessRules.departments?.length && department !== "both" && !accessRules.departments.includes(department)) return false;

    // "all access" users pass all soft checks
    if (permissions === "*") return true;

    // Soft matches (OR across categories)
    let anyMatch = false;
    if (accessRules.roles?.length && accessRules.roles.some(r => userRoles.includes(r))) anyMatch = true;
    if (accessRules.nodeTypes?.length && accessRules.nodeTypes.includes(nodeType)) anyMatch = true;
    if (accessRules.nodeCategories?.length && accessRules.nodeCategories.includes(nodeCategory)) anyMatch = true;
    if (accessRules.permissions?.length && !anyMatch) {
        if (Array.isArray(permissions) && accessRules.permissions.some(p => permissions.includes(p))) anyMatch = true;
    }

    const hasSoftRules = (accessRules.roles?.length || 0) + (accessRules.nodeTypes?.length || 0) + (accessRules.nodeCategories?.length || 0) + (accessRules.permissions?.length || 0);
    return hasSoftRules === 0 ? true : anyMatch;
};
