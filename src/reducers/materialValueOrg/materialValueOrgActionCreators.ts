import {Request} from "../../http/network";
import {Dispatch} from "redux";
import {RegistryAction, RegistryType} from "./materialValueOrgTypes";
import {AppAction, TypeApp} from "../app/appTypes";
import {RegistryToStorageModel, RegistryToStorageSendModel} from "../../models/registy/action/RegistryToStorageModel";
import {RegistryToStorageToServerSave} from "../../dataPreparation/toServer/registryToStorageToServerSave";
import {UrlEnum} from "../../constants/urlEnum";
import {IncomeModel, IncomeSendModel} from "../../models/materialValueOrg/IncomeModel";
import {IncomeToServerSave} from "../../dataPreparation/toServer/incomeToServer";
import {StorageToCabinetModel, StorageToCabinetSendModel} from "../../models/materialValueOrg/StorageToCabinetModel";
import {StorageToCabinetToServerSave} from "../../dataPreparation/toServer/storageToCabinetToServerSave";
import {AssembleModel, AssembleSendModel} from "../../models/materialValueOrg/AssembleModel";
import {AssembleToServerSave} from "../../dataPreparation/toServer/assembleToServer";
import {DisassembleModel, DisassembleSendModel} from "../../models/materialValueOrg/DisassembleModel";
import {DisassembleToServerSave} from "../../dataPreparation/toServer/disassembleToServer";
import {AddDeviceModel, AddDeviceSendModel} from "../../models/materialValueOrg/AddDeviceModel";
import {AddDeviceToServerSave} from "../../dataPreparation/toServer/addDeviceToServer";
import {RemoveDeviceModel, RemoveDeviceSendModel} from "../../models/materialValueOrg/RemoveDeviceModel";
import {RemoveDeviceToServerSave} from "../../dataPreparation/toServer/removeDeviceToServer";
import {ReplacementDeviceModel, ReplacementDeviceSendModel} from "../../models/materialValueOrg/ReplacementDeviceModel";
import {ReplacementDeviceToServerSave} from "../../dataPreparation/toServer/replacementDeviceToServer";
import {RepairDeviceModel, RepairDeviceSendModel} from "../../models/materialValueOrg/RepairDeviceModel";
import {RepairDeviceToServerSave} from "../../dataPreparation/toServer/repairDeviceToServer";
import {RepairCartridgeModel, RepairCartridgeSendModel} from "../../models/materialValueOrg/RepairCartridgeModel";
import {RepairCartridgeToServerSave} from "../../dataPreparation/toServer/repairCartridgeToServer";
import {
    RefillingCartridgeModel,
    RefillingCartridgeSendModel
} from "../../models/materialValueOrg/RefillingCartridgeModel";
import {RefillingCartridgeToServerSave} from "../../dataPreparation/toServer/refillingCartridgeToServer";
import {WriteOffModel, WriteOffSendModel} from "../../models/materialValueOrg/WriteOffModel";
import {WriteOffToServerSave} from "../../dataPreparation/toServer/writeOffToServer";
import {DisposeOfModel, DisposeOfSendModel} from "../../models/materialValueOrg/DisposeOfModel";
import {DisposeOfToServerSave} from "../../dataPreparation/toServer/disposeOfToServer";
import {MaterialValueOrgModel, MaterialValueOrgModelSend} from "../../models/MaterialValueOrgModel";
import {MaterialValueOrgToServerSave} from "../../dataPreparation/toServer/materialValueOrgToServer";

export interface storageResult {
    isOk?: boolean;
}

export const MaterialValueOrgActionCreators = {
    cabinetLoadFromServer: (params: any) => async (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Загрузка данных с сервера..."}});
        Request({
            url: UrlEnum.MaterialValueOrgCabinetPage,
            method: "GET",
            params: params
        })
            .then((response) => {
                if (response.isOk) {
                    dispatch({type: RegistryType.REGISTRY_LOAD, payload: response.data})
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    storageLoadFromServer: (params: any) => async (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Загрузка данных с сервера..."}});
        Request({
            url: UrlEnum.MaterialValueOrgStoragePage,
            method: "GET",
            params: params
        })
            .then((response) => {
                if (response.isOk) {
                    dispatch({type: RegistryType.STORAGE_LOAD, payload: response.data})
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveMaterialValueOrg: (value: MaterialValueOrgModel) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveMaterialValueOrg: MaterialValueOrgModelSend = MaterialValueOrgToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgSave,
            method: "POST",
            body: JSON.stringify([saveMaterialValueOrg]),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveIncome: (value: IncomeModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveIncomeArr: IncomeSendModel = IncomeToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgIncome,
            method: "POST",
            body: JSON.stringify(saveIncomeArr),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveAssemble: (value: AssembleModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveAssemble: AssembleSendModel = AssembleToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgAssemble,
            method: "POST",
            body: JSON.stringify(saveAssemble),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveDisassemble: (value: DisassembleModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveDisassemble: DisassembleSendModel = DisassembleToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgDisassemble,
            method: "POST",
            body: JSON.stringify(saveDisassemble),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveAddDevice: (value: AddDeviceModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveAddDevice: AddDeviceSendModel = AddDeviceToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgAdd,
            method: "POST",
            body: JSON.stringify(saveAddDevice),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveRemoveDevice: (value: RemoveDeviceModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveRemoveDevice: RemoveDeviceSendModel = RemoveDeviceToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgRemove,
            method: "POST",
            body: JSON.stringify(saveRemoveDevice),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveReplacementDevice: (value: ReplacementDeviceModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveReplacementDevice: ReplacementDeviceSendModel = ReplacementDeviceToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgReplacement,
            method: "POST",
            body: JSON.stringify(saveReplacementDevice),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveRepairDevice: (value: RepairDeviceModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveRepairDevice: RepairDeviceSendModel = RepairDeviceToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgRepair,
            method: "POST",
            body: JSON.stringify(saveRepairDevice),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveReplacementCartridge: (value: RepairCartridgeModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveRepairCartridge: RepairCartridgeSendModel = RepairCartridgeToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgRepairCartridge,
            method: "POST",
            body: JSON.stringify(saveRepairCartridge),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveRefillingCartridge: (value: RefillingCartridgeModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveRefillingCartridge: RefillingCartridgeSendModel = RefillingCartridgeToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgRefillingCartridge,
            method: "POST",
            body: JSON.stringify(saveRefillingCartridge),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveWriteOff: (value: WriteOffModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveWriteOff: WriteOffSendModel = WriteOffToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgWriteOff,
            method: "POST",
            body: JSON.stringify(saveWriteOff),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveDisposeOf: (value: DisposeOfModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveDisposeOf: DisposeOfSendModel = DisposeOfToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgDisposeOf,
            method: "POST",
            body: JSON.stringify(saveDisposeOf),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveStorageToCabinet: (value: StorageToCabinetModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveStorageToCabinet: StorageToCabinetSendModel = StorageToCabinetToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgStorageToCabinet,
            method: "POST",
            body: JSON.stringify(saveStorageToCabinet),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
    saveCabinetToStorage: (value: RegistryToStorageModel[]) => (dispatch: Dispatch<RegistryAction | AppAction>) => {
        dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: true, message: "Сохранение данных..."}});

        let saveRegistryToStorage: RegistryToStorageSendModel = RegistryToStorageToServerSave(value);

        return Request({
            url: UrlEnum.MaterialValueOrgCabinetToStorage,
            method: "POST",
            body: JSON.stringify(saveRegistryToStorage),
        })
            .then((response) => {
                if (response.isOk) {
                    return {isOk: true} as storageResult
                } else {
                    dispatch({
                        type: TypeApp.NOTIFICATION,
                        payload: {type: 'error', message: 'Ошибка', description: response.data}
                    })
                    return {isOk: false} as storageResult
                }
            })
            .finally(() => {
                dispatch({type: TypeApp.MODAL_WAIT, payload: {visible: false, message: null}});
            })
    },
}