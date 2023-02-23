import { createSlice } from "@reduxjs/toolkit";
import { fetchRegister } from "./authActions";

const initialState = {
    loading: false,
    error: null,
    success: false, // for monitoring the registration process.
}

const registerSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchRegister.pending, (state, action) => {
            state.loading = true
            state.error = null
        })
        .addCase(fetchRegister.fulfilled, (state, action) => {
            state.loading = false
            state.success = true // registration successful
            state.error = null
        })
        .addCase(fetchRegister.rejected, (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.payload
        })
    }
    //     // register user 
    //     [fetchRegister.pending]: (state) => {
    //       state.loading = true
    //       state.error = null
    //     },
    //     [fetchRegister.fulfilled]: (state, { payload }) => {
    //       state.loading = false
    //       state.success = true // registration successful
    //     },
    //     [fetchRegister.rejected]: (state, { payload }) => {
    //       state.loading = false
    //       state.error = payload
    //     }
    // }
})


export const registerReducer = registerSlice.reducer