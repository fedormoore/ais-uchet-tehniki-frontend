import React from "react";
import {ColumnsType} from "antd/es/table";
import {ReasonModel} from "../../../../models/ReasonModel";
import dayjs from "dayjs";

export type InterfaceType = 'contract' | 'statement';

interface ReasonProps {
    interfaceType: InterfaceType;
}

export const reasonColumns = (valueProps: ReasonProps) => {

    const x = () => {
        let columnsTmp: ColumnsType<ReasonModel> = columns;
        if (valueProps.interfaceType === 'statement') {
            columnsTmp = columnsTmp.filter(item => item.key !== 'contract')
        }
        if (valueProps.interfaceType === 'contract') {
            columnsTmp = columnsTmp.filter(item => item.key !== 'statement')
        }
        return columnsTmp;
    }

    return x();
}

export const columns: ColumnsType<ReasonModel> = [
    {
        title: 'Контракт',
        key: 'contract',
        children: [
            {
                title: 'Дата',
                dataIndex: 'date',
                key: 'dataCon',
                width: '60px',
                render: (text: any) => <>{dayjs(text).format("DD.MM.YYYY")} </>,
            },
            {
                title: 'Номер',
                dataIndex: 'number',
                key: 'numberCon',
                width: '60px',
            },
            {
                title: 'Сумма',
                dataIndex: 'sum',
                key: 'sumCon',
                width: '60px',
            },
            {
                title: 'Поставщик',
                dataIndex: ['counterparty', 'name'],
                key: 'counterparty',
                width: '200px',
            },
        ]
    },
    {
        title: 'Заявление',
        key: 'statement',
        children: [
            {
                title: 'Дата',
                dataIndex: 'date',
                key: 'dataCon',
                width: '60px',
                render: (text: any) => <>{dayjs(text).format("DD.MM.YYYY")} </>,
            },
            {
                title: 'Номер',
                dataIndex: 'number',
                key: 'numberCon',
                width: '60px',
            }
        ]
    },
    {
        title: 'Организация',
        dataIndex: ['organization', 'name'],
        key: 'organization',
        width: '200px',
    }
];