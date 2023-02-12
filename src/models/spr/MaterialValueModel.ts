import {MaterialValueTypeModel} from "./MaterialValueTypeModel";

export interface MaterialValueModel {
    id: string;
    materialValueType: MaterialValueTypeModel;
    nameInOrg: string;
    nameFirm: string;
    nameModel: string;
    deleted: boolean;
}

export interface MaterialValueSendModel {
    id?: string;
    materialValueTypeId: string;
    nameInOrg: string;
    nameFirm: string;
    nameModel: string;
}

export interface MaterialValueDeleteModel {
    id: string;
}