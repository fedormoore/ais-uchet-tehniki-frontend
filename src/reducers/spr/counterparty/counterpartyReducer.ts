import {CounterpartyAction, CounterpartyState, CounterpartyType} from "./counterpartyTypes";

const initialState: CounterpartyState = {
    counterpartyList: [],
    counterpartyTotalElements: 1,
    counterpartySelectPage: 1
}

export const counterpartyReducer = (state = initialState, action: CounterpartyAction): CounterpartyState => {
    switch (action.type) {
        case CounterpartyType.COUNTERPARTY_LOAD:
            return {
                ...state,
                counterpartyTotalElements: action.payload.totalElements,
                counterpartySelectPage: action.payload.number,
                counterpartyList: action.payload.content
            }
        default:
            return state
    }
}