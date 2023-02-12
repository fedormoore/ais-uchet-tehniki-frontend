import {UserAction, UserState, UserType} from "./userTypes";

const initialState: UserState = {
    userList: [],
    userTotalElements: 1,
    userSelectPage: 1
}

export const userReducer = (state = initialState, action: UserAction): UserState => {
    switch (action.type) {
        case UserType.USER_LOAD:
            return {
                ...state,
                userTotalElements: action.payload.totalElements,
                userSelectPage: action.payload.number,
                userList: action.payload.content
            }
        default:
            return state
    }
}