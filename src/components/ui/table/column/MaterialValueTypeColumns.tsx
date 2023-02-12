import React from "react";
import {ColumnsType} from "antd/es/table";
import {MaterialValueTypeModel} from "../../../../models/spr/MaterialValueTypeModel";
import {Checkbox} from "antd";

export const materialValueTypeColumns: ColumnsType<MaterialValueTypeModel> = [
    {
        title: 'Наименование',
        dataIndex: ['name'],
        key: 'name',
        width: '170px',
    },
    {
        title: 'Возможность добавления в состав других МЦ',
        dataIndex: ['addToOther'],
        key: 'addToOther',
        width: '170px',
        render:(value, record, index)=><Checkbox checked={record.addToOther}></Checkbox>
    },
    {
        title: 'Возможность добавления в себя других МЦ',
        dataIndex: ['addOther'],
        key: 'addOther',
        width: '170px',
        render:(value, record, index)=><Checkbox checked={record.addOther}></Checkbox>
    }
];