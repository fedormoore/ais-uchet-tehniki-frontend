import {AddDeviceModel, AddDeviceSendModel, AddDeviceSpecSendModel} from "../../models/materialValueOrg/AddDeviceModel";
import {MaterialValueOrgModel} from "../../models/MaterialValueOrgModel";

export const AddDeviceToServerSave: any = (inData: AddDeviceModel[]) => {
    let returnList: AddDeviceSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as AddDeviceSendModel;
        tmp = {
            statementId: inData[i].statement?.id,
            inDeviceId: inData[i].inDevice.id,
            specification: inData[i].specification !== undefined ? AddDeviceSpeToServerSave(inData[i].specification) : null
        }
        returnList = returnList.concat(tmp);
    }

    return returnList;
}

const AddDeviceSpeToServerSave: any = (inData: MaterialValueOrgModel[]) => {
    let returnList: AddDeviceSpecSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as AddDeviceSpecSendModel;
        tmp = {
            id: inData[i].id,
        }
        returnList = returnList.concat(tmp);
    }
    return returnList;
}