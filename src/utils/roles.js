export const hasRoleAccess = (allowedRoles, userRoles) =>
    allowedRoles.some(r => userRoles?.includes(r));

export const hasNodeAccess = (allowedNodes, node) =>
    allowedNodes?.includes(node);
