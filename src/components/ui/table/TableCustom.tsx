import React, {FC, useEffect, useState} from 'react';
import {Empty, Layout, Pagination, Row, Spin, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {TableRowSelection} from "antd/es/table/interface";
import {isParent} from "../../storage";
import ReactResizeDetector from "react-resize-detector";
import {Content} from "antd/es/layout/layout";
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import FilterCollapse from "./filter/FilterCollapse";
import SelectRecordCollapse from "./SelectRecordCollapse";
import {FilterTagModel} from "../../../models/FilterTagModel";

interface TableMultiSelectProps {
    dataSource: object[];
    columns: ColumnsType<any>;
    multiSelect: boolean;
    selectRecordIn: any;
    returnSelectRecords: (selectRecord: any) => void;
    returnDoubleClick?: () => void;
    filterIn?: { filterColumns: any, applyFilter: (filterListServer: any, filterList: FilterTagModel[]) => void, filterList: FilterTagModel[] };
    spinningLoading: boolean;
    selectChildren?: boolean;
    selectParent?: boolean;
    selectRecordView?: boolean;
    expandable?: boolean;
    pagination?: { selectPage: number, totalElements: number, onChangePage: (current: number, pageSize: number) => void }
}

const TableCustom: FC<TableMultiSelectProps> = (props) => {

    const [selectRecordKey, setSelectRecordKey] = useState<React.Key[]>([]);

    useEffect(() => {
        if (props.selectRecordIn[0]?.id !== selectRecordKey[0]) {
            setSelectRecordKey(props.selectRecordIn)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selectRecordIn])

    const rowMultiSelection: TableRowSelection<MaterialValueOrgModel> = {
        columnWidth: props.multiSelect ? '' : '0px',
        type: props.multiSelect ? 'checkbox' : 'radio',
        renderCell: (checked, record, index, originNode) => props.multiSelect ? originNode : '',
        getCheckboxProps: (record) => ({
            disabled: (props.selectChildren !== undefined && (props.selectChildren || isParent(record, props.dataSource))) || (props.selectParent !== undefined && (props.selectParent || !isParent(record, props.dataSource)))
        }),
        onSelect: (record) => {
            changeSelectRecord(record);
        },
        selectedRowKeys: selectRecordKey,
    };

    const onClickRow = (record: any) => {
        if (props.selectRecordIn.length > 1) {
        } else {
            if ((props.selectChildren === undefined && (props.selectChildren || isParent(record, props.dataSource))) || (props.selectParent === undefined && (props.selectParent || !isParent(record, props.dataSource)))) {
                props.returnSelectRecords([record]);
                setSelectRecordKey([record.id])
            }
        }
    }

    const changeSelectRecord = (record: any) => {
        if ((props.selectChildren === undefined && (props.selectChildren || isParent(record, props.dataSource))) || (props.selectParent === undefined && (props.selectParent || !isParent(record, props.dataSource)))) {
            if (props.selectRecordIn.some((el: any) => el.id === record.id)) {
                unSelect(record.id);
            } else {
                if (props.multiSelect) {
                    props.returnSelectRecords([...props.selectRecordIn, record]);
                    setSelectRecordKey([...selectRecordKey, record.id])
                } else {
                    props.returnSelectRecords([record]);
                    setSelectRecordKey([record.id])
                }
            }
        }
    }

    const unSelect = (id: string) => {
        props.returnSelectRecords!(props.selectRecordIn.filter((el: any) => el.id !== id));
        setSelectRecordKey(selectRecordKey.filter((el: any) => el !== id))
    }

    return (
        <Layout className={"parentTable"}>
            <Content className={"childrenTable"}>
                <div>
                    {props.selectRecordView && <SelectRecordCollapse multiSelect={props.multiSelect}
                                                                     changeSelectRecord={(record: any) => changeSelectRecord(record)}
                                                                     selectRow={(record: any) => changeSelectRecord(record)}
                                                                     unSelect={(id: any) => unSelect(id)}
                                                                     selectRecordIn={props.selectRecordIn}/>}
                    {props.filterIn?.filterColumns && <FilterCollapse filterIn={props.filterIn}/>}
                </div>
                <ReactResizeDetector handleWidth handleHeight>{({height}) =>
                    <Layout>
                        <Spin tip="Получение данных..." spinning={props.spinningLoading}>
                            <Table
                                size="small"
                                rowKey="id"
                                dataSource={props.dataSource}
                                columns={props.columns}
                                bordered
                                locale={{
                                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                      description="Нет данных"/>
                                }}
                                className={"table-striped-rows"}
                                onRow={(record) => ({
                                    onClick: () => {
                                        onClickRow(record);
                                    },
                                    onDoubleClick: () => {
                                        if (props.returnDoubleClick !== undefined && ((props.selectChildren === undefined && (props.selectChildren || isParent(record, props.dataSource))) || (props.selectParent === undefined && (props.selectParent || !isParent(record, props.dataSource))))) {
                                            props.returnDoubleClick();
                                        }
                                    },
                                })}
                                rowSelection={rowMultiSelection}
                                scroll={{x: 'true', y: `${height! - 43}px`}}
                                pagination={false}
                                expandable={{showExpandColumn: props.expandable !== undefined}}
                            >
                            </Table>
                        </Spin>
                    </Layout>}
                </ReactResizeDetector>
            </Content>
            {props.pagination &&
                <Content className={"childrenTable"} style={{minHeight: "25px", maxHeight: "25px"}}>
                    <Row justify={"end"}>
                        <Pagination
                            size={"small"}
                            total={props.pagination.totalElements}
                            current={props.pagination.selectPage}
                            pageSizeOptions={[20, 50, 100]}
                            defaultPageSize={20}
                            showSizeChanger
                            onChange={(current, pageSize) => props.pagination?.onChangePage(current, pageSize)}
                        />
                    </Row>
                </Content>
            }
        </Layout>
    );
};

export default TableCustom;