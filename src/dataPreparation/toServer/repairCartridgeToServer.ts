import {RepairCartridgeModel, RepairCartridgeSendModel} from "../../models/materialValueOrg/RepairCartridgeModel";

export const RepairCartridgeToServerSave: any = (inData: RepairCartridgeModel[]) => {
    let returnList: RepairCartridgeSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as RepairCartridgeSendModel;
        tmp = {
            statementId: inData[i].statement?.id,
            locationId: inData[i].location.id,
            printerId: inData[i].printer.id,
            cartridgeId: inData[i].cartridge.id
        }
        returnList = returnList.concat(tmp);
    }

    return returnList;
}