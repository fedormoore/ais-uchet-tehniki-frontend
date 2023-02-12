import {AssembleModel, AssembleSendModel, AssembleSpecSendModel} from "../../models/materialValueOrg/AssembleModel";
import {MaterialValueOrgModel} from "../../models/MaterialValueOrgModel";

export const AssembleToServerSave: any = (inData: AssembleModel[]) => {
    let returnList: AssembleSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as AssembleSendModel;
        tmp = {
            statementId: inData[i].statement?.id,
            materialValueId: inData[i].materialValue?.id,
            locationId: inData[i].location?.id,
            budgetAccountId: inData[i].budgetAccount?.id,
            specification: inData[i].specification !== undefined ? AssembleSpeToServerSave(inData[i].specification) : null
        }
        returnList = returnList.concat(tmp);
    }

    return returnList;
}

const AssembleSpeToServerSave: any = (inData: MaterialValueOrgModel[]) => {
    let returnList: AssembleSpecSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as AssembleSpecSendModel;
        tmp = {
            id: inData[i].id,
        }
        returnList = returnList.concat(tmp);
    }
    return returnList;
}