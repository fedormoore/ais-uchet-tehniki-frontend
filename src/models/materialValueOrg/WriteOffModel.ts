import {MaterialValueOrgModel} from "../MaterialValueOrgModel";
import {ReasonModel} from "../ReasonModel";

export interface WriteOffModel {
    statement: ReasonModel;
    specification: MaterialValueOrgModel[];
}

export interface WriteOffSendModel {
    statementId: string;
    specification: WriteOffSpecSendModel[];
}

export interface WriteOffSpecSendModel {
    id: string;
}