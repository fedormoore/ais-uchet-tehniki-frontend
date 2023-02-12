import {LocationAction, LocationState, LocationType} from "./locationTypes";

const initialState: LocationState = {
    locationList: []
}

export const locationReducer = (state = initialState, action: LocationAction): LocationState => {
    switch (action.type) {
        case LocationType.LOCATION_LOAD:
            return {...state, locationList: action.payload}
        default:
            return state
    }
}