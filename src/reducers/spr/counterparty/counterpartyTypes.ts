import {CounterpartyModel} from "../../../models/spr/CounterpartyModel";

export enum CounterpartyType {
    COUNTERPARTY_LOAD = 'COUNTERPARTY_LOAD'
}

export interface CounterpartyState {
    counterpartyList: CounterpartyModel[];
    counterpartySelectPage: number;
    counterpartyTotalElements: number;
}

interface CounterpartyLoadAction {
    type: CounterpartyType.COUNTERPARTY_LOAD;
    payload: { totalElements: number, number: number, content: CounterpartyModel[] };
}

export type CounterpartyAction =
    CounterpartyLoadAction
