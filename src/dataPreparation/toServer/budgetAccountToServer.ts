import {BudgetAccountDeleteModel, BudgetAccountModel} from "../../models/spr/BudgetAccountModel";

export const BudgetAccountToServerDelete: any = (list: BudgetAccountModel[]) => {
    let returnList: BudgetAccountDeleteModel[] = [];

    for (let i = 0; i < list.length; i++) {
        if (list[i].deleted) {
            returnList = returnList.concat({id: list[i].id});
        }
    }

    return returnList;
}