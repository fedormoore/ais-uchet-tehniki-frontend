import {ReplacementDeviceModel, ReplacementDeviceSendModel} from "../../models/materialValueOrg/ReplacementDeviceModel";

export const ReplacementDeviceToServerSave: any = (inData: ReplacementDeviceModel[]) => {
    let returnList: ReplacementDeviceSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as ReplacementDeviceSendModel;
        tmp = {
            statementId: inData[i].statement?.id,
            locationId: inData[i].location.id,
            budgetAccountId: inData[i].budgetAccount.id,
            replacementInDeviceId: inData[i].replacementInDevice.id,
            replacementToDeviceId: inData[i].replacementToDevice.id
        }
        returnList = returnList.concat(tmp);
    }

    return returnList;
}