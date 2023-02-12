import {LocationModel} from "../spr/LocationModel";
import {BudgetAccountModel} from "../spr/BudgetAccountModel";
import {MaterialValueOrgModel} from "../MaterialValueOrgModel";
import {ReasonModel} from "../ReasonModel";

export interface ReplacementDeviceModel {
    statement: ReasonModel;
    location: LocationModel;
    budgetAccount: BudgetAccountModel;
    replacementInDevice: MaterialValueOrgModel;
    replacementToDevice: MaterialValueOrgModel;
}

export interface ReplacementDeviceSendModel {
    statementId: string;
    locationId: string;
    budgetAccountId: string;
    replacementInDeviceId: string;
    replacementToDeviceId: string;
}

export interface ReplacementDeviceSpecSendModel {
    id: string;
}