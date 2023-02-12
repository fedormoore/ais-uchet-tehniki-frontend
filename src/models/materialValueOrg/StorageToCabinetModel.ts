import {LocationModel} from "../spr/LocationModel";
import {UserModel} from "../spr/UserModel";
import {MaterialValueOrgModel} from "../MaterialValueOrgModel";
import {ReasonModel} from "../ReasonModel";

export interface StorageToCabinetModel {
    statement: ReasonModel;
    materialValueOrg: MaterialValueOrgModel;
    location: LocationModel;
    user: UserModel;
    invNumber: string;
}

export interface StorageToCabinetSendModel {
    statementId: string;
    materialValueOrgId: string;
    locationId: string;
    userId: string;
    invNumber: string;
}