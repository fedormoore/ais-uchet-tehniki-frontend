import {
    DisassembleModel,
    DisassembleSendModel,
    DisassembleSpecSendModel
} from "../../models/materialValueOrg/DisassembleModel";
import {MaterialValueOrgModel} from "../../models/MaterialValueOrgModel";

export const DisassembleToServerSave: any = (inData: DisassembleModel[]) => {
    let returnList: DisassembleSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as DisassembleSendModel;
        tmp = {
            statementId: inData[i].statement?.id,
            locationId: inData[i].location?.id,
            budgetAccountId: inData[i].budgetAccount?.id,
            specification: inData[i].specification !== undefined ? DisassembleSpeToServerSave(inData[i].specification) : null
        }
        returnList = returnList.concat(tmp);
    }

    return returnList;
}

const DisassembleSpeToServerSave: any = (inData: MaterialValueOrgModel[]) => {
    let returnList: DisassembleSpecSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as DisassembleSpecSendModel;
        tmp = {
            id: inData[i].id,
        }
        returnList = returnList.concat(tmp);
    }
    return returnList;
}