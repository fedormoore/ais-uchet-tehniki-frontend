import {AuthAction, AuthState, AuthType} from "./authTypes";

const isAuth = JSON.parse(localStorage.getItem("isAuth") as string);

const initialState: AuthState = {
    isLoading: false,
    error: null,
    isAuth: isAuth ? (isAuth) : false
}

export function authReducer(state = initialState, action: AuthAction): AuthState {
    switch (action.type) {
        case AuthType.FETCH_SIGNUP:
            return {isLoading: true, error: null, isAuth: false}
        case AuthType.FETCH_SIGNUP_OK:
            return {isLoading: false, error: null, isAuth: false}
        case AuthType.FETCH_AUTH:
            return {isLoading: true, error: null, isAuth: false}
        case AuthType.FETCH_AUTH_SET:
            return {isLoading: false, error: null, isAuth: true}
        case AuthType.FETCH_AUTH_SET_ERROR:
            return {isLoading: false, error: action.payload, isAuth: false}
        case AuthType.FETCH_AUTH_SET_LOGOUT:
            return {isLoading: false, error: null, isAuth: false}
        default:
            return state
    }
}