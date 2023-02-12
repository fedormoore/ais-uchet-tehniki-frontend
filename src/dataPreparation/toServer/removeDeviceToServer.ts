import {
    RemoveDeviceModel,
    RemoveDeviceSendModel,
    RemoveDeviceSpecSendModel
} from "../../models/materialValueOrg/RemoveDeviceModel";
import {MaterialValueOrgModel} from "../../models/MaterialValueOrgModel";

export const RemoveDeviceToServerSave: any = (inData: RemoveDeviceModel[]) => {
    let returnList: RemoveDeviceSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as RemoveDeviceSendModel;
        tmp = {
            statementId: inData[i].statement?.id,
            locationId: inData[i].location.id,
            budgetAccountId: inData[i].budgetAccount.id,
            specification: inData[i].specification !== undefined ? RemoveDeviceSpeToServerSave(inData[i].specification) : null
        }
        returnList = returnList.concat(tmp);
    }

    return returnList;
}

const RemoveDeviceSpeToServerSave: any = (inData: MaterialValueOrgModel[]) => {
    let returnList: RemoveDeviceSpecSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as RemoveDeviceSpecSendModel;
        tmp = {
            id: inData[i].id,
        }
        returnList = returnList.concat(tmp);
    }
    return returnList;
}