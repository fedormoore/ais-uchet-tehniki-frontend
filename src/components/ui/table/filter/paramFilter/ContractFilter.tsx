import {FilterModel} from "../../../../../models/FilterModel";

export const filterContract:FilterModel[] = [
    {
        title: 'Дата',
        server: 'date',
    },
    {
        title: 'Номер',
        server: 'number',
    },
    {
        title: 'Сумма',
        server: 'sum',
    },
    {
        title: 'Поставщик',
        server: 'counterparty',
    },
    {
        title: 'Организация',
        server: 'organization',
    }
];