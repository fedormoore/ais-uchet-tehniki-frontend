import React, {FC, useState} from 'react';
import {MaterialValueOrgModel} from "../../../models/MaterialValueOrgModel";
import TableCustom from "../../../components/ui/table/TableCustom";
import {materialValueOrgColumns} from "../../../components/ui/table/column/MaterialValueOrgColumns";
import {MenuProps} from "antd";
import StorageMenu, {buttonDisableStorageMenu} from "../../../components/ui/topMenu/StorageMenu";
import AddDeviceDrawer from "../action/AddDeviceDrawer";
import RemoveDeviceDrawer from "../action/RemoveDeviceDrawer";
import ReplacementDeviceDrawer from "../action/ReplacementDeviceDrawer";
import RepairDeviceDrawer from "../action/RepairDeviceDrawer";

interface ChildrenTabProps {
    value: MaterialValueOrgModel;
}

const ChildrenTab: FC<ChildrenTabProps> = (props) => {

    type DrawerType =
        ''
        | 'add'
        | 'remove'
        | 'replacement'
        | 'repair';

    const [selectRecord, setSelectRecord] = useState<MaterialValueOrgModel[]>([]);

    const [buttonDisable, setButtonDisable] = useState<buttonDisableStorageMenu>({
        toRegistryDisable: false,
        assembleDisable: false,
        disassembleDisable: false,
        addDisable: false,
        removeDisable: true,
        replacementDisable: true,
        repairDisable: true,
        replacementCartridgeDisable: false,
        refillingCartridgesDisable: false,
        writeOffDisable: false,
        disposeOfDisable: false
    });

    const [visibleDrawer, setVisibleDrawer] = useState<DrawerType>();

    const onClickTopMenu: MenuProps['onClick'] = (e) => {
        switch (e.key) {
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
            default: {
                break;
            }
        }
    };

    const changeDisableButtonMenu = (selectedRows: MaterialValueOrgModel[]) => {
        //ЕСЛИ НИЧЕГО НЕ ВЫБРАНО
        if (selectedRows.length === 0) {
            setButtonDisable((prevState: buttonDisableStorageMenu) => ({
                ...prevState,
                toRegistryDisable: false,
                assembleDisable: false,
                disassembleDisable: false,
                addDisable: false,
                removeDisable: true,
                replacementDisable: true,
                repairDisable: true,
                replacementCartridgeDisable: false,
                refillingCartridgesDisable: false,
                writeOffDisable: false,
                disposeOfDisable: false
            }))
        }

        // ВЫВЕСТИ ИЗ СОСТАВА // ЗАМЕНА
        for (let i = 0; i < selectedRows.length; i++) {
            let disableButton: boolean = false;
            // если есть родитель то отказ
            // let children: boolean = !isParent(selectedRows[i], props.value);
            let deviceType: boolean = selectedRows[i].materialValue.materialValueType.name === "Картридж";
            if (deviceType) {
                disableButton = true
            }
            setButtonDisable((prevState: buttonDisableStorageMenu) => ({
                ...prevState,
                removeDisable: disableButton,
                replacementDisable: disableButton,
                repairDisable: disableButton
            }))
            if (disableButton) {
                break
            }
        }
    }

    const resetSelect = () => {
        setSelectRecord([]);
    }

    return (
        <div className="materialValueOrgStorageEditChildrenTab">
            <StorageMenu onClickMenu={onClickTopMenu} buttonDisable={buttonDisable} buttonVisible={{
                refreshVisible: false,
                incomeVisible: false,
                toRegistryVisible: false,
                assembleDisassembleVisible: false,
                replacementRefillingCartridgesVisible: false,
                writeOffDisposeOfVisible: false
            }}/>
            <TableCustom multiSelect={true} dataSource={props.value.children} selectRecordView={true} expandable={true}
                         columns={materialValueOrgColumns({interfaceType: 'storage'})}
                         spinningLoading={false}
                         selectRecordIn={selectRecord}
                         returnSelectRecords={(selectRecordIn: MaterialValueOrgModel[]) => {
                             setSelectRecord(selectRecordIn);
                             changeDisableButtonMenu(selectRecordIn);
                         }}
            />
            {visibleDrawer === 'add' &&
                <AddDeviceDrawer openDrawer={visibleDrawer === 'add'}
                                 closeDrawer={() => setVisibleDrawer('')}
                                 resetSelect={resetSelect} parent={props.value}/>}
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
        </div>
    );
};

export default ChildrenTab;