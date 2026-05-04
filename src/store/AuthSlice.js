import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    status: false,
    userData: null,
    // Pre-computed access data
    userRoles: [],
    permissions: [],
    userType: null,
    nodeType: null,        // e.g. "L-111"
    nodeCategory: null,    // e.g. "partner", "warehouse", "manufacturing", "retail"
    department: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialValue,
    reducers: {
        storeLogin: (state, action) => {
            const data = action.payload;
            state.status = true;
            state.userData = data;

            // Pre-compute roles
            const roles = data?.roles?.map(r => r.role) || [];
            state.userRoles = roles;

            // Flatten permissions
            const hasFullAccess = data?.roles?.some(r => r.permissions === "all access");
            state.permissions = hasFullAccess
                ? "*"
                : data?.roles?.flatMap(r => Array.isArray(r.permissions) ? r.permissions : []) || [];

            // User & node context
            state.userType = data?.type || null;
            state.nodeType = data?.activeNode?.type?.code || null;
            state.nodeCategory = data?.activeNode?.type?.category || null;
            state.department = data?.activeNode?.NodeUser?.department || null;
        },
        storeLogout: (state) => {
            state.status = false;
            state.userData = null;
            state.userRoles = [];
            state.permissions = [];
            state.userType = null;
            state.nodeType = null;
            state.nodeCategory = null;
            state.department = null;
        }
    }
});

export const { storeLogin, storeLogout } = authSlice.actions;
export default authSlice.reducer;