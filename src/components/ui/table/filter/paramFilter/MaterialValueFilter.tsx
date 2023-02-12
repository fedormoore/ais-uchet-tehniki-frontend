import {FilterModel} from "../../../../../models/FilterModel";

export const filterMaterialValue:FilterModel[] = [
    {
        title: 'Тип',
        server: 'materialValueType',
    },
    {
        title: 'Наименование в организации',
        server: 'nameInOrg',
    },
    {
        title: 'Фирма',
        server: 'nameFirm',
    },
    {
        title: 'Модель',
        server: 'nameModel',
    }
];