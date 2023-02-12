import {ColumnsType} from "antd/es/table";
import {MaterialValueModel} from "../../../../models/spr/MaterialValueModel";

export const materialValueColumns: ColumnsType<MaterialValueModel> = [
    {
        title: 'Тип',
        dataIndex: ['materialValueType', 'name'],
        key: 'materialValueType',
        width: '170px',
    },
    {
        title: 'Наименование в организации',
        dataIndex: ['nameInOrg'],
        key: 'name',
        width: '170px',
    },
    {
        title: 'Фирма',
        dataIndex: ['nameFirm'],
        key: 'name',
        width: '170px',
    },
    {
        title: 'Модель',
        dataIndex: ['nameModel'],
        key: 'name',
        width: '170px',
    }
];