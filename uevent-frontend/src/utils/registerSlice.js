import { createSlice } from "@reduxjs/toolkit";
import { fetchRegister } from "./authActions";

const initialState = {
    loading: false,
    userInfo: {}, // for user object
    userToken: null, // for storing the JWT
    error: null,
    success: false, // for monitoring the registration process.
}

const registerSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: {
        // register user 
        [fetchRegister.pending]: (state) => {
          state.loading = true
          state.error = null
        },
        [fetchRegister.fulfilled]: (state, { payload }) => {
          state.loading = false
          state.success = true // registration successful
        },
        [fetchRegister.rejected]: (state, { payload }) => {
          state.loading = false
          state.error = payload
        }
    }
})


export const registerReducer = registerSlice.reducer