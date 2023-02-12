import {DisposeOfModel, DisposeOfSendModel, DisposeOfSpecSendModel} from "../../models/materialValueOrg/DisposeOfModel";
import {MaterialValueOrgModel} from "../../models/MaterialValueOrgModel";

export const DisposeOfToServerSave: any = (inData: DisposeOfModel[]) => {
    let returnList: DisposeOfSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as DisposeOfSendModel;
        tmp = {
            contractId: inData[i].contract?.id,
            specification: inData[i].specification !== undefined ? DisposeOfSpeToServerSave(inData[i].specification) : null
        }
        returnList = returnList.concat(tmp);
    }

    return returnList;
}

const DisposeOfSpeToServerSave: any = (inData: MaterialValueOrgModel[]) => {
    let returnList: DisposeOfSpecSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as DisposeOfSpecSendModel;
        tmp = {
            id: inData[i].id,
        }
        returnList = returnList.concat(tmp);
    }
    return returnList;
}