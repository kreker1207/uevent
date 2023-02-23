import { createSlice } from "@reduxjs/toolkit";
import { fetchLogin, fetchLogout } from "./authActions";

const userToken = localStorage.getItem('accessToken')
  ? localStorage.getItem('accessToken')
  : null

const initialState = {
    loading: false,
    userInfo: {}, // for user object
    userToken, // for storing the JWT
    error: null,
    success: false, // for monitoring the registration process.
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // login user
        builder
        .addCase(fetchLogin.pending, (state, action) => {
            state.loading = true
            state.error = null
        })
        .addCase(fetchLogin.fulfilled, (state, action) => {
            state.loading = false
            state.userInfo = action.payload
            state.userToken = action.payload.userToken
            state.success = true
            state.error = null
        })
        .addCase(fetchLogin.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.success = false
        })
        .addCase(fetchLogout.pending, (state, action) => {
            state.loading = true
        })
        .addCase(fetchLogout.fulfilled, (state, action) => {
            state.loading = false
            state.userInfo = {}
            state.userToken = null
            state.error = null
            state.success = false
        })
        .addCase(fetchLogout.rejected, (state, action) => {
            state.error = action.payload
        })
        // [fetchLogin.pending]: (state) => {
        //   state.loading = true
        //   state.error = null
        // },
        // [fetchLogin.fulfilled]: (state, { payload }) => {
        //   state.loading = false
        //   state.userInfo = payload
        //   state.userToken = payload.userToken
        // },
        // [fetchLogin.rejected]: (state, { payload }) => {
        //   state.loading = false
        //   state.error = payload
        // }
    }
})

export const authReducer = authSlice.reducer