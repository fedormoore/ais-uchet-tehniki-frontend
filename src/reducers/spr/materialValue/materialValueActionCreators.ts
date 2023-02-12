import {Request} from "../../../http/network";
import {Dispatch} from "redux";
import {DeviceAction, DeviceType} from "./materialValueTypes";
import {AppAction, TypeApp} from "../../app/appTypes";
import {
    MaterialValueDeleteModel,
    MaterialValueModel,
    MaterialValueSendModel
} from "../../../models/spr/MaterialValueModel";
import {
    MaterialValueToServerDelete,
    MaterialValueToServerSave
} from "../../../dataPreparation/toServer/materialValueToServer";
import {UrlEnum} from "../../../constants/urlEnum";

export interface materialValueResult {
    isOk?: boolean;
}

export const MaterialValueActionCreators = {
    loadMaterialValue: (params: any) => async (dispatch: Dispatch<DeviceAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Загрузка данных с сервера..."}});
        Request({
            url: UrlEnum.MaterialValuePage,
            method: "GET",
            params: params
        })
            .then((response) => {
                if (response.isOk) {
                    dispatch({type: DeviceType.DEVICE_LOAD, payload: response.data})
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                }
            })
            .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
    },
    saveMaterialValue: (value: MaterialValueModel[]) => (dispatch: Dispatch<DeviceAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveMaterialValueArr: MaterialValueSendModel[] = MaterialValueToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValuePage,
            method: "POST",
            body: JSON.stringify(saveMaterialValueArr),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as materialValueResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as materialValueResult
                }
            })
            .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
    },
    deleteMaterialValue: (value: MaterialValueModel[]) => (dispatch: Dispatch<DeviceAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveMaterialValueArr: MaterialValueDeleteModel[] = MaterialValueToServerDelete(value);

        return Request({
            url: UrlEnum.MaterialValuePage,
            method: "DELETE",
            body: JSON.stringify(saveMaterialValueArr),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as materialValueResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as materialValueResult
                }
            })
            .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
    }
}