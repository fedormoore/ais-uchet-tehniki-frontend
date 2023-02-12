import React from "react";
import {ColumnsType} from "antd/es/table";
import {MaterialValueOrgHistoryModel} from "../../../../models/MaterialValueOrgHistoryModel";
import dayjs from "dayjs";
import {Input, Table} from "antd";

const { TextArea } = Input;

export const historyColumns: ColumnsType<MaterialValueOrgHistoryModel> = [
    Table.EXPAND_COLUMN,
    {
        title: 'Дата',
        dataIndex: ['dateCreate'],
        key: 'dateCreate',
        width: '150px',
        render: (text: any) => <>{dayjs(text).format("DD.MM.YYYY")} </>
    },
    {
        title: 'Тип',
        dataIndex: ['type'],
        key: 'type',
        width: '230px'
    },
    {
        title: 'Старое значение',
        dataIndex: ['oldValue'],
        key: 'oldValue',
        width: '170px'
    },
    {
        title: 'Новое значение',
        dataIndex: ['newValue'],
        key: 'newValue',
        width: '170px'
    },
    {
        title: 'Основание',
        dataIndex: ['reason'],
        key: 'reason',
        render: (value, record, index) => <>{renderReason(record)}</>,
        width: '170px'
    },
    {
        title: 'Примечание',
        dataIndex: ['note'],
        key: 'note',
        render: (value, record, index) => <TextArea value={record.note} bordered={false} autoSize={true} readOnly={true}/>,
        // width: '170px'
    },
];

const renderReason = (record: MaterialValueOrgHistoryModel) => {
    if (record.reason!.id !== null) {
        if (record.type === 'Поступление') {
            return <>{"Контракт от " + dayjs(record.reason!.date).format("DD.MM.YYYY") + " номер " + record.reason!.number}</>
        } else {
            return <>{"Заявление от " + dayjs(record.reason!.date).format("DD.MM.YYYY") + " номер " + record.reason!.number}</>
        }
    }else{
        return <></>
    }
}