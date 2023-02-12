import React, {FC, useEffect, useState} from 'react';

import {Layout} from "antd";

import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import MaterialValueTypeDrawer from "./drawer/MaterialValueTypeDrawer";

import {MaterialValueTypeModel} from "../../models/spr/MaterialValueTypeModel";
import TableCustom from "../../components/ui/table/TableCustom";
import ButtonGroup, {buttonInterface, initButtonList} from "../../components/ui/ButtonGroup";
import {filterMaterialValueType} from "../../components/ui/table/filter/paramFilter/MaterialValueTypeFilter";
import {
    MaterialValueTypeActionCreators,
    materialValueTypeResult
} from "../../reducers/spr/materialValueType/materialValueTypeActionCreators";
import {materialValueTypeColumns} from "../../components/ui/table/column/MaterialValueTypeColumns";
import {FilterTagModel} from "../../models/FilterTagModel";

let selectDataMaterialValueType = {} as MaterialValueTypeModel;
let filter = new URLSearchParams();
let filterList: FilterTagModel[] = []

const MaterialValueType: FC = () => {

    const {loadMaterialValueType, deleteMaterialValueType} = useActions(MaterialValueTypeActionCreators);
    const {
        materialValueTypeList, materialValueTypeSelectPage, materialValueTypeTotalElements
    } = useTypedSelector(state => state.materialValueType)

    const [visibleMaterialValueTypeDrawer, setVisibleMaterialValueTypeDrawer] = useState<boolean>(false);
    const [button, setButton] = useState<buttonInterface>(initButtonList)
    const [selectRecord, setSelectRecord] = useState<MaterialValueTypeModel[]>([]);


    useEffect(() => {
        if (materialValueTypeList.length === 0) {
            loadMaterialValueType();
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
        loadMaterialValueType(filter);
    }

    return (
        <Layout>
            <ButtonGroup button={{
                ...button, buttonVoid: {
                    addRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataMaterialValueType = {} as MaterialValueTypeModel;
                        setVisibleMaterialValueTypeDrawer(true);
                    },
                    editRecord: () => {
                        setVisibleMaterialValueTypeDrawer(true);
                    },
                    deleteRecord: () => {
                        (async function () {
                            selectRecord[0].deleted = true
                            const result: materialValueTypeResult = await deleteMaterialValueType(selectRecord) as materialValueTypeResult;
                            if (result.isOk) {
                                loadMaterialValueType();
                            } else {
                                selectRecord[0].deleted = false
                            }
                        })();
                    },
                    refreshRecord: () => {
                        setButton({...button, buttonDisable: {editRecord: true, deleteRecord: true}})
                        selectDataMaterialValueType = {} as MaterialValueTypeModel;
                        loadMaterialValueType(filter);
                    }
                }
            }}/>
            <TableCustom multiSelect={false} dataSource={materialValueTypeList} columns={materialValueTypeColumns}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         pagination={{
                             selectPage: materialValueTypeSelectPage + 1,
                             totalElements: materialValueTypeTotalElements,
                             onChangePage: (current: number, pageSize: number) => onChangePage(current, pageSize)
                         }}
                         returnDoubleClick={() => {
                             setVisibleMaterialValueTypeDrawer(true);
                         }}
                         returnSelectRecords={(selectRecord) => {
                             setSelectRecord(selectRecord);
                             selectDataMaterialValueType = selectRecord[0];
                             setButton({...button, buttonDisable: {editRecord: false, deleteRecord: false}});
                         }}
                         filterIn={{
                             filterColumns: filterMaterialValueType,
                             applyFilter: (filterListServer, filterList) => onFilter(filterListServer, filterList),
                             filterList
                         }}
            />
            {visibleMaterialValueTypeDrawer &&
                <MaterialValueTypeDrawer materialValueTypeOpenDrawer={visibleMaterialValueTypeDrawer}
                                         materialValueTypeCloseDrawer={() => setVisibleMaterialValueTypeDrawer(!visibleMaterialValueTypeDrawer)}
                                         materialValueTypeValues={selectDataMaterialValueType}/>
            }
        </Layout>
    );
};

export default MaterialValueType;