import {FilterModel} from "../../../../../models/FilterModel";

export const filterMaterialValueOrgCabinet:FilterModel[] = [
    {
        title: 'Наименование МЦ',
        server: 'materialValue',
    },
    {
        title: 'Штрихкод',
        server: 'barcode',
    },
    {
        title: 'Статус',
        server: 'status',
    },
    {
        title: 'Организация',
        server: 'organization',
    },
    {
        title: 'Расположение',
        server: 'location',
    },
    {
        title: 'Бюджетный счет',
        server: 'budgetAccount',
    },
    {
        title: 'МОЛ',
        server: 'responsible',
    },
    {
        title: 'Инвентарный номер',
        server: 'invNumber',
    }
];