import {v4 as uuid} from 'uuid';
import {IncomeChildrenModel} from "../../models/materialValueOrg/IncomeModel";

export const incomeSaveRecord = (incomeChildrenList: IncomeChildrenModel[], inData: IncomeChildrenModel[]) => {
    let returnList: IncomeChildrenModel[] = Object.assign([], incomeChildrenList);

    for (let i = 0; i < inData.length; i++) {

        if (inData[i].id === undefined) {
            inData[i] = {...inData[i], id: uuid()}
            returnList = saveRecordAdd(returnList, inData[i]);
        } else {
            returnList = saveRecordUpdate(returnList, inData[i]);
        }
    }
    return returnList;
}

const saveRecordAdd = (incomeChildrenList: IncomeChildrenModel[], inData: IncomeChildrenModel) => {
    let returnList: IncomeChildrenModel[] = Object.assign([], incomeChildrenList);

    const saveRecordAddSub = (list: IncomeChildrenModel[], inData: IncomeChildrenModel) => {
            list.push(inData);
    }
    saveRecordAddSub(returnList, inData);

    return returnList
}

const saveRecordUpdate: any = (incomeChildrenList: IncomeChildrenModel[], inData: IncomeChildrenModel) => {
    let returnList: IncomeChildrenModel[] = Object.assign([], incomeChildrenList);

    function updateR(list: IncomeChildrenModel[], i: number) {
        list[i] = inData;
    }

    const saveRecordUpdateRecordSub = (list: IncomeChildrenModel[]) => {
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

export const incomeDeleteRecord = (incomeChildrenList: IncomeChildrenModel[], deleteRecord: IncomeChildrenModel) => {
    let returnList: IncomeChildrenModel[] = Object.assign([], incomeChildrenList);

    function deleteR(list: IncomeChildrenModel[], i: number) {
        list.splice(i, 1);
    }

    const deleteRecordSub = (list: IncomeChildrenModel[]) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === deleteRecord.id) {
                deleteR(list, i);
                break;
            }
            if (list[i].children !== undefined) {
                deleteRecordSub(list[i].children!);
            }
        }
    }
    deleteRecordSub(returnList);
    return returnList
}