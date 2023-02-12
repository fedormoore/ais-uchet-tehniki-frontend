import React from "react";
import {ColumnsType} from "antd/es/table";
import {getDeviceName} from "../../../storage";
import {MaterialValueOrgHistoryModel} from "../../../../models/MaterialValueOrgHistoryModel";
import {Typography} from "antd";

const {Text} = Typography;

export type InterfaceType = 'contract' | 'statement';

interface ReasonSpecProps {
    interfaceType: InterfaceType;
}

export const reasonSpecColumns = (valueProps: ReasonSpecProps) => {

    const x = () => {
        let columnsTmp: ColumnsType<MaterialValueOrgHistoryModel> = columns;
        if (valueProps.interfaceType === 'statement') {
            columnsTmp = columnsTmp.filter(item => item.key !== 'sum')
        }
        if (valueProps.interfaceType === 'contract') {
            columnsTmp = columnsTmp.filter(item => item.key !== 'type')
        }
        return columnsTmp;
    }

    return x();
}

export const columns: ColumnsType<MaterialValueOrgHistoryModel> = [
    {
        title: 'Тип',
        dataIndex: 'type',
        key: 'type',
        width: '85px',
        fixed: true,
        render: (value, record, index) => {
            return record.type === 'BUDGET_ACCOUNT' ? <>Изменение бюджетного счета</> :
                    record.type === 'LOCATION' ? <>Изменение кабинета (склада)</> : <>{record.type}</>
        },
    },
    {
        title: 'Наименование МЦ',
        key: 'model',
        width: '330px',
        fixed: true,
        render: (record: MaterialValueOrgHistoryModel) => {
            return record.deleted ? <Text
                delete>{getDeviceName(record.materialValueOrg.materialValue)}</Text> : <>{getDeviceName(record.materialValueOrg.materialValue)}</>
        },
    },
    {
        title: 'Стоимость',
        dataIndex: 'sum',
        key: 'sum',
        width: '85px',
    }
];