import {CounterpartyDeleteModel, CounterpartyModel} from "../../models/spr/CounterpartyModel";

export const CounterpartyToServerDelete: any = (list: CounterpartyModel[]) => {
    let returnList: CounterpartyDeleteModel[] = [];

    for (let i = 0; i < list.length; i++) {
        if (list[i].deleted) {
            returnList = returnList.concat({id: list[i].id});
        }
    }

    return returnList;
}