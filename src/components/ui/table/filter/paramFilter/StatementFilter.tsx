import {FilterModel} from "../../../../../models/FilterModel";

export const filterStatement:FilterModel[] = [
    {
        title: 'Дата',
        server: 'date',
    },
    {
        title: 'Номер',
        server: 'number',
    },
    {
        title: 'Организация',
        server: 'organization',
    }
];