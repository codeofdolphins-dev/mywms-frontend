import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./AuthSlice.js";
import locationSlice from "./LocationSlice.js";


const store = configureStore({
    reducer: {
        auth: authSlice,
        location: locationSlice
    }
})

export default store;