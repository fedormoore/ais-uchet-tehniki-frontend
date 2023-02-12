import {Request} from "../../../http/network";
import {Dispatch} from "redux";
import {UserAction, UserType} from "./userTypes";
import {UserDeleteModel, UserModel} from "../../../models/spr/UserModel";
import {AppAction, TypeApp} from "../../app/appTypes";
import {UserToServerDelete, UserToServerSave} from "../../../dataPreparation/toServer/userToServer";
import {UrlEnum} from "../../../constants/urlEnum";

export interface userResult {
    isOk?: boolean;
}

export const UserActionCreators = {
    loadUser: (params: any) => async (dispatch: Dispatch<UserAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Загрузка данных с сервера..."}});
        Request({
            url: UrlEnum.UserPage,
            method: "GET",
            params: params
        })
            .then((response) => {
                if (response.isOk) {
                    dispatch({type: UserType.USER_LOAD, payload: response.data})
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                }
            })
            .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
    },
    saveUser: (value: UserModel[]) => (dispatch: Dispatch<UserAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveUserArr: UserModel[] = UserToServerSave(value);

        return Request({
            url: UrlEnum.UserPage,
            method: "POST",
            body: JSON.stringify(saveUserArr),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as userResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as userResult
                }
            })
            .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
    },
    deleteUser: (value: UserModel[]) => (dispatch: Dispatch<UserAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveUserArr: UserDeleteModel[] = UserToServerDelete(value);

        return Request({
            url: UrlEnum.UserPage,
            method: "DELETE",
            body: JSON.stringify(saveUserArr),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as userResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as userResult
                }
            })
            .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
    }
}