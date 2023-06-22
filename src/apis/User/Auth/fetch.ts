import { AuthRefreshParams, AuthSignupEmailData, AuthSignupEmailParams, AuthTokenData, AuthTokenParams} from "./type";
import {URLS} from '@/common/constants';
import onRequest, {RequestInstance} from "@/common/utils/fetch";

export async function postAuthRefesh(instance:RequestInstance, params:AuthRefreshParams) {
    return await onRequest(instance, URLS.AUTH_REFRESH, {method : "POST", params});
} 

export async function getAuthSignout(instance:RequestInstance) {
    return await onRequest(instance, URLS.AUTH_SIGNOUT, {method : "GET", headers:  {"accept":"application/json"}});
} 

export async function postAuthSignupEmail(instance:RequestInstance, data: AuthSignupEmailData, params?:AuthSignupEmailParams) {
    return await onRequest(instance, URLS.AUTH_SIGNUP_EMAIL, {method : "POST", data, params, headers : {"accept": " application/json", "Content-Type": "application/json"}});
} 

export async function postAuthToken(instance:RequestInstance, data: AuthTokenData, params:AuthTokenParams) {
    return await onRequest(instance, URLS.AUTH_TOKEN, {method : "POST", data, params, headers : {"accept": " application/json", "Content-Type": "application/x-www--urlencoded"}});
} 

