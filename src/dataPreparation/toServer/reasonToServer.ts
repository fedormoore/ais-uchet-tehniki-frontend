import {
    ReasonDeleteModel,
    ReasonModel,
    ReasonSendModel,
    ReasonSpecDeleteModel,
    ReasonSpecSendModel
} from "../../models/ReasonModel";
import {MaterialValueOrgHistoryModel} from "../../models/MaterialValueOrgHistoryModel";

export const ReasonToServerSave: any = (inData: ReasonModel, type: string) => {
    let returnList: ReasonSendModel;
    returnList = {
        date: inData.date,
        number: inData.number,
        sum: inData.sum,
        counterpartyId: inData.counterparty?.id,
        organizationId: inData.organization?.id,
        spec: inData.spec !== undefined ? ReasonSpecToServerSave(inData) : null
    }
    if (inData.id !== undefined) {
        returnList = {...returnList, id: inData.id};
    }
    return returnList;
}

export const ReasonSpecToServerSave: any = (inData: ReasonModel) => {
    let returnList: ReasonSpecSendModel[] = [];
    for (let i = 0; i < inData.spec.length; i++) {
        let tmp = {} as ReasonSpecSendModel;
        tmp = {
            id: inData.spec[i].id,
        }
        returnList = returnList.concat(tmp);
    }
    return returnList;
}

export const ReasonSpecToServerDelete: any = (list: MaterialValueOrgHistoryModel[]) => {
    let returnList: ReasonSpecDeleteModel[] = [];
    if (list !== undefined) {
        for (let i = 0; i < list.length; i++) {
            let tmp = {} as ReasonSpecDeleteModel;
            tmp = {
                id: list[i].id,
            }
            returnList = returnList.concat(tmp);
        }
    }
    return returnList;
}

export const ReasonToServerDelete: any = (list: ReasonModel[]) => {
    let returnList: ReasonDeleteModel[] = [];

    for (let i = 0; i < list.length; i++) {
        if (list[i].deleted) {
            returnList = returnList.concat({id: list[i].id});
        }
    }

    return returnList;
}