import {FilterModel} from "../../../../../models/FilterModel";

export const filterCounterparty:FilterModel[] = [
    {
        title: 'Наименование организации',
        server: 'name',
    },
    {
        title: 'ИНН',
        server: 'inn',
    },
    {
        title: 'Телефон',
        server: 'telephone',
    },
    {
        title: 'E-mail',
        server: 'email',
    },
    {
        title: 'Контактное лицо',
        server: 'contact',
    }
];