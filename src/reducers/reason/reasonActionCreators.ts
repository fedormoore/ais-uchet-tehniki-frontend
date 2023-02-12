import {Request} from "../../http/network";
import {Dispatch} from "redux";
import {AppAction, TypeApp} from "../app/appTypes";
import {ReasonAction, ReasonType} from "./reasonTypes";
import {ReasonDeleteModel, ReasonModel, ReasonSendModel, ReasonSpecDeleteModel} from "../../models/ReasonModel";
import {
    ReasonSpecToServerDelete,
    ReasonToServerDelete,
    ReasonToServerSave
} from "../../dataPreparation/toServer/reasonToServer";
import {UrlEnum} from "../../constants/urlEnum";
import {locationResult} from "../spr/location/locationActionCreators";

export interface reasonResult {
    isOk?: boolean;
}

export const ReasonActionCreators = {
    contractLoadFromServer: (params: any) => async (dispatch: Dispatch<ReasonAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Загрузка данных с сервера..."}});
        Request({
            url: UrlEnum.ReasonContractPage,
            method: "GET",
            params: params
        })
            .then((response) => {
                if (response.isOk) {
                    dispatch({type: ReasonType.CONTRACT_LOAD, payload: response.data})
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                }
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    statementLoadFromServer: (params: any) => async (dispatch: Dispatch<ReasonAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Загрузка данных с сервера..."}});
        Request({
            url: UrlEnum.ReasonStatementPage,
            method: "GET",
            params: params
        })
            .then((response) => {
                if (response.isOk) {
                    dispatch({type: ReasonType.STATEMENT_LOAD, payload: response.data})
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                }
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    contractSaveToServer: (value: ReasonModel) => async (dispatch: Dispatch<ReasonAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        const result: reasonResult = await deleteSpec(value, dispatch) as reasonResult;
        if (result.isOk) {
            let saveContractArr: ReasonSendModel = ReasonToServerSave(value, 'contract');

            return Request({
                url: UrlEnum.ReasonContractPage,
                method: "POST",
                body: JSON.stringify(saveContractArr),
            })
                .then((response) => {
                    if (response.isOk) {
                        return {isOk: true, data: response.data} as reasonResult
                    } else {
                        dispatch({
                            type: TypeApp.NOTIFICATION,
                            payload: {type: 'error', message: 'Ошибка', description: response.data}
                        })
                        return {isOk: false} as reasonResult
                    }
                })
                .finally(() => {
                    dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
                })
        }
    },
    statementSaveToServer: (value: ReasonModel) => async (dispatch: Dispatch<ReasonAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});
        const result: reasonResult = await deleteSpec(value, dispatch) as reasonResult;
        if (result.isOk) {
            let saveStatementArr: ReasonSendModel = ReasonToServerSave(value, '');
            console.log(saveStatementArr)
            return Request({
                url: UrlEnum.ReasonStatementPage,
                method: "POST",
                body: JSON.stringify(saveStatementArr),
            })
                .then((response) => {
                    if (response.isOk) {
                        return {isOk: true, data: response.data} as reasonResult
                    } else {
                        dispatch({
                            type: TypeApp.NOTIFICATION,
                            payload: {type: 'error', message: 'Ошибка', description: response.data}
                        })
                        return {isOk: false} as reasonResult
                    }
                })
                .finally(() => {
                    dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
                })
        }
    },

    reasonDeleteToServer: (value: ReasonModel) => async (dispatch: Dispatch<ReasonAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let deleteReasonArr: ReasonDeleteModel[] = ReasonToServerDelete(value);

        return Request({
            url: UrlEnum.Reason,
            method: "DELETE",
            body: JSON.stringify(deleteReasonArr),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true, data: response.data} as reasonResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as reasonResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })

    }
}

const deleteSpec = (value: ReasonModel, dispatch: Dispatch) => {
    let deleteArr: ReasonSpecDeleteModel[] = ReasonSpecToServerDelete(value.spec);
    if (deleteArr !== undefined && deleteArr.length > 0) {
        return Request({
            url: UrlEnum.History,
            method: "DELETE",
            body: JSON.stringify(deleteArr)
        }).then((response) => {
            if (response.isOk) {
                return {isOk: true} as locationResult
            } else {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
                dispatch({
                    type: TypeApp.NOTIFICATION,
                    payload: {type: 'error', message: 'Ошибка', description: response.data}
                })
                return {isOk: false} as locationResult
            }
        })
    } else {
        return {isOk: true} as locationResult
    }
}