import {HistoryEditSendModel, MaterialValueOrgHistoryModel} from "../../models/MaterialValueOrgHistoryModel";

export const HistoryToServerSave: any = (inData: MaterialValueOrgHistoryModel) => {
    let returnList: HistoryEditSendModel;

    returnList = {
        id: inData.id,
        reasonId: inData.reason !== undefined ? inData.reason.id : ''
    }
    return returnList;
}