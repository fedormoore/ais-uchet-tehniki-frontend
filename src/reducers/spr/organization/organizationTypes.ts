import {OrganizationModel} from "../../../models/spr/OrganizationModel";

export enum OrganizationType {
    ORGANIZATION_LOAD = 'ORGANIZATION_LOAD'
}

export interface OrganizationState {
    organizationList: OrganizationModel[];
}

interface OrganizationLoadAction {
    type: OrganizationType.ORGANIZATION_LOAD;
    payload: OrganizationModel[];
}

export type OrganizationAction =
    OrganizationLoadAction