import React, {FC, useCallback, useEffect, useState} from 'react';

import {Layout} from "antd";

import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";

import MaterialValueDrawer from "./drawer/MaterialValueDrawer";
import {
    MaterialValueActionCreators,
    materialValueResult
} from "../../reducers/spr/materialValue/materialValueActionCreators";
import TableCustom from "../../components/ui/table/TableCustom";
import {materialValueColumns} from "../../components/ui/table/column/MaterialValueColumns";
import ButtonGroup, {buttonInterface, initButtonList} from "../../components/ui/ButtonGroup";
import {filterMaterialValue} from "../../components/ui/table/filter/paramFilter/MaterialValueFilter";
import {MaterialValueModel} from "../../models/spr/MaterialValueModel";
import {FilterTagModel} from "../../models/FilterTagModel";

let selectDataMaterialValue = {} as MaterialValueModel;
let filter = new URLSearchParams();
let filterList: FilterTagModel[] = []

const MaterialValue: FC = () => {

    const {loadMaterialValue, deleteMaterialValue} = useActions(MaterialValueActionCreators);
    const {
        materialValueList,
        materialValueSelectPage,
        materialValueTotalElements
    } = useTypedSelector(state => state.materialValue)

    const [visibleMaterialValueDrawer, setVisibleMaterialValueDrawer] = useState<boolean>(false);
    const [button, setButton] = useState<buttonInterface>(initButtonList)
    const [selectRecord, setSelectRecord] = useState<MaterialValueModel[]>([]);

    useEffect(() => {
        if (materialValueList.length === 0 && filterList.length === 0) {
            loadMaterialValue();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function onChangePage(current: number, pageSize: number) {
        filter.set('page', current.toString());
        filter.set('limit', pageSize.toString());
        applyFilterChangePage();
    }

    const onFilter = useCallback((filterListServer: URLSearchParams, filterListIn: FilterTagModel[]) => {
        filter = filterListServer;
        filterList = filterListIn;
        applyFilterChangePage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function applyFilterChangePage() {
        loadMaterialValue(filter);
    }

    return (
        <Layout>
            <ButtonGroup button={{
                ...button, buttonVoid: {
                    addRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataMaterialValue = {} as MaterialValueModel;
                        setVisibleMaterialValueDrawer(true);
                    },
                    editRecord: () => {
                        setVisibleMaterialValueDrawer(true);
                    },
                    deleteRecord: () => {
                        (async function () {
                            selectRecord[0].deleted = true
                            const result: materialValueResult = await deleteMaterialValue(selectRecord) as materialValueResult;
                            if (result.isOk) {
                                loadMaterialValue();
                            } else {
                                selectRecord[0].deleted = false
                            }
                        })();
                    },
                    refreshRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataMaterialValue = {} as MaterialValueModel;
                        loadMaterialValue(filter);
                    }
                }
            }}/>
            <TableCustom multiSelect={false} dataSource={materialValueList} columns={materialValueColumns}
                         spinningLoading={false} selectChildren={false}
                         selectRecordIn={selectRecord}
                         pagination={{
                             selectPage: materialValueSelectPage + 1,
                             totalElements: materialValueTotalElements,
                             onChangePage: (current: number, pageSize: number) => onChangePage(current, pageSize)
                         }}
                         returnDoubleClick={() => {
                             setVisibleMaterialValueDrawer(true);
                         }}
                         returnSelectRecords={(selectRecord) => {
                             setSelectRecord(selectRecord);
                             selectDataMaterialValue = selectRecord[0];
                             setButton({...button, buttonDisable: {editRecord: false, deleteRecord: false}});
                         }}
                         filterIn={{
                             filterColumns: filterMaterialValue,
                             applyFilter: (filterListServer, filterList) => onFilter(filterListServer, filterList),
                             filterList
                         }}
            />
            {visibleMaterialValueDrawer &&
                <MaterialValueDrawer modelOpenDrawer={visibleMaterialValueDrawer}
                                     modelCloseDrawer={() => setVisibleMaterialValueDrawer(!visibleMaterialValueDrawer)}
                                     modelValues={selectDataMaterialValue}/>
            }
        </Layout>
    );
};

export default MaterialValue;