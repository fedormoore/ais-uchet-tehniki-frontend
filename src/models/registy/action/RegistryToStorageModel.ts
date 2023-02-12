import {LocationModel} from "../../spr/LocationModel";
import {MaterialValueOrgModel} from "../../MaterialValueOrgModel";
import {ReasonModel} from "../../ReasonModel";

export interface RegistryToStorageModel {
    statement: ReasonModel;
    materialValueOrg: MaterialValueOrgModel;
    location: LocationModel;
}

export interface RegistryToStorageSendModel {
    statementId: string;
    materialValueOrgId: string;
    locationId: string;
}