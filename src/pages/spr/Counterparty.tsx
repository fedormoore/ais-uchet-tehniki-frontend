import React, {FC, useEffect, useState} from 'react';

import {Layout} from "antd";

import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import CounterpartyDrawer from "./drawer/CounterpartyDrawer";

import {CounterpartyModel} from "../../models/spr/CounterpartyModel";
import {
    CounterpartyActionCreators,
    counterpartyResult
} from "../../reducers/spr/counterparty/counterpartyActionCreators";
import TableCustom from "../../components/ui/table/TableCustom";
import {counterpartyColumns} from "../../components/ui/table/column/CounterpartyColumns";
import ButtonGroup, {buttonInterface, initButtonList} from "../../components/ui/ButtonGroup";
import {filterCounterparty} from "../../components/ui/table/filter/paramFilter/CounterpartyFilter";
import {FilterTagModel} from "../../models/FilterTagModel";

let selectDataCounterparty = {} as CounterpartyModel;
let filter = new URLSearchParams();
let filterList: FilterTagModel[] = []

const Counterparty: FC = () => {

    const {loadCounterparty, deleteCounterparty} = useActions(CounterpartyActionCreators);
    const {
        counterpartyList, counterpartySelectPage, counterpartyTotalElements
    } = useTypedSelector(state => state.counterparty)

    const [visibleCounterpartyDrawer, setVisibleCounterpartyDrawer] = useState<boolean>(false);
    const [button, setButton] = useState<buttonInterface>(initButtonList)

    const [selectRecord, setSelectRecord] = useState<CounterpartyModel[]>([]);

    useEffect(() => {
        if (counterpartyList.length === 0) {
            loadCounterparty();
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
        loadCounterparty(filter);
    }

    return (
        <Layout className={"parentTable"}>
            <ButtonGroup button={{
                ...button, buttonVoid: {
                    addRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataCounterparty = {} as CounterpartyModel;
                        setVisibleCounterpartyDrawer(true);
                    },
                    editRecord: () => {
                        setVisibleCounterpartyDrawer(true);
                    },
                    deleteRecord: () => {
                        (async function () {
                            selectRecord[0].deleted = true
                            const result: counterpartyResult = await deleteCounterparty(selectRecord) as counterpartyResult;
                            if (result.isOk) {
                                loadCounterparty();
                            } else {
                                selectRecord[0].deleted = false
                            }
                        })();
                    },
                    refreshRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataCounterparty = {} as CounterpartyModel;
                        loadCounterparty(filter);
                    }
                }
            }}/>
            <TableCustom multiSelect={false} dataSource={counterpartyList} columns={counterpartyColumns}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         pagination={{
                             selectPage: counterpartySelectPage + 1,
                             totalElements: counterpartyTotalElements,
                             onChangePage: (current: number, pageSize: number) => onChangePage(current, pageSize)
                         }}
                         returnDoubleClick={() => {
                             setVisibleCounterpartyDrawer(true);
                         }}
                         returnSelectRecords={(selectRecord) => {
                             setSelectRecord(selectRecord);
                             selectDataCounterparty = selectRecord[0];
                             setButton({...button, buttonDisable: {editRecord: false, deleteRecord: false}})
                         }}
                         filterIn={{
                             filterColumns: filterCounterparty,
                             applyFilter: (filterListServer, filterList) => onFilter(filterListServer, filterList),
                             filterList
                         }}
            />
            {visibleCounterpartyDrawer &&
                <CounterpartyDrawer counterpartyOpenDrawer={visibleCounterpartyDrawer}
                                    counterpartyCloseDrawer={() => setVisibleCounterpartyDrawer(!visibleCounterpartyDrawer)}
                                    counterpartyValues={selectDataCounterparty}/>
            }

        </Layout>
    );
};

export default Counterparty;