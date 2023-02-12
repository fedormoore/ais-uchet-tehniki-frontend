import React, {FC, useState} from 'react';
import {
    DeviceHistoryChildren,
    DeviceHistoryParent,
    MaterialValueOrgHistoryModel
} from "../../../models/MaterialValueOrgHistoryModel";
import {historyColumns} from "../../../components/ui/table/column/HistoryColumns";
import {Empty, Table, Typography} from "antd";
import {TableRowSelection} from "antd/es/table/interface";
import {getDeviceName} from "../../../components/storage";
import {ColumnsType} from "antd/es/table";
import dayjs from "dayjs";

interface HistoryTabProps {
    historyEdit: (value: MaterialValueOrgHistoryModel) => void;
    loadValue: boolean
    value: MaterialValueOrgHistoryModel[];
}

const {Text} = Typography;

const HistoryTab: FC<HistoryTabProps> = (props) => {

    const [selectRecordKey, setSelectRecordKey] = useState<React.Key[]>([]);

    const rowMultiSelection: TableRowSelection<MaterialValueOrgHistoryModel> = {
        columnWidth: '0px',
        type: 'radio',
        renderCell: (checked, record, index, originNode) => '',
        onSelect: (record) => {
            setSelectRecordKey([record.id])
        },
        selectedRowKeys: selectRecordKey,
    };

    const onClickRow = (record: any) => {
        setSelectRecordKey([record.id])
    }

    const childrenExpandedRowRender = (record: MaterialValueOrgHistoryModel) => {

        const parentExpandedRowRender = (record: DeviceHistoryParent) => {
            const parentColumns: ColumnsType<DeviceHistoryParent> = [
                Table.EXPAND_COLUMN,
                {
                    title: 'Наименование МЦ',
                    key: 'model',
                    render: (value, record, index) => {
                        return <>{getDeviceName(record.materialValueOrg.materialValue)}</>
                    },
                },
                {
                    title: 'Основание',
                    dataIndex: ['reason'],
                    key: 'reason',
                    render: (value, record, index) => <>{renderReason(record)}</>
                    // width: '170px'
                }
            ];

            const renderReason = (record: DeviceHistoryParent) => {

                if (record !== null && record.reason !== undefined && record.reason !== null) {
                    if (record.type === 'Поступление') {
                        return <>{"Контракт от " + dayjs(record.reason?.date).format("DD.MM.YYYY") + " номер " + record.reason?.number!}</>
                    } else {
                        return <>{"Заявление от " + dayjs(record.reason?.date).format("DD.MM.YYYY") + " номер " + record.reason?.number!}</>
                    }
                } else {
                    return <></>
                }
            }
            if (record.parent !== null && record.parent !== undefined) {
                return (
                    <div style={{marginLeft: '55px'}}>
                        <Text>В составе:</Text>
                        <br/>
                        <Table rowKey={"id"} columns={parentColumns} dataSource={[record.parent!]}
                               pagination={false}
                               expandable={{
                                   expandedRowRender: (record) => parentExpandedRowRender(record),
                                   rowExpandable: (record) => record.parent !== null && record.parent !== undefined,
                               }}
                               childrenColumnName={"555"}
                        />
                    </div>
                );
            }
        }

        const childrenColumns: ColumnsType<DeviceHistoryChildren> = [
            Table.EXPAND_COLUMN,
            {
                title: 'Наименование МЦ',
                key: 'model',
                render: (record: DeviceHistoryChildren) => {
                    return <>{getDeviceName(record.materialValueOrg.materialValue)}</>
                }
            },
            {
                title: 'Основание',
                dataIndex: ['reason'],
                key: 'reason',
                render: (value, record, index) => <>{renderReason(record)}</>
                // width: '170px'
            }
        ];

        const parentColumns: ColumnsType<DeviceHistoryParent> = [
            Table.EXPAND_COLUMN,
            {
                title: 'Наименование МЦ',
                key: 'model',
                render: (value, record, index) => {
                    return <>{getDeviceName(record.materialValueOrg.materialValue)}</>
                },
            },
            {
                title: 'Основание',
                dataIndex: ['reason'],
                key: 'reason',
                render: (value, record, index) => <>{renderReason(record)}</>
                // width: '170px'
            }
        ];

        const renderReason = (record: DeviceHistoryParent | DeviceHistoryChildren) => {

            if (record !== null && record.reason !== undefined && record.reason !== null) {
                if (record.type === 'Поступление') {
                    return <>{"Контракт от " + dayjs(record.reason?.date).format("DD.MM.YYYY") + " номер " + record.reason?.number!}</>
                } else {
                    return <>{"Заявление от " + dayjs(record.reason?.date).format("DD.MM.YYYY") + " номер " + record.reason?.number!}</>
                }
            } else {
                return <></>
            }
        }
        if ((record.children !== null && record.children !== undefined) && (record.parent !== null && record.parent !== undefined)) {
            return (
                <div style={{marginLeft: '55px'}}>
                    <Text>Состоит из:</Text>
                    <br/>
                    <Table rowKey={"id"} columns={childrenColumns} dataSource={record.children}
                           pagination={false}/>

                    <Text>В составе:</Text>
                    <br/>
                    <Table rowKey={"id"} columns={parentColumns} dataSource={[record.parent!]}
                           pagination={false}/>
                </div>
            );
        }
        if (record.parent !== null && record.parent !== undefined) {
            return (
                <div style={{marginLeft: '55px'}}>
                    <Text>В составе:</Text>
                    <br/>
                    <Table rowKey={"id"} columns={parentColumns} dataSource={[record.parent!]}
                           pagination={false}
                           expandable={{
                               expandedRowRender: (record) => parentExpandedRowRender(record),
                               rowExpandable: (record) => record.parent !== null && record.parent !== undefined,
                           }}
                           childrenColumnName={"555"}
                    />
                </div>
            );
        }
        if (record.children!.length > 0) {
            return (
                <div style={{marginLeft: '55px'}}>
                    <Text>Состоит из:</Text>
                    <br/>
                    <Table rowKey={record => record.id} columns={childrenColumns} dataSource={record.children}
                           pagination={false}/>
                </div>
            );
        }
    }

    return (
        <div>
            <Table
                rowKey={'id'}
                loading={props.loadValue}
                locale={{
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                                      description="Нет данных"/>
                }}
                columns={historyColumns}
                expandable={{
                    expandedRowRender: (record) => childrenExpandedRowRender(record),
                    rowExpandable: (record) => (record.children !== null && record.children !== undefined) || (record.parent !== null && record.parent !== undefined),
                }}
                childrenColumnName={"555"}
                dataSource={props.value}
                pagination={false} size={'small'}
                className={"table-striped-rows"}
                rowSelection={rowMultiSelection}
                onRow={(record) => ({
                    onClick: () => {
                        onClickRow(record);
                    },
                    onDoubleClick: () => {
                        props.historyEdit(record);
                    },
                })}
            />
        </div>
    );
};

export default HistoryTab;