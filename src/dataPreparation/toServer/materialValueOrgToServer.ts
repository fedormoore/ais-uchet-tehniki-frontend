import {MaterialValueOrgModel, MaterialValueOrgModelSend} from "../../models/MaterialValueOrgModel";

export const MaterialValueOrgToServerSave: any = (inData: MaterialValueOrgModel) => {
    let returnList: MaterialValueOrgModelSend;

    returnList = {
        id: inData.id,
        barcode: inData.barcode,
        locationId: inData.location?.id,
        budgetAccountId: inData.budgetAccount?.id,
        responsibleId: inData.responsible?.id,
        userId: inData.user?.id,
        invNumber: inData.invNumber
    }
    return returnList;
}