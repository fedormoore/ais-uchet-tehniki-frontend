import {ModalWaitModel, NotificationModel} from "../../models/AppModel";

export enum TypeApp {
    NOTIFICATION = 'NOTIFICATION',
    MODAL_WAIT = 'MODAL_WAIT',
    WEB_SOCKET_CON = 'WEB_SOCKET_CON'
}

export interface AppState {
    appNotification: null | NotificationModel;
    appModalWait: null | ModalWaitModel;
    webSocketCon:boolean;
}

interface NotificationAction {
    type: TypeApp.NOTIFICATION;
    payload: null | NotificationModel;
}

interface ModalWaitAction {
    type: TypeApp.MODAL_WAIT;
    payload: null | ModalWaitModel;
}

interface WebSocketConAction {
    type: TypeApp.WEB_SOCKET_CON;
    payload: boolean;
}

export type AppAction =
    NotificationAction
    | ModalWaitAction
    | WebSocketConAction;