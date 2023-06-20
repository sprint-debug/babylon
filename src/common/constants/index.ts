export const ENV = import.meta.env.VITE_REACT_APP_ENV;

export const APP_VERSION = import.meta.env.VITE_REACT_APP_VERSION;
export const ENABLE_LOG = import.meta.env.VITE_REACT_APP_ENABLE_LOG === 'true' ? true : false;
export const ENABLE_LOG_LEVEL = import.meta.env.VITE_REACT_APP_ENABLE_LOG_LEVEL;

// 서버 API URL 정보
export enum URLS {
    AUTH_REFRESH = "/v1/auth/refresh",
    AUTH_SIGNOUT = "/v1/auth/signout",
    AUTH_SIGNUP_EMAIL = "/v1/signup/email",
    AUTH_TOKEN = "/v1/auth/token",
}

// 서버 정보
export enum SERVER_INFO {
    URL = "https://yourserverurl.com",
    KEY = "hash",
}
