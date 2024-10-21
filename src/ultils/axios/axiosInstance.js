import axios from 'axios';
import {
  clearLocalStorage,
  getRefreshTokenLocalStorageItem,
  getTokenLocalStorageItem,
  getUserLocalStorageItem,
} from '../index';
console.log(import.meta.env.VITE_APP_SERVER_URL);
const token = getTokenLocalStorageItem();
const axiosInstance = axios.create({
  baseURL: `http://${import.meta.env.VITE_APP_SERVER_URL}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    // Thêm các headers khác nếu cần
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    const condition =
      config.url?.includes('/account/authenticate') ||
      config.url?.includes('/face/registor/host') ||
      config.url?.includes('/face/registor/employee') ||
      config.url?.includes('/face/authenticate');
    if (condition) return config;
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 403 && !originalRequest._retry && token) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshTokenLocalStorageItem();
        if (!refreshToken) {
          clearLocalStorage();
          window.location.href = '/login';
          return;
        }
        const refreshResponse = await axiosInstance.post(
          'http://localhost:8000/api/v1/token/refresh',
          {},
          {
            headers: {
              'x-refresh-token': refreshToken,
            },
          }
        );
        if (refreshResponse.status !== 200) {
          clearLocalStorage();
          window.location.href = '/login';
          return;
        }
        // Update the token and retry the original request
        localStorage.setItem(
          'token',
          JSON.stringify(refreshResponse.data.metaData.token)
        );
        localStorage.setItem(
          'refreshToken',
          JSON.stringify(refreshResponse.data.metaData.refreshToken)
        );

        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.metaData.token}`;
        console.log('refresh Token successfully!');
        return axios(originalRequest);
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError);
        clearLocalStorage();
        window.location.href = '/login';
        return;
      }
    }
    Promise.reject(error);
    return error;
  }
);

export default axiosInstance;
