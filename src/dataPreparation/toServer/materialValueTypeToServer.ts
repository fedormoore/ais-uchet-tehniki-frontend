import {MaterialValueTypeDeleteModel, MaterialValueTypeModel} from "../../models/spr/MaterialValueTypeModel";

export const MaterialValueTypeToServerDelete: any = (list: MaterialValueTypeModel[]) => {
    let returnList: MaterialValueTypeDeleteModel[] = [];

    for (let i = 0; i < list.length; i++) {
        if (list[i].deleted) {
            returnList = returnList.concat({id: list[i].id});
        }
    }

    return returnList;
}