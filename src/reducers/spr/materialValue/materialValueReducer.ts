import {DeviceAction, DeviceState, DeviceType} from "./materialValueTypes";

const initialState: DeviceState = {
    materialValueList: [],
    materialValueTotalElements: 1,
    materialValueSelectPage: 1
}

export const materialValueReducer = (state = initialState, action: DeviceAction): DeviceState => {
    switch (action.type) {
        case DeviceType.DEVICE_LOAD:
            return {
                ...state,
                materialValueTotalElements: action.payload.totalElements,
                materialValueSelectPage: action.payload.number,
                materialValueList: action.payload.content
            }
        default:
            return state
    }
}