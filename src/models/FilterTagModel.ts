import {FilterModel} from "./FilterModel";

export interface FilterTagModel {
    id: string;
    column: FilterModel;
    param: string;
}