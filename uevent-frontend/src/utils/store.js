import { configureStore } from '@reduxjs/toolkit'
import { registerReducer } from './registerSlice'
import { authReducer } from './authSlice'

const store = configureStore({
    reducer: {
      auth: authReducer,
      register: registerReducer
    }
})

export default store





// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const initialState = {
//   isLoggedIn: false,
//   accessToken: null,
//   refreshToken: null,
//   user: null,
// };

// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'LOGIN_SUCCESS':
//       return {
//         isLoggedIn: true,
//         accessToken: action.payload.accessToken,
//         refreshToken: action.payload.refreshToken,
//       };
//     case 'LOGIN_FAILURE':
//       return {
//         isLoggedIn: false,
//         accessToken: null,
//         refreshToken: null,
//       };
//     case 'REFRESH_TOKEN_SUCCESS':
//       return {
//         ...state,
//         accessToken: action.payload.accessToken,
//       };
//     case 'REFRESH_TOKEN_FAILURE':
//       return {
//         ...state,
//         isLoggedIn: false,
//         accessToken: null,
//         refreshToken: null,
//       };
//     case 'LOAD_USER_SUCCESS':
//       return {
//         ...state,
//         user: action.payload.user,
//       };
//     default:
//       return state;
//   }
// };

// const store = createStore(reducer, applyMiddleware(thunk));

// const api = axios.create({
//   baseURL: 'http://localhost:8000',
// });

// api.interceptors.request.use(config => {
//   const accessToken = Cookies.get('accessToken');

//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   return config;
// });

// api.interceptors.response.use(
//     response => response,
//     async error => {
//         if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
//             // Try to refresh the access token using the refresh token
//             const refreshToken = Cookies.get('refreshToken');
        
//             if (refreshToken) {
//             try {
//                 const response = await axios.post('/refresh_token', { refreshToken });
//                 const { accessToken } = response.data;
        
//                 // Save the new access token and retry the original request
//                 Cookies.set('accessToken', accessToken);
//                 error.config.headers.Authorization = `Bearer ${accessToken}`;
//                 error.config.__isRetryRequest = true;
//                 return axios(error.config);
//             } catch (error) {
//                 // Clear the cookies and redirect to the login page
//                 Cookies.remove('accessToken');
//                 Cookies.remove('refreshToken');
//                 window.location.href = '/login';
//             }
//             } else {
//             // Clear the cookies and redirect to the login page
//             Cookies.remove('accessToken');
//             Cookies.remove('refreshToken');
//             window.location.href = '/login';
//             }
//         }
//         return Promise.reject(error);
//     }
// );
    
// const loginSuccess = tokens => ({
//     type: 'LOGIN_SUCCESS',
//     payload: tokens,
// });

// const loginFailure = () => ({
//     type: 'LOGIN_FAILURE',
// });

// const refreshTokenSuccess = accessToken => ({
//     type: 'REFRESH_TOKEN_SUCCESS',
//     payload: { accessToken },
// });

// const refreshTokenFailure = () => ({
//     type: 'REFRESH_TOKEN_FAILURE',
// });

// const loadUserSuccess = user => ({
//     type: 'LOAD_USER_SUCCESS',
//     payload: { user },
// });

// export const login = credentials => async dispatch => {
//     try {
//         const response = await api.post('/login', credentials);
//         const { accessToken, refreshToken } = response.data;

//         // Save access and refresh tokens in cookies
//         Cookies.set('accessToken', accessToken);
//         Cookies.set('refreshToken', refreshToken);

//         dispatch(loginSuccess({ accessToken, refreshToken }));
//     } catch (error) {
//         Cookies.remove('accessToken');
//         Cookies.remove('refreshToken');
//         dispatch(loginFailure());
//     }
// };

// export const refreshToken = () => async dispatch => {
//     try {
//     const refreshToken = Cookies.get('refreshToken');
//     const response = await api.post('/refresh_token', { refreshToken });
//     const { accessToken } = response.data;

//     // Save the new access token in cookies
//     Cookies.set('accessToken', accessToken);

//     dispatch(refreshTokenSuccess(accessToken));
//     } catch (error) {
//     Cookies.remove('accessToken');
//     Cookies.remove('refreshToken');
//     dispatch(refreshTokenFailure());
//     }
// };

// export const loadUser = () => async dispatch => {
//     try {
//     const response = await api.get('/user');
//     const user = response.data;

//     dispatch(loadUserSuccess(user));
//     } catch (error) {
//     Cookies.remove('accessToken');
//     Cookies.remove('refreshToken');
//     dispatch(loginFailure());
//     }
// };
    
// export default store;
    
