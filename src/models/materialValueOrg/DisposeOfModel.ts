import {ReasonModel} from "../ReasonModel";
import {MaterialValueOrgModel} from "../MaterialValueOrgModel";

export interface DisposeOfModel {
    contract: ReasonModel;
    specification: MaterialValueOrgModel[];
}

export interface DisposeOfSendModel {
    contractId: string;
    specification: DisposeOfSpecSendModel[];
}

export interface DisposeOfSpecSendModel {
    id: string;
}