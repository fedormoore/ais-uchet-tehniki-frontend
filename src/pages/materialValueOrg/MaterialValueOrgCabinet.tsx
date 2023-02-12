import React, {FC, useCallback, useEffect, useState} from 'react';

import {Layout, MenuProps} from "antd";

import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";

import CabinetMenu from "../../components/ui/topMenu/CabinetMenu";
import {MaterialValueOrgActionCreators} from "../../reducers/materialValueOrg/materialValueOrgActionCreators";
import TableCustom from "../../components/ui/table/TableCustom";
import {materialValueOrgColumns} from "../../components/ui/table/column/MaterialValueOrgColumns";
import CabinetToStorageDrawer from "./action/CabinetToStorageDrawer";
import {MaterialValueOrgModel} from "../../models/MaterialValueOrgModel";
import {
    filterMaterialValueOrgCabinet
} from "../../components/ui/table/filter/paramFilter/MaterialValueOrgCabinetFilter";
import {FilterTagModel} from "../../models/FilterTagModel";
import {isParent} from "../../components/storage";
import MaterialValueOrgEdit from "./edit/MaterialValueOrgEdit";

let filter = new URLSearchParams();
let filterList: FilterTagModel[] = []

const MaterialValueOrgCabinet: FC = () => {

    const {cabinetLoadFromServer} = useActions(MaterialValueOrgActionCreators);
    const {
        registryList,
        registryTotalElements,
        registrySelectPage
    } = useTypedSelector(state => state.registry)

    const [toStorageVisible, setToStorageVisible] = useState<boolean>(false);
    const [toStorageDisable, setToStorageDisable] = useState<boolean>(false);

    const [visibleMaterialValueOrgCabinetEdit, setVisibleMaterialValueOrgCabinetEdit] = useState<boolean>(false);

    const [selectRecord, setSelectRecord] = useState<MaterialValueOrgModel[]>([]);

    useEffect(() => {
        if (registryList.length === 0 && filterList.length === 0) {
            cabinetLoadFromServer();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickTopMenu: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case "refresh": {
                cabinetLoadFromServer();
                break;
            }
            case "toStorage": {
                setToStorageVisible(true)
                break;
            }
            default: {
                break;
            }
        }
    };

    const resetSelect = () => {
        setSelectRecord([]);
    }

    const changeDisableButtonMenu = (selectedRows: MaterialValueOrgModel[]) => {
        //ЕСЛИ НИЧЕГО НЕ ВЫБРАНО
        if (selectedRows.length === 0) {
            setToStorageDisable(false)
        }

        // ВЕРНУТЬ НА СКЛАД
        for (let i = 0; i < selectedRows.length; i++) {
            let disableButton: boolean = false;
            // если есть родитель то отказ
            let children: boolean = isParent(selectedRows[i], registryList);
            let deviceType: boolean = selectedRows[i].materialValue.materialValueType.name === "Картридж";
            if (children || deviceType) {
                disableButton = true
            }
            setToStorageDisable(disableButton)
            if (disableButton) {
                break
            }
        }
    }

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
        cabinetLoadFromServer(filter);
    }

    return (
        <Layout className={"parentTable"}>
            <CabinetMenu onClickMenu={onClickTopMenu} toStorageDisable={toStorageDisable}/>
            <TableCustom multiSelect={true} dataSource={registryList} selectRecordView={true} expandable={true}
                         columns={materialValueOrgColumns({interfaceType: 'cabinet'})}
                         filterIn={{
                             filterColumns: filterMaterialValueOrgCabinet,
                             applyFilter: (filterListServer, filterList) => onFilter(filterListServer, filterList),
                             filterList
                         }}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         pagination={{
                             selectPage: registrySelectPage + 1,
                             totalElements: registryTotalElements,
                             onChangePage: (current: number, pageSize: number) => onChangePage(current, pageSize)
                         }}
                         returnDoubleClick={() => {
                             setVisibleMaterialValueOrgCabinetEdit(true);
                         }}
                         returnSelectRecords={(selectRecord) => {
                             changeDisableButtonMenu(selectRecord);
                             setSelectRecord(selectRecord);
                         }}
            />
            {toStorageVisible &&
                <CabinetToStorageDrawer openDrawer={toStorageVisible}
                                        closeDrawer={() => setToStorageVisible(!toStorageVisible)}
                                        materialValueOrgList={selectRecord} resetSelect={resetSelect}/>}
            {visibleMaterialValueOrgCabinetEdit &&
                <MaterialValueOrgEdit openDrawer={visibleMaterialValueOrgCabinetEdit} locationType={'cabinet'}
                                      closeDrawer={() => setVisibleMaterialValueOrgCabinetEdit(false)}
                                      valueEdit={selectRecord[0]}/>}
        </Layout>
    );
};

export default MaterialValueOrgCabinet;