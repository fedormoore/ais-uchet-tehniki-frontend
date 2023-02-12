import {RegistryAction, RegistryState, RegistryType} from "./materialValueOrgTypes";

const initialState: RegistryState = {
    storageList: [],
    storageTotalElements: 1,
    storageSelectPage: 1,

    registryList: [],
    registryTotalElements: 1,
    registrySelectPage: 1
}

export const materialValueOrgReducer = (state = initialState, action: RegistryAction): RegistryState => {
    switch (action.type) {
        case RegistryType.REGISTRY_LOAD:
            return {
                ...state,
                registryTotalElements: action.payload.totalElements,
                registrySelectPage: action.payload.number,
                registryList: action.payload.content
            }
        case RegistryType.STORAGE_LOAD:
            return {
                ...state,
                storageTotalElements: action.payload.totalElements,
                storageSelectPage: action.payload.number,
                storageList: action.payload.content
            }
        default:
            return state
    }
}