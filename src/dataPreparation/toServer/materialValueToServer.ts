import {
    MaterialValueDeleteModel,
    MaterialValueModel,
    MaterialValueSendModel
} from "../../models/spr/MaterialValueModel";

export const MaterialValueToServerSave: any = (inData: MaterialValueModel[]) => {
    let returnList: MaterialValueSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as MaterialValueSendModel;
        tmp = {
            materialValueTypeId: inData[i].materialValueType?.id,
            nameInOrg: inData[i].nameInOrg,
            nameFirm: inData[i].nameFirm,
            nameModel: inData[i].nameModel
        }
        if (inData[i].id !== undefined) {
            tmp = {...tmp, id: inData[i].id};
        }
        returnList = returnList.concat(tmp);
    }
    return returnList;
}

export const MaterialValueToServerDelete: any = (list: MaterialValueModel[]) => {
    let returnList: MaterialValueDeleteModel[] = [];

    for (let i = 0; i < list.length; i++) {
        if (list[i].deleted) {
            returnList = returnList.concat({id: list[i].id});
        }
    }

    return returnList;
}