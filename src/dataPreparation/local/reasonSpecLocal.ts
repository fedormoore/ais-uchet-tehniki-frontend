import {MaterialValueOrgHistoryModel} from "../../models/MaterialValueOrgHistoryModel";
import {v4 as uuid} from "uuid";

export const saveRecord: any = (contractSpecList: MaterialValueOrgHistoryModel[], saveRecord: MaterialValueOrgHistoryModel[]) => {
    let returnList: MaterialValueOrgHistoryModel[] = Object.assign([], contractSpecList);
    for (let i = 0; i < saveRecord.length; i++) {
        if (saveRecord[i].id === undefined) {
            saveRecord[i] = {...saveRecord[i], id: uuid(), isServer: false}
        }
        returnList = returnList.concat(saveRecord[i])
    }
    return returnList
}

export const deleteRecord: any = (contractSpecList: MaterialValueOrgHistoryModel[], indexDeleteRecord: number) => {
    let returnList: MaterialValueOrgHistoryModel[] = Object.assign([], contractSpecList);
    returnList[indexDeleteRecord] = {...returnList[indexDeleteRecord], deleted: true}
    return returnList
}

export const undoRecord: any = (contractSpecList: MaterialValueOrgHistoryModel[], indexDeleteRecord: number) => {
    let returnList: MaterialValueOrgHistoryModel[] = Object.assign([], contractSpecList);
    returnList[indexDeleteRecord] = {...returnList[indexDeleteRecord], deleted: false}
    return returnList
}