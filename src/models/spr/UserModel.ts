import {LocationModel} from "./LocationModel";
import {OrganizationModel} from "./OrganizationModel";

export interface UserModel {
    id: string;
    lastName: string;
    firstName: string;
    middleNames: string;
    email: string;
    telephone: string;
    organizationFunction: string;
    location?: LocationModel;
    organization?: OrganizationModel;
    deleted: boolean;
}

export interface UserSendModel {
    id?: string;
    lastName: string;
    firstName: string;
    middleNames: string;
    email: string;
    telephone: string;
    organizationFunction: string;
    locationId?: string;
    organizationId?: string;
}

export interface UserDeleteModel {
    id: string;
}