import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: `http://localhost:8888/api/`,
    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    credentials: 'include',   
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const accessToken =  window.localStorage.getItem('accessToken')
    if (accessToken) {
        config.headers.Authorization = `${accessToken}`;
    }
    return config
})

api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
            // Try to refresh the access token using the refresh token
            const refreshToken = Cookies.get('refreshToken');
        
            if (refreshToken) {
                try {
                    const response = await axios.post('/refresh_token', { refreshToken });
                    const { accessToken } = response.data;
            
                    // Save the new access token and retry the original request
                    window.localStorage.setItem('accessToken', accessToken)
                    error.config.headers.Authorization = `${accessToken}`;
                    error.config.__isRetryRequest = true;
                    return axios(error.config);
                } catch (error) {
                    // Clear the cookies and redirect to the login page
                    window.localStorage.removeItem('accessToken')
                    Cookies.remove('refreshToken');
                    window.location.href = '/login';
                }
            } else {
            // Clear the cookies and redirect to the login page
                window.localStorage.removeItem('accessToken')
                Cookies.remove('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
export default api