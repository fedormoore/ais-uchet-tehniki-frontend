import {ColumnsType} from "antd/es/table";
import {UserModel} from "../../../../models/spr/UserModel";

export const userColumns: ColumnsType<UserModel> = [
    {
        title: 'E-mail',
        dataIndex: ['email'],
        key: 'email',
        width: '170px',
    },
    {
        title: 'ФИО',
        key: 'FIO',
        width: '150px',
        render: (value, record, index) => <>{record.lastName + " " + record.firstName + " " + record.middleNames}</>
    },
    {
        title: 'Телефон',
        dataIndex: ['telephone'],
        key: 'telephone',
        width: '150px',
    },
    {
        title: 'Кабинет',
        dataIndex: ['location', 'name'],
        key: 'location',
        width: '100px',
    },
    {
        title: 'Организация',
        dataIndex: ['organization', 'name'],
        key: 'organization',
        width: '100px',
    },
    {
        title: 'Должность',
        dataIndex: ['organizationFunction'],
        key: 'organizationFunction',
        width: '100px',
    }
];