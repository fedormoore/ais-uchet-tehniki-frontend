import {StorageToCabinetModel, StorageToCabinetSendModel} from "../../models/materialValueOrg/StorageToCabinetModel";

export const StorageToCabinetToServerSave: any = (inData: StorageToCabinetModel[]) => {
    let returnList: StorageToCabinetSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as StorageToCabinetSendModel;
        tmp = {
            statementId: inData[i].statement?.id,
            materialValueOrgId: inData[i].materialValueOrg.id,
            locationId: inData[i].location.id,
            userId: inData[i].user?.id,
            invNumber: inData[i].invNumber
        }
        returnList = returnList.concat(tmp);
    }

    return returnList;
}