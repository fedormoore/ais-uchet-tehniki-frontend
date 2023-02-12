import React, {FC, useCallback, useEffect, useState} from 'react';

import {MenuProps} from "antd";

import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import StorageMenu, {buttonDisableStorageMenu} from "../../components/ui/topMenu/StorageMenu";
import IncomeDrawer from "./action/IncomeDrawer";
import AssembleDrawer from "./action/AssembleDrawer";
import DisassembleDrawer from "./action/DisassembleDrawer";
import {isParent} from "../../components/storage";
import TableCustom from "../../components/ui/table/TableCustom";
import AddDeviceDrawer from "./action/AddDeviceDrawer";
import RemoveDeviceDrawer from "./action/RemoveDeviceDrawer";
import ReplacementDeviceDrawer from "./action/ReplacementDeviceDrawer";
import RepairDeviceDrawer from "./action/RepairDeviceDrawer";
import StorageToCabinetDrawer from "./action/StorageToCabinetDrawer";
import ReplacementCartridgeDrawer from "./action/ReplacementCartridgeDrawer";
import RefillingCartridgeDrawer from "./action/RefillingCartridgeDrawer";
import WriteOffDrawer from "./action/WriteOffDrawer";
import DisposeOfDrawer from "./action/DisposeOfDrawer";
import {MaterialValueOrgModel} from "../../models/MaterialValueOrgModel";
import {materialValueOrgColumns} from "../../components/ui/table/column/MaterialValueOrgColumns";
import {MaterialValueOrgActionCreators} from "../../reducers/materialValueOrg/materialValueOrgActionCreators";
import {
    filterMaterialValueOrgStorage
} from "../../components/ui/table/filter/paramFilter/MaterialValueOrgStorageFilter";
import {FilterTagModel} from "../../models/FilterTagModel";
import MaterialValueOrgEdit from "./edit/MaterialValueOrgEdit";

let filter = new URLSearchParams();
let filterList: FilterTagModel[] = []

const MaterialValueOrgStorage: FC = () => {

    type DrawerType =
        ''
        | 'income'
        | 'toRegistry'
        | 'assemble'
        | 'disassemble'
        | 'add'
        | 'remove'
        | 'replacement'
        | 'repair'
        | 'replacementCartridge'
        | 'refillingCartridge'
        | 'writeOff'
        | 'disposeOf';

    const {storageLoadFromServer} = useActions(MaterialValueOrgActionCreators);
    const {
        storageList,
        storageTotalElements,
        storageSelectPage
    } = useTypedSelector(state => state.registry)

    const [buttonDisable, setButtonDisable] = useState<buttonDisableStorageMenu>({
        toRegistryDisable: false,
        assembleDisable: false,
        disassembleDisable: false,
        addDisable: false,
        removeDisable: false,
        replacementDisable: false,
        repairDisable: false,
        replacementCartridgeDisable: false,
        refillingCartridgesDisable: false,
        writeOffDisable: false,
        disposeOfDisable: false
    });
    const [visibleDrawer, setVisibleDrawer] = useState<DrawerType>();
    const [selectRecord, setSelectRecord] = useState<MaterialValueOrgModel[]>([]);

    const [visibleMaterialValueOrgStorageEdit, setVisibleMaterialValueOrgStorageEdit] = useState<boolean>(false);

    useEffect(() => {
        if (storageList.length === 0 && filterList.length === 0) {
            storageLoadFromServer();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onClickTopMenu: MenuProps['onClick'] = (e) => {
        switch (e.key) {
            case "income": {
                setVisibleDrawer("income");
                break;
            }
            case "refresh": {
                resetSelect();
                storageLoadFromServer(filter);
                break;
            }
            case "assemble": {
                setVisibleDrawer('assemble')
                break;
            }
            case "disassemble": {
                setVisibleDrawer('disassemble')
                break;
            }
            case "addDevice": {
                setVisibleDrawer('add')
                break;
            }
            case "removeDevice": {
                setVisibleDrawer('remove')
                break;
            }
            case "replacement": {
                setVisibleDrawer('replacement')
                break;
            }
            case "repair": {
                setVisibleDrawer('repair')
                break;
            }
            case "toRegistry": {
                setVisibleDrawer('toRegistry')
                break;
            }
            case "replacementCartridge": {
                setVisibleDrawer('replacementCartridge')
                break;
            }
            case "refillingCartridges": {
                setVisibleDrawer('refillingCartridge')
                break;
            }
            case "writeOff": {
                setVisibleDrawer("writeOff");
                break;
            }
            case "disposeOf": {
                setVisibleDrawer("disposeOf");
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
            setButtonDisable((prevState: buttonDisableStorageMenu) => ({
                ...prevState,
                toRegistryDisable: false,
                assembleDisable: false,
                disassembleDisable: false,
                addDisable: false,
                removeDisable: false,
                replacementDisable: false,
                repairDisable: false,
                replacementCartridgeDisable: false,
                refillingCartridgesDisable: false,
                writeOffDisable: false,
                disposeOfDisable: false
            }))
        }

        // ВЫДАТЬ // ВКЛЮЧИТЬ В СОСТАВ
        for (let i = 0; i < selectedRows.length; i++) {
            let disableButton: boolean = false;
            // если есть родитель то отказ
            let children: boolean = isParent(selectedRows[i], storageList);
            let deviceType: boolean = selectedRows[i].materialValue.materialValueType.name === "Картридж";
            if (children || deviceType) {
                disableButton = true
            }
            setButtonDisable((prevState: buttonDisableStorageMenu) => ({
                ...prevState,
                toRegistryDisable: disableButton,
                addDisable: disableButton
            }))
            if (disableButton) {
                break
            }
        }

        // СФОРМИРОВАТЬ
        for (let i = 0; i < selectedRows.length; i++) {
            let disableButton: boolean = false;
            // если есть родитель то отказ
            let children: boolean = isParent(selectedRows[i], storageList);
            let deviceType: boolean = selectedRows[i].materialValue.materialValueType.name === "Картридж";
            let countSelect: boolean = selectedRows.length < 2;
            if (children || deviceType || countSelect) {
                disableButton = true
            }
            setButtonDisable((prevState: buttonDisableStorageMenu) => ({...prevState, assembleDisable: disableButton}))
            if (disableButton) {
                break
            }
        }

        // РАСФОРМИРОВАТЬ
        for (let i = 0; i < selectedRows.length; i++) {
            let disableButton: boolean = false;
            // если есть родитель то отказ
            let children: boolean = isParent(selectedRows[i], storageList);
            let deviceType: boolean = selectedRows[i].materialValue.materialValueType.name === "Картридж";
            let notChildren: boolean = selectedRows[i].children === undefined;
            if (children || deviceType || notChildren) {
                disableButton = true
            }
            setButtonDisable((prevState: buttonDisableStorageMenu) => ({
                ...prevState,
                disassembleDisable: disableButton
            }))
            if (disableButton) {
                break
            }
        }

        // ВЫВЕСТИ ИЗ СОСТАВА // ЗАМЕНА
        for (let i = 0; i < selectedRows.length; i++) {
            let disableButton: boolean = false;
            // если есть родитель то отказ
            let children: boolean = !isParent(selectedRows[i], storageList);
            let deviceType: boolean = selectedRows[i].materialValue.materialValueType.name === "Картридж";
            if (children || deviceType) {
                disableButton = true
            }
            setButtonDisable((prevState: buttonDisableStorageMenu) => ({
                ...prevState,
                removeDisable: disableButton,
                replacementDisable: disableButton
            }))
            if (disableButton) {
                break
            }
        }

        // ЗАМЕНА КАРТРИДЖА
        for (let i = 0; i < selectedRows.length; i++) {
            let disableButton: boolean = false;
            let deviceType: boolean = selectedRows[i].materialValue.materialValueType.name !== "Картридж";
            let deviceStatus: boolean = selectedRows[i].status !== "Новый" && selectedRows[i].status !== "Заправлен";
            if (deviceType || deviceStatus) {
                disableButton = true
            }
            setButtonDisable((prevState: buttonDisableStorageMenu) => ({
                ...prevState,
                replacementCartridgeDisable: disableButton
            }))
            if (disableButton) {
                break
            }
        }

        // ЗАПРАВКА КАРТРИДЖА
        for (let i = 0; i < selectedRows.length; i++) {
            let disableButton: boolean = false;
            let deviceType: boolean = selectedRows[i].materialValue.materialValueType.name !== "Картридж";
            let deviceStatus: boolean = selectedRows[i].status !== "Пустой";
            if (deviceType || deviceStatus) {
                disableButton = true
            }
            setButtonDisable((prevState: buttonDisableStorageMenu) => ({
                ...prevState,
                refillingCartridgesDisable: disableButton
            }))
            if (disableButton) {
                break
            }
        }

        // СПИСАТЬ
        for (let i = 0; i < selectedRows.length; i++) {
            // если есть родитель то отказ
            let children: boolean = isParent(selectedRows[i], storageList);
            setButtonDisable((prevState: buttonDisableStorageMenu) => ({...prevState, writeOffDisable: children}))
            if (children) {
                break
            }
        }

        // УТИЛИЗИРОВАТЬ
        for (let i = 0; i < selectedRows.length; i++) {
            let deviceStatus: boolean = selectedRows[i].status !== "Списан";
            setButtonDisable((prevState: buttonDisableStorageMenu) => ({...prevState, disposeOfDisable: deviceStatus}))
            if (deviceStatus) {
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
        storageLoadFromServer(filter);
    }

    return (
        <>
            <StorageMenu onClickMenu={onClickTopMenu} buttonDisable={buttonDisable}/>
            <TableCustom multiSelect={true} dataSource={storageList} selectRecordView={true} expandable={true}
                         columns={materialValueOrgColumns({interfaceType: 'storage'})}
                         filterIn={{
                             filterColumns: filterMaterialValueOrgStorage,
                             applyFilter: (filterListServer, filterList) => onFilter(filterListServer, filterList),
                             filterList
                         }}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         pagination={{
                             selectPage: storageSelectPage + 1,
                             totalElements: storageTotalElements,
                             onChangePage: (current: number, pageSize: number) => onChangePage(current, pageSize)
                         }}
                         returnDoubleClick={() => {
                             setVisibleMaterialValueOrgStorageEdit(true);
                         }}
                         returnSelectRecords={(selectRecordIn: MaterialValueOrgModel[]) => {
                             setSelectRecord(selectRecordIn);
                             changeDisableButtonMenu(selectRecordIn);
                         }}
            />
            {visibleDrawer === 'income' &&
                <IncomeDrawer openDrawer={visibleDrawer === 'income'} closeDrawer={() => setVisibleDrawer('')}/>}
            {visibleDrawer === 'assemble' &&
                <AssembleDrawer openDrawer={visibleDrawer === 'assemble'}
                                closeDrawer={() => setVisibleDrawer('')}
                                valueSpec={selectRecord} resetSelect={resetSelect}/>}
            {visibleDrawer === 'disassemble' &&
                <DisassembleDrawer openDrawer={visibleDrawer === 'disassemble'}
                                   closeDrawer={() => setVisibleDrawer('')}
                                   valueSpec={selectRecord} resetSelect={resetSelect}/>}
            {visibleDrawer === 'add' &&
                <AddDeviceDrawer openDrawer={visibleDrawer === 'add'}
                                 closeDrawer={() => setVisibleDrawer('')}
                                 valueSpec={selectRecord} resetSelect={resetSelect}/>}
            {visibleDrawer === 'remove' &&
                <RemoveDeviceDrawer openDrawer={visibleDrawer === 'remove'}
                                    closeDrawer={() => setVisibleDrawer('')}
                                    valueSpec={selectRecord} resetSelect={resetSelect}/>}
            {visibleDrawer === 'replacement' &&
                <ReplacementDeviceDrawer openDrawer={visibleDrawer === 'replacement'}
                                         closeDrawer={() => setVisibleDrawer('')}
                                         valueSpec={selectRecord} resetSelect={resetSelect}/>}
            {visibleDrawer === 'repair' &&
                <RepairDeviceDrawer openDrawer={visibleDrawer === 'repair'}
                                    closeDrawer={() => setVisibleDrawer('')}
                                    valueSpec={selectRecord} resetSelect={resetSelect}/>}
            {visibleDrawer === 'toRegistry' &&
                <StorageToCabinetDrawer openDrawer={visibleDrawer === 'toRegistry'}
                                        closeDrawer={() => setVisibleDrawer('')}
                                        materialValueOrgList={selectRecord} resetSelect={resetSelect}/>}
            {visibleDrawer === 'replacementCartridge' &&
                <ReplacementCartridgeDrawer openDrawer={visibleDrawer === 'replacementCartridge'}
                                            closeDrawer={() => setVisibleDrawer('')}
                                            cartridge={selectRecord} resetSelect={resetSelect}/>}
            {visibleDrawer === 'refillingCartridge' &&
                <RefillingCartridgeDrawer openDrawer={visibleDrawer === 'refillingCartridge'}
                                          closeDrawer={() => setVisibleDrawer('')}
                                          cartridge={selectRecord} resetSelect={resetSelect}/>}
            {visibleDrawer === 'writeOff' &&
                <WriteOffDrawer openDrawer={visibleDrawer === 'writeOff'}
                                closeDrawer={() => setVisibleDrawer('')}
                                valueSpec={selectRecord} resetSelect={resetSelect}/>}
            {visibleDrawer === 'disposeOf' &&
                <DisposeOfDrawer openDrawer={visibleDrawer === 'disposeOf'}
                                 closeDrawer={() => setVisibleDrawer('')}
                                 valueSpec={selectRecord} resetSelect={resetSelect}/>}
            {visibleMaterialValueOrgStorageEdit &&
                <MaterialValueOrgEdit openDrawer={visibleMaterialValueOrgStorageEdit} locationType={'storage'}
                                      closeDrawer={() => setVisibleMaterialValueOrgStorageEdit(false)}
                                      valueEdit={selectRecord[0]}/>}
        </>
    );
};

export default MaterialValueOrgStorage;