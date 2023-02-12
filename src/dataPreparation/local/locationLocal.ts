import {LocationModel} from "../../models/spr/LocationModel";
import {v4 as uuid} from "uuid";

export const locationSaveRecord = (locationChildrenList: LocationModel[], inData: LocationModel[]) => {
    let returnList: LocationModel[] = Object.assign([], locationChildrenList);

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

const saveRecordAdd = (locationList: LocationModel[], inData: LocationModel) => {
    let returnList: LocationModel[] = Object.assign([], locationList);

    const saveRecordAddSub = (list: LocationModel[], inData: LocationModel) => {
        list.push(inData);
    }
    saveRecordAddSub(returnList, inData);

    return returnList;
}

const saveRecordUpdate: any = (locationList: LocationModel[], inData: LocationModel) => {
    let returnList: LocationModel[] = Object.assign([], locationList);

    function updateR(list: LocationModel[], i: number) {
        list[i] = inData;
    }

    const saveRecordUpdateRecordSub = (list: LocationModel[]) => {
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

export const deleteRecord: any = (locationSpecList: LocationModel[], indexDeleteRecord: number) => {
    let returnList: LocationModel[] = Object.assign([], locationSpecList);

    returnList[indexDeleteRecord] = {...returnList[indexDeleteRecord], deleted: true}

    return returnList
}

export const undoRecord: any = (locationSpecList: LocationModel[], indexDeleteRecord: number) => {
    let returnList: LocationModel[] = Object.assign([], locationSpecList);

    returnList[indexDeleteRecord] = {...returnList[indexDeleteRecord], deleted: false}

    return returnList
}