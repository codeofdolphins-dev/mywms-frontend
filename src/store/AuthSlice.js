import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    status: false,
    userData: null,
    // Pre-computed access data
    roles: [],
    permissions: []
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
            state.roles = roles;

            // Flatten permissions
            const hasFullAccess = data?.roles?.some(r => r.permissions === "all access");
            state.permissions = hasFullAccess
                ? "*"
                : [...new Set(data?.roles?.flatMap(r =>
                    Array.isArray(r.permissions)
                        ? r.permissions.map(per =>
                            per.split(":")[0]
                        ) : []
                ) || [])];

        },
        storeLogout: (state) => {
            state.status = false;
            state.userData = null;
            state.roles = [];
            state.permissions = [];
        }
    }
});

export const { storeLogin, storeLogout } = authSlice.actions;
export default authSlice.reducer;
