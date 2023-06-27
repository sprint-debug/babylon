import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request config before sending
    // For example, add headers or modify data
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful response
    // Modify or process the response data
    return response;
  },
  (error) => {
    // Handle response error
    // Handle different error cases based on error.response status or other properties
    return Promise.reject(error);
  }
);

export default axiosInstance;



// import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
// import queryString from 'query-string';
// import dayjs from 'dayjs';
// import 'dayjs/locale/ko';

// import config from 'config';
// import {
//   clearToken,
//   getToken,
//   checkIsAutoLogin,
//   setAccessToken,
//   setRefreshToken,
//   setLoginedDate,
// } from 'common';

// dayjs.locale('ko');

// const instance = axios.create({
//   baseURL: config.API_URL,
//   timeout: 5000,
// });

// const checkAccessTokenValid = (): boolean => {
//   const now = dayjs().format('YYYYMMDD');
//   const loginedDate = localStorage.getItem('loginedDate');

//   if (loginedDate && now === loginedDate) {
//     return true;
//   } else {
//     return false;
//   }
// };

// const getRefreshToken = async (): Promise<boolean> => {
//   const isAuto = checkIsAutoLogin() as boolean;
//   const { accessToken, refreshToken } = getToken();

//   if (!accessToken || !refreshToken) {
//     clearToken();
//     return false;
//   }

//   try {
//     const { data } = await axios.post(`${config.API_URL}/auth/refresh`, {
//       accessToken,
//       refreshToken,
//     });

//     if (data?.accessToken && data?.refreshToken) {
//       setLoginedDate(isAuto);
//       setAccessToken(data.accessToken, isAuto);
//       setRefreshToken(data.refreshToken, isAuto);

//       return true;
//     } else {
//       return false;
//     }
//   } catch (error) {
//     clearToken();
//     return false;
//   }
// };

// instance.interceptors.request.use(async (axiosConfig: AxiosRequestConfig) => {
//   if (typeof window === 'undefined') return axiosConfig;

//   // 토큰 재발급 체크
//   if (!checkAccessTokenValid()) {
//     await getRefreshToken();
//   }

//   const { accessToken } = getToken();
//   if (accessToken && axiosConfig.headers) {
//     axiosConfig.headers['Authorization'] = `Bearer ${accessToken}`;
//   }

//   return axiosConfig;
// });

// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     if (typeof window === 'undefined') return error.response;

//     const { data } = error.response;
//     const { status, message } = data;

//     if (status === 401 && message === 'TOKEN EXPIRED') {
//       // 토큰 재발급 시도
//       const refreshed = await getRefreshToken();
//       if (refreshed) {
//         // 토큰 재발급 성공시 재요청
//         return await instance(error.config);
//       } else {
//         clearToken();
//       }
//     }

//     return error.response;
//   }
// );

// export interface RequestAPI {
//   method: Method;
//   url: string;
//   query?: Record<string, any>;
//   headers?: any;
//   body?: any;
// }

// export const requestAPI = async ({
//   method,
//   url,
//   query,
//   headers,
//   body,
// }: RequestAPI): Promise<AxiosResponse> => {
//   let apiUrl = url;

//   if (query) apiUrl += `?${queryString.stringify(query)}`;

//   try {
//     const response = await instance({
//       method,
//       url: apiUrl,
//       data: body,
//       headers,
//     });

//     return response;
//   } catch (error) {
//     return (error as any)?.response;
//   }
// };
