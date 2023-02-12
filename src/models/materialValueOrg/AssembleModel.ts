import {LocationModel} from "../spr/LocationModel";
import {BudgetAccountModel} from "../spr/BudgetAccountModel";
import {MaterialValueModel} from "../spr/MaterialValueModel";
import {MaterialValueOrgModel} from "../MaterialValueOrgModel";
import {ReasonModel} from "../ReasonModel";

export interface AssembleModel {
    statement: ReasonModel;
    materialValue:MaterialValueModel;
    location: LocationModel;
    budgetAccount: BudgetAccountModel;
    specification: MaterialValueOrgModel[];
}

export interface AssembleSendModel {
    statementId: string;
    materialValueId: string;
    locationId: string;
    budgetAccountId: string;
    specification: AssembleSpecSendModel[];
}

export interface AssembleSpecSendModel {
    id: string;
}