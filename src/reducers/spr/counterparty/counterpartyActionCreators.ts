import {Request} from "../../../http/network";
import {Dispatch} from "redux";
import {CounterpartyAction, CounterpartyType} from "./counterpartyTypes";
import {CounterpartyDeleteModel, CounterpartyModel} from "../../../models/spr/CounterpartyModel";
import {AppAction, TypeApp} from "../../app/appTypes";
import {UrlEnum} from "../../../constants/urlEnum";
import {CounterpartyToServerDelete} from "../../../dataPreparation/toServer/counterpartyToServer";

export interface counterpartyResult {
    isOk?: boolean;
}

export const CounterpartyActionCreators = {
    loadCounterparty: (params: any) => async (dispatch: Dispatch<CounterpartyAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Загрузка данных с сервера..."}});
        Request({
            url: UrlEnum.CounterpartyPage,
            method: "GET",
            params: params
        })
            .then((response) => {
                if (response.isOk) {
                    dispatch({type: CounterpartyType.COUNTERPARTY_LOAD, payload: response.data})
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                }
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveCounterparty: (value: CounterpartyModel[]) => (dispatch: Dispatch<CounterpartyAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});
        return Request({
            url: UrlEnum.CounterpartyPage,
            method: "POST",
            body: JSON.stringify(value),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as counterpartyResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as counterpartyResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    deleteCounterparty: (value: CounterpartyModel[]) => (dispatch: Dispatch<CounterpartyAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveCounterpartyArr: CounterpartyDeleteModel[] = CounterpartyToServerDelete(value);

        return Request({
            url: UrlEnum.CounterpartyPage,
            method: "DELETE",
            body: JSON.stringify(saveCounterpartyArr),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as counterpartyResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as counterpartyResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    }
}