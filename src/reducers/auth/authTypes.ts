export enum AuthType {
    FETCH_SIGNUP= 'FETCH_SIGNUP',
    FETCH_SIGNUP_OK= 'FETCH_SIGNUP_OK',
    FETCH_AUTH= 'FETCH_AUTH',
    FETCH_AUTH_SET= 'FETCH_SET_AUTH',
    FETCH_AUTH_SET_ERROR='FETCH_AUTH_SET_ERROR',
    FETCH_AUTH_SET_LOGOUT= 'FETCH_AUTH_SET_LOGOUT'
}

export interface AuthState {
    isLoading: boolean;
    error: null | string;
    isAuth: boolean;
}

interface FetchSignUpAction {
    type: AuthType.FETCH_SIGNUP;
}

interface FetchSignUpOkAction {
    type: AuthType.FETCH_SIGNUP_OK;
}

interface FetchAuthAction {
    type: AuthType.FETCH_AUTH;
}

interface FetchAuthSetAction {
    type: AuthType.FETCH_AUTH_SET;
}

interface FetchAuthErrorAction {
    type: AuthType.FETCH_AUTH_SET_ERROR;
    payload: string;
}

interface FetchAuthLogoutAction {
    type: AuthType.FETCH_AUTH_SET_LOGOUT;
}

export type AuthAction = FetchSignUpOkAction | FetchSignUpAction | FetchAuthAction | FetchAuthSetAction | FetchAuthErrorAction | FetchAuthLogoutAction
