import {MaterialValueTypeModel} from "../../../models/spr/MaterialValueTypeModel";

export enum DeviceTypeType {
    DEVICE_TYPE_LOAD = 'DEVICE_TYPE_LOAD'
}

export interface DeviceTypeState {
    materialValueTypeList: MaterialValueTypeModel[];
    materialValueTypeSelectPage: number;
    materialValueTypeTotalElements: number;
}

interface DeviceTypeLoadAction {
    type: DeviceTypeType.DEVICE_TYPE_LOAD;
    payload: { totalElements: number, number: number, content: MaterialValueTypeModel[] };
}

export type DeviceTypeAction =
    DeviceTypeLoadAction