import React, {FC, useEffect, useState} from 'react';

import {Layout} from "antd";

import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {ReasonModel} from "../../models/ReasonModel";
import ReasonDrawer from "./drawer/ReasonDrawer";
import {ReasonActionCreators, reasonResult} from "../../reducers/reason/reasonActionCreators";
import TableCustom from "../../components/ui/table/TableCustom";
import {reasonColumns} from "../../components/ui/table/column/ReasonColumns";
import {FilterTagModel} from "../../models/FilterTagModel";
import ButtonGroup, {buttonInterface, initButtonList} from "../../components/ui/ButtonGroup";
import {filterContract} from "../../components/ui/table/filter/paramFilter/ContractFilter";

let selectDataContract = {} as ReasonModel;
let filter = new URLSearchParams();
let filterList: FilterTagModel[] = []

const Contract: FC = () => {

    const {contractLoadFromServer, reasonDeleteToServer} = useActions(ReasonActionCreators);
    const {
        contractList,
        contractTotalElements,
        contractSelectPage
    } = useTypedSelector(state => state.reason)

    const [visibleContractDrawer, setVisibleContractDrawer] = useState<boolean>(false);
    const [button, setButton] = useState<buttonInterface>(initButtonList)

    const [selectRecord, setSelectRecord] = useState<ReasonModel[]>([]);

    useEffect(() => {
        if (contractList.length === 0) {
            contractLoadFromServer();
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
        contractLoadFromServer(filter);
    }

    return (
        <Layout className={"parentTable"}>
            <ButtonGroup button={{
                ...button, buttonVoid: {
                    addRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataContract = {} as ReasonModel;
                        setVisibleContractDrawer(true);
                    },
                    editRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        setVisibleContractDrawer(true);
                    },
                    deleteRecord: () => {
                        (async function () {
                            selectRecord[0].deleted = true
                            const result: reasonResult = await reasonDeleteToServer(selectRecord) as reasonResult;
                            if (result.isOk) {
                                contractLoadFromServer();
                            } else {
                                selectRecord[0].deleted = false
                            }
                        })();
                    },
                    refreshRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataContract = {} as ReasonModel;
                        contractLoadFromServer(filter);
                    }
                }
            }}/>
            <TableCustom multiSelect={false} dataSource={contractList}
                         columns={reasonColumns({interfaceType: 'contract'})}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         pagination={{
                             selectPage: contractSelectPage + 1,
                             totalElements: contractTotalElements,
                             onChangePage: (current: number, pageSize: number) => onChangePage(current, pageSize)
                         }}
                         returnDoubleClick={() => {
                             setVisibleContractDrawer(true);
                         }}
                         returnSelectRecords={(selectRecord) => {
                             setSelectRecord(selectRecord);
                             selectDataContract = selectRecord[0];
                             setButton({...button, buttonDisable: {editRecord: false, deleteRecord: false}})
                         }}
                         filterIn={{
                             filterColumns: filterContract,
                             applyFilter: (filterListServer, filterList) => onFilter(filterListServer, filterList),
                             filterList
                         }}
            />
            {visibleContractDrawer &&
                <ReasonDrawer openDrawer={visibleContractDrawer}
                              closeDrawer={() => setVisibleContractDrawer(!visibleContractDrawer)}
                              values={selectDataContract} interfaceType={'contract'}
                              viewContractSpec={true}/>}

        </Layout>
    );
};

export default Contract;