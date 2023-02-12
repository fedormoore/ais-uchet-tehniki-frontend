import {WriteOffModel, WriteOffSendModel, WriteOffSpecSendModel} from "../../models/materialValueOrg/WriteOffModel";
import {MaterialValueOrgModel} from "../../models/MaterialValueOrgModel";

export const WriteOffToServerSave: any = (inData: WriteOffModel[]) => {
    let returnList: WriteOffSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as WriteOffSendModel;
        tmp = {
            statementId: inData[i].statement?.id,
            specification: inData[i].specification !== undefined ? WriteOffSpeToServerSave(inData[i].specification) : null
        }
        returnList = returnList.concat(tmp);
    }

    return returnList;
}

const WriteOffSpeToServerSave: any = (inData: MaterialValueOrgModel[]) => {
    let returnList: WriteOffSpecSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as WriteOffSpecSendModel;
        tmp = {
            id: inData[i].id,
        }
        returnList = returnList.concat(tmp);
    }
    return returnList;
}