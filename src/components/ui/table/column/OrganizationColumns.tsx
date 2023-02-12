import {ColumnsType} from "antd/es/table";
import {OrganizationModel} from "../../../../models/spr/OrganizationModel";
import {Typography} from "antd";

const {Text} = Typography;

export const organizationColumns: ColumnsType<OrganizationModel> = [
    {
        title: 'Тип',
        dataIndex: ['type'],
        key: 'type',
        width: '300px',
        render: (value, record, index) => record.deleted ? <Text delete>{value}</Text> : value
    },
    {
        title: 'Наименование',
        dataIndex: ['name'],
        key: 'name',
        render: (value, record, index) => record.deleted ? <Text delete>{value}</Text> : value
    }
];