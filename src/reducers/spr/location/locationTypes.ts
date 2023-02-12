import {LocationModel} from "../../../models/spr/LocationModel";

export enum LocationType {
    LOCATION_LOAD = 'LOCATION_LOAD'
}

export interface LocationState {
    locationList: LocationModel[];
}

interface LocationLoadAction {
    type: LocationType.LOCATION_LOAD;
    payload: LocationModel[];
}

export type LocationAction =
    LocationLoadAction