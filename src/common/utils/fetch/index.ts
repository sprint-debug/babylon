import { AxiosInstance } from 'axios';


export type RequestInstance = AxiosInstance;

export type TRequestOptions = {
  headers?: any;
  method: "POST" | "GET" | "DELETE" | "PUT";
  data?: any;
  params?: any;
};

const onRequest = async <T>(instance: RequestInstance, url: string, { method, data, headers, params }: TRequestOptions): Promise<T | null> => {
  try {
    const res = await instance.request<T>({ method, url, data, headers, params });
    if (res.status !== 200) {
      console.error(res);
      return null;
    }

    return res.data;
  }
  catch {
    return null;
  }
};

export default onRequest;


//  import { SERVER_INFO } from "../../constants";

// export const instance = axios.create({ baseURL: SERVER_INFO.URL });


// instance.interceptors.request.use(async (config) => {
//     config.headers.set("X-API-KEY", SERVER_INFO.KEY);

//     return config;
// });

// instance.interceptors.response.use((response) => {
//   return response;
// });
