import {MaterialValueOrgModel} from "../../models/MaterialValueOrgModel";

export enum RegistryType {
    REGISTRY_LOAD = 'REGISTRY_LOAD',
    STORAGE_LOAD = 'STORAGE_LOAD'
}

export interface RegistryState {
    storageList: MaterialValueOrgModel[];
    storageSelectPage: number;
    storageTotalElements: number;

    registryList: MaterialValueOrgModel[];
    registrySelectPage: number;
    registryTotalElements: number;
}

interface RegistryLoadAction {
    type: RegistryType.REGISTRY_LOAD;
    payload: { totalElements: number, number: number, content: MaterialValueOrgModel[] };
}

interface StorageLoadAction {
    type: RegistryType.STORAGE_LOAD;
    payload: { totalElements: number, number: number, content: MaterialValueOrgModel[] };
}

export type RegistryAction =
    | RegistryLoadAction
    | StorageLoadAction
