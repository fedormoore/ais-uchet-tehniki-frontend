import {MaterialValueModel} from "../../../models/spr/MaterialValueModel";

export enum DeviceType {
    DEVICE_LOAD = 'DEVICE_LOAD'
}

export interface DeviceState {
    materialValueList: MaterialValueModel[];
    materialValueSelectPage:number;
    materialValueTotalElements: number;
}

interface DeviceLoadAction {
    type: DeviceType.DEVICE_LOAD;
    payload: { totalElements: number, number: number, content: MaterialValueModel[] };
}

export type DeviceAction =
    DeviceLoadAction
