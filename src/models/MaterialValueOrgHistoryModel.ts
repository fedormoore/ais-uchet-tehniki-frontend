import {ReasonModel} from "./ReasonModel";
import {MaterialValueOrgModel} from "./MaterialValueOrgModel";

export interface MaterialValueOrgHistoryModel {
    id: string;
    materialValueOrg: MaterialValueOrgModel
    dateCreate: Date;
    type: string;
    reason?: ReasonModel;
    oldValue: string;
    newValue: string;
    note: string;

    parent?: DeviceHistoryParent;
    children?: DeviceHistoryChildren[];

    isServer: boolean;
    deleted: boolean;
}

export interface DeviceHistoryParent {
    id: string;
    type: string;
    reason: ReasonModel;
    materialValueOrg: MaterialValueOrgModel;

    parent: DeviceHistoryParent;
}

export interface DeviceHistoryChildren {
    id: string;
    type: string;
    reason: ReasonModel;
    materialValueOrg: MaterialValueOrgModel;
}

export interface HistoryEditSendModel {
    id: string;
    reasonId: string;
}
