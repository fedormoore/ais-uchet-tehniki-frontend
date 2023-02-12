import {MaterialValueModel} from "../spr/MaterialValueModel";
import {LocationModel} from "../spr/LocationModel";
import {UserModel} from "../spr/UserModel";
import {BudgetAccountModel} from "../spr/BudgetAccountModel";
import {OrganizationModel} from "../spr/OrganizationModel";
import {ReasonModel} from "../ReasonModel";

export interface IncomeModel {
    organization: OrganizationModel;
    contract: ReasonModel;
    location: LocationModel;
    responsible: UserModel;
    spec: IncomeSpecificationModel[];
}

export interface IncomeSendModel {
    organizationId: string;
    contractId: string;
    locationId: string;
    responsibleId: string;
    spec?: IncomeSpecificationSendModel[];
}

export interface IncomeSpecificationModel {
    id:string;
    materialValue: MaterialValueModel;
    sum: number;
    budgetAccount: BudgetAccountModel;
    children?: IncomeChildrenModel[];
}

export interface IncomeSpecificationSendModel {
    materialValueId: string;
    sum: number;
    budgetAccountId: string;
    children?: IncomeChildrenModel[];
}

export interface IncomeChildrenModel {
    id:string;

    materialValue: MaterialValueModel;
    sum: number;
    children?: IncomeChildrenModel[];
}

export interface IncomeChildrenSendModel {
    materialValueId: string;
    sum: number;
    children?: IncomeChildrenSendModel[];
}