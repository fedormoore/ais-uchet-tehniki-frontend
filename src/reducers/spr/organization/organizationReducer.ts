import {OrganizationAction, OrganizationState, OrganizationType} from "./organizationTypes";

const initialState: OrganizationState = {
    organizationList: []
}

export const organizationReducer = (state = initialState, action: OrganizationAction): OrganizationState => {
    switch (action.type) {
        case OrganizationType.ORGANIZATION_LOAD:
            return {...state, organizationList: action.payload}
        default:
            return state
    }
}