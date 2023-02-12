import {OrganizationModel} from "../../models/spr/OrganizationModel";
import {v4 as uuid} from "uuid";

export const organizationSaveRecord = (organizationChildrenList: OrganizationModel[], inData: OrganizationModel[]) => {
    let returnList: OrganizationModel[] = Object.assign([], organizationChildrenList);

    for (let i = 0; i < inData.length; i++) {

        if (inData[i].id === undefined) {
            inData[i] = {...inData[i], id: uuid(), isServer:false}
            returnList = saveRecordAdd(returnList, inData[i]);
        } else {
            returnList = saveRecordUpdate(returnList, inData[i]);
        }
    }
    return returnList;
}

const saveRecordAdd = (organizationList: OrganizationModel[], inData: OrganizationModel) => {
    let returnList: OrganizationModel[] = Object.assign([], organizationList);

        const saveRecordAddSub = (list: OrganizationModel[], inData: OrganizationModel) => {
            list.push(inData);
        }
        saveRecordAddSub(returnList, inData);

    return returnList;
}

const saveRecordUpdate: any = (organizationList: OrganizationModel[], inData: OrganizationModel) => {
    let returnList: OrganizationModel[] = Object.assign([], organizationList);

    function updateR(list: OrganizationModel[], i: number) {
        list[i] = inData;
    }
    
    const saveRecordUpdateRecordSub = (list: OrganizationModel[]) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === inData.id) {
                updateR(list, i);
                break;
            }
            if (list[i].children !== undefined) {
                saveRecordUpdateRecordSub(list[i].children!);
            }
        }
    }
    saveRecordUpdateRecordSub(returnList);
    
    return returnList;
}

export const deleteRecord: any = (organizationSpecList: OrganizationModel[], indexDeleteRecord: number) => {
    let returnList: OrganizationModel[] = Object.assign([], organizationSpecList);

    returnList[indexDeleteRecord] = {...returnList[indexDeleteRecord], deleted: true}

    return returnList
}

export const undoRecord: any = (organizationSpecList: OrganizationModel[], indexDeleteRecord: number) => {
    let returnList: OrganizationModel[] = Object.assign([], organizationSpecList);

    returnList[indexDeleteRecord] = {...returnList[indexDeleteRecord], deleted: false}

    return returnList
}