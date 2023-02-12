import {RegistryToStorageModel, RegistryToStorageSendModel} from "../../models/registy/action/RegistryToStorageModel";

export const RegistryToStorageToServerSave: any = (inData: RegistryToStorageModel[]) => {
    let returnList: RegistryToStorageSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as RegistryToStorageSendModel;
        tmp = {
            statementId: inData[i].statement?.id,
            materialValueOrgId: inData[i].materialValueOrg.id,
            locationId: inData[i].location.id,
        }
        returnList = returnList.concat(tmp);
    }

    return returnList;
}