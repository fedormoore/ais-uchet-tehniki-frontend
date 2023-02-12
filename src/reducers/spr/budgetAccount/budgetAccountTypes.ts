import {BudgetAccountModel} from "../../../models/spr/BudgetAccountModel";

export enum BudgetAccountType {
    BUDGET_ACCOUNT_LOAD = 'BUDGET_ACCOUNT_LOAD'
}

export interface BudgetAccountState {
    budgetAccountList: BudgetAccountModel[];
    budgetAccountSelectPage: number;
    budgetAccountTotalElements: number;
}

interface BudgetAccountLoadAction {
    type: BudgetAccountType.BUDGET_ACCOUNT_LOAD;
    payload: { totalElements: number, number: number, content: BudgetAccountModel[] };
}

export type BudgetAccountAction =
    BudgetAccountLoadAction
