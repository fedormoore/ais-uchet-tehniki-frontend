import {DeviceTypeAction, DeviceTypeState, DeviceTypeType} from "./materialValueTypeTypes";

const initialState: DeviceTypeState = {
    materialValueTypeList: [],
    materialValueTypeTotalElements: 1,
    materialValueTypeSelectPage: 1
}

export const materialValueTypeReducer = (state = initialState, action: DeviceTypeAction): DeviceTypeState => {
    switch (action.type) {
        case DeviceTypeType.DEVICE_TYPE_LOAD:
            return {
                ...state,
                materialValueTypeTotalElements: action.payload.totalElements,
                materialValueTypeSelectPage: action.payload.number,
                materialValueTypeList: action.payload.content
            }
        default:
            return state
    }
}