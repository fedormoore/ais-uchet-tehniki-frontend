import React, {FC, useEffect, useState} from 'react';

import {Layout} from "antd";

import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import BudgetAccountDrawer from "./drawer/BudgetAccountDrawer";

import {BudgetAccountModel} from "../../models/spr/BudgetAccountModel";
import {
    BudgetAccountActionCreators,
    budgetAccountResult
} from "../../reducers/spr/budgetAccount/budgetAccountActionCreators";
import TableCustom from "../../components/ui/table/TableCustom";
import {budgetAccountColumns} from "../../components/ui/table/column/BudgetAccountColumns";
import ButtonGroup, {buttonInterface, initButtonList} from "../../components/ui/ButtonGroup";
import {filterBudgetAccount} from "../../components/ui/table/filter/paramFilter/BudgetAccountFilter";
import {FilterTagModel} from "../../models/FilterTagModel";

let selectDataBudgetAccount = {} as BudgetAccountModel;
let filter = new URLSearchParams();
let filterList: FilterTagModel[] = []

const BudgetAccount: FC = () => {

    const {loadBudgetAccount, deleteBudgetAccount} = useActions(BudgetAccountActionCreators);
    const {
        budgetAccountList, budgetAccountSelectPage, budgetAccountTotalElements
    } = useTypedSelector(state => state.budgetAccount)

    const [visibleBudgetAccountDrawer, setVisibleBudgetAccountDrawer] = useState<boolean>(false);
    const [button, setButton] = useState<buttonInterface>(initButtonList)

    const [selectRecord, setSelectRecord] = useState<BudgetAccountModel[]>([]);

    useEffect(() => {
        if (budgetAccountList.length === 0) {
            loadBudgetAccount();
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
        loadBudgetAccount(filter);
    }

    return (
        <Layout className={"parentTable"}>
            <ButtonGroup button={{
                ...button, buttonVoid: {
                    addRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataBudgetAccount = {} as BudgetAccountModel;
                        setVisibleBudgetAccountDrawer(true);
                    },
                    editRecord: () => {
                        setVisibleBudgetAccountDrawer(true);
                    },
                    deleteRecord: () => {
                        (async function () {
                            selectRecord[0].deleted = true
                            const result: budgetAccountResult = await deleteBudgetAccount(selectRecord) as budgetAccountResult;
                            if (result.isOk) {
                                loadBudgetAccount();
                            } else {
                                selectRecord[0].deleted = false
                            }
                        })();
                    },
                    refreshRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataBudgetAccount = {} as BudgetAccountModel;
                        loadBudgetAccount(filter);
                    }
                }
            }}/>
            <TableCustom multiSelect={false} dataSource={budgetAccountList} columns={budgetAccountColumns}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         pagination={{
                             selectPage: budgetAccountSelectPage + 1,
                             totalElements: budgetAccountTotalElements,
                             onChangePage: (current: number, pageSize: number) => onChangePage(current, pageSize)
                         }}
                         returnDoubleClick={() => {
                             setVisibleBudgetAccountDrawer(true);
                         }}
                         returnSelectRecords={(selectRecord) => {
                             setSelectRecord(selectRecord);
                             selectDataBudgetAccount = selectRecord[0];
                             setButton({...button, buttonDisable: {editRecord: false, deleteRecord: false}})
                         }}
                         filterIn={{
                             filterColumns: filterBudgetAccount,
                             applyFilter: (filterListServer, filterList) => onFilter(filterListServer, filterList),
                             filterList
                         }}
            />
            {visibleBudgetAccountDrawer &&
                <BudgetAccountDrawer budgetAccountOpenDrawer={visibleBudgetAccountDrawer}
                                     budgetAccountCloseDrawer={() => setVisibleBudgetAccountDrawer(!visibleBudgetAccountDrawer)}
                                     budgetAccountValues={selectDataBudgetAccount}/>
            }

        </Layout>
    );
};

export default BudgetAccount;