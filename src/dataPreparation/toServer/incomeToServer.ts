import {
    IncomeChildrenModel,
    IncomeChildrenSendModel,
    IncomeModel,
    IncomeSendModel,
    IncomeSpecificationModel,
    IncomeSpecificationSendModel
} from "../../models/materialValueOrg/IncomeModel";

export const IncomeToServerSave: any = (inData: IncomeModel) => {
    let returnList: IncomeSendModel = {} as IncomeSendModel;
    returnList = {
        organizationId: inData.organization?.id,
        contractId: inData.contract?.id,
        locationId: inData.location?.id,
        responsibleId: inData.responsible?.id,
        spec: inData.spec !== undefined ? IncomeSpecificationToServerSave(inData.spec) : null
    }
    return returnList;
}

const IncomeSpecificationToServerSave: any = (inData: IncomeSpecificationModel[]) => {
    let returnList: IncomeSpecificationSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as IncomeSpecificationSendModel;
        tmp = {
            materialValueId: inData[i].materialValue?.id,
            sum: inData[i].sum,
            budgetAccountId: inData[i].budgetAccount?.id,
            children: inData[i].children !== undefined ? IncomeChildrenToServerSave(inData[i].children) : null
        }
        returnList = returnList.concat(tmp);
    }
    return returnList;
}

const IncomeChildrenToServerSave: any = (inData: IncomeChildrenModel[]) => {
    let returnList: IncomeChildrenSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as IncomeChildrenSendModel;
        tmp = {
            materialValueId: inData[i].materialValue?.id,
            sum: inData[i].sum,
            children: inData[i].children !== undefined ? IncomeChildrenToServerSave(inData[i].children) : null
        }
        returnList = returnList.concat(tmp);
    }
    return returnList;
}