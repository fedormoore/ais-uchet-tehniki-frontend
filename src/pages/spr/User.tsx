import React, {FC, useEffect, useState} from 'react';

import {Layout} from "antd";

import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import UserDrawer from "./drawer/UserDrawer";

import {UserModel} from "../../models/spr/UserModel";
import {UserActionCreators, userResult} from "../../reducers/spr/user/userActionCreators";
import TableCustom from "../../components/ui/table/TableCustom";
import {userColumns} from "../../components/ui/table/column/UserColumns";
import ButtonGroup, {buttonInterface, initButtonList} from "../../components/ui/ButtonGroup";
import {filterUser} from "../../components/ui/table/filter/paramFilter/UserFilter";
import {FilterTagModel} from "../../models/FilterTagModel";

let selectDataUser = {} as UserModel;
let filter = new URLSearchParams();
let filterList: FilterTagModel[] = []

const User: FC = () => {

    const {loadUser, deleteUser} = useActions(UserActionCreators);
    const {userList, userTotalElements, userSelectPage} = useTypedSelector(state => state.user)

    const [visibleUserDrawer, setVisibleUserDrawer] = useState<boolean>(false);
    const [button, setButton] = useState<buttonInterface>(initButtonList)
    const [selectRecord, setSelectRecord] = useState<UserModel[]>([]);

    useEffect(() => {
        if (userList.length === 0) {
            loadUser();
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
        loadUser(filter);
    }

    return (
        <Layout>
            <ButtonGroup button={{
                ...button, buttonVoid: {
                    addRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataUser = {} as UserModel;
                        setVisibleUserDrawer(true);
                    },
                    editRecord: () => {
                        setVisibleUserDrawer(true);
                    },
                    deleteRecord: () => {
                        (async function () {
                            selectRecord[0].deleted = true
                            const result: userResult = await deleteUser(selectRecord) as userResult;
                            if (result.isOk) {
                                loadUser();
                            } else {
                                selectRecord[0].deleted = false
                            }
                        })();
                    },
                    refreshRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataUser = {} as UserModel;
                        loadUser(filter);
                    }
                }
            }}/>
            <TableCustom multiSelect={false} dataSource={userList} columns={userColumns}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         pagination={{
                             selectPage: userSelectPage + 1,
                             totalElements: userTotalElements,
                             onChangePage: (current: number, pageSize: number) => onChangePage(current, pageSize)
                         }}
                         returnDoubleClick={() => {
                             setVisibleUserDrawer(true);
                         }}
                         returnSelectRecords={(selectRecord) => {
                             setSelectRecord(selectRecord);
                             selectDataUser = selectRecord[0];
                             setButton({...button, buttonDisable: {editRecord: false, deleteRecord: false}});
                         }}
                         filterIn={{
                             filterColumns: filterUser,
                             applyFilter: (filterListServer, filterList) => onFilter(filterListServer, filterList),
                             filterList
                         }}
            />
            {visibleUserDrawer &&
                <UserDrawer userOpenDrawer={visibleUserDrawer}
                            userCloseDrawer={() => setVisibleUserDrawer(!visibleUserDrawer)}
                            userValues={selectDataUser}/>
            }

        </Layout>
    );
};

export default User;