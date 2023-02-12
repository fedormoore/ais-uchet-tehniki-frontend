import {ReasonAction, ReasonState, ReasonType} from "./reasonTypes";

const initialState: ReasonState = {
    contractList: [],
    contractTotalElements: 1,
    contractSelectPage: 1,

    statementList: [],
    statementTotalElements: 1,
    statementSelectPage: 1
}

export const reasonReducer = (state = initialState, action: ReasonAction): ReasonState => {
    switch (action.type) {
        case ReasonType.CONTRACT_LOAD:
            return {
                ...state,
                contractTotalElements: action.payload.totalElements,
                contractSelectPage: action.payload.number,
                contractList: action.payload.content
            }
        case ReasonType.STATEMENT_LOAD:
            return {
                ...state,
                statementTotalElements: action.payload.totalElements,
                statementSelectPage: action.payload.number,
                statementList: action.payload.content
            }
        default:
            return state
    }
}