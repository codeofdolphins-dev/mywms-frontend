import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import OpenForum from "../screens/OpenForum";

const DASHBOARD_BY_ROLE = {
    store_rm: "/production/store/rm",
    store_wip: "/production/store/wip",
    store_fg: "/production/store/fg",
};

/** Used at /production/store index — redirects to role-specific store path */
export const StoreRoute = () => {
    const roles = useSelector(state => state.auth.roles);
    const storeRole = Object.keys(DASHBOARD_BY_ROLE).find(r => roles.includes(r));
    return <Navigate to={DASHBOARD_BY_ROLE[storeRole] ?? "/"} replace />;
};

/** Used at root "/" index — redirects store roles after login, others see OpenForum */
export const HomeRoute = () => {
    const roles = useSelector(state => state.auth.roles);
    const storeRole = Object.keys(DASHBOARD_BY_ROLE).find(r => roles.includes(r));
    if (storeRole) return <Navigate to={DASHBOARD_BY_ROLE[storeRole]} replace />;
    return <OpenForum />;
};