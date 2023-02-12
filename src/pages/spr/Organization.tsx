import React, {FC, useEffect, useState} from 'react';

import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";

import {Layout} from "antd";
import OrganizationDrawer from "./drawer/OrganizationDrawer";
import {
    OrganizationActionCreators,
    organizationResult
} from "../../reducers/spr/organization/organizationActionCreators";
import {OrganizationModel} from "../../models/spr/OrganizationModel";
import TableCustom from "../../components/ui/table/TableCustom";
import {organizationColumns} from "../../components/ui/table/column/OrganizationColumns";
import ButtonGroup, {buttonInterface, initButtonList} from "../../components/ui/ButtonGroup";
import {filterOrganization} from "../../components/ui/table/filter/paramFilter/OrganizationFilter";
import {FilterTagModel} from "../../models/FilterTagModel";

let selectDataOrganization = {} as OrganizationModel;
let filter = new URLSearchParams();
let filterList: FilterTagModel[] = []

const Organization: FC = () => {

    const {loadOrganization, deleteOrganization} = useActions(OrganizationActionCreators);
    const {organizationList} = useTypedSelector(state => state.organization)

    const [visibleOrganizationDrawer, setVisibleOrganizationDrawer] = useState<boolean>(false);
    const [button, setButton] = useState<buttonInterface>(initButtonList)
    const [selectRecord, setSelectRecord] = useState<OrganizationModel[]>([]);

    useEffect(() => {
        if (organizationList.length === 0) {
            loadOrganization();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function onFilter(filterListServer: URLSearchParams, filterListIn: FilterTagModel[]) {
        filter = filterListServer;
        filterList = filterListIn;
        applyFilterChangePage();
    }

    function applyFilterChangePage() {
        loadOrganization(filter);
    }

    return (
        <Layout>
            <ButtonGroup button={{
                ...button, buttonVoid: {
                    addRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataOrganization = {} as OrganizationModel;
                        setVisibleOrganizationDrawer(true);
                    },
                    editRecord: () => {
                        setVisibleOrganizationDrawer(true);
                    },
                    deleteRecord: () => {
                        (async function () {
                            selectRecord[0].deleted = true
                            const result: organizationResult = await deleteOrganization(selectRecord) as organizationResult;
                            if (result.isOk) {
                                loadOrganization();
                            } else {
                                selectRecord[0].deleted = false
                            }
                        })();
                    },
                    refreshRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataOrganization = {} as OrganizationModel;
                        loadOrganization(filter);
                    }
                }
            }}/>
            <TableCustom multiSelect={false} dataSource={organizationList} expandable={true}
                         columns={organizationColumns}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         returnDoubleClick={() => {
                             setVisibleOrganizationDrawer(true);
                         }}
                         returnSelectRecords={(selectRecord) => {
                             setSelectRecord(selectRecord);
                             selectDataOrganization = selectRecord[0];
                             setButton({...button, buttonDisable: {editRecord: false, deleteRecord: false}});
                         }}
                         filterIn={{
                             filterColumns: filterOrganization,
                             applyFilter: (filterListServer, filterList) => onFilter(filterListServer, filterList),
                             filterList
                         }}
            />
            {visibleOrganizationDrawer &&
                <OrganizationDrawer organizationOpenDrawer={visibleOrganizationDrawer}
                                    organizationCloseDrawer={() => setVisibleOrganizationDrawer(!visibleOrganizationDrawer)}
                                    organizationValues={selectDataOrganization}/>
            }
        </Layout>
    );
};

export default Organization;