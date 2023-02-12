import {UserModel} from "../../../models/spr/UserModel";

export enum UserType {
    USER_LOAD = 'USER_LOAD'
}

export interface UserState {
    userList: UserModel[];
    userSelectPage: number;
    userTotalElements: number;
}

interface UserLoadAction {
    type: UserType.USER_LOAD;
    payload: { totalElements: number, number: number, content: UserModel[] };
}

export type UserAction =
    UserLoadAction
