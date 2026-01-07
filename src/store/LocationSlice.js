import { createSlice } from "@reduxjs/toolkit";


const locationSlice = createSlice({
    name: "location",
    initialState: [],
    reducers: {
        storeLocation: (state, action) => {
            return action.payload;
        },
        destoryLocation: (state, action) => {
            return [];
        }
    }
});

export const { storeLocation, destoryLocation } = locationSlice.actions;
export default locationSlice.reducer;