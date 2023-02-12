import {LocationModel} from "../spr/LocationModel";
import {BudgetAccountModel} from "../spr/BudgetAccountModel";
import {MaterialValueOrgModel} from "../MaterialValueOrgModel";
import {ReasonModel} from "../ReasonModel";

export interface RemoveDeviceModel {
    statement: ReasonModel;
    location: LocationModel;
    budgetAccount: BudgetAccountModel;
    specification: MaterialValueOrgModel[];
}

export interface RemoveDeviceSendModel {
    statementId: string;
    locationId: string;
    budgetAccountId: string;
    specification: RemoveDeviceSpecSendModel[];
}

export interface RemoveDeviceSpecSendModel {
    id: string;
}