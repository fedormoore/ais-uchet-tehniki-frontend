import {CounterpartyModel} from "./spr/CounterpartyModel";
import {OrganizationModel} from "./spr/OrganizationModel";
import {MaterialValueOrgHistoryModel} from "./MaterialValueOrgHistoryModel";

export interface ReasonModel {
    id: string;
    date: string | null;
    number: string;
    sum: number;
    counterparty: CounterpartyModel;
    organization: OrganizationModel;
    spec: MaterialValueOrgHistoryModel[];
    deleted: boolean;
}

export interface ReasonSendModel {
    id?: string
    date: string | null;
    number: string;
    sum?: number;
    counterpartyId?: string;
    organizationId?: string;
    spec?: ReasonSpecSendModel[];
}

export interface ReasonSpecSendModel {
    id: string;
}

export interface ReasonSpecDeleteModel {
    id: string;
}

export interface ReasonDeleteModel {
    id: string;
}