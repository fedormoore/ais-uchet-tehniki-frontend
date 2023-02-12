export interface LocationModel {
    id: string;
    type: string;
    name: string;
    children: LocationModel[];

    isServer: boolean;
    deleted: boolean;
}

export interface LocationSendModel {
    id: string;
    type: string;
    name: string;
    children: LocationSendModel[];
}

export interface LocationDeleteModel {
    id: string;
}