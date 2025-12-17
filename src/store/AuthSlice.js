import { createSlice } from "@reduxjs/toolkit";



const initialValue = {
    status: false,
    userData: null
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialValue,
    reducers: {
        storeLogin: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
        },
        storeLogout: (state, action) => {
            state.status = false;
            state.userData = null;
        }
    }
});

export const { storeLogin, storeLogout } = authSlice.actions;
export default authSlice.reducer;