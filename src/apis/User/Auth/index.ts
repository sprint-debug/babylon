import { useMutation } from '@tanstack/react-query'
import { AuthRefreshParams, AuthSignupEmailData, AuthSignupEmailParams, AuthTokenData, AuthTokenParams } from './type';
import { getAuthSignout, postAuthRefesh, postAuthSignupEmail, postAuthToken } from './fetch';
import axiosInstance from '@/common/utils/axios';


const useAuthAPI = () => {
    const mutationAuthRefresh = useMutation(async (payload: { params: AuthRefreshParams }) => await postAuthRefesh(axiosInstance, payload.params));

    const mutationAuthSignout = useMutation(async () => await getAuthSignout(axiosInstance));

    const mutationAuthSignupEmail = useMutation(async (payload: { data: AuthSignupEmailData, params?: AuthSignupEmailParams }) => await postAuthSignupEmail(axiosInstance, payload.data, payload.params));

    const mutationAuthToken = useMutation(async (payload: { data: AuthTokenData, params: AuthTokenParams }) => await postAuthToken(axiosInstance, payload.data, payload.params));

    return { mutationAuthRefresh, mutationAuthSignout, mutationAuthSignupEmail, mutationAuthToken }
}

export default useAuthAPI;

