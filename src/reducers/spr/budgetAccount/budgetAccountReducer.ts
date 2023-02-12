import {BudgetAccountAction, BudgetAccountState, BudgetAccountType} from "./budgetAccountTypes";

const initialState: BudgetAccountState = {
    budgetAccountList: [],
    budgetAccountTotalElements: 1,
    budgetAccountSelectPage: 1
}

export const budgetAccountReducer = (state = initialState, action: BudgetAccountAction): BudgetAccountState => {
    switch (action.type) {
        case BudgetAccountType.BUDGET_ACCOUNT_LOAD:
            return {
                ...state,
                budgetAccountTotalElements: action.payload.totalElements,
                budgetAccountSelectPage: action.payload.number,
                budgetAccountList: action.payload.content
            }
        default:
            return state
    }
}