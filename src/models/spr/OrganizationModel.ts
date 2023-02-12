export interface OrganizationModel {
    id: string;
    type: string;
    name: string;
    children: OrganizationModel[];

    isServer: boolean;
    deleted: boolean;
}

export interface OrganizationSendModel {
    id: string;
    type: string;
    name: string;
    children: OrganizationSendModel[];
}

export interface OrganizationDeleteModel {
    id: string;
}