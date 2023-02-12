import {MaterialValueOrgModel} from "../MaterialValueOrgModel";
import {ReasonModel} from "../ReasonModel";

export interface AddDeviceModel {
    statement: ReasonModel;
    inDevice: MaterialValueOrgModel;
    specification: MaterialValueOrgModel[];
}

export interface AddDeviceSendModel {
    statementId: string;
    inDeviceId: string;
    specification: AddDeviceSpecSendModel[];
}

export interface AddDeviceSpecSendModel {
    id: string;
}