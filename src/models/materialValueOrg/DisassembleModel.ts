import {LocationModel} from "../spr/LocationModel";
import {BudgetAccountModel} from "../spr/BudgetAccountModel";
import {MaterialValueOrgModel} from "../MaterialValueOrgModel";
import {ReasonModel} from "../ReasonModel";

export interface DisassembleModel {
    statement: ReasonModel;
    location: LocationModel;
    budgetAccount: BudgetAccountModel;
    specification: MaterialValueOrgModel[];
}

export interface DisassembleSendModel {
    statementId: string;
    locationId: string;
    budgetAccountId: string;
    specification: DisassembleSpecSendModel[];
}

export interface DisassembleSpecSendModel {
    id: string;
}