import {Request} from "../../../http/network";
import {Dispatch} from "redux";
import {DeviceTypeAction, DeviceTypeType} from "./materialValueTypeTypes";
import {MaterialValueTypeDeleteModel, MaterialValueTypeModel} from "../../../models/spr/MaterialValueTypeModel";
import {AppAction, TypeApp} from "../../app/appTypes";
import {UrlEnum} from "../../../constants/urlEnum";
import {MaterialValueTypeToServerDelete} from "../../../dataPreparation/toServer/materialValueTypeToServer";

export interface materialValueTypeResult {
    isOk?: boolean;
}

export const MaterialValueTypeActionCreators = {
    loadMaterialValueType: (params: any) => async (dispatch: Dispatch<DeviceTypeAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Загрузка данных с сервера..."}});

        Request({
            url: UrlEnum.MaterialValueTypePage,
            method: "GET",
            params: params
        })
            .then((response) => {
                if (response.isOk) {
                    dispatch({type: DeviceTypeType.DEVICE_TYPE_LOAD, payload: response.data})
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                }
            })
            .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
    },
    saveMaterialValueType: (value: MaterialValueTypeModel[]) => (dispatch: Dispatch<DeviceTypeAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        return Request({
            url: UrlEnum.MaterialValueTypePage,
            method: "POST",
            body: JSON.stringify(value),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as materialValueTypeResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as materialValueTypeResult
                }
            })
            .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
    },
    deleteMaterialValueType: (value: MaterialValueTypeModel[]) => (dispatch: Dispatch<DeviceTypeAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveMaterialValueTypeArr: MaterialValueTypeDeleteModel[] = MaterialValueTypeToServerDelete(value);

        return Request({
            url: UrlEnum.MaterialValueTypePage,
            method: "DELETE",
            body: JSON.stringify(saveMaterialValueTypeArr),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as materialValueTypeResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as materialValueTypeResult
                }
            })
            .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
    }
}