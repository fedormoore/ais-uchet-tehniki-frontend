import {Request} from "../../../http/network";
import {Dispatch} from "redux";
import {BudgetAccountAction, BudgetAccountType} from "./budgetAccountTypes";
import {BudgetAccountDeleteModel, BudgetAccountModel} from "../../../models/spr/BudgetAccountModel";
import {AppAction, TypeApp} from "../../app/appTypes";
import {UrlEnum} from "../../../constants/urlEnum";
import {BudgetAccountToServerDelete} from "../../../dataPreparation/toServer/budgetAccountToServer";

export interface budgetAccountResult {
    isOk?: boolean;
}

export const BudgetAccountActionCreators = {
    loadBudgetAccount: (params: any) => async (dispatch: Dispatch<BudgetAccountAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Загрузка данных с сервера..."}});
        Request({
            url: UrlEnum.BudgetAccountPage,
            method: "GET",
            params: params
        })
            .then((response) => {
                if (response.isOk) {
                    dispatch({type: BudgetAccountType.BUDGET_ACCOUNT_LOAD, payload: response.data})
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                }
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveBudgetAccount: (value: BudgetAccountModel[]) => (dispatch: Dispatch<BudgetAccountAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});
        return Request({
            url: UrlEnum.BudgetAccountPage,
            method: "POST",
            body: JSON.stringify(value),
        })
            .then((response) => {
                if (response.isOk) {

                    return {isOk: true} as budgetAccountResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as budgetAccountResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    deleteBudgetAccount: (value: BudgetAccountModel[]) => (dispatch: Dispatch<BudgetAccountAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveBudgetAccountArr: BudgetAccountDeleteModel[] = BudgetAccountToServerDelete(value);

        return Request({
            url: UrlEnum.BudgetAccountPage,
            method: "DELETE",
            body: JSON.stringify(saveBudgetAccountArr),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as budgetAccountResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as budgetAccountResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    }
}