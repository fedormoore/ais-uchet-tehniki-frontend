import {
    RefillingCartridgeListSendModel,
    RefillingCartridgeModel,
    RefillingCartridgeSendModel
} from "../../models/materialValueOrg/RefillingCartridgeModel";
import {MaterialValueOrgModel} from "../../models/MaterialValueOrgModel";

export const RefillingCartridgeToServerSave: any = (inData: RefillingCartridgeModel[]) => {
    let returnList: RefillingCartridgeSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as RefillingCartridgeSendModel;
        tmp = {
            contractId: inData[i].contract?.id,
            cartridge: inData[i].cartridge !== undefined ? AddDeviceSpeToServerSave(inData[i].cartridge) : null
        }
        returnList = returnList.concat(tmp);
    }

    return returnList;
}

const AddDeviceSpeToServerSave: any = (inData: MaterialValueOrgModel[]) => {
    let returnList: RefillingCartridgeListSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as RefillingCartridgeListSendModel;
        tmp = {
            id: inData[i].id,
        }
        returnList = returnList.concat(tmp);
    }
    return returnList;
}