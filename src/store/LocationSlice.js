import { createSlice } from "@reduxjs/toolkit";


const locationSlice = createSlice({
    name: "location",
    initialState: [],
    reducers: {
        storeLocation: (state, action) => {
            return action.payload;
        },
        clearLocation: (state, action) => {
            return [];
        }
    }
});

export const { storeLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;