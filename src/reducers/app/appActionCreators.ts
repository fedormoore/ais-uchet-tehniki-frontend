import {AppAction, TypeApp} from "./appTypes";
import {ModalWaitModel, NotificationModel} from "../../models/AppModel";
import {Dispatch} from "redux";

export const AppActionCreators = {
    setNotification: (value: NotificationModel) => (dispatch: Dispatch<AppAction>) => {
        dispatch({type: TypeApp.NOTIFICATION, payload: value})
    },
    resetNotification: () => (dispatch: Dispatch<AppAction>) => {
        dispatch({type: TypeApp.NOTIFICATION, payload: null})
    },
    modalWait: (values: ModalWaitModel) => (dispatch: Dispatch<AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: values})
    },
    setWebSocketCon: (values: boolean) => (dispatch: Dispatch<AppAction>) => {
        dispatch({type: TypeApp.WEB_SOCKET_CON, payload: values})
    },
}