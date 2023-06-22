

export type AuthRefreshParams = {
    w?: string;
    p?:string;
}

export type AuthSignupEmailParams = {
    w?: string;
    p?:string;
}

export type AuthSignupEmailData = {
    email:string;
    id:string;
    password:string;
}

export type AuthTokenParams = {
    w?: string;
}

export type AuthTokenData = {
    grant_type: "code";
    request_uri: string;
    code_verifier: string;
    client_id: string;
    code : string;
}