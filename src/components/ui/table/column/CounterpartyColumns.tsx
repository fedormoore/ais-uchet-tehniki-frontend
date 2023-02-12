import {ColumnsType} from "antd/es/table";
import {CounterpartyModel} from "../../../../models/spr/CounterpartyModel";

export const counterpartyColumns: ColumnsType<CounterpartyModel> = [
    {
        title: 'Наименование организации',
        dataIndex: ['name'],
        key: 'name',
        width: '170px',
    },
    {
        title: 'ИНН',
        dataIndex: ['inn'],
        key: 'inn',
        width: '150px',
    },
    {
        title: 'Телефон',
        dataIndex: ['telephone'],
        key: 'telephone',
        width: '150px',
    },
    {
        title: 'E-mail',
        dataIndex: ['email'],
        key: 'email',
        width: '150px',
    },
    {
        title: 'Контактное лицо',
        dataIndex: ['contact'],
        key: 'contact',
        width: '150px',
    }
];