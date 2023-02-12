import {FilterModel} from "../../../../../models/FilterModel";

export const filterUser:FilterModel[] = [
    {
        title: 'E-mail',
        server: 'email',
    },
    {
        title: 'ФИО',
        server: 'fio',
    },
    {
        title: 'Телефон',
        server: 'telephone',
    },
    {
        title: 'Кабинет',
        server: 'location',
    },
    {
        title: 'Организация',
        server: 'organization',
    },
    {
        title: 'Должность',
        server: 'organizationFunction',
    }
];