import {AppAction, AppState, TypeApp} from "./appTypes";

const initialState: AppState = {
    appNotification: null,
    appModalWait:null,
    webSocketCon:false
}

export const appReducer = (state = initialState, action: AppAction): AppState => {
    switch (action.type) {
        case TypeApp.NOTIFICATION:
            return {...state, appNotification: action.payload}
        case TypeApp.MODAL_WAIT:
            return {...state, appModalWait: action.payload}
        case TypeApp.WEB_SOCKET_CON:
            return {...state, webSocketCon: action.payload}
        default:
            return state
    }
}