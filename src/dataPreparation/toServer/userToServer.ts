import {UserDeleteModel, UserModel, UserSendModel} from "../../models/spr/UserModel";

export const UserToServerSave: any = (inData: UserModel[]) => {
    let returnList: UserSendModel[] = [];
    for (let i = 0; i < inData.length; i++) {
        let tmp = {} as UserSendModel;
        tmp = {
            lastName: inData[i].lastName,
            firstName: inData[i].firstName,
            middleNames: inData[i].middleNames || "",
            email: inData[i].email,
            telephone: inData[i].telephone || "",
            organizationFunction: inData[i].organizationFunction || "",
            locationId: inData[i].location?.id,
            organizationId: inData[i].organization?.id
        }
        if (inData[i].id !== undefined) {
            tmp = {...tmp, id: inData[i].id};
        }

        returnList = returnList.concat(tmp);
    }

    return returnList;
}

export const UserToServerDelete: any = (list: UserModel[]) => {
    let returnList: UserDeleteModel[] = [];

    for (let i = 0; i < list.length; i++) {
        if (list[i].deleted) {
            returnList = returnList.concat({id: list[i].id});
        }
    }

    return returnList;
}