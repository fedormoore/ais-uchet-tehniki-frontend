import {MaterialValueOrgModel} from "../MaterialValueOrgModel";
import {ReasonModel} from "../ReasonModel";

export interface RepairDeviceModel {
    statement: ReasonModel;
    device: MaterialValueOrgModel;
    note: string;
}

export interface RepairDeviceSendModel {
    statementId: string;
    deviceId: string;
    note: string;
}