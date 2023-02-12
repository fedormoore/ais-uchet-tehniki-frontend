import {Request} from "../../../http/network";
import {Dispatch} from "redux";
import {OrganizationAction, OrganizationType} from "./organizationTypes";
import {OrganizationDeleteModel, OrganizationModel, OrganizationSendModel} from "../../../models/spr/OrganizationModel";
import {AppAction, TypeApp} from "../../app/appTypes";
import {UrlEnum} from "../../../constants/urlEnum";
import {
    OrganizationToServerDelete,
    OrganizationToServerSave
} from "../../../dataPreparation/toServer/organizationToServer";

export interface organizationResult{
    isOk?: boolean;
}

export const OrganizationActionCreators = {
    loadOrganization: (params: any) => (dispatch: Dispatch<OrganizationAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible:true, message:"Загрузка данных с сервера..."}});
        Request({
            url: UrlEnum.OrganizationPage,
            method: "GET",
            params: params
        })
            .then((response) => {
                if (response.isOk) {
                    dispatch({type: OrganizationType.ORGANIZATION_LOAD, payload: response.data})
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                }
            })
            .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
    },
    saveOrganization: (value: OrganizationModel[]) => async (dispatch: Dispatch<OrganizationAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible:true, message:"Сохранение данных..."}});

        const result: organizationResult = await deleteOrganization(value, dispatch) as organizationResult;
        if (result.isOk) {
            let saveArr: OrganizationSendModel[] = OrganizationToServerSave(value);
            return Request({
                url: UrlEnum.OrganizationPage,
                method: "POST",
                body: JSON.stringify(saveArr),
            })
                .then((response) => {
                    if (response.isOk) {
                        return {isOk: true} as organizationResult
                    } else {
                        dispatch({
                            type: TypeApp.NOTIFICATION,
                            payload: {type: 'error', message: 'Ошибка', description: response.data}
                        })
                        return {isOk: false} as organizationResult
                    }
                })
                .finally(() => dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}}))
        }
    },
    deleteOrganization: (value: OrganizationModel[]) => async (dispatch: Dispatch<OrganizationAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});
        const result: organizationResult = await deleteOrganization(value, dispatch) as organizationResult;
        if (result.isOk) {
            dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            return {isOk: true} as organizationResult
        } else {
            return {isOk: false} as organizationResult
        }
    }
}

const deleteOrganization = (value: OrganizationModel[], dispatch: Dispatch) => {
    let deleteArr: OrganizationDeleteModel[] = OrganizationToServerDelete(value);
    if (deleteArr !== undefined && deleteArr.length > 0) {
        return Request({
            url: UrlEnum.OrganizationPage,
            method: "DELETE",
            body: JSON.stringify(deleteArr)
        }).then((response) => {
            if (response.isOk) {
                return {isOk: true} as organizationResult
            } else {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
                dispatch({
                    type: TypeApp.NOTIFICATION,
                    payload: {type: 'error', message: 'Ошибка', description: response.data}
                })
                return {isOk: false} as organizationResult
            }
        })
    } else {
        return {isOk: true} as organizationResult
    }
}