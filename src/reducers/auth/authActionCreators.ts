import {AuthAction, AuthType} from "./authTypes";
import {Dispatch} from "redux";

import {Request} from "../../http/network";
import {SignUpModel} from "../../models/auth/SignUpModel";
import {SignInModel} from "../../models/auth/SignInModel";

export interface resultSignUp {
    isOk?: boolean;
}

export const AuthActionCreators = {
    signInAction: (values: SignInModel) => async (dispatch: Dispatch<AuthAction>) => {
        dispatch({type: AuthType.FETCH_AUTH})

        return Request({
            url: "/auth/signIn",
            method: "POST",
            body: JSON.stringify(values),
        })
            .then((response: any) => {
                if (response.isOk) {
                    localStorage.setItem("isAuth", String(true));
                    localStorage.setItem("email", values.email);
                    localStorage.setItem("accessToken", response.data.accessToken);
                    localStorage.setItem("refreshToken", response.data.refreshToken);

                    dispatch({type: AuthType.FETCH_AUTH_SET})
                    return {isOk: true} as resultSignUp
                } else {
                    dispatch({type: AuthType.FETCH_AUTH_SET_ERROR, payload: response.data})
                }
            })
    },
    signUpAction: (values: SignUpModel) => (dispatch: Dispatch<AuthAction>) => {
        dispatch({type: AuthType.FETCH_SIGNUP})

        try {
            return Request({
                url: "/auth/signUp",
                method: "POST",
                body: JSON.stringify(values)
            })
                .then((response) => {
                    if (response.isOk) {
                        dispatch({type: AuthType.FETCH_SIGNUP_OK});
                        return {isOk: true} as resultSignUp
                    } else {
                        dispatch({type: AuthType.FETCH_AUTH_SET_ERROR, payload: response.data});
                        return {isOk: false} as resultSignUp
                    }
                })
        } catch (e) {
            dispatch({type: AuthType.FETCH_AUTH_SET_ERROR, payload: 'Произошла ошибка'})
        }
    },
    logoutAction: () => (dispatch: Dispatch<AuthAction>) => {
        localStorage.removeItem('isAuth')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        dispatch({type: AuthType.FETCH_AUTH_SET_LOGOUT})
    }
}