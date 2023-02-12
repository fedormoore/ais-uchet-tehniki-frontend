import {OrganizationDeleteModel, OrganizationModel, OrganizationSendModel} from "../../models/spr/OrganizationModel";

export const OrganizationToServerDelete: any = (list: OrganizationModel[]) => {
    let returnList: OrganizationDeleteModel[] = [];

    const searchDeleted = (list: OrganizationModel[]) => {
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

export const OrganizationToServerSave: any = (list: OrganizationModel[]) => {
    let returnList: OrganizationSendModel[] = [];

    const searchSave = (list: OrganizationModel[]) => {
        for (let i = 0; i < list.length; i++) {
            if (!list[i].deleted) {
                returnList = returnList.concat({
                    id: list[i].isServer === undefined ? list[i].id : '',
                    type: list[i].type,
                    name: list[i].name,
                    children: list[i].children !== undefined && list[i].children.length > 0 ? OrganizationToServerSave(list[i].children) : null
                });
            }
        }
    }
    searchSave(list)

    return returnList;
}
