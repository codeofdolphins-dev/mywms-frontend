export const hasRole = (allowedRoles, userRoles) =>
    allowedRoles.some(r => userRoles?.includes(r));
