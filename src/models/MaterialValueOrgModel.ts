import {MaterialValueModel} from "./spr/MaterialValueModel";
import {LocationModel} from "./spr/LocationModel";
import {UserModel} from "./spr/UserModel";
import {BudgetAccountModel} from "./spr/BudgetAccountModel";
import {OrganizationModel} from "./spr/OrganizationModel";

export interface MaterialValueOrgModel {
    id: string;
    barcode: string;
    materialValue: MaterialValueModel;
    status: string;
    organization: OrganizationModel;
    invNumber: string;
    location: LocationModel
    user: UserModel;
    budgetAccount: BudgetAccountModel;
    responsible: UserModel;
    children: MaterialValueOrgModel[];

    name?: string;
}

export interface MaterialValueOrgModelSend {
    id: string;
    barcode: string;
    locationId: string;
    budgetAccountId: string;
    userId: string;
    responsibleId: string;
    invNumber: string;
}