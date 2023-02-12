import {Request} from "../../../http/network";
import {Dispatch} from "redux";
import {LocationAction, LocationType} from "./locationTypes";
import {LocationDeleteModel, LocationModel, LocationSendModel} from "../../../models/spr/LocationModel";
import {AppAction, TypeApp} from "../../app/appTypes";
import {UrlEnum} from "../../../constants/urlEnum";
import {LocationToServerDelete, LocationToServerSave} from "../../../dataPreparation/toServer/locationToServer";

export interface locationResult {
    isOk?: boolean;
}

export const LocationActionCreators = {
    loadLocation: (params: any) => (dispatch: Dispatch<LocationAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Загрузка данных с сервера..."}});
        Request({
            url: UrlEnum.LocationPage,
            method: "GET",
            params: params
        })
            .then((response) => {
                if (response.isOk) {
                    dispatch({type: LocationType.LOCATION_LOAD, payload: response.data})
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                }
            })
            .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
    },
    saveLocation: (value: LocationModel[]) => async (dispatch: Dispatch<LocationAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        const result: locationResult = await deleteLocation(value, dispatch) as locationResult;
        if (result.isOk) {
            let saveArr: LocationSendModel[] = LocationToServerSave(value);
            return Request({
                url: UrlEnum.LocationPage,
                method: "POST",
                body: JSON.stringify(saveArr),
            })
                .then((response) => {
                    if (response.isOk) {
                        return {isOk: true} as locationResult
                    } else {
                        dispatch({
                            type: TypeApp.NOTIFICATION,
                            payload: {type: 'error', message: 'Ошибка', description: response.data}
                        })
                        return {isOk: false} as locationResult
                    }
                })
                .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
        }
    },
    deleteLocation: (value: LocationModel[]) => async (dispatch: Dispatch<LocationAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});
        const result: locationResult = await deleteLocation(value, dispatch) as locationResult;
        if (result.isOk) {
            dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            return {isOk: true} as locationResult
        } else {
            return {isOk: false} as locationResult
        }
    }
}

const deleteLocation = (value: LocationModel[], dispatch: Dispatch) => {
    let deleteArr: LocationDeleteModel[] = LocationToServerDelete(value);
    if (deleteArr !== undefined && deleteArr.length > 0) {
        return Request({
            url: UrlEnum.LocationPage,
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