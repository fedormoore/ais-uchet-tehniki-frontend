import {ReasonModel} from "../../models/ReasonModel";

export enum ReasonType {
    CONTRACT_LOAD = 'CONTRACT_LOAD',
    STATEMENT_LOAD = 'STATEMENT_LOAD'
}

export interface ReasonState {
    contractList: ReasonModel[];
    contractSelectPage: number;
    contractTotalElements: number;

    statementList: ReasonModel[];
    statementSelectPage: number;
    statementTotalElements: number;
}

interface ContractLoadAction {
    type: ReasonType.CONTRACT_LOAD;
    payload: { totalElements: number, number: number, content: ReasonModel[] };
}

interface StatementLoadAction {
    type: ReasonType.STATEMENT_LOAD;
    payload: { totalElements: number, number: number, content: ReasonModel[] };
}

export type ReasonAction =
    ContractLoadAction
    | StatementLoadAction