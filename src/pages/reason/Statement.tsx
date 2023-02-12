import React, {FC, useEffect, useState} from 'react';

import {Layout} from "antd";

import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import TableCustom from "../../components/ui/table/TableCustom";
import {FilterTagModel} from "../../models/FilterTagModel";
import ButtonGroup, {buttonInterface, initButtonList} from "../../components/ui/ButtonGroup";
import {filterStatement} from "../../components/ui/table/filter/paramFilter/StatementFilter";
import {ReasonActionCreators, reasonResult} from "../../reducers/reason/reasonActionCreators";
import {ReasonModel} from "../../models/ReasonModel";
import {reasonColumns} from "../../components/ui/table/column/ReasonColumns";
import ReasonDrawer from "./drawer/ReasonDrawer";

let selectDataStatement = {} as ReasonModel;
let filter = new URLSearchParams();
let filterList: FilterTagModel[] = []

const Statement: FC = () => {

    const {statementLoadFromServer, reasonDeleteToServer} = useActions(ReasonActionCreators);
    const {
        statementList,
        statementTotalElements,
        statementSelectPage
    } = useTypedSelector(state => state.reason)

    const [visibleStatementDrawer, setVisibleStatementDrawer] = useState<boolean>(false);
    const [button, setButton] = useState<buttonInterface>(initButtonList)
    const [selectRecord, setSelectRecord] = useState<ReasonModel[]>([]);

    useEffect(() => {
        if (statementList.length === 0) {
            statementLoadFromServer();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function onChangePage(current: number, pageSize: number) {
        filter.set('page', current.toString());
        filter.set('limit', pageSize.toString());
        applyFilterChangePage();
    }

    function onFilter(filterListServer: URLSearchParams, filterListIn: FilterTagModel[]) {
        filter = filterListServer;
        filterList = filterListIn;
        applyFilterChangePage();
    }

    function applyFilterChangePage() {
        statementLoadFromServer(filter);
    }

    return (
        <Layout className={"parentTable"}>
            <ButtonGroup button={{
                ...button, buttonVoid: {
                    addRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataStatement = {} as ReasonModel;
                        setVisibleStatementDrawer(true);
                    },
                    editRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        setVisibleStatementDrawer(true);
                    },
                    deleteRecord: () => {
                        (async function () {
                            selectRecord[0].deleted = true
                            const result: reasonResult = await reasonDeleteToServer(selectRecord) as reasonResult;
                            if (result.isOk) {
                                statementLoadFromServer();
                            } else {
                                selectRecord[0].deleted = false
                            }
                        })();
                    },
                    refreshRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataStatement = {} as ReasonModel;
                        statementLoadFromServer(filter);
                    }
                }
            }}/>
            <TableCustom multiSelect={false} dataSource={statementList}
                         columns={reasonColumns({interfaceType: 'statement'})}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         pagination={{
                             selectPage: statementSelectPage + 1,
                             totalElements: statementTotalElements,
                             onChangePage: (current: number, pageSize: number) => onChangePage(current, pageSize)
                         }}
                         returnDoubleClick={() => {
                             setVisibleStatementDrawer(true);
                         }}
                         returnSelectRecords={(selectRecord) => {
                             setSelectRecord(selectRecord);
                             selectDataStatement = selectRecord[0];
                             setButton({...button, buttonDisable: {editRecord: false, deleteRecord: false}});
                         }}
                         filterIn={{
                             filterColumns: filterStatement,
                             applyFilter: (filterListServer, filterList) => onFilter(filterListServer, filterList),
                             filterList
                         }}
            />
            {visibleStatementDrawer &&
                <ReasonDrawer openDrawer={visibleStatementDrawer}
                              closeDrawer={() => setVisibleStatementDrawer(!visibleStatementDrawer)}
                              values={selectDataStatement} interfaceType={'statement'}
                              viewContractSpec={true}/>}
        </Layout>
    );
};

export default Statement;