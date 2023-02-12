import {RepairDeviceModel, RepairDeviceSendModel} from "../../models/materialValueOrg/RepairDeviceModel";

export const RepairDeviceToServerSave: any = (inData: RepairDeviceModel[]) => {
    let returnList: RepairDeviceSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as RepairDeviceSendModel;
        tmp = {
            statementId: inData[i].statement?.id,
            deviceId: inData[i].device.id,
            note: inData[i].note
        }
        returnList = returnList.concat(tmp);
    }

    return returnList;
}