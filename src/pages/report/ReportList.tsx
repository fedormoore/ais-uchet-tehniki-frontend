import React, {FC, useState} from 'react';
import {Col, Input, Layout, Row, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import ReactResizeDetector from "react-resize-detector";
import {TableRowSelection} from "antd/es/table/interface";
import UserToLocation from "./setting/UserToLocation";
import Barcode from "./setting/Barcode";
import History from "./setting/History";
import MaterialValueOrgToLocation from "./setting/MaterialValueOrgToLocation";
import StatusCartridge from "./setting/StatusCartridge";
import Contract from "./setting/Contract";
import Statement from "./setting/Statemnt";

interface DataType {
    key: string;
    name: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name',
    }
];

const data: DataType[] = [
    {
        key: 'userToLocation',
        name: 'Сотрудники по кабинетам',
    },
    {
        key: 'materialValueOrgToLocation',
        name: 'Материальные ценности по кабинетам',
    },
    {
        key: 'statusCartridge',
        name: 'Состояние картриджей',
    },
    {
        key: 'contract',
        name: 'Контракты',
    },
    {
        key: 'statement',
        name: 'Заявления',
    },
    {
        key: 'barcode',
        name: 'Генерация штихкодов',
    },
    {
        key: 'history',
        name: 'История',
    },
];

interface ReportListProps {
    createReport: (response: any, name: string) => void;
}

const ReportList: FC<ReportListProps> = (props) => {

    const [searchReport, setSearchReport] = useState<string>('');
    const [selectRecordKey, setSelectRecordKey] = useState<React.Key[]>(['sprLocation']);

    const rowSelection: TableRowSelection<DataType> = {
        columnWidth: '0px',
        type: 'radio',
        renderCell: (checked, record, index, originNode) => '',
        selectedRowKeys: selectRecordKey,
    };

    const onClickRow = (record: any) => {
        setSelectRecordKey([record.key])
    }

    const onClick = () => {
        switch (selectRecordKey.toString()) {
            case "userToLocation": {
                return <UserToLocation
                    createReport={(response: any) => props.createReport(response, 'Сотрудники по кабинетам')}/>
            }
            case "materialValueOrgToLocation": {
                return <MaterialValueOrgToLocation
                    createReport={(response: any) => props.createReport(response, 'Материальные ценности по кабинетам')}/>
            }
            case "statusCartridge": {
                return <StatusCartridge
                    createReport={(response: any) => props.createReport(response, 'Состояние картриджей')}/>
            }
            case "contract": {
                return <Contract
                    createReport={(response: any) => props.createReport(response, 'Контракты')}/>
            }
            case "statement": {
                return <Statement
                    createReport={(response: any) => props.createReport(response, 'Заявления')}/>
            }
            case "barcode": {
                return <Barcode createReport={(response: any) => props.createReport(response, 'Генерация штихкодов')}/>
            }
            case "history": {
                return <History createReport={(response: any) => props.createReport(response, 'История')}/>
            }
            default: {
                return <></>
            }
        }
    };

    return (
        <Row wrap={false}>
            <Col flex="none">
                <div className="reportTab">
                    <Input placeholder="Поиск отчета..." onChange={(e) => setSearchReport(e.target.value)}/>
                    <ReactResizeDetector handleWidth handleHeight>{({height}) =>
                        <Layout>
                            <Table columns={columns}
                                   dataSource={data.filter((item) => item.name.toLowerCase().includes(searchReport.toLowerCase()))}
                                   pagination={false} size={"small"} showHeader={false}
                                   rowSelection={rowSelection}
                                   onRow={(record) => ({
                                       onClick: () => {
                                           onClickRow(record);
                                       }
                                   })}
                                   scroll={{x: '250px', y: `${height!}px`}}/>
                        </Layout>}
                    </ReactResizeDetector>
                </div>
            </Col>
            <Col flex="auto">
                <div>
                    {onClick()}
                </div>
            </Col>
        </Row>
    );
};

export default ReportList;