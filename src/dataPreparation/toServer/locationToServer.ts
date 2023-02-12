import {LocationDeleteModel, LocationModel, LocationSendModel} from "../../models/spr/LocationModel";

export const LocationToServerDelete: any = (list: LocationModel[]) => {
    let returnList: LocationDeleteModel[] = [];

    const searchDeleted = (list: LocationModel[]) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i].children !== undefined) {
                searchDeleted(list[i].children)
            }
            if (list[i].deleted && list[i].isServer === undefined) {
                returnList = returnList.concat({id: list[i].id});
            }
        }
    }
    searchDeleted(list)

    return returnList;
}

export const LocationToServerSave: any = (list: LocationModel[]) => {
    let returnList: LocationSendModel[] = [];

    const searchSave = (list: LocationModel[]) => {
        for (let i = 0; i < list.length; i++) {
            if (!list[i].deleted) {
                returnList = returnList.concat({
                    id: list[i].isServer === undefined ? list[i].id : '',
                    type: list[i].type,
                    name: list[i].name,
                    children: list[i].children !== undefined && list[i].children.length > 0 ? LocationToServerSave(list[i].children) : null
                });
            }
        }
    }
    searchSave(list)

    return returnList;
}
