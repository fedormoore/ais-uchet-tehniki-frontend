import React from "react";
import {ColumnsType} from "antd/es/table";
import {LocationModel} from "../../../../models/spr/LocationModel";
import {Typography} from "antd";

const { Text } = Typography;

export const locationColumns: ColumnsType<LocationModel> = [
    {
        title: 'Тип',
        dataIndex: ['type'],
        key: 'type',
        width: '200px',
        render:(value, record, index)=> record.deleted ? <Text delete>{value}</Text> : value
    },
    {
        title: 'Наименование',
        dataIndex: ['name'],
        key: 'name',
        width: '200px',
        render:(value, record, index)=> record.deleted ? <Text delete>{value}</Text> : value
    }
];