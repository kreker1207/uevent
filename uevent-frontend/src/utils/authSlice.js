import { createSlice } from "@reduxjs/toolkit";
import { fetchLogin } from "./authActions";

const initialState = {
    loading: false,
    userInfo: {}, // for user object
    userToken: null, // for storing the JWT
    error: null,
    success: false, // for monitoring the registration process.
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: {
        // login user
        [fetchLogin.pending]: (state) => {
          state.loading = true
          state.error = null
        },
        [fetchLogin.fulfilled]: (state, { payload }) => {
          state.loading = false
          state.userInfo = payload
          state.userToken = payload.userToken
        },
        [fetchLogin.rejected]: (state, { payload }) => {
          state.loading = false
          state.error = payload
        }
    }
})

export const authReducer = authSlice.reducer